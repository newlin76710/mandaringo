import type { Metadata } from "next";
import { listParentsForAdmin } from "@/lib/queries/admin-lists";
import { ParentsTable } from "@/components/lms/admin/ParentsTable";

export const metadata: Metadata = { title: "家長管理 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function AdminParentsPage() {
  const parents = await listParentsForAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">家長管理 ({parents.length})</h1>
      <ParentsTable parents={parents} />
    </div>
  );
}
