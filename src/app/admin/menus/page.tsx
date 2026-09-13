import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMenus } from "@/lib/db";
import { deleteMenuAction } from "./actions";
import { ConfirmSubmitButton } from "../_components/confirm-submit-button";

export default async function MenusPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const menus = await getMenus();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">メニュー・料金管理</h1>
        <Link
          href="/admin/menus/new"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white"
        >
          + 新規追加
        </Link>
      </div>

      {menus.length === 0 && <p className="text-sm text-gray-500">登録されているメニューはありません。</p>}

      <ul className="space-y-3">
        {menus.map((menu) => (
          <li key={menu.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <span className="mb-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {menu.category}
            </span>
            <p className="font-medium text-gray-900">{menu.name}</p>
            <p className="mt-1 text-sm text-gray-600">
              ¥{menu.price.toLocaleString()} ／ 所要{menu.durationMin}分
            </p>

            <div className="mt-3 flex gap-2">
              <Link
                href={`/admin/menus/${menu.id}/edit`}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700"
              >
                編集
              </Link>
              <form action={deleteMenuAction}>
                <input type="hidden" name="id" value={menu.id} />
                <ConfirmSubmitButton
                  confirmMessage="このメニューを削除しますか？"
                  className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600"
                >
                  削除
                </ConfirmSubmitButton>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
