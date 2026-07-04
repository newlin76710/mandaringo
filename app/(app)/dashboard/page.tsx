import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStudentDashboard, getParentDashboard, getTeacherDashboard } from "@/lib/queries/dashboard";
import { LmsNav } from "@/components/lms/LmsNav";
import { StudentDashboard } from "@/components/lms/dashboard/StudentDashboard";
import { ParentDashboard } from "@/components/lms/dashboard/ParentDashboard";
import { TeacherDashboard } from "@/components/lms/dashboard/TeacherDashboard";

export const metadata: Metadata = { title: "我的主頁 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  if (!session.user.hasProfile) redirect("/onboarding");
  if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") redirect("/admin");

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
  return <TeacherDashboard data={data} />;
}
