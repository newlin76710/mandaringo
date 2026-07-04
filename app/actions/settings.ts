"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { setTeacherAccessCode } from "@/lib/settings";
import { logAudit } from "@/lib/audit";

const schema = z
  .object({
    code: z.string().min(6, "密碼至少 6 個字元"),
    confirmCode: z.string(),
  })
  .refine((d) => d.code === d.confirmCode, { message: "兩次輸入不一致", path: ["confirmCode"] });

export async function updateTeacherAccessCode(input: unknown) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { error: "無權限操作" };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await setTeacherAccessCode(parsed.data.code, session.user.id);
  await logAudit({
    actorId: session.user.id,
    action: "settings.update_teacher_access_code",
    entityType: "SystemSetting",
    entityId: "TEACHER_ACCESS_CODE_HASH",
  });

  return { success: true as const };
}
