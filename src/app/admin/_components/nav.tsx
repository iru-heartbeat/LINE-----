"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "../actions";

const links = [
  { href: "/admin/faqs", label: "FAQ管理" },
  { href: "/admin/inquiries", label: "問い合わせ履歴" },
];

export function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex gap-4">
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
