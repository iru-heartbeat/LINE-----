// .env.local の LINE_CHANNEL_SECRET を使って正しい署名を自分で計算し、
// Webhookエンドポイントが正しく検証できるかをテストする（値は一切表示しない）
// 実行方法: node --env-file=.env.local scripts/test-webhook-signature.mjs <URL>
import crypto from "node:crypto";

const url = process.argv[2];
if (!url) throw new Error("使い方: node --env-file=.env.local scripts/test-webhook-signature.mjs <URL>");

const secret = process.env.LINE_CHANNEL_SECRET;
if (!secret) throw new Error("LINE_CHANNEL_SECRET is not set");

const body = JSON.stringify({ destination: "xxxxxxxxxx", events: [] });
const signature = crypto.createHmac("sha256", secret).update(body).digest("base64");

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-line-signature": signature,
  },
  body,
});

console.log("status:", res.status);
console.log("body:", await res.text());
