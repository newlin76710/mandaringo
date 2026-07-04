import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMyEnrollments } from "@/app/actions/enrollment";
import { LmsNav } from "@/components/lms/LmsNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ENROLLMENT_STATUS_LABELS, ENROLLMENT_STATUS_BADGE } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "我的報名 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function MyEnrollmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/my/enrollments");

  const enrollments = await getMyEnrollments();

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNav />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-slate-900">我的報名</h1>

        {enrollments.length === 0 ? (
          <p className="mt-8 text-sm text-slate-400">
            還沒有報名紀錄，
            <Link href="/courses" className="font-semibold text-sky-600 hover:underline">
              去看看有哪些課程
            </Link>
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {enrollments.map((e) => (
              <Link key={e.id} href={`/my/enrollments/${e.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between gap-4 pt-6">
                    <div>
                      <p className="font-bold text-slate-900">{e.course.name}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        學生：{e.student.chineseLastName}
                        {e.student.chineseFirstName} · 報名編號 {e.code}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{formatDate(e.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={ENROLLMENT_STATUS_BADGE[e.status]}>{ENROLLMENT_STATUS_LABELS[e.status]}</Badge>
                      <p className="mt-1.5 text-sm font-bold text-slate-700">
                        {formatCurrency(e.payment?.amount.toString() ?? "0", e.payment?.currency)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
