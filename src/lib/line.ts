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

function getAccessTokenOrThrow(): string {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
  return token;
}

// 送信者の表示名を取得する(友だち解除済み・ブロック中などで取得できない場合はnull)
export async function getUserDisplayName(userId: string): Promise<string | null> {
  const token = getAccessTokenOrThrow();

  const res = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { displayName?: string };
  return data.displayName ?? null;
}

// 友だち全員へお知らせメッセージを一斉配信する
export async function sendBroadcast(text: string): Promise<void> {
  const token = getAccessTokenOrThrow();

  const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages: [{ type: "text", text }] }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LINE broadcast failed: ${res.status} ${errText}`);
  }
}

export type MessageQuota = { limit: number | null; used: number };

// 今月のメッセージ配信の上限と使用済み数（無料枠の残数確認用）
export async function getMessageQuota(): Promise<MessageQuota> {
  const token = getAccessTokenOrThrow();
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [quotaRes, consumptionRes] = await Promise.all([
    fetch("https://api.line.me/v2/bot/message/quota", { headers: authHeaders }),
    fetch("https://api.line.me/v2/bot/message/quota/consumption", { headers: authHeaders }),
  ]);
  if (!quotaRes.ok || !consumptionRes.ok) {
    throw new Error("LINE quota fetch failed");
  }

  const quota = (await quotaRes.json()) as { type: "limited" | "none"; value?: number };
  const consumption = (await consumptionRes.json()) as { totalUsage: number };

  return {
    limit: quota.type === "limited" ? (quota.value ?? null) : null,
    used: consumption.totalUsage,
  };
}

function yesterdayInJstAsYyyymmdd(): string {
  const jstNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  jstNow.setDate(jstNow.getDate() - 1);
  const y = jstNow.getFullYear();
  const m = String(jstNow.getMonth() + 1).padStart(2, "0");
  const d = String(jstNow.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

// 前日時点の友だち数（当日分の集計はLINE側でまだ確定していないため取得できない）
export async function getFollowerCount(): Promise<number | null> {
  const token = getAccessTokenOrThrow();
  const date = yesterdayInJstAsYyyymmdd();

  const res = await fetch(`https://api.line.me/v2/bot/insight/followers?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { status: string; followers?: number };
  return data.status === "ready" ? (data.followers ?? null) : null;
}
