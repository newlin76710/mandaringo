import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

const TEACHER_ACCESS_CODE_KEY = "TEACHER_ACCESS_CODE_HASH";

export async function hasTeacherAccessCode() {
  const row = await prisma.systemSetting.findUnique({ where: { key: TEACHER_ACCESS_CODE_KEY } });
  return !!row;
}

export async function verifyTeacherAccessCode(code: string) {
  const row = await prisma.systemSetting.findUnique({ where: { key: TEACHER_ACCESS_CODE_KEY } });
  if (!row) return false;
  return verifyPassword(code, row.value);
}

export async function setTeacherAccessCode(newCode: string, actorId: string) {
  const value = await hashPassword(newCode);
  await prisma.systemSetting.upsert({
    where: { key: TEACHER_ACCESS_CODE_KEY },
    create: { key: TEACHER_ACCESS_CODE_KEY, value, updatedById: actorId },
    update: { value, updatedById: actorId },
  });
}
