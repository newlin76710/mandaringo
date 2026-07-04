import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listCurrentAdmins, listPromotableTeachers } from "@/lib/queries/admin-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PromoteToAdminDialog } from "@/components/lms/admin/PromoteToAdminDialog";
import { DemoteAdminButton } from "@/components/lms/admin/DemoteAdminButton";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "管理員管理 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function AdminAdminsPage() {
  const session = await auth();
  if (session?.user.role !== "SUPER_ADMIN") redirect("/admin");

  const [admins, promotable] = await Promise.all([listCurrentAdmins(), listPromotableTeachers()]);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">管理員管理</h1>
        <PromoteToAdminDialog
          teachers={promotable.map((t) => ({ id: t.id, label: `${t.chineseLastName}${t.chineseFirstName}（${t.email}）` }))}
        />
      </div>
      <p className="text-sm text-slate-500">
        管理員與最高管理員唯一的差別，就是只有最高管理員能在這裡新增或移除管理員身分。新增只能從已有登入帳號的老師中挑選；移除只會拿掉管理員身分，老師資料完整保留。
      </p>

      <Card>
        <CardHeader>
          <CardTitle>目前管理員 ({admins.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {admins.length === 0 ? (
            <p className="text-sm text-slate-400">目前沒有管理員（僅有最高管理員）。</p>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between border-b border-slate-50 py-2 last:border-0">
                <div>
                  <p className="font-semibold text-slate-800">
                    {admin.teacher ? `${admin.teacher.chineseLastName}${admin.teacher.chineseFirstName}` : admin.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {admin.email} · 設為管理員：{formatDate(admin.updatedAt)}
                  </p>
                </div>
                <DemoteAdminButton userId={admin.id} name={admin.teacher ? `${admin.teacher.chineseLastName}${admin.teacher.chineseFirstName}` : admin.name ?? admin.email ?? ""} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
