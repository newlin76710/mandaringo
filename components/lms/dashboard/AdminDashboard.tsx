import Link from "next/link";
import { Settings, GraduationCap, Wallet, ClipboardList, UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/constants";
import type { Role } from "@prisma/client";

export function AdminDashboard({ name, role }: { name: string; role: Role }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{name} 您好</h1>
          <p className="mt-1 text-sm text-slate-500">{ROLE_LABELS[role]} · 這裡是您的會員中心</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/profile">
            <UserCog className="h-4 w-4" />
            編輯個人資料
          </Link>
        </Button>
      </div>

      <Card className="border-sky-200 bg-sky-50/60">
        <CardContent className="flex flex-col items-start gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white">
              <Settings className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">後台管理</h2>
              <p className="text-sm text-slate-500">學生、家長、老師、課程、繳費審核與系統設定都在這裡</p>
            </div>
          </div>
          <Button asChild size="lg">
            <Link href="/admin">
              <Settings className="h-4 w-4" />
              前往後台管理
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/students">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 pt-6">
              <GraduationCap className="h-5 w-5 text-sky-500" />
              <span className="font-semibold text-slate-700">學生管理</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/enrollments">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 pt-6">
              <Wallet className="h-5 w-5 text-sky-500" />
              <span className="font-semibold text-slate-700">報名 / 繳費審核</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/leave">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 pt-6">
              <ClipboardList className="h-5 w-5 text-sky-500" />
              <span className="font-semibold text-slate-700">請假審核</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
