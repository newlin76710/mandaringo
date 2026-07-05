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

/**
 * Deletes a member's login entirely (account/session/tokens cascade) plus any linked
 * profile that has no real history — so the email is fully freed up and they can
 * register again from scratch. Blocks when there's enrollment/attendance/leave or
 * teaching history to protect, matching the guard used by the per-profile delete
 * actions (which push those cases toward deactivating instead).
 */
export async function deleteMemberAdmin(userId: string) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  if (userId === check.session.user.id) return { error: "無法刪除自己的帳號" };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      student: { include: { _count: { select: { enrollments: true, attendances: true, leaves: true } } } },
      teacher: { include: { _count: { select: { primaryCourses: true, secondaryCourses: true } } } },
      parent: true,
    },
  });
  if (!user) return { error: "找不到此會員" };
  if (user.role === "SUPER_ADMIN") return { error: "無法刪除最高管理員帳號" };

  if (user.student) {
    const s = user.student._count;
    if (s.enrollments > 0 || s.attendances > 0 || s.leaves > 0) {
      return { error: "此會員的學生身分已有報名、出缺席或請假紀錄，請改用停用以保留歷史資料" };
    }
  }
  if (user.teacher) {
    const t = user.teacher._count;
    if (t.primaryCourses > 0 || t.secondaryCourses > 0) {
      return { error: "此會員的老師身分已開設或協同教授課程，請改用停用以保留歷史資料" };
    }
  }

  await prisma.$transaction(async (tx) => {
    if (user.student) await tx.student.delete({ where: { id: user.student!.id } });
    if (user.teacher) await tx.teacher.delete({ where: { id: user.teacher!.id } });
    if (user.parent) await tx.parent.delete({ where: { id: user.parent!.id } });
    await tx.user.delete({ where: { id: userId } });
  });

  await logAudit({ actorId: check.session.user.id, action: "user.delete_by_admin", entityType: "User", entityId: userId });
  revalidatePath("/admin/members");
  return { success: true as const };
}
