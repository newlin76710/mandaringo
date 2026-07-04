import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActiveToggleButton } from "@/components/lms/admin/ActiveToggleButton";
import { DeleteRecordButton } from "@/components/lms/admin/DeleteRecordButton";
import { StudentProfileEditForm } from "@/components/lms/StudentProfileEditForm";
import { setStudentActive } from "@/app/actions/admin-users";
import { updateStudentAdmin, deleteStudentAdmin } from "@/app/actions/admin-students";
import {
  ENROLLMENT_STATUS_LABELS,
  ENROLLMENT_STATUS_BADGE,
  LEAVE_STATUS_LABELS,
  LEAVE_STATUS_BADGE,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

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
    <div className="max-w-3xl space-y-6">
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
        <div className="flex gap-2">
          <ActiveToggleButton id={student.id} isActive={student.isActive} action={setStudentActive} />
          <DeleteRecordButton
            id={student.id}
            confirmMessage={`確定要刪除學生「${student.chineseLastName}${student.chineseFirstName}」嗎？此操作無法復原。`}
            redirectTo="/admin/students"
            action={deleteStudentAdmin}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本資料</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentProfileEditForm
            defaultValues={{
              chineseFirstName: student.chineseFirstName,
              chineseLastName: student.chineseLastName,
              englishFirstName: student.englishFirstName,
              englishMiddleName: student.englishMiddleName ?? undefined,
              englishLastName: student.englishLastName,
              nickname: student.nickname ?? undefined,
              gender: student.gender,
              birthDate: toDateInput(student.birthDate),
              phone: student.phone ?? undefined,
              otherContact: student.otherContact ?? undefined,
              allergies: student.allergies ?? undefined,
              specialNeeds: student.specialNeeds ?? undefined,
              notes: student.notes ?? undefined,
            }}
            onSave={(profile) => updateStudentAdmin(student.id, profile)}
          />
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
