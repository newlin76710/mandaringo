import Link from "next/link";
import { UserCog } from "lucide-react";
import type { getTeacherDashboard } from "@/lib/queries/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COURSE_LEVEL_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type Data = NonNullable<Awaited<ReturnType<typeof getTeacherDashboard>>>;

export function TeacherDashboard({ data }: { data: Data }) {
  const { teacher, pendingLeaves } = data;
  const allCourses = [
    ...teacher.primaryCourses.map((c) => ({ ...c, activeCount: c._count.enrollments, isPrimary: true })),
    ...teacher.secondaryCourses.map((sc) => ({ ...sc.course, activeCount: sc.course._count.enrollments, isPrimary: false })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {teacher.chineseLastName}
            {teacher.chineseFirstName} 老師
          </h1>
          <p className="mt-1 text-sm text-slate-500">您的課程與待辦事項</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/profile">
              <UserCog className="h-4 w-4" />
              編輯個人資料
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/attendance">點名</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/courses/new">開新課程</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>我的課程 ({allCourses.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {allCourses.length === 0 ? (
            <p className="text-sm text-slate-400">尚未開設任何課程</p>
          ) : (
            allCourses.map((c) => (
              <Link
                key={c.id}
                href={`/admin/courses/${c.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
              >
                <div>
                  <span className="font-semibold text-slate-800">{c.name}</span>
                  <span className="ml-2 text-xs text-slate-400">{c.isPrimary ? "主教" : "協同教師"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{COURSE_LEVEL_LABELS[c.level]}</Badge>
                  <span className="text-xs text-slate-400">
                    {c.activeCount}/{c.maxCapacity} 人
                  </span>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>待審核請假 ({pendingLeaves.length})</CardTitle>
          <Link href="/leave" className="text-sm font-semibold text-sky-600 hover:underline">
            前往審核
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {pendingLeaves.length === 0 ? (
            <p className="text-sm text-slate-400">目前沒有待審核的請假申請</p>
          ) : (
            pendingLeaves.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  {formatDate(l.date)} · {l.course.name} ·{" "}
                  {l.student.chineseLastName}
                  {l.student.chineseFirstName}
                </span>
                <Badge variant="warning">審核中</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
