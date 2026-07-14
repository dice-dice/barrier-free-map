"""
OpenStreetMapの仙台市バリアフリータグ付きPOIを取得し、
spotsテーブルへの一括INSERT用SQLファイルを生成するスクリプト。

使い方:
  python3 supabase/scripts/import_osm_sendai.py

出力:
  supabase/import_osm_sendai.sql (SQL Editorに貼り付けて実行する)

注意:
- ODbLライセンスに基づき取得データを使用。アプリ側で帰属表示を行うこと。
- created_by は動作確認用シードユーザーのIDを暫定的に使用している。
"""

import json
import urllib.request
import urllib.parse
from typing import List, Optional

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
AREA_NAME = "仙台市"
CREATED_BY = "dcd5a2d9-2229-46c4-af4a-9a54d1ac6b50"
OUTPUT_PATH = "supabase/import_osm_sendai.sql"

QUERY = f"""
[out:json][timeout:120];
area["name"="{AREA_NAME}"]["boundary"="administrative"]->.searchArea;
(
  node["wheelchair"]["name"](area.searchArea);
  way["wheelchair"]["name"](area.searchArea);
);
out body center;
"""

CATEGORY_TAG_KEYS = ["amenity", "shop", "tourism", "office", "leisure", "craft", "healthcare"]


def fetch_overpass(query: str) -> dict:
    data = urllib.parse.urlencode({"data": query}).encode("utf-8")
    headers = {
        "User-Agent": "barrier-free-map-import/1.0",
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    req = urllib.request.Request(OVERPASS_URL, data=data, headers=headers)
    with urllib.request.urlopen(req, timeout=130) as resp:
        return json.loads(resp.read().decode("utf-8"))


def guess_category(tags: dict) -> str:
    if tags.get("amenity") == "toilets":
        return "toilet"
    if tags.get("amenity") in ("parking", "parking_space"):
        return "parking"
    return "other"


def build_accessibility_features(tags: dict) -> List[str]:
    features = []
    wheelchair = tags.get("wheelchair")
    if wheelchair in ("yes", "limited"):
        features.append("wheelchair")
    if tags.get("toilets:wheelchair") == "yes":
        features.append("multipurpose_toilet")
    return features


def build_address(tags: dict) -> Optional[str]:
    if tags.get("addr:full"):
        return tags["addr:full"]
    parts = [
        tags.get("addr:city"),
        tags.get("addr:street"),
        tags.get("addr:housenumber"),
    ]
    parts = [p for p in parts if p]
    return "".join(parts) if parts else None


def has_category_tag(tags: dict) -> bool:
    return any(key in tags for key in CATEGORY_TAG_KEYS)


def sql_escape(value: str) -> str:
    return value.replace("'", "''")


def sql_string_or_null(value):
    if value is None:
        return "null"
    return f"'{sql_escape(value)}'"


def sql_text_array(values: List[str]) -> str:
    if not values:
        return "array[]::text[]"
    escaped = ", ".join(f"'{sql_escape(v)}'" for v in values)
    return f"array[{escaped}]"


def main():
    print(f"Overpassへ{AREA_NAME}のクエリを送信中...")
    result = fetch_overpass(QUERY)
    elements = result.get("elements", [])
    print(f"取得件数(フィルタ前): {len(elements)}")

    rows = []
    skipped_no_category = 0

    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue
        if not has_category_tag(tags):
            skipped_no_category += 1
            continue

        if el["type"] == "node":
            lat, lon = el.get("lat"), el.get("lon")
        else:
            center = el.get("center") or {}
            lat, lon = center.get("lat"), center.get("lon")

        if lat is None or lon is None:
            continue

        rows.append(
            {
                "name": name,
                "category": guess_category(tags),
                "accessibility_features": build_accessibility_features(tags),
                "address": build_address(tags),
                "latitude": lat,
                "longitude": lon,
                "osm_type": el["type"],
                "osm_id": el["id"],
            }
        )

    print(f"カテゴリタグなしで除外: {skipped_no_category}")
    print(f"最終的にインポートする件数: {len(rows)}")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("-- OpenStreetMapから一括インポートした仙台市のバリアフリー関連POI\n")
        f.write("-- 生成元: supabase/scripts/import_osm_sendai.py\n")
        f.write("-- ライセンス: データは (c) OpenStreetMap contributors, ODbL\n")
        f.write(f"-- 件数: {len(rows)}\n\n")

        if not rows:
            f.write("-- (対象データなし)\n")
        else:
            f.write("insert into public.spots\n")
            f.write(
                "  (name, category, accessibility_features, location, address, status, source, "
                "osm_type, osm_id, created_by)\n"
            )
            f.write("values\n")

            value_lines = []
            for row in rows:
                point = f"extensions.st_setsrid(extensions.st_makepoint({row['longitude']}, {row['latitude']}), 4326)::extensions.geography"
                value_lines.append(
                    "  ("
                    f"{sql_string_or_null(row['name'])}, "
                    f"'{row['category']}', "
                    f"{sql_text_array(row['accessibility_features'])}, "
                    f"{point}, "
                    f"{sql_string_or_null(row['address'])}, "
                    "'approved', "
                    "'openstreetmap', "
                    f"'{row['osm_type']}', "
                    f"{row['osm_id']}, "
                    f"'{CREATED_BY}'"
                    ")"
                )
            f.write(",\n".join(value_lines))
            f.write("\non conflict (osm_type, osm_id) where osm_type is not null and osm_id is not null\n")
            f.write("do nothing;\n")

    print(f"SQLファイルを書き出しました: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
