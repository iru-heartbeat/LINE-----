import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMessageQuota, getFollowerCount } from "@/lib/line";
import { getBroadcasts } from "@/lib/db";
import { BroadcastForm } from "../_components/broadcast-form";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

export default async function BroadcastPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [quota, followerCount, broadcasts] = await Promise.all([
    getMessageQuota().catch(() => null),
    getFollowerCount().catch(() => null),
    getBroadcasts(),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">一斉配信</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
        <p>友だち数（前日時点）: {followerCount ?? "取得できませんでした"}</p>
        {quota ? (
          <p>
            今月の配信可能数:{" "}
            {quota.limit === null ? "上限なし（従量課金プラン）" : `残り ${quota.limit - quota.used} / ${quota.limit} 通`}
          </p>
        ) : (
          <p>配信可能数: 取得できませんでした</p>
        )}
      </div>

      <BroadcastForm />

      <h2 className="text-base font-semibold text-gray-900">配信履歴</h2>
      {broadcasts.length === 0 && <p className="text-sm text-gray-500">配信履歴はまだありません。</p>}
      <ul className="space-y-3">
        {broadcasts.map((b) => (
          <li key={b.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
              <span>{formatDateTime(b.sentAt)}</span>
              <span>送信対象の目安: {b.recipientCount}人</span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-900">{b.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
