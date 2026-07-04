import { prisma } from "@/lib/prisma";

export async function getStudentDashboard(userId: string) {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      enrollments: { include: { course: true, payment: true }, orderBy: { createdAt: "desc" } },
      attendances: { include: { course: true }, orderBy: { date: "desc" }, take: 5 },
      leaves: { include: { course: true }, orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  return student;
}

export async function getParentDashboard(userId: string) {
  const parent = await prisma.parent.findUnique({
    where: { userId },
    include: {
      students: {
        include: {
          student: {
            include: {
              enrollments: { include: { course: true, payment: true }, orderBy: { createdAt: "desc" } },
              leaves: { include: { course: true }, orderBy: { createdAt: "desc" }, take: 5 },
            },
          },
        },
      },
    },
  });
  return parent;
}

export async function getTeacherDashboard(userId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    include: {
      primaryCourses: {
        where: { archivedAt: null },
        include: { _count: { select: { enrollments: { where: { status: "ACTIVE" } } } } },
        orderBy: { startDate: "desc" },
      },
      secondaryCourses: {
        include: {
          course: { include: { _count: { select: { enrollments: { where: { status: "ACTIVE" } } } } } },
        },
      },
    },
  });
  if (!teacher) return null;

  const courseIds = [
    ...teacher.primaryCourses.map((c) => c.id),
    ...teacher.secondaryCourses.map((sc) => sc.course.id),
  ];

  const pendingLeaves = await prisma.leave.findMany({
    where: { courseId: { in: courseIds }, status: "SUBMITTED" },
    include: { course: true, student: true },
    orderBy: { createdAt: "asc" },
  });

  return { teacher, pendingLeaves };
}
