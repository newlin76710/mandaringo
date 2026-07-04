import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasTeacherAccessCode } from "@/lib/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherAccessCodeForm } from "@/components/lms/admin/TeacherAccessCodeForm";

export const metadata: Metadata = { title: "系統設定 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN" && session?.user.role !== "SUPER_ADMIN") redirect("/admin");

  const isSet = await hasTeacherAccessCode();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">系統設定</h1>

      <Card>
        <CardHeader>
          <CardTitle>老師註冊密碼</CardTitle>
        </CardHeader>
        <CardContent>
          <TeacherAccessCodeForm isSet={isSet} />
        </CardContent>
      </Card>
    </div>
  );
}
