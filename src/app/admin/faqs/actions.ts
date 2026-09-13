"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { createFaq, updateFaq, deleteFaq } from "@/lib/db";

// Server Actionはpublicなエンドポイントと同じ扱い。proxy.tsのチェックとは別に、ここでも必ずログイン済みか確認する
async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

function readFaqFields(formData: FormData) {
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  return { question, answer, category: categoryRaw || null };
}

export async function createFaqAction(formData: FormData): Promise<void> {
  await requireSession();
  const { question, answer, category } = readFaqFields(formData);
  if (!question || !answer) return;

  await createFaq({ question, answer, category });
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function updateFaqAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  const { question, answer, category } = readFaqFields(formData);
  if (!id || !question || !answer) return;

  await updateFaq({ id, question, answer, category });
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function deleteFaqAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  if (!id) return;

  await deleteFaq(id);
  revalidatePath("/admin/faqs");
}
