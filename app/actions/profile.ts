"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { studentProfileSchema, parentProfileSchema, teacherProfileSchema } from "@/lib/schemas/auth";
import { logAudit } from "@/lib/audit";
import { resolveOwnProfile } from "@/lib/queries/own-profile";

export async function getMyProfile() {
  const session = await auth();
  if (!session?.user) return null;
  return resolveOwnProfile(session.user.id, session.user.role);
}

export async function updateMyProfile(input: unknown) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" as const };

  const existing = await resolveOwnProfile(session.user.id, session.user.role);
  if (!existing) return { error: "找不到可編輯的個人資料，請先完成帳號設定" };

  if (existing.type === "STUDENT") {
    const parsed = studentProfileSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    const d = parsed.data;

    await prisma.student.update({
      where: { id: existing.data.id },
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

    await logAudit({ actorId: session.user.id, action: "student.update_self", entityType: "Student", entityId: existing.data.id });
    revalidatePath("/profile");
    return { success: true as const };
  }

  if (existing.type === "PARENT") {
    const parsed = parentProfileSchema.safeParse(input);
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    const d = parsed.data;

    await prisma.parent.update({
      where: { id: existing.data.id },
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

    await logAudit({ actorId: session.user.id, action: "parent.update_self", entityType: "Parent", entityId: existing.data.id });
    revalidatePath("/profile");
    return { success: true as const };
  }

  // TEACHER
  const parsed = teacherProfileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  await prisma.teacher.update({
    where: { id: existing.data.id },
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

  await logAudit({ actorId: session.user.id, action: "teacher.update_self", entityType: "Teacher", entityId: existing.data.id });
  revalidatePath("/profile");
  return { success: true as const };
}
