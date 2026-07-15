-- 投稿の連投・確認コメントの連投によるスパムを防ぐための最低限のレート制限。
-- Edge Functionsなど新規インフラを足さず、DBトリガーのみで完結させる。

create or replace function public.enforce_pending_spot_limit()
returns trigger
language plpgsql
as $$
declare
  pending_count integer;
begin
  select count(*) into pending_count
  from public.spots
  where created_by = new.created_by
    and status = 'pending';

  if pending_count >= 5 then
    raise exception '審査中の投稿が上限（5件）に達しています。承認されるまでお待ちください。';
  end if;

  return new;
end;
$$;

create trigger spots_enforce_pending_limit
  before insert on public.spots
  for each row
  when (new.status = 'pending')
  execute function public.enforce_pending_spot_limit();

create or replace function public.enforce_confirmation_rate_limit()
returns trigger
language plpgsql
as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.spot_confirmations
  where user_id = new.user_id
    and created_at > now() - interval '1 day';

  if recent_count >= 20 then
    raise exception '1日に送信できる確認・コメントの上限（20件）に達しています。';
  end if;

  return new;
end;
$$;

create trigger spot_confirmations_enforce_rate_limit
  before insert on public.spot_confirmations
  for each row
  execute function public.enforce_confirmation_rate_limit();

-- 現状コメントは投稿と同時に即座に公開され、承認フローを通らないため、
-- 不適切なコメントを管理者が削除できる手段がなかった。
create policy "admins can delete any confirmation"
  on public.spot_confirmations for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
