"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "./spinner";

export function BroadcastForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    if (!window.confirm("友だち全員にこの内容を配信します。よろしいですか？")) return;

    setSending(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = (await res.json()) as { recipientCount?: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? "配信に失敗しました");

      setResult(`送信しました（送信対象の目安: ${data.recipientCount ?? "不明"}人）`);
      setMessage("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "配信に失敗しました");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="space-y-1">
        <label htmlFor="broadcast-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          配信内容
        </label>
        <textarea
          id="broadcast-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {result && <p className="text-sm text-green-700 dark:text-green-400">{result}</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="flex w-full min-h-12 items-center justify-center rounded-md bg-blue-600 px-4 text-base font-medium text-white disabled:opacity-60"
      >
        {sending ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            配信中...
          </span>
        ) : (
          "友だち全員に配信する"
        )}
      </button>
    </form>
  );
}
