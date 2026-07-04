import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export async function getManageableCourses(userId: string, role: Role) {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return prisma.course.findMany({ where: { archivedAt: null }, orderBy: { name: "asc" } });
  }
  if (role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: { primaryCourses: { where: { archivedAt: null } }, secondaryCourses: { include: { course: true } } },
    });
    if (!teacher) return [];
    const secondary = teacher.secondaryCourses.map((sc) => sc.course).filter((c) => !c.archivedAt);
    const map = new Map(teacher.primaryCourses.concat(secondary).map((c) => [c.id, c]));
    return Array.from(map.values());
  }
  return [];
}

export async function getRosterForAttendance(courseId: string, date: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId, status: "ACTIVE" },
    include: { student: true },
    orderBy: { student: { chineseFirstName: "asc" } },
  });

  const existing = await prisma.attendance.findMany({
    where: { courseId, date: new Date(date) },
  });
  const existingMap = new Map(existing.map((a) => [a.studentId, a]));

  return enrollments.map((e) => ({
    student: e.student,
    attendance: existingMap.get(e.studentId) ?? null,
  }));
}
