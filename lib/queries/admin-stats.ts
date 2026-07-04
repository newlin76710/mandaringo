import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [studentCount, teacherCount, parentCount, activeCourseCount, pendingPaymentCount, pendingLeaveCount, monthRevenue] =
    await Promise.all([
      prisma.student.count({ where: { isActive: true } }),
      prisma.teacher.count({ where: { isActive: true } }),
      prisma.parent.count({ where: { isActive: true } }),
      prisma.course.count({ where: { isPublished: true, archivedAt: null } }),
      prisma.enrollment.count({ where: { status: "CONFIRMING" } }),
      prisma.leave.count({ where: { status: "SUBMITTED" } }),
      prisma.payment.aggregate({
        where: { status: "PAID", confirmedAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
    ]);

  return {
    studentCount,
    teacherCount,
    parentCount,
    activeCourseCount,
    pendingPaymentCount,
    pendingLeaveCount,
    monthRevenue: monthRevenue._sum.amount?.toString() ?? "0",
  };
}
