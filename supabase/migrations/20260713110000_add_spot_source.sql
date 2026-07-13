-- spotsの出所を区別する（ユーザー投稿 / OpenStreetMap一括インポート）
-- OpenStreetMap由来のデータはアプリ上で「未確認」バッジを表示する想定
alter table public.spots
  add column source text not null default 'user_submitted'
    check (source in ('user_submitted', 'openstreetmap'));
