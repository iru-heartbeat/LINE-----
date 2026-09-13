import Link from "next/link";
import type { Faq } from "@/lib/db";

export function FaqForm({
  action,
  faq,
}: {
  action: (formData: FormData) => Promise<void>;
  faq?: Faq;
}) {
  return (
    <form action={action} className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      {faq && <input type="hidden" name="id" value={faq.id} />}

      <div className="space-y-1">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
          質問
        </label>
        <input
          id="question"
          name="question"
          type="text"
          required
          defaultValue={faq?.question}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
          回答
        </label>
        <textarea
          id="answer"
          name="answer"
          required
          rows={4}
          defaultValue={faq?.answer}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          カテゴリ（任意）
        </label>
        <input
          id="category"
          name="category"
          type="text"
          defaultValue={faq?.category ?? ""}
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
          href="/admin/faqs"
          className="rounded-md border border-gray-300 px-4 py-3 text-base text-gray-700"
        >
          キャンセル
        </Link>
      </div>
    </form>
  );
}
