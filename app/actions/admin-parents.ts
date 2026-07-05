"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parentProfileEditSchema } from "@/lib/schemas/auth";
import { logAudit } from "@/lib/audit";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return { error: "無權限操作" } as const;
  }
  return { session };
}

export async function createParentAdmin(input: unknown) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  const parsed = parentProfileEditSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { email, ...d } = parsed.data;

  const taken = await prisma.parent.findUnique({ where: { email } });
  if (taken) return { error: "此 Email 已被使用" };

  const parent = await prisma.parent.create({
    data: {
      email,
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

  await logAudit({ actorId: check.session.user.id, action: "parent.create_by_admin", entityType: "Parent", entityId: parent.id });
  revalidatePath("/admin/parents");
  return { success: true as const, parentId: parent.id };
}

export async function updateParentAdmin(parentId: string, input: unknown) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  const parsed = parentProfileEditSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const existing = await prisma.parent.findUnique({ where: { id: parentId } });
  if (!existing) return { error: "找不到家長資料" };

  const emailTaken = await prisma.parent.findFirst({ where: { email: d.email, NOT: { id: parentId } } });
  if (emailTaken) return { error: "該email已經有註冊過了，請重新確認" };

  await prisma.parent.update({
    where: { id: parentId },
    data: {
      chineseFirstName: d.chineseFirstName,
      chineseLastName: d.chineseLastName,
      englishFirstName: d.englishFirstName,
      englishLastName: d.englishLastName,
      gender: d.gender,
      email: d.email,
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

  await logAudit({ actorId: check.session.user.id, action: "parent.update_by_admin", entityType: "Parent", entityId: parentId });
  revalidatePath("/admin/parents");
  revalidatePath(`/admin/parents/${parentId}`);
  return { success: true as const };
}

export async function deleteParentAdmin(parentId: string) {
  const check = await requireAdmin();
  if ("error" in check) return { error: check.error } as const;

  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    include: { _count: { select: { students: true } } },
  });
  if (!parent) return { error: "找不到家長資料" };

  if (parent.userId) return { error: "此家長已建立登入帳號，請改用停用" };
  if (parent._count.students > 0) return { error: "此家長仍連結學生資料，請先移除連結或改用停用" };

  await prisma.parent.delete({ where: { id: parentId } });

  await logAudit({ actorId: check.session.user.id, action: "parent.delete_by_admin", entityType: "Parent", entityId: parentId });
  revalidatePath("/admin/parents");
  return { success: true as const };
}
