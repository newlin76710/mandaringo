"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { error: "無權限操作" } as const;
  }
  return { session };
}

export async function setStudentActive(studentId: string, isActive: boolean) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  await prisma.student.update({ where: { id: studentId }, data: { isActive } });
  await logAudit({
    actorId: check.session.user.id,
    action: isActive ? "student.activate" : "student.deactivate",
    entityType: "Student",
    entityId: studentId,
  });
  revalidatePath("/admin/students");
  return { success: true as const };
}

export async function setParentActive(parentId: string, isActive: boolean) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  await prisma.parent.update({ where: { id: parentId }, data: { isActive } });
  await logAudit({
    actorId: check.session.user.id,
    action: isActive ? "parent.activate" : "parent.deactivate",
    entityType: "Parent",
    entityId: parentId,
  });
  revalidatePath("/admin/parents");
  return { success: true as const };
}

export async function setTeacherActive(teacherId: string, isActive: boolean) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  await prisma.teacher.update({ where: { id: teacherId }, data: { isActive } });
  await logAudit({
    actorId: check.session.user.id,
    action: isActive ? "teacher.activate" : "teacher.deactivate",
    entityType: "Teacher",
    entityId: teacherId,
  });
  revalidatePath("/admin/teachers");
  return { success: true as const };
}
