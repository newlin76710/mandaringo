import type { Metadata } from "next";
import { listEnrollmentsForAdmin } from "@/lib/queries/admin-lists";
import { EnrollmentsTable } from "@/components/lms/admin/EnrollmentsTable";

export const metadata: Metadata = { title: "報名 / 繳費審核 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function AdminEnrollmentsPage() {
  const enrollments = await listEnrollmentsForAdmin();
  const pendingCount = enrollments.filter((e) => e.status === "CONFIRMING").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">報名 / 繳費審核 ({pendingCount} 筆待處理)</h1>
      <EnrollmentsTable enrollments={enrollments} />
    </div>
  );
}
