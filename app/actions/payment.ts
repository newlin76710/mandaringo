"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { sendEmail, enrollmentConfirmedEmailHtml, enrollmentRejectedEmailHtml } from "@/lib/email";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { error: "無權限操作" } as const;
  }
  return { session };
}

export async function approvePayment(enrollmentId: string) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;
  const { session } = check;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true, student: true, payment: true },
  });
  if (!enrollment || !enrollment.payment) return { error: "找不到報名紀錄" };
  if (enrollment.status !== "CONFIRMING") return { error: "此報名狀態不允許核准" };

  await prisma.$transaction([
    prisma.enrollment.update({ where: { id: enrollmentId }, data: { status: "ACTIVE" } }),
    prisma.payment.update({
      where: { enrollmentId },
      data: { status: "PAID", confirmedAt: new Date(), confirmedById: session.user.id },
    }),
  ]);

  await logAudit({ actorId: session.user.id, action: "payment.approve", entityType: "Enrollment", entityId: enrollmentId });

  const studentName = `${enrollment.student.chineseLastName}${enrollment.student.chineseFirstName}`;
  const contactEmail = enrollment.student.email ?? undefined;
  if (contactEmail) {
    await sendEmail({
      to: contactEmail,
      subject: "報名已確認 - Mandarin Go",
      html: enrollmentConfirmedEmailHtml(enrollment.course.name, studentName),
    });
  }

  revalidatePath("/admin/enrollments");
  return { success: true as const };
}

const rejectSchema = z.object({ reason: z.string().min(1, "請輸入退回原因") });

export async function rejectPayment(enrollmentId: string, input: unknown) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;
  const { session } = check;

  const parsed = rejectSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true, student: true, payment: true },
  });
  if (!enrollment || !enrollment.payment) return { error: "找不到報名紀錄" };
  if (enrollment.status !== "CONFIRMING") return { error: "此報名狀態不允許退回" };

  await prisma.$transaction([
    prisma.enrollment.update({ where: { id: enrollmentId }, data: { status: "CANCELLED" } }),
    prisma.payment.update({
      where: { enrollmentId },
      data: { status: "CANCELLED", rejectedReason: parsed.data.reason },
    }),
  ]);

  await logAudit({
    actorId: session.user.id,
    action: "payment.reject",
    entityType: "Enrollment",
    entityId: enrollmentId,
    metadata: { reason: parsed.data.reason },
  });

  const studentName = `${enrollment.student.chineseLastName}${enrollment.student.chineseFirstName}`;
  const contactEmail = enrollment.student.email ?? undefined;
  if (contactEmail) {
    await sendEmail({
      to: contactEmail,
      subject: "付款確認未通過 - Mandarin Go",
      html: enrollmentRejectedEmailHtml(enrollment.course.name, studentName, parsed.data.reason),
    });
  }

  revalidatePath("/admin/enrollments");
  return { success: true as const };
}
