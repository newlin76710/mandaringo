"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { error: "僅最高管理員可以操作" } as const;
  }
  return { session };
}

/** Promote an existing Teacher (who already has their own login) to Admin. */
export async function promoteTeacherToAdmin(teacherId: string) {
  const check = await requireSuperAdmin();
  if ("error" in check) return { error: check.error } as const;

  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId }, include: { user: true } });
  if (!teacher || !teacher.userId || !teacher.user) return { error: "找不到可升級的老師帳號" };
  if (teacher.user.role === "ADMIN" || teacher.user.role === "SUPER_ADMIN") {
    return { error: "此帳號已經是管理員" };
  }

  await prisma.user.update({ where: { id: teacher.userId }, data: { role: "ADMIN" } });

  await logAudit({
    actorId: check.session.user.id,
    action: "user.promote_to_admin",
    entityType: "User",
    entityId: teacher.userId,
  });

  revalidatePath("/admin/admins");
  return { success: true as const };
}

/**
 * Removes Admin status only — the underlying Teacher profile (and everything else) is
 * left completely untouched, since Admin's identity is always "a Teacher plus the Admin
 * role." Only ever demotes to TEACHER, and only ever targets ADMIN (not another
 * SUPER_ADMIN) to avoid accidentally locking out other super admins.
 */
export async function demoteAdmin(userId: string) {
  const check = await requireSuperAdmin();
  if ("error" in check) return { error: check.error } as const;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "找不到此帳號" };
  if (user.role !== "ADMIN") return { error: "此帳號不是管理員" };

  await prisma.user.update({ where: { id: userId }, data: { role: "TEACHER" } });

  await logAudit({ actorId: check.session.user.id, action: "user.demote_from_admin", entityType: "User", entityId: userId });

  revalidatePath("/admin/admins");
  return { success: true as const };
}
