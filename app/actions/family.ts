"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { studentProfileSchema } from "@/lib/schemas/auth";
import { createStudentProfile } from "@/lib/profile";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const addChildSchema = studentProfileSchema.and(
  z.object({ relationship: z.string().min(1, "請輸入與孩子的關係") })
);

const MAX_STUDENTS_PER_PARENT = 10;

const PARENT_REQUIRED_FIELDS = [
  "chineseFirstName",
  "chineseLastName",
  "englishFirstName",
  "englishLastName",
  "phone",
  "nationality",
  "postalCode",
] as const;

export async function addChildStudent(input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" };

  const parsed = addChildSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { relationship, ...profile } = parsed.data;

  // Not role-gated: a Teacher who has also become a Parent should be able to add
  // students too — whether someone can do this comes down to having a Parent profile,
  // not what User.role happens to be.
  const parent = await prisma.parent.findUnique({
    where: { userId: session.user.id },
    include: { _count: { select: { students: true } } },
  });
  if (!parent) return { error: "找不到家長資料，請先申請成為家長" };

  const missingField = PARENT_REQUIRED_FIELDS.find((field) => !parent[field]);
  if (missingField) {
    return { error: "請先於「會員中心」補齊您自己的必填資料，再新增學生" };
  }

  if (parent._count.students >= MAX_STUDENTS_PER_PARENT) {
    return { error: `每位家長最多可以新增 ${MAX_STUDENTS_PER_PARENT} 位學生` };
  }

  const student = await prisma.$transaction(async (tx) => {
    const s = await createStudentProfile(tx, null, profile);
    await tx.parentStudent.create({
      data: { parentId: parent.id, studentId: s.id, relationship, isPrimary: true },
    });
    return s;
  });

  await logAudit({
    actorId: session.user.id,
    action: "student.create_by_parent",
    entityType: "Student",
    entityId: student.id,
  });

  revalidatePath("/dashboard");
  return { success: true as const };
}
