-- 将来OSMデータを再取り込みする際に重複を防げるよう、取り込み元の要素種別とIDを保持する
-- (node/wayは別々の採番空間なので、両方揃って初めて一意になる)
alter table public.spots
  add column osm_type text,
  add column osm_id bigint;

create unique index spots_osm_type_id_key
  on public.spots (osm_type, osm_id)
  where osm_type is not null and osm_id is not null;
