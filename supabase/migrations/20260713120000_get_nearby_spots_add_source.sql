-- get_nearby_spotsの戻り値にsourceを追加（OSM由来の未確認バッジ表示のため）
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
  average_rating numeric,
  review_count bigint,
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
    coalesce(avg(r.rating), 0)::numeric(2,1) as average_rating,
    count(r.id) as review_count,
    s.created_by,
    s.created_at,
    s.updated_at,
    extensions.st_distance(s.location, extensions.st_makepoint(lng, lat)::extensions.geography) as distance_meters
  from public.spots s
  left join public.reviews r on r.spot_id = s.id
  where extensions.st_dwithin(s.location, extensions.st_makepoint(lng, lat)::extensions.geography, radius_meters)
    and (category_filter is null or s.category = category_filter)
  group by s.id
  order by distance_meters asc;
$$;
