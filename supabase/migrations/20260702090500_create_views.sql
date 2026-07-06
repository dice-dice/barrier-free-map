-- クライアントが扱いやすいよう lat/lng を平坦化し、評価集計も含めたビュー
create view public.spot_details
with (security_invoker = true) -- 呼び出しユーザーのRLSをそのまま適用させる
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
  s.created_by,
  s.created_at,
  s.updated_at,
  coalesce(avg(r.rating), 0)::numeric(2,1) as average_rating,
  count(r.id) as review_count
from public.spots s
left join public.reviews r on r.spot_id = s.id
group by s.id;
