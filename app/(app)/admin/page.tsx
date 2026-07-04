import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, BookOpen, Users, BookMarked, Wallet, ClipboardList, TrendingUp } from "lucide-react";
import { getAdminStats } from "@/lib/queries/admin-stats";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "後台儀表板 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "在學學生", value: stats.studentCount, icon: GraduationCap, href: "/admin/students" },
    { label: "在職老師", value: stats.teacherCount, icon: BookOpen, href: "/admin/teachers" },
    { label: "家長帳號", value: stats.parentCount, icon: Users, href: "/admin/parents" },
    { label: "開放中課程", value: stats.activeCourseCount, icon: BookMarked, href: "/admin/courses" },
    { label: "待確認繳費", value: stats.pendingPaymentCount, icon: Wallet, href: "/admin/enrollments" },
    { label: "待審核請假", value: stats.pendingLeaveCount, icon: ClipboardList, href: "/leave" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">儀表板</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">{c.value}</div>
                  <div className="text-sm text-slate-500">{c.label}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{formatCurrency(stats.monthRevenue)}</div>
              <div className="text-sm text-slate-500">本月收入（已確認）</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
