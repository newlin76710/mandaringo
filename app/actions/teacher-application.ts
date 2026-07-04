"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { teacherProfileSchema } from "@/lib/schemas/auth";
import { createTeacherProfile } from "@/lib/profile";
import { verifyTeacherAccessCode } from "@/lib/settings";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const schema = z
  .object({ teacherAccessCode: z.string().min(1, "請輸入老師註冊密碼") })
  .and(teacherProfileSchema);

/**
 * Lets an already-authenticated account (typically a Parent) additionally become a
 * Teacher — the two identities aren't mutually exclusive. Their existing Parent profile
 * (and all its data/relationships) is left untouched; this only adds a Teacher profile
 * and, unless they're already Admin/Super Admin, upgrades User.role to TEACHER so they
 * get teacher-level permissions (create courses, take attendance, review leave) on top
 * of what they already had.
 */
export async function applyToBecomeTeacher(input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" as const };

  const existingTeacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (existingTeacher) return { error: "您已經是老師身分了" };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { teacherAccessCode, ...profile } = parsed.data;

  const validCode = await verifyTeacherAccessCode(teacherAccessCode);
  if (!validCode) return { error: "老師註冊密碼錯誤，請向行政人員確認" };

  const email = session.user.email;
  if (!email) return { error: "帳號缺少 Email，請聯繫行政人員協助設定" };

  const taken = await prisma.teacher.findUnique({ where: { email } });
  if (taken) return { error: "此 Email 已被使用，請聯繫行政人員協助合併帳號" };

  const userId = session.user.id;
  const isAdminAccount = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  await prisma.$transaction(async (tx) => {
    await createTeacherProfile(tx, userId, email, profile);
    if (!isAdminAccount) {
      await tx.user.update({ where: { id: userId }, data: { role: "TEACHER" } });
    }
  });

  await logAudit({ actorId: userId, action: "user.become_teacher", entityType: "User", entityId: userId });

  revalidatePath("/dashboard");
  return { success: true as const };
}
