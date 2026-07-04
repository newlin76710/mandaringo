import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActiveToggleButton } from "@/components/lms/admin/ActiveToggleButton";
import { setStudentActive } from "@/app/actions/admin-users";
import {
  GENDER_LABELS,
  ENROLLMENT_STATUS_LABELS,
  ENROLLMENT_STATUS_BADGE,
  LEAVE_STATUS_LABELS,
  LEAVE_STATUS_BADGE,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      parents: { include: { parent: true } },
      enrollments: { include: { course: true }, orderBy: { createdAt: "desc" } },
      leaves: { include: { course: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!student) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {student.chineseLastName}
            {student.chineseFirstName}
            <span className="ml-2 text-sm font-normal text-slate-400">{student.studentNumber}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {student.englishFirstName} {student.englishMiddleName} {student.englishLastName}
          </p>
        </div>
        <ActiveToggleButton id={student.id} isActive={student.isActive} action={setStudentActive} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>基本資料</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Field label="性別" value={GENDER_LABELS[student.gender]} />
              <Field label="出生日期" value={formatDate(student.birthDate)} />
              <Field label="暱稱" value={student.nickname} />
              <Field label="電話" value={student.phone} />
              <Field label="Email" value={student.email} />
              <Field label="其他聯繫方式" value={student.otherContact} />
              <Field label="過敏" value={student.allergies} />
              <Field label="特殊需求" value={student.specialNeeds} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>家長 / 監護人</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {student.parents.length === 0 ? (
              <p className="text-sm text-slate-400">尚未連結家長</p>
            ) : (
              student.parents.map((ps) => (
                <div key={ps.id} className="flex items-center justify-between text-sm">
                  <span>
                    {ps.parent.chineseLastName}
                    {ps.parent.chineseFirstName}（{ps.relationship}）
                  </span>
                  <span className="text-slate-400">{ps.parent.phone}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>報名紀錄</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {student.enrollments.length === 0 ? (
            <p className="text-sm text-slate-400">尚無報名紀錄</p>
          ) : (
            student.enrollments.map((e) => (
              <div key={e.id} className="flex items-center justify-between text-sm">
                <span>{e.course.name}</span>
                <Badge variant={ENROLLMENT_STATUS_BADGE[e.status]}>{ENROLLMENT_STATUS_LABELS[e.status]}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>請假紀錄</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {student.leaves.length === 0 ? (
            <p className="text-sm text-slate-400">尚無請假紀錄</p>
          ) : (
            student.leaves.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <span>
                  {formatDate(l.date)} · {l.course.name}
                </span>
                <Badge variant={LEAVE_STATUS_BADGE[l.status]}>{LEAVE_STATUS_LABELS[l.status]}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-700">{value || "—"}</dd>
    </div>
  );
}
