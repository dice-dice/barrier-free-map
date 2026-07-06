create table public.spots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null check (category in ('toilet','ramp','elevator','parking','entrance','other')),
  accessibility_features text[] not null default '{}',
  location extensions.geography(point, 4326) not null,
  address text,
  photo_urls text[] not null default '{}',
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index spots_location_idx on public.spots using gist (location);
create index spots_category_idx on public.spots (category);

create trigger spots_set_updated_at
  before update on public.spots
  for each row execute function public.set_updated_at();
