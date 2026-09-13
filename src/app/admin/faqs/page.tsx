import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFaqs } from "@/lib/db";
import { deleteFaqAction } from "./actions";
import { DeleteButton } from "../_components/delete-button";
import { FlashBanner } from "../_components/flash-banner";

export default async function FaqsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const faqs = await getFaqs();

  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <FlashBanner />
      </Suspense>

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">FAQ管理</h1>
        <Link
          href="/admin/faqs/new"
          className="flex min-h-11 items-center rounded-md bg-blue-600 px-3 text-sm font-medium text-white"
        >
          + 新規追加
        </Link>
      </div>

      {faqs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">登録されているFAQはありません。</p>}

      <ul className="space-y-3">
        {faqs.map((faq) => (
          <li
            key={faq.id}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            {faq.category && (
              <span className="mb-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {faq.category}
              </span>
            )}
            <p className="font-medium text-gray-900 dark:text-gray-100">Q. {faq.question}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">A. {faq.answer}</p>

            <div className="mt-3 flex gap-2">
              <Link
                href={`/admin/faqs/${faq.id}/edit`}
                className="flex min-h-11 items-center rounded-md border border-gray-300 px-3 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200"
              >
                編集
              </Link>
              <DeleteButton
                id={faq.id}
                action={deleteFaqAction}
                confirmMessage="このFAQを削除しますか？"
                className="flex min-h-11 items-center rounded-md border border-red-300 px-3 text-sm text-red-600 dark:border-red-800 dark:text-red-400"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
