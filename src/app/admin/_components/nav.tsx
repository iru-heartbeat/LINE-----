"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "../actions";

const links = [
  { href: "/admin/faqs", label: "FAQ管理" },
  { href: "/admin/menus", label: "メニュー管理" },
  { href: "/admin/inquiries", label: "問い合わせ履歴" },
  { href: "/admin/broadcast", label: "一斉配信" },
];

export function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <nav className="sticky top-0 z-10 flex flex-col gap-2 border-b border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium ${
              pathname.startsWith(link.href) ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <form action={logoutAction}>
        <button type="submit" className="text-sm text-gray-500">
          ログアウト
        </button>
      </form>
    </nav>
  );
}
