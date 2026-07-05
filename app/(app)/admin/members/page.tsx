import type { Metadata } from "next";
import { listMembersForAdmin } from "@/lib/queries/admin-lists";
import { MembersTable } from "@/components/lms/admin/MembersTable";

export const metadata: Metadata = { title: "網站會員 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const members = await listMembersForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">網站會員 ({members.length})</h1>
        <p className="mt-1 text-sm text-slate-500">
          所有註冊登入的會員帳號，包含登入方式、目前角色與身分。刪除會移除登入帳號，讓該 Email 可重新註冊。
        </p>
      </div>
      <MembersTable members={members} />
    </div>
  );
}
