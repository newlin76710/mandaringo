"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

const recordSchema = z.object({
  studentId: z.string(),
  status: z.enum(["PRESENT", "LATE", "ABSENT", "EXCUSED"]),
  note: z.string().optional(),
});
const inputSchema = z.object({
  courseId: z.string(),
  date: z.string().refine((d) => !isNaN(Date.parse(d))),
  records: z.array(recordSchema).min(1),
});

async function canManageCourse(userId: string, role: string, courseId: string) {
  if (role === "ADMIN" || role === "SUPER_ADMIN") return true;
  if (role !== "TEACHER") return false;
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) return false;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { secondaryTeachers: true },
  });
  if (!course) return false;
  return course.primaryTeacherId === teacher.id || course.secondaryTeachers.some((st) => st.teacherId === teacher.id);
}

export async function markAttendance(input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" as const };

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const allowed = await canManageCourse(session.user.id, session.user.role, parsed.data.courseId);
  if (!allowed) return { error: "您無權為此課程點名" };

  const date = new Date(parsed.data.date);

  await prisma.$transaction(
    parsed.data.records.map((r) =>
      prisma.attendance.upsert({
        where: { courseId_studentId_date: { courseId: parsed.data.courseId, studentId: r.studentId, date } },
        create: {
          courseId: parsed.data.courseId,
          studentId: r.studentId,
          date,
          status: r.status,
          note: r.note || null,
          markedById: session.user.id,
        },
        update: { status: r.status, note: r.note || null, markedById: session.user.id },
      })
    )
  );

  await logAudit({
    actorId: session.user.id,
    action: "attendance.mark",
    entityType: "Course",
    entityId: parsed.data.courseId,
    metadata: { date: parsed.data.date, count: parsed.data.records.length },
  });

  revalidatePath("/attendance");
  return { success: true as const };
}
