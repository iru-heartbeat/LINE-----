"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { createMenu, updateMenu, deleteMenu } from "@/lib/db";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

function readMenuFields(formData: FormData) {
  const category = String(formData.get("category") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const durationMin = Number(formData.get("durationMin"));
  return { category, name, price, durationMin };
}

export async function createMenuAction(formData: FormData): Promise<void> {
  await requireSession();
  const { category, name, price, durationMin } = readMenuFields(formData);
  if (!category || !name || !Number.isFinite(price) || !Number.isFinite(durationMin)) return;

  await createMenu({ category, name, price, durationMin });
  revalidatePath("/admin/menus");
  redirect("/admin/menus");
}

export async function updateMenuAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  const { category, name, price, durationMin } = readMenuFields(formData);
  if (!id || !category || !name || !Number.isFinite(price) || !Number.isFinite(durationMin)) return;

  await updateMenu({ id, category, name, price, durationMin });
  revalidatePath("/admin/menus");
  redirect("/admin/menus");
}

export async function deleteMenuAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  if (!id) return;

  await deleteMenu(id);
  revalidatePath("/admin/menus");
}
