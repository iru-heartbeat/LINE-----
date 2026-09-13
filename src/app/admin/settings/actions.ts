"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { updateSalonName } from "@/lib/db";

export async function updateSalonNameAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const salonName = String(formData.get("salonName") ?? "").trim();
  if (!salonName) return;

  await updateSalonName(salonName);
  revalidatePath("/admin", "layout");
  redirect(`/admin/settings?flash=${encodeURIComponent("更新しました")}`);
}
