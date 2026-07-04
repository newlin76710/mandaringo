import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import type { AuthTokenPurpose } from "@prisma/client";

const TOKEN_TTL_HOURS: Record<AuthTokenPurpose, number> = {
  EMAIL_VERIFICATION: 48,
  PASSWORD_RESET: 2,
};

export async function issueAuthToken(userId: string, purpose: AuthTokenPurpose) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS[purpose] * 60 * 60 * 1000);

  // Invalidate any previous unused tokens of the same purpose for this user.
  await prisma.authToken.updateMany({
    where: { userId, purpose, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.authToken.create({
    data: { userId, purpose, token, expiresAt },
  });

  return token;
}

export async function consumeAuthToken(token: string, purpose: AuthTokenPurpose) {
  const record = await prisma.authToken.findUnique({ where: { token } });

  if (!record || record.purpose !== purpose) return { error: "無效的連結" as const };
  if (record.usedAt) return { error: "此連結已被使用過" as const };
  if (record.expiresAt < new Date()) return { error: "此連結已過期" as const };

  await prisma.authToken.update({
    where: { token },
    data: { usedAt: new Date() },
  });

  return { userId: record.userId };
}
