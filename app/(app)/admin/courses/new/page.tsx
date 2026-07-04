import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { CourseForm } from "@/components/lms/admin/CourseForm";

export const metadata: Metadata = { title: "開新課程 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let teachers: { id: string; label: string }[] = [];
  let lockPrimaryTeacher: string | undefined;

  if (session.user.role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    if (teacher) {
      teachers = [{ id: teacher.id, label: `${teacher.chineseLastName}${teacher.chineseFirstName}` }];
      lockPrimaryTeacher = teacher.id;
    }
  } else {
    const all = await prisma.teacher.findMany({ where: { isActive: true }, orderBy: { chineseLastName: "asc" } });
    teachers = all.map((t) => ({ id: t.id, label: `${t.chineseLastName}${t.chineseFirstName}` }));
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">開新課程</h1>
      <Card>
        <CardContent className="pt-6">
          <CourseForm teachers={teachers} lockPrimaryTeacher={lockPrimaryTeacher} />
        </CardContent>
      </Card>
    </div>
  );
}
