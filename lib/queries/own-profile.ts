import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

type OwnProfile =
  | { type: "STUDENT"; data: NonNullable<Awaited<ReturnType<typeof prisma.student.findUnique>>> }
  | { type: "PARENT"; data: NonNullable<Awaited<ReturnType<typeof prisma.parent.findUnique>>> }
  | { type: "TEACHER"; data: NonNullable<Awaited<ReturnType<typeof prisma.teacher.findUnique>>> };

/**
 * Resolves whichever profile record belongs to this user. For Student/Parent/Teacher
 * accounts this is just their own role's profile. Admin/Super Admin are pure account
 * roles with no profile of their own by default — but an admin who was promoted after
 * registering normally may already have one (e.g. a Parent profile), so we check all
 * three rather than assuming. If none exists, the caller should default to creating a
 * Teacher profile — an Admin/Super Admin's default identity in this system.
 */
export async function resolveOwnProfile(userId: string, role: Role): Promise<OwnProfile | null> {
  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId } });
    return student ? { type: "STUDENT", data: student } : null;
  }
  if (role === "PARENT") {
    const parent = await prisma.parent.findUnique({ where: { userId } });
    return parent ? { type: "PARENT", data: parent } : null;
  }
  if (role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    return teacher ? { type: "TEACHER", data: teacher } : null;
  }

  // ADMIN / SUPER_ADMIN
  const [teacher, parent, student] = await Promise.all([
    prisma.teacher.findUnique({ where: { userId } }),
    prisma.parent.findUnique({ where: { userId } }),
    prisma.student.findUnique({ where: { userId } }),
  ]);
  if (teacher) return { type: "TEACHER", data: teacher };
  if (parent) return { type: "PARENT", data: parent };
  if (student) return { type: "STUDENT", data: student };
  return null;
}
