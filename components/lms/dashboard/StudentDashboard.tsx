import Link from "next/link";
import type { getStudentDashboard } from "@/lib/queries/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ENROLLMENT_STATUS_LABELS,
  ENROLLMENT_STATUS_BADGE,
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_BADGE,
  LEAVE_STATUS_LABELS,
  LEAVE_STATUS_BADGE,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type Student = NonNullable<Awaited<ReturnType<typeof getStudentDashboard>>>;

export function StudentDashboard({ student }: { student: Student }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          嗨，{student.chineseLastName}
          {student.chineseFirstName}！
        </h1>
        <p className="mt-1 text-sm text-slate-500">學號 {student.studentNumber}</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>我的課程</CardTitle>
          <Link href="/my/enrollments" className="text-sm font-semibold text-sky-600 hover:underline">
            查看全部
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {student.enrollments.length === 0 ? (
            <p className="text-sm text-slate-400">
              還沒有報名課程，
              <Link href="/courses" className="font-semibold text-sky-600 hover:underline">
                去看看課程
              </Link>
            </p>
          ) : (
            student.enrollments.slice(0, 5).map((e) => (
              <Link
                key={e.id}
                href={`/my/enrollments/${e.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
              >
                <span className="font-semibold text-slate-800">{e.course.name}</span>
                <Badge variant={ENROLLMENT_STATUS_BADGE[e.status]}>{ENROLLMENT_STATUS_LABELS[e.status]}</Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>最近出缺席</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {student.attendances.length === 0 ? (
              <p className="text-sm text-slate-400">尚無紀錄</p>
            ) : (
              student.attendances.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {formatDate(a.date)} · {a.course.name}
                  </span>
                  <Badge variant={ATTENDANCE_STATUS_BADGE[a.status]}>{ATTENDANCE_STATUS_LABELS[a.status]}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>請假紀錄</CardTitle>
            <Link href="/leave" className="text-sm font-semibold text-sky-600 hover:underline">
              請假 / 查看全部
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {student.leaves.length === 0 ? (
              <p className="text-sm text-slate-400">尚無紀錄</p>
            ) : (
              student.leaves.map((l) => (
                <div key={l.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {formatDate(l.date)} · {l.course.name}
                  </span>
                  <Badge variant={LEAVE_STATUS_BADGE[l.status]}>{LEAVE_STATUS_LABELS[l.status]}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
