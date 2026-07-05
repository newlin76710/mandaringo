import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActiveToggleButton } from "@/components/lms/admin/ActiveToggleButton";
import { DeleteRecordButton } from "@/components/lms/admin/DeleteRecordButton";
import { TeacherProfileEditForm } from "@/components/lms/TeacherProfileEditForm";
import { setTeacherActive } from "@/app/actions/admin-users";
import { updateTeacherAdmin, deleteTeacherAdmin } from "@/app/actions/admin-teachers";

export const dynamic = "force-dynamic";

export default async function AdminTeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      primaryCourses: true,
      secondaryCourses: { include: { course: true } },
    },
  });
  if (!teacher) notFound();

  const courses = [...teacher.primaryCourses, ...teacher.secondaryCourses.map((sc) => sc.course)];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {teacher.chineseLastName}
            {teacher.chineseFirstName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{teacher.email}</p>
        </div>
        <div className="flex gap-2">
          <ActiveToggleButton id={teacher.id} isActive={teacher.isActive} action={setTeacherActive} />
          <DeleteRecordButton
            id={teacher.id}
            confirmMessage={`確定要刪除老師「${teacher.chineseLastName}${teacher.chineseFirstName}」嗎？此操作無法復原。`}
            redirectTo="/admin/teachers"
            action={deleteTeacherAdmin}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本資料</CardTitle>
        </CardHeader>
        <CardContent>
          <TeacherProfileEditForm
            defaultValues={{
              chineseFirstName: teacher.chineseFirstName,
              chineseLastName: teacher.chineseLastName,
              englishFirstName: teacher.englishFirstName,
              englishMiddleName: teacher.englishMiddleName ?? undefined,
              englishLastName: teacher.englishLastName,
              gender: teacher.gender,
              email: teacher.email,
              phone: teacher.phone,
              nationality: teacher.nationality ?? "",
              postalCode: teacher.postalCode ?? "",
              registeredAddress: teacher.registeredAddress ?? undefined,
              residentialAddress: teacher.residentialAddress ?? undefined,
              occupation: teacher.occupation ?? undefined,
              educationLevel: teacher.educationLevel ?? undefined,
              emergencyContactName: teacher.emergencyContactName ?? undefined,
              emergencyContactPhone: teacher.emergencyContactPhone ?? undefined,
              bio: teacher.bio ?? undefined,
            }}
            targetId={teacher.id}
            action={updateTeacherAdmin}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>授課課程</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {courses.length === 0 ? (
            <p className="text-sm text-slate-400">尚未開設課程</p>
          ) : (
            courses.map((c) => (
              <Link key={c.id} href={`/admin/courses/${c.id}`} className="block text-sm text-slate-700 hover:text-sky-600">
                {c.name}
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
