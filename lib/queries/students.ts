import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

/** Students the current user is allowed to enroll/manage: themselves (STUDENT) or their linked children (PARENT). */
export async function getManageableStudents(userId: string, role: Role) {
  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId } });
    return student ? [student] : [];
  }
  if (role === "PARENT") {
    const parent = await prisma.parent.findUnique({
      where: { userId },
      include: { students: { include: { student: true } } },
    });
    return parent ? parent.students.map((ps) => ps.student) : [];
  }
  return [];
}
