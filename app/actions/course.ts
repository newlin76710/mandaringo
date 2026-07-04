"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { courseSchema } from "@/lib/schemas/course";
import { generateCourseCode } from "@/lib/codes";
import { logAudit } from "@/lib/audit";

const LEVEL_LETTER: Record<string, string> = {
  LEVEL_1: "A",
  LEVEL_2: "B",
  LEVEL_3: "C",
  LEVEL_4: "D",
  LEVEL_5: "E",
};

async function requireTeacherOrAdmin() {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" } as const;
  if (!["TEACHER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    return { error: "僅老師以上權限可以管理課程" } as const;
  }
  return { session };
}

export async function createCourse(input: unknown) {
  const check = await requireTeacherOrAdmin();
  if ("error" in check) return { error: check.error } as const;
  const { session } = check;

  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const data = parsed.data;

  if (session.user.role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    if (!teacher || teacher.id !== data.primaryTeacherId) {
      return { error: "老師只能將自己設為主要老師" };
    }
  }

  const startDate = new Date(data.startDate);
  const code = await generateCourseCode(prisma, startDate, data.regionCode || "XX", LEVEL_LETTER[data.level]);

  const course = await prisma.course.create({
    data: {
      code,
      name: data.name,
      description: data.description || null,
      level: data.level,
      fee: data.fee,
      currency: data.currency,
      startDate,
      endDate: new Date(data.endDate),
      scheduleNote: data.scheduleNote || null,
      region: data.region || null,
      timezone: data.timezone || null,
      dayOfWeek: data.dayOfWeek ?? null,
      startTime: data.startTime || null,
      minCapacity: data.minCapacity,
      maxCapacity: data.maxCapacity,
      materialUrl: data.materialUrl || null,
      isPublished: data.isPublished,
      primaryTeacherId: data.primaryTeacherId,
      createdById: session.user.id,
    },
  });

  await logAudit({ actorId: session.user.id, action: "course.create", entityType: "Course", entityId: course.id });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true as const, courseId: course.id };
}

export async function updateCourse(courseId: string, input: unknown) {
  const check = await requireTeacherOrAdmin();
  if ("error" in check) return { error: check.error } as const;
  const { session } = check;

  const existing = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existing) return { error: "課程不存在" };

  if (session.user.role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    if (!teacher || teacher.id !== existing.primaryTeacherId) return { error: "您無權編輯此課程" };
  }

  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const data = parsed.data;

  if (session.user.role === "TEACHER" && data.primaryTeacherId !== existing.primaryTeacherId) {
    return { error: "老師無法變更主要老師" };
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      name: data.name,
      description: data.description || null,
      level: data.level,
      fee: data.fee,
      currency: data.currency,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      scheduleNote: data.scheduleNote || null,
      region: data.region || null,
      timezone: data.timezone || null,
      dayOfWeek: data.dayOfWeek ?? null,
      startTime: data.startTime || null,
      minCapacity: data.minCapacity,
      maxCapacity: data.maxCapacity,
      materialUrl: data.materialUrl || null,
      isPublished: data.isPublished,
      primaryTeacherId: data.primaryTeacherId,
    },
  });

  await logAudit({ actorId: session.user.id, action: "course.update", entityType: "Course", entityId: courseId });

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  return { success: true as const };
}

export async function setCourseArchived(courseId: string, archived: boolean) {
  const check = await requireTeacherOrAdmin();
  if ("error" in check) return { error: check.error } as const;
  const { session } = check;

  const existing = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existing) return { error: "課程不存在" };
  if (session.user.role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    if (!teacher || teacher.id !== existing.primaryTeacherId) return { error: "您無權操作此課程" };
  }

  await prisma.course.update({ where: { id: courseId }, data: { archivedAt: archived ? new Date() : null } });
  await logAudit({
    actorId: session.user.id,
    action: archived ? "course.archive" : "course.unarchive",
    entityType: "Course",
    entityId: courseId,
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true as const };
}
