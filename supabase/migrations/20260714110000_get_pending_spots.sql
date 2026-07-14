-- 承認待ち一覧・近隣重複チェック用に、緯度経度付きでpending spotsを返すRPC
-- security invoker（既定）のため、呼び出し元のRLSがそのまま適用される
-- （管理者は全件、投稿者は自分の分のみ、それ以外は0件）
create function public.get_pending_spots()
returns table (
  id uuid,
  name text,
  address text,
  category text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz
)
language sql
stable
as $$
  select
    s.id,
    s.name,
    s.address,
    s.category,
    extensions.st_y(s.location::extensions.geometry) as latitude,
    extensions.st_x(s.location::extensions.geometry) as longitude,
    s.created_at
  from public.spots s
  where s.status = 'pending'
  order by s.created_at desc;
$$;
