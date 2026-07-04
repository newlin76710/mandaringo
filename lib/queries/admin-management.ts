import { prisma } from "@/lib/prisma";

export function listCurrentAdmins() {
  return prisma.user.findMany({
    where: { role: "ADMIN" },
    include: { teacher: true },
    orderBy: { createdAt: "asc" },
  });
}

/** Teachers eligible to be promoted: have their own login, and aren't already Admin/Super Admin. */
export function listPromotableTeachers() {
  return prisma.teacher.findMany({
    where: {
      userId: { not: null },
      isActive: true,
      user: { role: { notIn: ["ADMIN", "SUPER_ADMIN"] } },
    },
    orderBy: { chineseLastName: "asc" },
  });
}
