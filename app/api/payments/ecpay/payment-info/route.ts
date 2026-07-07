import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyCheckMacValue, getEcpayCredentials } from "@/lib/ecpay";

/**
 * 綠界 PaymentInfoURL：選擇 ATM / 超商代碼 / 條碼繳費時，綠界會先發出這支
 * server-to-server 通知，帶出繳費帳號／代碼供本站顯示給付款人，此時款項
 * 尚未實際入帳（入帳確認以 /api/payments/ecpay/notify 的 ReturnURL 為準）。
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const fields: Record<string, string> = {};
  for (const [key, value] of form.entries()) fields[key] = String(value);

  const { hashKey, hashIv } = getEcpayCredentials();
  if (!verifyCheckMacValue(fields, hashKey, hashIv)) {
    console.error("[ecpay:payment-info] CheckMacValue 驗證失敗", fields);
    return new Response("0|CheckMacValueError", { status: 200 });
  }

  const merchantTradeNo = fields.MerchantTradeNo;
  const payment = await prisma.payment.findUnique({ where: { merchantTradeNo } });
  if (!payment) {
    console.error("[ecpay:payment-info] 找不到對應的付款紀錄", merchantTradeNo);
    return new Response("0|PaymentNotFound", { status: 200 });
  }

  const paymentType = fields.PaymentType ?? "";
  const info: Record<string, string> = { paymentType };
  if (paymentType.startsWith("ATM")) {
    info.bankCode = fields.BankCode ?? "";
    info.vAccount = fields.vAccount ?? "";
    info.expireDate = fields.ExpireDate ?? "";
  } else if (paymentType.startsWith("CVS") || paymentType.startsWith("BARCODE")) {
    info.paymentNo = fields.PaymentNo ?? "";
    info.expireDate = fields.ExpireDate ?? "";
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { ecpayPaymentType: paymentType, ecpayPaymentInfo: info },
  });

  revalidatePath(`/my/enrollments/${payment.enrollmentId}`);

  return new Response("1|OK", { status: 200 });
}
