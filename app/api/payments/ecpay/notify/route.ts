import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyCheckMacValue, getEcpayCredentials } from "@/lib/ecpay";
import { logAudit } from "@/lib/audit";
import { sendEmail, enrollmentConfirmedEmailHtml } from "@/lib/email";

/**
 * 綠界 AioCheckOut 的 ReturnURL：付款完成後由綠界主機對本站發出的
 * server-to-server 通知（非使用者瀏覽器導向）。必須回應純文字 "1|OK"，
 * 否則綠界會在之後數天內重試。
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const fields: Record<string, string> = {};
  for (const [key, value] of form.entries()) fields[key] = String(value);

  const { hashKey, hashIv } = getEcpayCredentials();
  if (!verifyCheckMacValue(fields, hashKey, hashIv)) {
    console.error("[ecpay:notify] CheckMacValue 驗證失敗", fields);
    return new Response("0|CheckMacValueError", { status: 200 });
  }

  const merchantTradeNo = fields.MerchantTradeNo;
  const payment = await prisma.payment.findUnique({
    where: { merchantTradeNo },
    include: { enrollment: { include: { course: true, student: true } } },
  });
  if (!payment) {
    console.error("[ecpay:notify] 找不到對應的付款紀錄", merchantTradeNo);
    return new Response("0|PaymentNotFound", { status: 200 });
  }

  if (fields.RtnCode !== "1") {
    console.warn("[ecpay:notify] 付款未成功", fields.RtnCode, fields.RtnMsg);
    return new Response("1|OK", { status: 200 });
  }

  if (payment.status !== "PAID") {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          ecpayTradeNo: fields.TradeNo ?? null,
          ecpayPaymentType: fields.PaymentType ?? null,
          confirmedAt: new Date(),
        },
      }),
      prisma.enrollment.update({ where: { id: payment.enrollmentId }, data: { status: "ACTIVE" } }),
    ]);

    await logAudit({
      action: "payment.ecpay_confirmed",
      entityType: "Enrollment",
      entityId: payment.enrollmentId,
      metadata: { merchantTradeNo, tradeNo: fields.TradeNo, paymentType: fields.PaymentType },
    });

    const { enrollment } = payment;
    const studentName = `${enrollment.student.chineseLastName}${enrollment.student.chineseFirstName}`;
    const contactEmail = enrollment.student.email ?? undefined;
    if (contactEmail) {
      await sendEmail({
        to: contactEmail,
        subject: "報名已確認 - Mandarin Go",
        html: enrollmentConfirmedEmailHtml(enrollment.course.name, studentName),
      });
    }

    revalidatePath("/my/enrollments");
    revalidatePath(`/my/enrollments/${enrollment.id}`);
    revalidatePath("/admin/enrollments");
  }

  return new Response("1|OK", { status: 200 });
}
