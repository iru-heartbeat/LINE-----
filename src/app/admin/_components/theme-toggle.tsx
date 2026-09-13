"use client";

function toggleTheme() {
  const root = document.documentElement;
  const next = !root.classList.contains("dark");
  root.classList.toggle("dark", next);
  try {
    localStorage.setItem("theme", next ? "dark" : "light");
  } catch {
    // localStorageが使えない環境(プライベートモード等)では保存を諦め、その場での切り替えだけ行う
  }
}

// 見た目の切り替えはCSSの dark: バリアントだけで行い、Reactの状態は持たない
// (SSRとクライアントで実際のテーマが食い違ってもハイドレーションエラーにならないようにするため)
export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="ダークモード切り替え"
      className="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-gray-300 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-200"
    >
      <span className="dark:hidden">🌙</span>
      <span className="hidden dark:inline">☀️</span>
    </button>
  );
}
