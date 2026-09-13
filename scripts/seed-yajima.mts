// 矢島美容室の初期FAQ・メニューデータをNeon(PostgreSQL)へ投入する
// 実行方法: node --env-file=.env.local scripts/seed-yajima.mts
import { Client } from "pg";

const faqs: { category: string; question: string; answer: string }[] = [
  {
    category: "営業時間",
    question: "営業時間を教えてください",
    answer:
      "営業時間は10:00〜19:00（最終受付18:00）です。完全予約制のため、ご来店前にご予約をお願いいたします。",
  },
  {
    category: "料金",
    question: "カット料金はいくらですか",
    answer:
      "カットは¥6,000（シャンプー・ブロー込み）です。カラー・パーマ等を含む場合は別途メニュー表をご案内しますので、ご希望の内容をお知らせください。",
  },
  {
    category: "アクセス",
    question: "お店の場所を教えてください",
    answer:
      "千葉県千葉市中央区新町3-5-2 矢島ビル1Fです。JR千葉駅東口から徒歩7分、大通り沿いのビルの1階になります。",
  },
  {
    category: "定休日",
    question: "定休日はいつですか",
    answer: "定休日は毎週月曜日と第3火曜日です。祝日は営業しております。",
  },
  {
    category: "支払い方法",
    question: "支払い方法は何がありますか",
    answer: "現金・クレジットカード（VISA/Master/JCB）・PayPay・楽天Payに対応しております。",
  },
];

const menus: { category: string; name: string; price: number; durationMin: number }[] = [
  { category: "カット", name: "カット（シャンプー・ブロー込み）", price: 6000, durationMin: 60 },
  { category: "カット", name: "前髪カットのみ", price: 1000, durationMin: 15 },
  { category: "カラー", name: "フルカラー（カット込み）", price: 12000, durationMin: 120 },
  { category: "カラー", name: "フルカラー（カットなし）", price: 8000, durationMin: 90 },
  { category: "カラー", name: "リタッチカラー（根元のみ）", price: 6500, durationMin: 75 },
  { category: "パーマ", name: "パーマ（カット込み）", price: 13000, durationMin: 150 },
  { category: "パーマ", name: "パーマ（カットなし）", price: 9500, durationMin: 120 },
  { category: "パーマ", name: "縮毛矯正（カット込み）", price: 18000, durationMin: 180 },
  { category: "トリートメント", name: "通常トリートメント", price: 3000, durationMin: 20 },
  { category: "トリートメント", name: "集中補修トリートメント", price: 5000, durationMin: 40 },
];

const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();

  // 再実行してもデータが重複しないよう、投入前に既存データを入れ替える
  await client.query("TRUNCATE TABLE faqs RESTART IDENTITY");
  await client.query("TRUNCATE TABLE menus RESTART IDENTITY");

  for (const faq of faqs) {
    await client.query(
      "INSERT INTO faqs (category, question, answer) VALUES ($1, $2, $3)",
      [faq.category, faq.question, faq.answer]
    );
  }

  for (const menu of menus) {
    await client.query(
      "INSERT INTO menus (category, name, price, duration_min) VALUES ($1, $2, $3, $4)",
      [menu.category, menu.name, menu.price, menu.durationMin]
    );
  }

  console.log(`投入完了: faqs ${faqs.length}件, menus ${menus.length}件`);
} finally {
  await client.end();
}
