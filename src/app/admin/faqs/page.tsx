import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFaqs } from "@/lib/db";
import { deleteFaqAction } from "./actions";
import { ConfirmSubmitButton } from "../_components/confirm-submit-button";

export default async function FaqsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const faqs = await getFaqs();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">FAQ管理</h1>
        <Link
          href="/admin/faqs/new"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white"
        >
          + 新規追加
        </Link>
      </div>

      {faqs.length === 0 && <p className="text-sm text-gray-500">登録されているFAQはありません。</p>}

      <ul className="space-y-3">
        {faqs.map((faq) => (
          <li key={faq.id} className="rounded-lg border border-gray-200 bg-white p-4">
            {faq.category && (
              <span className="mb-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {faq.category}
              </span>
            )}
            <p className="font-medium text-gray-900">Q. {faq.question}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">A. {faq.answer}</p>

            <div className="mt-3 flex gap-2">
              <Link
                href={`/admin/faqs/${faq.id}/edit`}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700"
              >
                編集
              </Link>
              <form action={deleteFaqAction}>
                <input type="hidden" name="id" value={faq.id} />
                <ConfirmSubmitButton
                  confirmMessage="このFAQを削除しますか？"
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
