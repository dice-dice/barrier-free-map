-- 星評価つきの汎用レビューは、Googleマップへのリンクに譲る方針としたため廃止する。
-- 代わりに「この施設のバリアフリー情報は合っていたか」を確認する軽量なフィードバック
-- (spot_confirmations)に置き換える。reviewsは未使用(0件)のため安全に置き換え可能。

-- reviewsに依存しているビュー・関数を先に削除する
drop view if exists public.spot_details;
drop function if exists public.get_nearby_spots(double precision, double precision, double precision, text);

drop table if exists public.reviews;

create table public.spot_confirmations (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.spots (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  is_accurate boolean not null,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (spot_id, user_id)
);

create index spot_confirmations_spot_id_idx on public.spot_confirmations (spot_id);

create trigger spot_confirmations_set_updated_at
  before update on public.spot_confirmations
  for each row execute function public.set_updated_at();

alter table public.spot_confirmations enable row level security;

create policy "confirmations are viewable by everyone"
  on public.spot_confirmations for select using (true);

create policy "authenticated users can insert confirmations"
  on public.spot_confirmations for insert with check (auth.uid() = user_id);

create policy "owner can update own confirmation"
  on public.spot_confirmations for update using (auth.uid() = user_id);

create policy "owner can delete own confirmation"
  on public.spot_confirmations for delete using (auth.uid() = user_id);
