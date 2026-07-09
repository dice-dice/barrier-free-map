-- テスト用シードデータ（東京駅周辺の架空施設6件）
-- Supabaseダッシュボード > SQL Editor で実行してください。
-- created_by には既存の profiles.id を使用しています（seed用に作成したテストユーザー）。
-- photo_urls は picsum.photos の著作権フリーなプレースホルダー画像です（実際の施設写真ではありません）。

insert into public.spots (name, description, category, accessibility_features, location, address, photo_urls, created_by)
values
  (
    '東京駅八重洲口',
    '車椅子対応のスロープ付き入口',
    'entrance',
    array['wheelchair'],
    extensions.st_setsrid(extensions.st_makepoint(139.767052, 35.681236), 4326)::extensions.geography,
    '東京都千代田区丸の内1丁目',
    array['https://picsum.photos/seed/bfm-tokyo-station-entrance/800/600'],
    'dcd5a2d9-2229-46c4-af4a-9a54d1ac6b50'
  ),
  (
    '東京駅1F 多目的トイレ',
    'オストメイト対応',
    'toilet',
    array[]::text[],
    extensions.st_setsrid(extensions.st_makepoint(139.766000, 35.680900), 4326)::extensions.geography,
    '東京都千代田区丸の内1丁目',
    array[
      'https://picsum.photos/seed/bfm-tokyo-station-toilet-1/800/600',
      'https://picsum.photos/seed/bfm-tokyo-station-toilet-2/800/600'
    ],
    'dcd5a2d9-2229-46c4-af4a-9a54d1ac6b50'
  ),
  (
    '丸の内ビルディング エレベーター',
    '1階から全フロアへ直通',
    'elevator',
    array['wheelchair'],
    extensions.st_setsrid(extensions.st_makepoint(139.763500, 35.681700), 4326)::extensions.geography,
    '東京都千代田区丸の内2丁目4-1',
    array['https://picsum.photos/seed/bfm-marunouchi-elevator/800/600'],
    'dcd5a2d9-2229-46c4-af4a-9a54d1ac6b50'
  ),
  (
    '皇居外苑 スロープ',
    '段差のない散策路入口',
    'ramp',
    array['wheelchair'],
    extensions.st_setsrid(extensions.st_makepoint(139.756000, 35.683000), 4326)::extensions.geography,
    '東京都千代田区皇居外苑1-1',
    array['https://picsum.photos/seed/bfm-kokyo-ramp/800/600'],
    'dcd5a2d9-2229-46c4-af4a-9a54d1ac6b50'
  ),
  (
    '東京国際フォーラム 身障者用駐車場',
    '入口から近い専用区画あり',
    'parking',
    array[]::text[],
    extensions.st_setsrid(extensions.st_makepoint(139.763300, 35.678000), 4326)::extensions.geography,
    '東京都千代田区丸の内3丁目5-1',
    array[]::text[],
    'dcd5a2d9-2229-46c4-af4a-9a54d1ac6b50'
  ),
  (
    '文化会館 多目的トイレ',
    'カテゴリではなくタグでトイレ判定される例',
    'other',
    array['multipurpose_toilet', 'wheelchair'],
    extensions.st_setsrid(extensions.st_makepoint(139.760000, 35.679500), 4326)::extensions.geography,
    '東京都千代田区丸の内3丁目',
    array['https://picsum.photos/seed/bfm-bunka-kaikan-toilet/800/600'],
    'dcd5a2d9-2229-46c4-af4a-9a54d1ac6b50'
  );
