"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// 作成/更新など「別ページへ移動する」操作の直後に、遷移先で一度だけ完了メッセージを出す
// (URLの ?flash=... で受け渡す。表示する文言は最初のレンダーで一度だけ確定させ、
//  その後URLからは消す。エフェクト内で直接setStateすると再レンダーが連鎖するため避けている)
export function FlashBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [message] = useState(() => searchParams.get("flash"));
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!message) return;
    router.replace(pathname, { scroll: false });
    const timer = setTimeout(() => setHidden(true), 3000);
    return () => clearTimeout(timer);
  }, [message, pathname, router]);

  if (!message || hidden) return null;

  return (
    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 dark:border-green-700 dark:bg-green-900/40 dark:text-green-300">
      {message}
    </div>
  );
}
