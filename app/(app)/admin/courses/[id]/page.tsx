import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseForm } from "@/components/lms/admin/CourseForm";
import { ArchiveCourseButton } from "@/components/lms/admin/ArchiveCourseButton";
import { ENROLLMENT_STATUS_LABELS, ENROLLMENT_STATUS_BADGE } from "@/lib/constants";

export const dynamic = "force-dynamic";

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function AdminCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id },
    include: { enrollments: { include: { student: true, payment: true } } },
  });
  if (!course) notFound();

  if (session.user.role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    if (!teacher || teacher.id !== course.primaryTeacherId) redirect("/admin/courses");
  }

  let teachers: { id: string; label: string }[] = [];
  let lockPrimaryTeacher: string | undefined;
  if (session.user.role === "TEACHER") {
    lockPrimaryTeacher = course.primaryTeacherId;
    teachers = [{ id: course.primaryTeacherId, label: "" }];
    const teacher = await prisma.teacher.findUnique({ where: { id: course.primaryTeacherId } });
    if (teacher) teachers = [{ id: teacher.id, label: `${teacher.chineseLastName}${teacher.chineseFirstName}` }];
  } else {
    const all = await prisma.teacher.findMany({ where: { isActive: true }, orderBy: { chineseLastName: "asc" } });
    teachers = all.map((t) => ({ id: t.id, label: `${t.chineseLastName}${t.chineseFirstName}` }));
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{course.name}</h1>
          <p className="text-sm text-slate-400">{course.code}</p>
        </div>
        <ArchiveCourseButton courseId={course.id} archived={!!course.archivedAt} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>編輯課程資料</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm
            teachers={teachers}
            lockPrimaryTeacher={lockPrimaryTeacher}
            course={{
              id: course.id,
              name: course.name,
              description: course.description ?? undefined,
              level: course.level,
              fee: Number(course.fee),
              currency: course.currency,
              startDate: toDateInput(course.startDate),
              endDate: toDateInput(course.endDate),
              scheduleNote: course.scheduleNote ?? undefined,
              region: course.region ?? undefined,
              timezone: course.timezone ?? undefined,
              dayOfWeek: course.dayOfWeek ?? undefined,
              startTime: course.startTime ?? undefined,
              minCapacity: course.minCapacity,
              maxCapacity: course.maxCapacity,
              materialUrl: course.materialUrl ?? undefined,
              isPublished: course.isPublished,
              primaryTeacherId: course.primaryTeacherId,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>學生名冊 ({course.enrollments.filter((e) => e.status === "ACTIVE").length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {course.enrollments.length === 0 ? (
            <p className="text-sm text-slate-400">尚無報名紀錄</p>
          ) : (
            course.enrollments.map((e) => (
              <div key={e.id} className="flex items-center justify-between text-sm">
                <span>
                  {e.student.chineseLastName}
                  {e.student.chineseFirstName}
                </span>
                <Badge variant={ENROLLMENT_STATUS_BADGE[e.status]}>{ENROLLMENT_STATUS_LABELS[e.status]}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
