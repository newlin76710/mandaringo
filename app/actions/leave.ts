"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getManageableStudents } from "@/lib/queries/students";

const submitSchema = z.object({
  enrollmentId: z.string(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), "請輸入有效日期"),
  reason: z.string().min(1, "請輸入請假原因"),
});

export async function submitLeaveRequest(input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" as const };

  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const enrollment = await prisma.enrollment.findUnique({ where: { id: parsed.data.enrollmentId } });
  if (!enrollment || enrollment.status !== "ACTIVE") return { error: "找不到有效的報名紀錄" };

  const manageable = await getManageableStudents(session.user.id);
  if (!manageable.some((s) => s.id === enrollment.studentId)) return { error: "您無法為此學生申請請假" };

  const date = new Date(parsed.data.date);
  const existing = await prisma.leave.findUnique({
    where: { enrollmentId_date: { enrollmentId: enrollment.id, date } },
  });
  if (existing) return { error: "此日期已經申請過請假" };

  const leave = await prisma.leave.create({
    data: {
      enrollmentId: enrollment.id,
      courseId: enrollment.courseId,
      studentId: enrollment.studentId,
      date,
      reason: parsed.data.reason,
      requestedById: session.user.id,
      status: "SUBMITTED",
    },
  });

  await logAudit({ actorId: session.user.id, action: "leave.submit", entityType: "Leave", entityId: leave.id });

  revalidatePath("/leave");
  revalidatePath("/dashboard");
  return { success: true as const };
}

const decideSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().optional(),
});

async function canReviewCourse(userId: string, role: string, courseId: string) {
  if (role === "ADMIN" || role === "SUPER_ADMIN") return true;
  if (role !== "TEACHER") return false;
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) return false;
  const course = await prisma.course.findUnique({ where: { id: courseId }, include: { secondaryTeachers: true } });
  if (!course) return false;
  return course.primaryTeacherId === teacher.id || course.secondaryTeachers.some((st) => st.teacherId === teacher.id);
}

export async function decideLeaveRequest(leaveId: string, input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" as const };

  const parsed = decideSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const leave = await prisma.leave.findUnique({ where: { id: leaveId } });
  if (!leave) return { error: "找不到請假紀錄" };

  const allowed = await canReviewCourse(session.user.id, session.user.role, leave.courseId);
  if (!allowed) return { error: "您無權審核此請假申請" };

  await prisma.leave.update({
    where: { id: leaveId },
    data: {
      status: parsed.data.decision,
      decidedById: session.user.id,
      decidedAt: new Date(),
      decisionNote: parsed.data.note || null,
    },
  });

  if (parsed.data.decision === "APPROVED") {
    await prisma.attendance.upsert({
      where: { courseId_studentId_date: { courseId: leave.courseId, studentId: leave.studentId, date: leave.date } },
      create: {
        courseId: leave.courseId,
        studentId: leave.studentId,
        date: leave.date,
        status: "EXCUSED",
        markedById: session.user.id,
      },
      update: { status: "EXCUSED", markedById: session.user.id },
    });
  }

  await logAudit({
    actorId: session.user.id,
    action: parsed.data.decision === "APPROVED" ? "leave.approve" : "leave.reject",
    entityType: "Leave",
    entityId: leaveId,
  });

  revalidatePath("/leave");
  revalidatePath("/dashboard");
  return { success: true as const };
}
