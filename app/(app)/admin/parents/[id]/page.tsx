import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActiveToggleButton } from "@/components/lms/admin/ActiveToggleButton";
import { DeleteRecordButton } from "@/components/lms/admin/DeleteRecordButton";
import { ParentProfileEditForm } from "@/components/lms/ParentProfileEditForm";
import { setParentActive } from "@/app/actions/admin-users";
import { updateParentAdmin, deleteParentAdmin } from "@/app/actions/admin-parents";

export const dynamic = "force-dynamic";

export default async function AdminParentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parent = await prisma.parent.findUnique({
    where: { id },
    include: { students: { include: { student: true } } },
  });
  if (!parent) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {parent.chineseLastName}
            {parent.chineseFirstName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{parent.email}</p>
        </div>
        <div className="flex gap-2">
          <ActiveToggleButton id={parent.id} isActive={parent.isActive} action={setParentActive} />
          <DeleteRecordButton
            id={parent.id}
            confirmMessage={`確定要刪除家長「${parent.chineseLastName}${parent.chineseFirstName}」嗎？此操作無法復原。`}
            redirectTo="/admin/parents"
            action={deleteParentAdmin}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本資料</CardTitle>
        </CardHeader>
        <CardContent>
          <ParentProfileEditForm
            defaultValues={{
              chineseFirstName: parent.chineseFirstName,
              chineseLastName: parent.chineseLastName,
              englishFirstName: parent.englishFirstName,
              englishLastName: parent.englishLastName,
              gender: parent.gender,
              phone: parent.phone,
              nationality: parent.nationality ?? "",
              postalCode: parent.postalCode ?? "",
              address: parent.address ?? undefined,
              otherContact: parent.otherContact ?? undefined,
              occupation: parent.occupation ?? undefined,
              educationLevel: parent.educationLevel ?? undefined,
              secondaryContactName: parent.secondaryContactName ?? undefined,
              secondaryContactPhone: parent.secondaryContactPhone ?? undefined,
              notes: parent.notes ?? undefined,
            }}
            onSave={(profile) => updateParentAdmin(parent.id, profile)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>連結學生</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {parent.students.length === 0 ? (
            <p className="text-sm text-slate-400">尚未連結學生</p>
          ) : (
            parent.students.map((ps) => (
              <Link
                key={ps.id}
                href={`/admin/students/${ps.student.id}`}
                className="flex items-center justify-between text-sm text-slate-700 hover:text-sky-600"
              >
                <span>
                  {ps.student.chineseLastName}
                  {ps.student.chineseFirstName}（{ps.relationship}）
                </span>
                <span className="text-slate-400">{ps.student.studentNumber}</span>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
