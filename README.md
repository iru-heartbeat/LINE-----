# LINE公式アカウント向け AI自動応答システム

美容室のLINE公式アカウントに届く「営業時間」「料金」「アクセス」などの定型的な問い合わせに、Claude APIが自動で回答するシステムです。回答できない問い合わせはオーナーへ自動でエスカレーションされ、スマホ対応の管理画面からFAQ・メニュー・問い合わせ履歴の確認や一斉配信ができます。

> 本リポジトリは実案件を想定した学習用プロジェクト（模擬案件）です。詳細な要件は [要件定義書.md](./要件定義書.md) を参照してください。

## デモ

本番相当のデータ・LINEアカウント・課金APIに接続されているため、公開URLはあえて掲載していません（不特定多数がアクセスできる状態にすると、なりすましリクエストによるAPI課金や、管理画面へのアクセス試行のリスクがあるため）。動作の様子はスクリーンショットでご確認ください。

<!--
  スクリーンショットは docs/screenshots/ に画像を置いて、下のパスをそこに合わせてください。
  例: docs/screenshots/login.png, docs/screenshots/faqs.png, docs/screenshots/inquiries.png,
      docs/screenshots/broadcast.png, docs/screenshots/dark-mode.png
-->

| ログイン画面 | FAQ管理 | 問い合わせ履歴 |
|---|---|---|
| (screenshot) | (screenshot) | (screenshot) |

| 一斉配信 | ダークモード |
|---|---|
| (screenshot) | (screenshot) |

## 主な機能

- **FAQ自動応答**: LINEでの問い合わせをClaude APIが判定し、登録済みFAQ・メニュー情報をもとに自然な日本語で自動回答
- **有人エスカレーション**: 自動回答できない・確信度が低いと判定した問い合わせは、オーナーへLINEでプッシュ通知
- **FAQ管理 / メニュー・料金管理**: スマホからの一覧・追加・編集・削除
- **問い合わせ履歴**: 自動応答/エスカレーションの別、送信者のLINE表示名付きで一覧表示
- **一斉配信**: 友だち全員への配信、配信可能数（無料枠残数）の確認、配信履歴
- **店舗設定**: 管理画面ヘッダーに表示する店舗名の編集
- **管理画面ログイン**: メール・パスワード認証、セッションCookie（JWT）による保護
- **レスポンシブ / ダークモード対応**: スマホでの片手操作を想定したUI、端末に応じたテーマ切り替え

## 使用技術

| 分類 | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router, TypeScript) |
| スタイリング | Tailwind CSS v4 |
| ホスティング | Vercel |
| データベース | Neon (Serverless PostgreSQL) |
| AI | Claude API (Anthropic SDK) |
| 外部連携 | LINE Messaging API |
| 認証 | 自前のセッション認証（jose / JWT, bcryptjs） |

## アーキテクチャ

```
友だち(LINEアプリ) → LINE公式アカウント(Messaging API)
        │ Webhook
        ▼
     Vercel(サーバー) ──→ Claude API（AI応答生成）
        │        └────→ Neon（FAQ／履歴DB, PostgreSQL）
        ▼
   オーナー様（管理画面／通知）
```

## ディレクトリ構成

```
src/
  app/
    api/line-webhook/   LINE Webhook受信（FAQ自動応答・エスカレーション）
    api/broadcast/      一斉配信API
    admin/               管理画面（ログイン・FAQ・メニュー・履歴・配信・設定）
  lib/
    line.ts              LINE Messaging APIクライアント
    claude.ts             Claude APIによるFAQ回答生成
    db.ts                 Neon(PostgreSQL)クライアント
    auth.ts               管理画面の認証・セッション管理
  proxy.ts                /admin配下の未ログインアクセスをブロック
scripts/
  init-db.mjs             テーブル作成
  seed-yajima.mts          初期FAQ・メニューデータ投入
  create-admin.mjs         管理者アカウント作成
```

## セットアップ

```bash
npm install
cp .env.local.example .env.local   # 各値を設定
node --env-file=.env.local scripts/init-db.mjs
node --env-file=.env.local scripts/create-admin.mjs <email> <password>
npm run dev
```

環境変数の詳細は [.env.local.example](./.env.local.example) を参照してください。

## その他コマンド

```bash
npm run build   # 本番ビルド
npm run lint    # Lint
```
