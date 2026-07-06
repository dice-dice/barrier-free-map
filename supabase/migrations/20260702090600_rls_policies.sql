alter table public.profiles enable row level security;
alter table public.spots enable row level security;
alter table public.reviews enable row level security;

-- profiles: 全員閲覧可、本人のみ更新可
create policy "profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- spots: 全員閲覧可、投稿はログインユーザーのみ、更新削除は作成者のみ
create policy "spots are viewable by everyone"
  on public.spots for select using (true);

create policy "authenticated users can insert spots"
  on public.spots for insert with check (auth.uid() = created_by);

create policy "owner can update own spot"
  on public.spots for update using (auth.uid() = created_by);

create policy "owner can delete own spot"
  on public.spots for delete using (auth.uid() = created_by);

-- reviews: 全員閲覧可、投稿はログインユーザーのみ、更新削除は本人のみ
create policy "reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "authenticated users can insert reviews"
  on public.reviews for insert with check (auth.uid() = user_id);

create policy "owner can update own review"
  on public.reviews for update using (auth.uid() = user_id);

create policy "owner can delete own review"
  on public.reviews for delete using (auth.uid() = user_id);
