import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStudentDashboard, getParentDashboard, getTeacherDashboard } from "@/lib/queries/dashboard";
import { LmsNav } from "@/components/lms/LmsNav";
import { StudentDashboard } from "@/components/lms/dashboard/StudentDashboard";
import { ParentDashboard } from "@/components/lms/dashboard/ParentDashboard";
import { TeacherDashboard } from "@/components/lms/dashboard/TeacherDashboard";
import { AdminDashboard } from "@/components/lms/dashboard/AdminDashboard";

export const metadata: Metadata = { title: "會員中心 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  // Admin/Super Admin are pure account roles with no Student/Parent/Teacher profile to
  // fill in, so they skip the onboarding/hasProfile gate entirely and land on a member
  // center that surfaces a way into the back office — they should never be silently
  // redirected straight into /admin (that made the "front stage" link feel broken, since
  // it just bounced back).
  if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-slate-50">
        <LmsNav />
        <div className="mx-auto max-w-4xl px-4 py-10">
          <AdminDashboard name={session.user.name ?? session.user.email ?? "使用者"} role={session.user.role} />
        </div>
      </div>
    );
  }

  if (!session.user.hasProfile) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNav />
      <div className="mx-auto max-w-4xl px-4 py-10">
        {session.user.role === "STUDENT" && (await renderStudent(session.user.id))}
        {session.user.role === "PARENT" && (await renderParent(session.user.id))}
        {session.user.role === "TEACHER" && (await renderTeacher(session.user.id))}
      </div>
    </div>
  );
}

async function renderStudent(userId: string) {
  const student = await getStudentDashboard(userId);
  if (!student) redirect("/onboarding");
  return <StudentDashboard student={student} />;
}

async function renderParent(userId: string) {
  const parent = await getParentDashboard(userId);
  if (!parent) redirect("/onboarding");
  return <ParentDashboard parent={parent} />;
}

async function renderTeacher(userId: string) {
  const data = await getTeacherDashboard(userId);
  if (!data) redirect("/onboarding");
  // A Parent who has also become a Teacher keeps their Parent profile — surface a way
  // back to it instead of hiding it now that the dashboard only shows one view.
  const parent = await prisma.parent.findUnique({ where: { userId }, select: { id: true } });
  return <TeacherDashboard data={data} hasParentProfile={!!parent} />;
}
