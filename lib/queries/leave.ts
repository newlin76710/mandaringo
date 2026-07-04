import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";
import { getManageableStudents } from "@/lib/queries/students";

export async function getMyActiveEnrollments(userId: string) {
  const students = await getManageableStudents(userId);
  if (students.length === 0) return [];

  return prisma.enrollment.findMany({
    where: { studentId: { in: students.map((s) => s.id) }, status: "ACTIVE" },
    include: { course: true, student: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyLeaveRequests(userId: string) {
  const students = await getManageableStudents(userId);
  if (students.length === 0) return [];

  return prisma.leave.findMany({
    where: { studentId: { in: students.map((s) => s.id) } },
    include: { course: true, student: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLeavesForReviewer(userId: string, role: Role) {
  let courseIds: string[] | null = null;

  if (role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: { primaryCourses: true, secondaryCourses: true },
    });
    if (!teacher) return [];
    courseIds = [...teacher.primaryCourses.map((c) => c.id), ...teacher.secondaryCourses.map((sc) => sc.courseId)];
  }

  return prisma.leave.findMany({
    where: courseIds ? { courseId: { in: courseIds } } : undefined,
    include: { course: true, student: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
  });
}
