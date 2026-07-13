"""
source='openstreetmap' のspotsについて、緯度経度から国土地理院の
逆ジオコーディングAPI(無料・APIキー不要)で住所を再生成し、
統一フォーマットのUPDATE文を生成するスクリプト。

OSM側のaddr:*タグは粒度がバラバラ(ローマ字、市区町村のみ等)なため、
座標から計算し直して一貫性のある住所に揃える。

使い方:
  python3 supabase/scripts/reverse_geocode_sendai.py

出力:
  supabase/update_osm_sendai_addresses.sql
"""

import json
import time
import urllib.request
import urllib.parse

SUPABASE_URL = "https://egjznffofpvxyedsbeav.supabase.co"
ANON_KEY = "sb_publishable_WZga_gw62LwUTQlyG8Snxg_FpmGE2eN"
GSI_URL = "https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress"
OUTPUT_PATH = "supabase/update_osm_sendai_addresses.sql"

WARD_NAMES = {
    "04101": "宮城県仙台市青葉区",
    "04102": "宮城県仙台市宮城野区",
    "04103": "宮城県仙台市若林区",
    "04104": "宮城県仙台市太白区",
    "04105": "宮城県仙台市泉区",
}


def fetch_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "barrier-free-map-geocode/1.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_spots() -> list:
    url = f"{SUPABASE_URL}/rest/v1/spots?select=id,name,address&source=eq.openstreetmap"
    req = urllib.request.Request(
        url,
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
        },
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def sql_escape(value: str) -> str:
    return value.replace("'", "''")


def main():
    print("spots(source=openstreetmap)一覧を取得中...")
    spots = fetch_spots()
    print(f"対象: {len(spots)}件")

    # 座標はspot_detailsビューから取得
    url = f"{SUPABASE_URL}/rest/v1/spot_details?select=id,latitude,longitude&created_by=eq.dcd5a2d9-2229-46c4-af4a-9a54d1ac6b50"
    req = urllib.request.Request(
        url,
        headers={"apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}"},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        details = json.loads(resp.read().decode("utf-8"))
    coords_by_id = {d["id"]: (d["latitude"], d["longitude"]) for d in details}

    updates = []
    skipped = 0

    for i, spot in enumerate(spots, 1):
        spot_id = spot["id"]
        coords = coords_by_id.get(spot_id)
        if not coords:
            skipped += 1
            continue

        lat, lon = coords
        try:
            result = fetch_json(f"{GSI_URL}?lon={lon}&lat={lat}")
        except Exception as e:
            print(f"  [{i}/{len(spots)}] {spot['name']}: 取得失敗 ({e})")
            skipped += 1
            continue

        results = result.get("results")
        if not results:
            skipped += 1
            time.sleep(0.3)
            continue

        muni_cd = results.get("muniCd")
        block_name = results.get("lv01Nm", "")
        ward = WARD_NAMES.get(muni_cd)

        if not ward:
            skipped += 1
            time.sleep(0.3)
            continue

        new_address = f"{ward}{block_name}"
        updates.append((spot_id, new_address))

        if i % 10 == 0:
            print(f"  進捗: {i}/{len(spots)}")

        time.sleep(0.3)  # GSI APIへの配慮

    print(f"住所を再生成できた件数: {len(updates)}")
    print(f"スキップ: {skipped}")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("-- OpenStreetMapインポート分の住所を、国土地理院の逆ジオコーディングで統一フォーマットに置き換える\n")
        f.write("-- 生成元: supabase/scripts/reverse_geocode_sendai.py\n\n")
        for spot_id, address in updates:
            f.write(
                f"update public.spots set address = '{sql_escape(address)}' where id = '{spot_id}';\n"
            )

    print(f"SQLファイルを書き出しました: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
