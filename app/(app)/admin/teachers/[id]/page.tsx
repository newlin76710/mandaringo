import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActiveToggleButton } from "@/components/lms/admin/ActiveToggleButton";
import { setTeacherActive } from "@/app/actions/admin-users";
import { GENDER_LABELS } from "@/lib/constants";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">
          {teacher.chineseLastName}
          {teacher.chineseFirstName}
        </h1>
        <ActiveToggleButton id={teacher.id} isActive={teacher.isActive} action={setTeacherActive} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本資料</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Field label="性別" value={GENDER_LABELS[teacher.gender]} />
            <Field label="電話" value={teacher.phone} />
            <Field label="Email" value={teacher.email} />
            <Field label="國籍／居住地" value={teacher.nationality} />
            <Field label="緊急聯繫人" value={teacher.emergencyContactName} />
            <Field label="緊急聯繫人電話" value={teacher.emergencyContactPhone} />
          </dl>
          {teacher.bio && (
            <div className="mt-4">
              <dt className="text-xs text-slate-400">履歷／證照簡介</dt>
              <dd className="mt-1 whitespace-pre-line text-sm text-slate-700">{teacher.bio}</dd>
            </div>
          )}
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

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-700">{value || "—"}</dd>
    </div>
  );
}
