-- 管理者フラグを追加し、アプリ内で承認/非公開の切り替えができるようにする
alter table public.profiles
  add column is_admin boolean not null default false;

-- 管理者は状態に関わらず全spotsを閲覧できる（承認待ち一覧画面用）
create policy "admins can view all spots"
  on public.spots for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 投稿者は自分のspotsを状態に関わらず閲覧できる（マイ投稿画面用）
create policy "owner can view own spots regardless of status"
  on public.spots for select
  using (auth.uid() = created_by);

-- 管理者はstatusを含め、どのspotsでも更新できる（承認/非公開の切り替え用）
create policy "admins can update any spot"
  on public.spots for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
