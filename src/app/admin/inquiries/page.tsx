import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getInquiries } from "@/lib/db";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

export default async function InquiriesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const inquiries = await getInquiries();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">問い合わせ履歴</h1>

      {inquiries.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">問い合わせ履歴はまだありません。</p>
      )}

      <ul className="space-y-3">
        {inquiries.map((inquiry) => (
          <li
            key={inquiry.id}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-1 flex items-center justify-between">
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${
                  inquiry.isEscalated
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                }`}
              >
                {inquiry.isEscalated ? "未対応（要オーナー対応）" : "自動応答済み"}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{formatDateTime(inquiry.createdAt)}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              送信者: {inquiry.lineDisplayName ?? `不明（ID: ${inquiry.lineUserId}）`}
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-100">質問: {inquiry.message}</p>
            {inquiry.botResponse && (
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
                回答: {inquiry.botResponse}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
