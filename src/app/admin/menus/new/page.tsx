import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { MenuForm } from "../../_components/menu-form";
import { createMenuAction } from "../actions";

export default async function NewMenuPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">メニュー新規追加</h1>
      <MenuForm action={createMenuAction} />
    </div>
  );
}
