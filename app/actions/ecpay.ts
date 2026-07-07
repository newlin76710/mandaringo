"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildAioCheckoutParams, generateMerchantTradeNo } from "@/lib/ecpay";
import { logAudit } from "@/lib/audit";
import { getManageableStudents } from "@/lib/queries/students";

export async function createEcpayCheckout(enrollmentId: string) {
  const session = await auth();
  if (!session?.user) return { error: "請先登入" };

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true, payment: true },
  });
  if (!enrollment || !enrollment.payment) return { error: "找不到報名紀錄" };

  const manageable = await getManageableStudents(session.user.id);
  const isOwner = enrollment.enrolledById === session.user.id || manageable.some((s) => s.id === enrollment.studentId);
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isOwner && !isAdmin) return { error: "無權限操作" };
  if (enrollment.status !== "PENDING_PAYMENT") return { error: "此報名狀態不允許付款" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return { error: "系統尚未設定 NEXT_PUBLIC_APP_URL" };

  const merchantTradeNo = generateMerchantTradeNo();

  let checkout: ReturnType<typeof buildAioCheckoutParams>;
  try {
    checkout = buildAioCheckoutParams({
      merchantTradeNo,
      totalAmount: Number(enrollment.payment.amount),
      itemName: enrollment.course.name,
      tradeDesc: "Mandarin Go 課程報名費",
      returnURL: `${appUrl}/api/payments/ecpay/notify`,
      clientBackURL: `${appUrl}/my/enrollments/${enrollment.id}`,
      paymentInfoURL: `${appUrl}/api/payments/ecpay/payment-info`,
    });
  } catch {
    return { error: "綠界金流尚未設定完成，請聯繫系統管理員" };
  }

  await prisma.payment.update({
    where: { enrollmentId: enrollment.id },
    data: { method: "ECPAY", merchantTradeNo, status: "PENDING" },
  });

  await logAudit({
    actorId: session.user.id,
    action: "payment.ecpay_checkout_created",
    entityType: "Enrollment",
    entityId: enrollment.id,
    metadata: { merchantTradeNo },
  });

  return { success: true as const, actionUrl: checkout.actionUrl, params: checkout.params };
}
