import { prisma } from "@/lib/prisma";

export function listStudentsForAdmin() {
  return prisma.student.findMany({
    include: {
      parents: { include: { parent: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function listParentsForAdmin() {
  return prisma.parent.findMany({
    include: { students: { include: { student: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function listTeachersForAdmin() {
  return prisma.teacher.findMany({
    include: { _count: { select: { primaryCourses: true, secondaryCourses: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function listCoursesForAdmin() {
  return prisma.course.findMany({
    include: {
      primaryTeacher: true,
      _count: { select: { enrollments: { where: { status: { in: ["ACTIVE", "CONFIRMING"] } } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function listEnrollmentsForAdmin() {
  return prisma.enrollment.findMany({
    include: { course: true, student: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}
