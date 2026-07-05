"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { teacherProfileEditSchema } from "@/lib/schemas/auth";
import { logAudit } from "@/lib/audit";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { error: "無權限操作" } as const;
  }
  return { session };
}

export async function createTeacherAdmin(input: unknown) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  const parsed = teacherProfileEditSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { email, ...d } = parsed.data;

  const taken = await prisma.teacher.findUnique({ where: { email } });
  if (taken) return { error: "此 Email 已被使用" };

  const teacher = await prisma.teacher.create({
    data: {
      email,
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

  await logAudit({ actorId: check.session.user.id, action: "teacher.create_by_admin", entityType: "Teacher", entityId: teacher.id });
  revalidatePath("/admin/teachers");
  return { success: true as const, teacherId: teacher.id };
}

export async function updateTeacherAdmin(teacherId: string, input: unknown) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  const parsed = teacherProfileEditSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const existing = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!existing) return { error: "找不到老師資料" };

  const emailTaken = await prisma.teacher.findFirst({ where: { email: d.email, NOT: { id: teacherId } } });
  if (emailTaken) return { error: "該email已經有註冊過了，請重新確認" };

  await prisma.teacher.update({
    where: { id: teacherId },
    data: {
      chineseFirstName: d.chineseFirstName,
      chineseLastName: d.chineseLastName,
      englishFirstName: d.englishFirstName,
      englishMiddleName: d.englishMiddleName || null,
      englishLastName: d.englishLastName,
      gender: d.gender,
      email: d.email,
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

  await logAudit({ actorId: check.session.user.id, action: "teacher.update_by_admin", entityType: "Teacher", entityId: teacherId });
  revalidatePath("/admin/teachers");
  revalidatePath(`/admin/teachers/${teacherId}`);
  return { success: true as const };
}

export async function deleteTeacherAdmin(teacherId: string) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: { _count: { select: { primaryCourses: true, secondaryCourses: true } } },
  });
  if (!teacher) return { error: "找不到老師資料" };

  if (teacher.userId) return { error: "此老師已建立登入帳號，請改用停用" };
  if (teacher._count.primaryCourses > 0 || teacher._count.secondaryCourses > 0) {
    return { error: "此老師已開設或協同教授課程，請改用停用以保留歷史資料" };
  }

  await prisma.teacher.delete({ where: { id: teacherId } });

  await logAudit({ actorId: check.session.user.id, action: "teacher.delete_by_admin", entityType: "Teacher", entityId: teacherId });
  revalidatePath("/admin/teachers");
  return { success: true as const };
}
