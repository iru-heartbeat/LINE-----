import crypto from "node:crypto";
import { validateSignature } from "@line/bot-sdk";

// LINEから届いたリクエストが本物か検証する（なりすまし防止）
// 自前のHMAC計算にバグが無いか切り分けるため、LINE公式SDKの検証関数も併用する
export function verifyLineSignature(rawBody: Buffer, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret) throw new Error("LINE_CHANNEL_SECRET is not set");

  const hash = crypto.createHmac("sha256", secret).update(rawBody).digest("base64");
  const sdkResult = validateSignature(rawBody, secret, signature);

  if (hash !== signature || !sdkResult) {
    // 診断用: 計算結果と受信した署名はどちらも秘密鍵を含まない(一方向ハッシュ)ため出力して問題ない
    console.log("[line-webhook] computed vs received signature", {
      computed: hash,
      received: signature,
      sdkResult,
    });
  }
  return sdkResult;
}

// LINEの友だちへ返信メッセージを送る
export async function replyMessage(replyToken: string, text: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");

  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LINE reply failed: ${res.status} ${errText}`);
  }
}

// 特定のユーザー（オーナー）へ、返信とは無関係に自発的にメッセージを送る（エスカレーション通知用）
export async function pushMessage(toUserId: string, text: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: toUserId,
      messages: [{ type: "text", text }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LINE push failed: ${res.status} ${errText}`);
  }
}
