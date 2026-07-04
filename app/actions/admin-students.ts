"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { studentProfileSchema } from "@/lib/schemas/auth";
import { createStudentProfile } from "@/lib/profile";
import { logAudit } from "@/lib/audit";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { error: "無權限操作" } as const;
  }
  return { session };
}

export async function createStudentAdmin(input: unknown) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  const parsed = studentProfileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const student = await prisma.$transaction((tx) => createStudentProfile(tx, null, parsed.data));

  await logAudit({
    actorId: check.session.user.id,
    action: "student.create_by_admin",
    entityType: "Student",
    entityId: student.id,
  });

  revalidatePath("/admin/students");
  return { success: true as const, studentId: student.id };
}

export async function updateStudentAdmin(studentId: string, input: unknown) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  const parsed = studentProfileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const existing = await prisma.student.findUnique({ where: { id: studentId } });
  if (!existing) return { error: "找不到學生資料" };

  await prisma.student.update({
    where: { id: studentId },
    data: {
      chineseFirstName: d.chineseFirstName,
      chineseLastName: d.chineseLastName,
      englishFirstName: d.englishFirstName,
      englishMiddleName: d.englishMiddleName || null,
      englishLastName: d.englishLastName,
      nickname: d.nickname || null,
      gender: d.gender,
      birthDate: new Date(d.birthDate),
      phone: d.phone || null,
      otherContact: d.otherContact || null,
      allergies: d.allergies || null,
      specialNeeds: d.specialNeeds || null,
      notes: d.notes || null,
    },
  });

  await logAudit({ actorId: check.session.user.id, action: "student.update_by_admin", entityType: "Student", entityId: studentId });
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${studentId}`);
  return { success: true as const };
}

export async function deleteStudentAdmin(studentId: string) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { _count: { select: { enrollments: true, attendances: true, leaves: true } } },
  });
  if (!student) return { error: "找不到學生資料" };

  if (student.userId) return { error: "此學生已建立登入帳號，請改用停用" };

  const hasHistory = student._count.enrollments > 0 || student._count.attendances > 0 || student._count.leaves > 0;
  if (hasHistory) return { error: "此學生已有報名、出缺席或請假紀錄，請改用停用以保留歷史資料" };

  await prisma.student.delete({ where: { id: studentId } });

  await logAudit({ actorId: check.session.user.id, action: "student.delete_by_admin", entityType: "Student", entityId: studentId });
  revalidatePath("/admin/students");
  return { success: true as const };
}
