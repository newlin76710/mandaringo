import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getManageableCourses, getRosterForAttendance } from "@/lib/queries/attendance";
import { LmsNav } from "@/components/lms/LmsNav";
import { Card, CardContent } from "@/components/ui/card";
import { CourseDatePicker } from "@/components/lms/CourseDatePicker";
import { AttendanceRosterForm } from "@/components/lms/AttendanceRosterForm";

export const metadata: Metadata = { title: "點名 - Mandarin Go" };
export const dynamic = "force-dynamic";

const ALLOWED_ROLES = ["TEACHER", "ADMIN", "SUPER_ADMIN"];

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string; date?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/attendance");
  if (!ALLOWED_ROLES.includes(session.user.role)) redirect("/dashboard");

  const { courseId, date } = await searchParams;
  const courses = await getManageableCourses(session.user.id, session.user.role);

  const roster = courseId && date ? await getRosterForAttendance(courseId, date) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNav />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-slate-900">課堂點名</h1>

        <Card className="mt-6">
          <CardContent className="pt-6">
            {courses.length === 0 ? (
              <p className="text-sm text-slate-400">您目前沒有任何課程可以點名。</p>
            ) : (
              <CourseDatePicker courses={courses} basePath="/attendance" defaultCourseId={courseId} defaultDate={date} />
            )}
          </CardContent>
        </Card>

        {roster && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <AttendanceRosterForm courseId={courseId!} date={date!} roster={roster} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
