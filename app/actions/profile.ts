"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { studentProfileSchema, parentProfileSchema, teacherProfileSchema } from "@/lib/schemas/auth";
import { logAudit } from "@/lib/audit";

export async function getMyProfile() {
  const session = await auth();
  if (!session?.user) return null;

  if (session.user.role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    return student ? { role: "STUDENT" as const, data: student } : null;
  }
  if (session.user.role === "PARENT") {
    const parent = await prisma.parent.findUnique({ where: { userId: session.user.id } });
    return parent ? { role: "PARENT" as const, data: parent } : null;
  }
  if (session.user.role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    return teacher ? { role: "TEACHER" as const, data: teacher } : null;
  }
  return null;
}

export async function updateMyProfile(input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" as const };
  if (!session.user.hasProfile) return { error: "請先完成帳號設定" };

  if (session.user.role === "STUDENT") {
    const parsed = studentProfileSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    const d = parsed.data;

    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    if (!student) return { error: "找不到學生資料" };

    await prisma.student.update({
      where: { id: student.id },
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

    await logAudit({ actorId: session.user.id, action: "student.update_self", entityType: "Student", entityId: student.id });
    revalidatePath("/profile");
    return { success: true as const };
  }

  if (session.user.role === "PARENT") {
    const parsed = parentProfileSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    const d = parsed.data;

    const parent = await prisma.parent.findUnique({ where: { userId: session.user.id } });
    if (!parent) return { error: "找不到家長資料" };

    await prisma.parent.update({
      where: { id: parent.id },
      data: {
        chineseFirstName: d.chineseFirstName,
        chineseLastName: d.chineseLastName,
        englishFirstName: d.englishFirstName,
        englishLastName: d.englishLastName,
        gender: d.gender,
        phone: d.phone,
        nationality: d.nationality,
        postalCode: d.postalCode,
        address: d.address || null,
        otherContact: d.otherContact || null,
        occupation: d.occupation || null,
        educationLevel: d.educationLevel || null,
        secondaryContactName: d.secondaryContactName || null,
        secondaryContactPhone: d.secondaryContactPhone || null,
        notes: d.notes || null,
      },
    });

    await logAudit({ actorId: session.user.id, action: "parent.update_self", entityType: "Parent", entityId: parent.id });
    revalidatePath("/profile");
    return { success: true as const };
  }

  if (session.user.role === "TEACHER") {
    const parsed = teacherProfileSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    const d = parsed.data;

    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    if (!teacher) return { error: "找不到老師資料" };

    await prisma.teacher.update({
      where: { id: teacher.id },
      data: {
        chineseFirstName: d.chineseFirstName,
        chineseLastName: d.chineseLastName,
        englishFirstName: d.englishFirstName,
        englishMiddleName: d.englishMiddleName || null,
        englishLastName: d.englishLastName,
        gender: d.gender,
        phone: d.phone,
        nationality: d.nationality,
        postalCode: d.postalCode,
        registeredAddress: d.registeredAddress || null,
        residentialAddress: d.residentialAddress || null,
        occupation: d.occupation || null,
        educationLevel: d.educationLevel || null,
        emergencyContactName: d.emergencyContactName || null,
        emergencyContactPhone: d.emergencyContactPhone || null,
        bio: d.bio || null,
      },
    });

    await logAudit({ actorId: session.user.id, action: "teacher.update_self", entityType: "Teacher", entityId: teacher.id });
    revalidatePath("/profile");
    return { success: true as const };
  }

  return { error: "此帳號類型無法編輯個人資料" };
}
