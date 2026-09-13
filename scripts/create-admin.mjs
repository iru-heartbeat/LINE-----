// 管理画面にログインするための最初の管理者アカウントを作成する（既存メールなら パスワードを更新する）
// 実行方法: node --env-file=.env.local scripts/create-admin.mjs <email> <password>
import { Client } from "pg";
import bcrypt from "bcryptjs";

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error("使い方: node --env-file=.env.local scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 10);

const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  await client.query(
    `INSERT INTO admin_users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, passwordHash]
  );
  console.log(`管理者アカウントを作成/更新しました: ${email}`);
} finally {
  await client.end();
}
