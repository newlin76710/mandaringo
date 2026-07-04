import type { Metadata } from "next";
import { listStudentsForAdmin } from "@/lib/queries/admin-lists";
import { StudentsTable } from "@/components/lms/admin/StudentsTable";

export const metadata: Metadata = { title: "學生管理 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const students = await listStudentsForAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">學生管理 ({students.length})</h1>
      <StudentsTable students={students} />
    </div>
  );
}
