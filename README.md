# barrier-free-map

車椅子利用者などが安心して利用できる、バリアフリー対応施設を地図・リスト形式で探せる Expo (React Native) アプリです。ユーザー自身が施設を登録・確認できるクラウドソーシング型のデータベースを Supabase 上に構築しています。

## 主な機能

- **ゲスト閲覧**: ログインなしで周辺施設の一覧・地図表示が可能（登録・確認などの投稿操作のみログインが必要）
- **一覧 / 地図表示の切り替え**: リスト表示と地図表示（`react-native-maps`）を行き来できる
- **現在地からの近隣検索**: `expo-location` で現在地を取得し、近くのバリアフリー施設を検索（Supabase の RPC `get_nearby_spots` を利用）
- **施設登録**: 地図の長押しで座標を指定し、住所検索でも該当地点へ移動可能。登録した施設は承認待ち（pending）として登録される
- **管理者レビュー機能**: 管理者ユーザーが投稿された施設を承認・却下できる（pending/approved/rejected のワークフロー）
- **自分の投稿一覧**: 自分が登録した施設のステータスを確認できる
- **確認（Confirmation）機能**: 星評価レビューの代わりに「情報が正しいか」を軽量に確認・コメントできる仕組み
- **写真ギャラリー**: 施設ごとに写真を表示
- **OpenStreetMap データのインポート**: 仙台エリアの車椅子アクセシブルな POI を OSM からインポート済み（出典表示付き）
- **Googleマップ連携**: 各施設からワンタップで Google マップの経路案内を開ける
- **スパム対策**: 投稿数の上限やコメントモデレーションなどの簡易的な対策
- **設定メニュー**: プロフィール、利用規約、プライバシーポリシー、お問い合わせ、アカウント削除
- **エラー監視**: Sentry によるクラッシュ・エラーレポート
- **初回起動時の注意事項表示**: 免責事項（DisclaimerNotice）とファーストラン通知

## 技術スタック

- [Expo](https://expo.dev/) / React Native 0.86 / React 19
- [NativeWind](https://www.nativewind.dev/)（Tailwind CSS ベースのスタイリング）
- [Supabase](https://supabase.com/)（Auth・Postgres DB・RPC・Row Level Security）
- [TanStack Query](https://tanstack.com/query/latest)（データフェッチ・キャッシュ管理）
- [react-native-maps](https://github.com/react-native-maps/react-native-maps)
- [Sentry](https://sentry.io/)（エラー・クラッシュ監視、ソースマップアップロード）
- [Maestro](https://maestro.mobile.dev/)（E2E テスト）
- Jest（ユニットテスト、`jest-expo` プリセット）

## ディレクトリ構成

```
App.tsx              エントリポイント（セッション取得・QueryClientProvider・Sentry.wrap）
screens/             画面コンポーネント（一覧/地図, 施設登録, ログイン/サインアップ, 管理者レビュー, 設定系画面など）
components/          再利用可能な UI コンポーネント
hooks/               Supabase / TanStack Query を用いたデータフェッチ・操作フック
lib/                 Supabase クライアント、型定義、バリデーション、地理計算などのユーティリティ
supabase/            DB マイグレーション、OSM インポート・ジオコーディングスクリプト、シードデータ
.maestro/            E2E テストフロー（ログイン/ログアウト、地図タブ表示、ゲスト閲覧など）
```

## セットアップ

### 前提

- Node.js
- Expo CLI（`npx expo` で実行可能）
- Supabase プロジェクト（Auth・DB）

### 環境変数

`.env.example` を参考に `.env` を作成してください。

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

### インストールと起動

```bash
npm install
npm start          # Expo 開発サーバーを起動
npm run ios        # iOS シミュレータで起動
npm run android    # Android エミュレータで起動
npm run web        # Web で起動
```

### テスト

```bash
npm test           # Jest ユニットテスト
npm run test:e2e   # Maestro E2E テスト（.maestro 配下のフロー）
```

## データベース（Supabase）

`supabase/migrations` にマイグレーションが時系列で格納されています。主な内容:

- プロファイル・施設（spots）・確認（confirmations）テーブルの作成
- 施設の近傍検索用 RPC（`get_nearby_spots`）
- 施設の承認ステータス（pending/approved/rejected）と管理者レビュー用 RPC（`get_pending_spots`）
- 施設データの出典（source, osm_id）管理
- 承認済み施設のみを公開するビューへの制限（RLS）
- 投稿数上限などのスパム対策

`supabase/scripts` には仙台エリアの OSM データをインポート・逆ジオコーディングするスクリプトがあります。

## 開発の経緯

Expo (blank-typescript) プロジェクトの初期化から始まり、Supabase を用いた認証・データ基盤の構築、施設一覧・地図表示、施設登録・承認ワークフロー、OSM データのインポート、NativeWind へのスタイル移行、スパム対策、Sentry によるエラー監視、利用規約・プライバシーポリシー・設定メニューの追加という順で開発を進めてきました。詳細な変更履歴は `git log` を参照してください。
