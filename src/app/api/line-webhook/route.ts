import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyMessage, pushMessage, getUserDisplayName } from "@/lib/line";
import { getFaqs, getMenus, logInquiry } from "@/lib/db";
import { generateFaqAnswer } from "@/lib/claude";

type LineEvent = {
  type: string;
  replyToken?: string;
  message?: { type: string; text?: string };
  source?: { userId?: string };
};

const ESCALATION_MESSAGE =
  "申し訳ございません、こちらではお答えできないお問い合わせのため、オーナーより直接ご返信いたします。少々お待ちください。";

export async function POST(request: NextRequest) {
  const rawBodyBuffer = Buffer.from(await request.arrayBuffer());
  const signature = request.headers.get("x-line-signature");

  const signatureOk = verifyLineSignature(rawBodyBuffer, signature);
  if (!signatureOk) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBodyBuffer.toString("utf8")) as { events?: LineEvent[] };

  for (const event of body.events ?? []) {
    if (event.type !== "message" || event.message?.type !== "text" || !event.replyToken) {
      continue;
    }

    const question = event.message.text ?? "";
    const lineUserId = event.source?.userId ?? "unknown";
    console.log("[line-webhook] sender userId:", lineUserId);

    try {
      const [faqs, menus, lineDisplayName] = await Promise.all([
        getFaqs(),
        getMenus(),
        lineUserId === "unknown" ? Promise.resolve(null) : getUserDisplayName(lineUserId).catch(() => null),
      ]);
      const { confidence, answer } = await generateFaqAnswer(question, faqs, menus);

      if (confidence === "low") {
        await replyMessage(event.replyToken, ESCALATION_MESSAGE);
        await logInquiry({ lineUserId, lineDisplayName, message: question, botResponse: null, isEscalated: true });

        const ownerUserId = process.env.OWNER_LINE_USER_ID;
        if (ownerUserId) {
          await pushMessage(
            ownerUserId,
            `【要対応】自動応答できない質問が届きました。\n質問: ${question}`
          );
        } else {
          console.log("[line-webhook] OWNER_LINE_USER_ID is not set; skipped owner notification");
        }
      } else {
        await replyMessage(event.replyToken, answer);
        await logInquiry({ lineUserId, lineDisplayName, message: question, botResponse: answer, isEscalated: false });
      }
    } catch (err) {
      console.error("[line-webhook] failed to handle message event", err);
    }
  }

  return NextResponse.json({ status: "ok" });
}
