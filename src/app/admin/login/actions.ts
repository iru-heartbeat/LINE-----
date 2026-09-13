"use server";

import { redirect } from "next/navigation";
import { getAdminUserByEmail, touchAdminLastLogin } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください" };
  }

  const adminUser = await getAdminUserByEmail(email);
  if (!adminUser || !(await verifyPassword(password, adminUser.passwordHash))) {
    return { error: "メールアドレスまたはパスワードが正しくありません" };
  }

  await createSession(adminUser.id);
  await touchAdminLastLogin(adminUser.id);
  redirect("/admin/faqs");
}
