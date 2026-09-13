import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { FaqForm } from "../../_components/faq-form";
import { createFaqAction } from "../actions";

export default async function NewFaqPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">FAQ新規追加</h1>
      <FaqForm action={createFaqAction} />
    </div>
  );
}
