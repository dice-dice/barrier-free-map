-- 動作確認用テストユーザーのメールを個別に確認済みにする
-- プロジェクト全体の「Confirm email」設定は変更しません。
update auth.users
set email_confirmed_at = now()
where email = 'barrier-free-map.seed.20260709@gmail.com';
