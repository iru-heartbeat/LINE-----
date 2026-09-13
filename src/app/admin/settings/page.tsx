import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSalonName } from "@/lib/db";
import { updateSalonNameAction } from "./actions";
import { SubmitButton } from "../_components/submit-button";
import { FlashBanner } from "../_components/flash-banner";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const salonName = await getSalonName();

  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <FlashBanner />
      </Suspense>

      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">店舗設定</h1>

      <form
        action={updateSalonNameAction}
        className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="space-y-1">
          <label htmlFor="salonName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            店舗名
          </label>
          <input
            id="salonName"
            name="salonName"
            type="text"
            required
            defaultValue={salonName}
            placeholder="例: 矢島美容室"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">管理画面のヘッダーに表示されます。</p>
        </div>

        <SubmitButton
          pendingText="保存中..."
          className="flex min-h-12 items-center justify-center rounded-md bg-blue-600 px-4 text-base font-medium text-white"
        >
          保存
        </SubmitButton>
      </form>
    </div>
  );
}
