import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFaqById } from "@/lib/db";
import { FaqForm } from "../../../_components/faq-form";
import { updateFaqAction } from "../../actions";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const faq = await getFaqById(Number(id));
  if (!faq) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">FAQ編集</h1>
      <FaqForm action={updateFaqAction} faq={faq} />
    </div>
  );
}
