-- 投稿された施設(spots)を承認制にする
-- pending: 投稿直後（一般には非公開）
-- approved: 管理者が承認済み（一般に公開）
-- rejected: 管理者が却下（一般には非公開）
-- 承認/却下はSupabaseダッシュボードのSQL Editor等、RLSを経由しない管理者操作でのみ行う想定
alter table public.spots
  add column status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'));

drop policy "spots are viewable by everyone" on public.spots;
create policy "approved spots are viewable by everyone"
  on public.spots for select using (status = 'approved');

drop policy "authenticated users can insert spots" on public.spots;
create policy "authenticated users can insert spots as pending"
  on public.spots for insert
  with check (auth.uid() = created_by and status = 'pending');

-- 投稿者は承認/却下が確定するまでの間だけ編集可能。statusを自分でapproved/rejectedに変更することはできない
drop policy "owner can update own spot" on public.spots;
create policy "owner can update own pending spot"
  on public.spots for update
  using (auth.uid() = created_by and status = 'pending')
  with check (auth.uid() = created_by and status = 'pending');
