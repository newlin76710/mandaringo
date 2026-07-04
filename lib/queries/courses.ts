import { prisma } from "@/lib/prisma";

const ACTIVE_STATUSES = ["ACTIVE", "CONFIRMING"] as const;

export function getPublishedCourses() {
  return prisma.course.findMany({
    where: { isPublished: true, archivedAt: null },
    include: {
      primaryTeacher: true,
      _count: { select: { enrollments: { where: { status: { in: [...ACTIVE_STATUSES] } } } } },
    },
    orderBy: { startDate: "asc" },
  });
}

export function getCourseDetail(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      primaryTeacher: true,
      secondaryTeachers: { include: { teacher: true } },
      _count: { select: { enrollments: { where: { status: { in: [...ACTIVE_STATUSES] } } } } },
    },
  });
}
