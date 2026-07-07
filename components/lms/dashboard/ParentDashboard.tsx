import Link from "next/link";
import { UserCog } from "lucide-react";
import type { getParentDashboard } from "@/lib/queries/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ENROLLMENT_STATUS_LABELS, ENROLLMENT_STATUS_BADGE, LEAVE_STATUS_LABELS, LEAVE_STATUS_BADGE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { AddStudentDialog } from "@/components/lms/AddStudentDialog";
import { BecomeTeacherDialog } from "@/components/lms/BecomeTeacherDialog";

type Parent = NonNullable<Awaited<ReturnType<typeof getParentDashboard>>>;

export function ParentDashboard({ parent }: { parent: Parent }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {parent.chineseLastName}
            {parent.chineseFirstName} 您好
          </h1>
          <p className="mt-1 text-sm text-slate-500">管理您孩子的報名、繳費與請假</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/profile">
              <UserCog className="h-4 w-4" />
              編輯個人資料
            </Link>
          </Button>
          <AddStudentDialog />
          <BecomeTeacherDialog
            defaultValues={{
              chineseFirstName: parent.chineseFirstName,
              chineseLastName: parent.chineseLastName,
              englishFirstName: parent.englishFirstName,
              englishLastName: parent.englishLastName,
              gender: parent.gender,
              phone: parent.phone,
              nationality: parent.nationality ?? "",
              postalCode: parent.postalCode ?? "",
            }}
          />
        </div>
      </div>

      {parent.students.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-slate-400">
            尚未新增學生資料，請點選右上角「新增學生」開始報名課程。
          </CardContent>
        </Card>
      ) : (
        parent.students.map(({ student, relationship }) => (
          <Card key={student.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>
                {student.chineseLastName}
                {student.chineseFirstName}
                <span className="ml-2 text-xs font-normal text-slate-400">
                  {relationship} · 學號 {student.studentNumber}
                </span>
              </CardTitle>
              <Link href="/courses" className="text-sm font-semibold text-sky-600 hover:underline">
                為其報名新課程
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">課程</h3>
                {student.enrollments.length === 0 ? (
                  <p className="text-sm text-slate-400">尚未報名任何課程</p>
                ) : (
                  <div className="space-y-2">
                    {student.enrollments.map((e) => (
                      <Link
                        key={e.id}
                        href={`/my/enrollments/${e.id}`}
                        className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
                      >
                        <span className="font-semibold text-slate-800">{e.course.name}</span>
                        <Badge variant={ENROLLMENT_STATUS_BADGE[e.status]}>{ENROLLMENT_STATUS_LABELS[e.status]}</Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">最近請假</h3>
                  <Link href="/leave" className="text-xs font-semibold text-sky-600 hover:underline">
                    請假
                  </Link>
                </div>
                {student.leaves.length === 0 ? (
                  <p className="text-sm text-slate-400">尚無紀錄</p>
                ) : (
                  <div className="space-y-1.5">
                    {student.leaves.map((l) => (
                      <div key={l.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          {formatDate(l.date)} · {l.course.name}
                        </span>
                        <Badge variant={LEAVE_STATUS_BADGE[l.status]}>{LEAVE_STATUS_LABELS[l.status]}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
