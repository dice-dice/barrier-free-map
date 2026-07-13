-- 20260713100000_add_spot_approval_status.sql 適用後、
-- 既存のシードデータ（動作確認用の6施設）を承認済みにする
update public.spots
set status = 'approved'
where created_by = 'dcd5a2d9-2229-46c4-af4a-9a54d1ac6b50';
