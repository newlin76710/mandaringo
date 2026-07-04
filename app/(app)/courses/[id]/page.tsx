import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, MapPin, Calendar, Clock } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCourseDetail } from "@/lib/queries/courses";
import { getManageableStudents } from "@/lib/queries/students";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COURSE_LEVEL_LABELS, DAY_OF_WEEK_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { LmsNav } from "@/components/lms/LmsNav";
import { EnrollWidget } from "@/components/lms/EnrollWidget";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseDetail(id);
  if (!course || !course.isPublished) notFound();

  const session = await auth();
  const full = course._count.enrollments >= course.maxCapacity;

  let studentOptions: { id: string; label: string; alreadyEnrolled: boolean }[] = [];
  const canEnroll = session?.user && (session.user.role === "PARENT" || session.user.role === "STUDENT");

  if (canEnroll) {
    const students = await getManageableStudents(session!.user.id, session!.user.role);
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: course.id, studentId: { in: students.map((s) => s.id) } },
    });
    const activeStudentIds = new Set(
      enrollments.filter((e) => e.status !== "CANCELLED" && e.status !== "WITHDRAWN").map((e) => e.studentId)
    );
    studentOptions = students.map((s) => ({
      id: s.id,
      label: `${s.chineseLastName}${s.chineseFirstName}`,
      alreadyEnrolled: activeStudentIds.has(s.id),
    }));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNav />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Badge variant="info">{COURSE_LEVEL_LABELS[course.level]}</Badge>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{course.name}</h1>
        <p className="mt-1 text-sm text-slate-400">課程編號：{course.code}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardContent className="space-y-4 pt-6 text-sm leading-relaxed text-slate-600">
              <p>{course.description}</p>
              {course.scheduleNote && (
                <div>
                  <h3 className="font-bold text-slate-900">課程說明</h3>
                  <p className="mt-1 whitespace-pre-line">{course.scheduleNote}</p>
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-900">授課老師</h3>
                <p className="mt-1">
                  {course.primaryTeacher.chineseLastName}
                  {course.primaryTeacher.chineseFirstName}（主教）
                  {course.secondaryTeachers.length > 0 &&
                    " / " +
                      course.secondaryTeachers
                        .map((st) => `${st.teacher.chineseLastName}${st.teacher.chineseFirstName}`)
                        .join("、")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="text-2xl font-extrabold text-sky-600">{formatCurrency(course.fee.toString(), course.currency)}</div>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {formatDate(course.startDate)} ～ {formatDate(course.endDate)}
                </li>
                {course.dayOfWeek !== null && course.startTime && (
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    每{DAY_OF_WEEK_LABELS[course.dayOfWeek]} {course.startTime}
                    {course.timezone ? `（${course.timezone}）` : ""}
                  </li>
                )}
                {course.region && (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {course.region}
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  {course._count.enrollments} / {course.maxCapacity} 人
                </li>
              </ul>

              <div className="border-t border-slate-100 pt-4">
                {canEnroll ? (
                  <EnrollWidget courseId={course.id} students={studentOptions} full={full} />
                ) : session?.user ? (
                  <p className="text-sm text-slate-500">此帳號類型無法直接報名，請聯繫行政人員協助安排。</p>
                ) : (
                  <Link href="/login" className="text-sm font-semibold text-sky-600 hover:underline">
                    請先登入以報名此課程 →
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
