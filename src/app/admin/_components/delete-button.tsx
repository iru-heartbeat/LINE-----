"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "./spinner";

export function DeleteButton({
  id,
  action,
  confirmMessage,
  className,
}: {
  id: number;
  action: (id: number) => Promise<void>;
  confirmMessage: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    startTransition(async () => {
      await action(id);
      router.refresh();
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    });
  }

  return (
    <button type="button" onClick={handleClick} disabled={pending} className={`${className} disabled:opacity-60`}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner />
          削除中...
        </span>
      ) : done ? (
        "削除しました"
      ) : (
        "削除"
      )}
    </button>
  );
}
