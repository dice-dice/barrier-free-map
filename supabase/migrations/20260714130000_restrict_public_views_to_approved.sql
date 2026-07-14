-- spot_details / get_nearby_spots は「一般公開されているspots」を返す想定だったが、
-- ステータスを明示的に絞っておらず「approved以外はRLSで自然と弾かれる」ことに暗黙的に依存していた。
-- 投稿者が自分のspotsを状態に関わらず閲覧できるRLSポリシーを追加した結果、
-- この2つが投稿者本人の審査中・非公開spotsまで返すようになってしまったため、明示的に絞る。
drop view if exists public.spot_details;

create view public.spot_details
with (security_invoker = true)
as
select
  s.id,
  s.name,
  s.description,
  s.category,
  s.accessibility_features,
  extensions.st_y(s.location::extensions.geometry) as latitude,
  extensions.st_x(s.location::extensions.geometry) as longitude,
  s.address,
  s.photo_urls,
  s.source,
  s.created_by,
  s.created_at,
  s.updated_at,
  count(c.id) filter (where c.is_accurate) as confirmed_count,
  count(c.id) filter (where not c.is_accurate) as disputed_count
from public.spots s
left join public.spot_confirmations c on c.spot_id = s.id
where s.status = 'approved'
group by s.id;

drop function if exists public.get_nearby_spots(double precision, double precision, double precision, text);

create function public.get_nearby_spots(
  lat double precision,
  lng double precision,
  radius_meters double precision,
  category_filter text default null
)
returns table (
  id uuid,
  name text,
  description text,
  category text,
  accessibility_features text[],
  latitude double precision,
  longitude double precision,
  address text,
  photo_urls text[],
  source text,
  confirmed_count bigint,
  disputed_count bigint,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz,
  distance_meters double precision
)
language sql
stable
as $$
  select
    s.id,
    s.name,
    s.description,
    s.category,
    s.accessibility_features,
    extensions.st_y(s.location::extensions.geometry) as latitude,
    extensions.st_x(s.location::extensions.geometry) as longitude,
    s.address,
    s.photo_urls,
    s.source,
    count(c.id) filter (where c.is_accurate) as confirmed_count,
    count(c.id) filter (where not c.is_accurate) as disputed_count,
    s.created_by,
    s.created_at,
    s.updated_at,
    extensions.st_distance(s.location, extensions.st_makepoint(lng, lat)::extensions.geography) as distance_meters
  from public.spots s
  left join public.spot_confirmations c on c.spot_id = s.id
  where extensions.st_dwithin(s.location, extensions.st_makepoint(lng, lat)::extensions.geography, radius_meters)
    and s.status = 'approved'
    and (category_filter is null or s.category = category_filter)
  group by s.id
  order by distance_meters asc;
$$;
