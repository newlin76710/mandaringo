"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateEnrollmentCode } from "@/lib/codes";
import { BANK_INFO } from "@/lib/bank-info";
import { logAudit } from "@/lib/audit";
import { getManageableStudents } from "@/lib/queries/students";

const ACTIVE_STATUSES = ["ACTIVE", "CONFIRMING"] as const;

export async function enrollStudent(courseId: string, studentId: string) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" };

  const manageable = await getManageableStudents(session.user.id);
  if (!manageable.some((s) => s.id === studentId) && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { error: "您無法為此學生報名" };
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { _count: { select: { enrollments: { where: { status: { in: [...ACTIVE_STATUSES] } } } } } },
  });
  if (!course || !course.isPublished || course.archivedAt) return { error: "課程不存在或已下架" };
  if (course._count.enrollments >= course.maxCapacity) return { error: "此課程名額已滿" };

  const existing = await prisma.enrollment.findUnique({ where: { courseId_studentId: { courseId, studentId } } });
  if (existing && existing.status !== "CANCELLED" && existing.status !== "WITHDRAWN") {
    return { error: "此學生已經報名過這門課程" };
  }

  const code = generateEnrollmentCode();

  const enrollment = await prisma.$transaction(async (tx) => {
    const enr = existing
      ? await tx.enrollment.update({ where: { id: existing.id }, data: { code, status: "PENDING_PAYMENT" } })
      : await tx.enrollment.create({
          data: { code, courseId, studentId, enrolledById: session.user.id, status: "PENDING_PAYMENT" },
        });

    await tx.payment.upsert({
      where: { enrollmentId: enr.id },
      create: {
        enrollmentId: enr.id,
        amount: course.fee,
        currency: course.currency,
        status: "PENDING",
        bankCode: BANK_INFO.bankCode,
        bankAccount: BANK_INFO.accountNumber,
      },
      update: {
        status: "PENDING",
        transferLastFive: null,
        transferDate: null,
        rejectedReason: null,
      },
    });

    return enr;
  });

  await logAudit({
    actorId: session.user.id,
    action: "enrollment.create",
    entityType: "Enrollment",
    entityId: enrollment.id,
    metadata: { courseId, studentId },
  });

  revalidatePath("/courses");
  revalidatePath("/my/enrollments");
  return { success: true as const, enrollmentId: enrollment.id };
}

const proofSchema = z.object({
  transferLastFive: z.string().length(5, "請輸入匯款帳號末5碼").regex(/^\d{5}$/, "必須是 5 位數字"),
  transferDate: z.string().refine((d) => !isNaN(Date.parse(d)), "請輸入有效日期"),
});

export async function submitPaymentProof(enrollmentId: string, input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" };

  const parsed = proofSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { payment: true },
  });
  if (!enrollment) return { error: "找不到報名紀錄" };

  const isOwner = enrollment.enrolledById === session.user.id;
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isOwner && !isAdmin) return { error: "無權限操作" };
  if (enrollment.status !== "PENDING_PAYMENT") return { error: "此報名已提交過付款證明或狀態不允許" };

  await prisma.$transaction([
    prisma.enrollment.update({ where: { id: enrollmentId }, data: { status: "CONFIRMING" } }),
    prisma.payment.update({
      where: { enrollmentId },
      data: {
        status: "CONFIRMING",
        transferLastFive: parsed.data.transferLastFive,
        transferDate: new Date(parsed.data.transferDate),
      },
    }),
  ]);

  await logAudit({
    actorId: session.user.id,
    action: "payment.submit_proof",
    entityType: "Enrollment",
    entityId: enrollmentId,
  });

  revalidatePath("/my/enrollments");
  revalidatePath(`/my/enrollments/${enrollmentId}`);
  return { success: true as const };
}

export async function cancelEnrollment(enrollmentId: string) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" };

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { payment: true },
  });
  if (!enrollment) return { error: "找不到報名紀錄" };

  const manageable = await getManageableStudents(session.user.id);
  const isOwner = enrollment.enrolledById === session.user.id || manageable.some((s) => s.id === enrollment.studentId);
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isOwner && !isAdmin) return { error: "無權限操作" };
  if (enrollment.status !== "PENDING_PAYMENT" && enrollment.status !== "CONFIRMING") {
    return { error: "此報名狀態不允許取消" };
  }

  await prisma.$transaction([
    prisma.enrollment.update({ where: { id: enrollmentId }, data: { status: "CANCELLED" } }),
    prisma.payment.update({ where: { enrollmentId }, data: { status: "CANCELLED" } }),
  ]);

  await logAudit({
    actorId: session.user.id,
    action: "enrollment.cancel",
    entityType: "Enrollment",
    entityId: enrollmentId,
  });

  revalidatePath("/courses");
  revalidatePath("/my/enrollments");
  revalidatePath(`/my/enrollments/${enrollmentId}`);
  return { success: true as const };
}

export async function getMyEnrollments() {
  const session = await auth();
  if (!session?.user) return [];

  const students = await getManageableStudents(session.user.id);
  if (students.length === 0) return [];

  return prisma.enrollment.findMany({
    where: { studentId: { in: students.map((s) => s.id) } },
    include: { course: true, student: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}
