import Anthropic from "@anthropic-ai/sdk";
import type { Faq, Menu } from "@/lib/db";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type FaqAnswer = {
  confidence: "high" | "medium" | "low";
  answer: string;
};

// FAQとメニュー一覧を毎回コンテキストとして渡し、質問への回答と確信度をClaudeに判定させる
export async function generateFaqAnswer(
  question: string,
  faqs: Faq[],
  menus: Menu[]
): Promise<FaqAnswer> {
  const faqContext = faqs
    .map((f) => `- カテゴリ: ${f.category ?? "未分類"}\n  Q: ${f.question}\n  A: ${f.answer}`)
    .join("\n");

  const menuContext = menus
    .map((m) => `- [${m.category}] ${m.name}: ¥${m.price.toLocaleString()}（所要${m.durationMin}分）`)
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 512,
    system: `あなたは美容室の公式LINEアカウントの自動応答botです。以下のFAQリストとメニュー表の内容だけを根拠に、友だちからのメッセージに日本語で丁寧に対応してください。

# FAQリスト
${faqContext}

# メニュー表
${menuContext}

# 回答ルール
- FAQリストまたはメニュー表の内容から自信を持って回答できる質問には confidence を "high" にする
- あいさつ・雑談など具体的な質問ではないメッセージには、「営業時間・料金・メニュー・アクセス・定休日・支払い方法などについてご案内できます」という趣旨の案内を confidence "high" で返す（文面はその都度自然な言い回しでよい）
- 近い内容はあるが断定しにくい場合は "medium"
- FAQ・メニューに無い情報が必要な質問や、予約の受付・空き状況の案内（未対応の機能）を求められた場合は "low"（この場合 answer は空文字でよい）
- 必ず次のJSON形式のみで出力すること。他の文章は一切含めない。
{"confidence": "high" | "medium" | "low", "answer": "回答文"}`,
    messages: [{ role: "user", content: question }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response did not contain text content");
  }

  const parsed = JSON.parse(textBlock.text) as FaqAnswer;
  return parsed;
}
