import { AdminNav } from "./_components/nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="mx-auto max-w-2xl p-4">{children}</main>
    </div>
  );
}
