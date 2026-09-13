import Link from "next/link";
import type { Faq } from "@/lib/db";
import { SubmitButton } from "./submit-button";

export function FaqForm({
  action,
  faq,
}: {
  action: (formData: FormData) => Promise<void>;
  faq?: Faq;
}) {
  return (
    <form
      action={action}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
    >
      {faq && <input type="hidden" name="id" value={faq.id} />}

      <div className="space-y-1">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          質問
        </label>
        <input
          id="question"
          name="question"
          type="text"
          required
          defaultValue={faq?.question}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          回答
        </label>
        <textarea
          id="answer"
          name="answer"
          required
          rows={4}
          defaultValue={faq?.answer}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          カテゴリ（任意）
        </label>
        <input
          id="category"
          name="category"
          type="text"
          defaultValue={faq?.category ?? ""}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="flex gap-2">
        <SubmitButton
          pendingText="保存中..."
          className="flex min-h-12 items-center justify-center rounded-md bg-blue-600 px-4 text-base font-medium text-white"
        >
          保存
        </SubmitButton>
        <Link
          href="/admin/faqs"
          className="flex min-h-12 items-center rounded-md border border-gray-300 px-4 text-base text-gray-700 dark:border-gray-700 dark:text-gray-200"
        >
          キャンセル
        </Link>
      </div>
    </form>
  );
}
