import { Pool } from "pg";

// Neon(PostgreSQL)への接続。サーバーサイドの処理からのみ使う想定。
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string | null;
};

export async function getFaqs(): Promise<Faq[]> {
  const { rows } = await pool.query<Faq>(
    "SELECT id, question, answer, category FROM faqs ORDER BY id"
  );
  return rows;
}

export type Menu = {
  id: number;
  category: string;
  name: string;
  price: number;
  durationMin: number;
};

export async function getMenus(): Promise<Menu[]> {
  const { rows } = await pool.query<{
    id: number;
    category: string;
    name: string;
    price: number;
    duration_min: number;
  }>("SELECT id, category, name, price, duration_min FROM menus ORDER BY id");
  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    name: r.name,
    price: r.price,
    durationMin: r.duration_min,
  }));
}

export async function logInquiry(params: {
  lineUserId: string;
  message: string;
  botResponse: string | null;
  isEscalated: boolean;
}): Promise<void> {
  await pool.query(
    `INSERT INTO inquiries (line_user_id, message, bot_response, is_escalated)
     VALUES ($1, $2, $3, $4)`,
    [params.lineUserId, params.message, params.botResponse, params.isEscalated]
  );
}

export type AdminUser = {
  id: number;
  email: string;
  passwordHash: string;
};

export async function getAdminUserByEmail(email: string): Promise<AdminUser | null> {
  const { rows } = await pool.query<{ id: number; email: string; password_hash: string }>(
    "SELECT id, email, password_hash FROM admin_users WHERE email = $1",
    [email]
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  return { id: row.id, email: row.email, passwordHash: row.password_hash };
}

export async function touchAdminLastLogin(adminUserId: number): Promise<void> {
  await pool.query("UPDATE admin_users SET last_login_at = now() WHERE id = $1", [adminUserId]);
}
