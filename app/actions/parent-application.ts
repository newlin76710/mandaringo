"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parentProfileSchema } from "@/lib/schemas/auth";
import { createParentProfile } from "@/lib/profile";
import { logAudit } from "@/lib/audit";

/**
 * Lets an already-authenticated account (typically a Teacher) additionally become a
 * Parent — unlike applying to become a Teacher, this needs no access code: managing
 * your own kids' enrollment doesn't grant any elevated system permission, so there's
 * nothing to gate. Their existing profile/role is untouched; this only adds a Parent
 * profile, which unlocks the "add student" / enroll-my-kids capabilities.
 */
export async function applyToBecomeParent(input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" as const };

  const existingParent = await prisma.parent.findUnique({ where: { userId: session.user.id } });
  if (existingParent) return { error: "您已經是家長身分了" };

  const parsed = parentProfileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const email = session.user.email;
  if (!email) return { error: "帳號缺少 Email，請聯繫行政人員協助設定" };

  const taken = await prisma.parent.findUnique({ where: { email } });
  if (taken) return { error: "此 Email 已被使用，請聯繫行政人員協助合併帳號" };

  const userId = session.user.id;

  await prisma.$transaction((tx) => createParentProfile(tx, userId, email, parsed.data));

  await logAudit({ actorId: userId, action: "user.become_parent", entityType: "User", entityId: userId });

  revalidatePath("/dashboard");
  return { success: true as const };
}
