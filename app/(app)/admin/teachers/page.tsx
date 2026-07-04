import type { Metadata } from "next";
import { listTeachersForAdmin } from "@/lib/queries/admin-lists";
import { TeachersTable } from "@/components/lms/admin/TeachersTable";

export const metadata: Metadata = { title: "老師管理 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function AdminTeachersPage() {
  const teachers = await listTeachersForAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">老師管理 ({teachers.length})</h1>
      <TeachersTable teachers={teachers} />
    </div>
  );
}
