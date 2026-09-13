import Link from "next/link";
import type { Menu } from "@/lib/db";

export function MenuForm({
  action,
  menu,
}: {
  action: (formData: FormData) => Promise<void>;
  menu?: Menu;
}) {
  return (
    <form action={action} className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      {menu && <input type="hidden" name="id" value={menu.id} />}

      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          カテゴリ
        </label>
        <input
          id="category"
          name="category"
          type="text"
          required
          defaultValue={menu?.category}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          メニュー名
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={menu?.name}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          料金（円）
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          required
          defaultValue={menu?.price}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="durationMin" className="block text-sm font-medium text-gray-700">
          所要時間（分）
        </label>
        <input
          id="durationMin"
          name="durationMin"
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          required
          defaultValue={menu?.durationMin}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-3 text-base font-medium text-white"
        >
          保存
        </button>
        <Link
          href="/admin/menus"
          className="rounded-md border border-gray-300 px-4 py-3 text-base text-gray-700"
        >
          キャンセル
        </Link>
      </div>
    </form>
  );
}
