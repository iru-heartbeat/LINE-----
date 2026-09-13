import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMenuById } from "@/lib/db";
import { MenuForm } from "../../../_components/menu-form";
import { updateMenuAction } from "../../actions";

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const menu = await getMenuById(Number(id));
  if (!menu) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">メニュー編集</h1>
      <MenuForm action={updateMenuAction} menu={menu} />
    </div>
  );
}
