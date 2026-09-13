import { AdminNav } from "./_components/nav";
import { getSalonName } from "@/lib/db";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const salonName = await getSalonName();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminNav salonName={salonName} />
      <main className="mx-auto max-w-2xl p-4">{children}</main>
    </div>
  );
}
