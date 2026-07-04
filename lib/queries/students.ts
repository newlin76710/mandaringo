import { prisma } from "@/lib/prisma";

/**
 * Students the current user is allowed to enroll/manage: themselves (if they have a
 * Student profile) plus any children linked via a Parent profile. Deliberately not keyed
 * off `role` — roles can be "upgraded" (e.g. a Parent who also becomes a Teacher keeps
 * User.role = TEACHER) without losing access to a profile they already have linked.
 */
export async function getManageableStudents(userId: string) {
  const [parent, student] = await Promise.all([
    prisma.parent.findUnique({
      where: { userId },
      include: { students: { include: { student: true } } },
    }),
    prisma.student.findUnique({ where: { userId } }),
  ]);

  const fromParent = parent ? parent.students.map((ps) => ps.student) : [];
  const self = student ? [student] : [];

  // A student could theoretically also be a manageable "self" while a parent of others —
  // dedupe just in case.
  const seen = new Set<string>();
  return [...fromParent, ...self].filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}
