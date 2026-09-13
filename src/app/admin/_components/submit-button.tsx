"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "./spinner";

// <form action={serverAction}> の中に置くと、送信中だけ自動でくるくる+文言に切り替わる
export function SubmitButton({
  children,
  pendingText,
  className,
}: {
  children: React.ReactNode;
  pendingText: string;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={`${className} disabled:opacity-60`}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner />
          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
