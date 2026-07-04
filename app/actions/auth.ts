"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { issueAuthToken, consumeAuthToken } from "@/lib/tokens";
import { sendEmail, verificationEmailHtml, passwordResetEmailHtml } from "@/lib/email";
import { createStudentProfile, createParentProfile, createTeacherProfile } from "@/lib/profile";
import { logAudit } from "@/lib/audit";
import { registerSchema, onboardingSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/schemas/auth";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function registerWithCredentials(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { role, email, password, profile } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "此 Email 已被註冊過" };

  if (role === "PARENT") {
    const taken = await prisma.parent.findUnique({ where: { email } });
    if (taken) return { error: "此 Email 已被使用" };
  } else if (role === "TEACHER") {
    const taken = await prisma.teacher.findUnique({ where: { email } });
    if (taken) return { error: "此 Email 已被使用" };
  }

  const passwordHash = await hashPassword(password);

  const userId = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        role,
        name: `${profile.chineseLastName}${profile.chineseFirstName}`,
      },
    });

    if (role === "STUDENT") {
      await createStudentProfile(tx, user.id, profile);
    } else if (role === "PARENT") {
      await createParentProfile(tx, user.id, email, profile);
    } else {
      await createTeacherProfile(tx, user.id, email, profile);
    }

    return user.id;
  });

  await logAudit({ actorId: userId, action: "user.register", entityType: "User", entityId: userId, metadata: { role } });

  const token = await issueAuthToken(userId, "EMAIL_VERIFICATION");
  await sendEmail({
    to: email,
    subject: "請驗證您的 Mandarin Go 帳號",
    html: verificationEmailHtml(`${APP_URL}/verify-email?token=${token}`),
  });

  return { success: true as const };
}

export async function completeOnboarding(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { error: "請先登入" };
  if (session.user.hasProfile) return { error: "您已完成資料填寫" };

  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { role, profile } = parsed.data;
  const userId = session.user.id;
  const email = session.user.email ?? "";

  if (role === "PARENT") {
    const taken = await prisma.parent.findUnique({ where: { email } });
    if (taken) return { error: "此 Email 已被使用，請聯繫行政人員協助合併帳號" };
  } else if (role === "TEACHER") {
    const taken = await prisma.teacher.findUnique({ where: { email } });
    if (taken) return { error: "此 Email 已被使用，請聯繫行政人員協助合併帳號" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        role,
        name: `${profile.chineseLastName}${profile.chineseFirstName}`,
        emailVerified: new Date(),
      },
    });

    if (role === "STUDENT") {
      await createStudentProfile(tx, userId, profile);
    } else if (role === "PARENT") {
      await createParentProfile(tx, userId, email, profile);
    } else {
      await createTeacherProfile(tx, userId, email, profile);
    }
  });

  await logAudit({ actorId: userId, action: "user.onboard", entityType: "User", entityId: userId, metadata: { role } });

  revalidatePath("/dashboard");
  return { success: true as const };
}

export async function verifyEmail(token: string) {
  const result = await consumeAuthToken(token, "EMAIL_VERIFICATION");
  if ("error" in result) return result;

  await prisma.user.update({ where: { id: result.userId }, data: { emailVerified: new Date() } });
  await logAudit({ actorId: result.userId, action: "user.verify_email", entityType: "User", entityId: result.userId });

  return { success: true as const };
}

export async function requestPasswordReset(input: unknown) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Always return success to avoid leaking which emails are registered.
  if (!user || !user.passwordHash) return { success: true as const };

  const token = await issueAuthToken(user.id, "PASSWORD_RESET");
  await sendEmail({
    to: parsed.data.email,
    subject: "重設您的 Mandarin Go 密碼",
    html: passwordResetEmailHtml(`${APP_URL}/reset-password?token=${token}`),
  });

  return { success: true as const };
}

export async function resetPassword(input: unknown) {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const result = await consumeAuthToken(parsed.data.token, "PASSWORD_RESET");
  if ("error" in result) return result;

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.update({ where: { id: result.userId }, data: { passwordHash } });
  await logAudit({ actorId: result.userId, action: "user.reset_password", entityType: "User", entityId: result.userId });

  return { success: true as const };
}
