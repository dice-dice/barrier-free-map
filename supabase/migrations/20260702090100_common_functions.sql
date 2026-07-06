-- updated_at自動更新(全テーブル共通で使い回す)
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
