import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Clock, XCircle, Landmark } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getManageableStudents } from "@/lib/queries/students";
import { LmsNav } from "@/components/lms/LmsNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ENROLLMENT_STATUS_LABELS, ENROLLMENT_STATUS_BADGE } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PaymentProofForm } from "@/components/lms/PaymentProofForm";
import { EcpayCheckoutButton } from "@/components/lms/EcpayCheckoutButton";

export const dynamic = "force-dynamic";

export default async function EnrollmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/my/enrollments/${id}`);

  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: { course: true, student: true, payment: true },
  });
  if (!enrollment) notFound();

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  const manageable = await getManageableStudents(session.user.id);
  const isOwner = enrollment.enrolledById === session.user.id || manageable.some((s) => s.id === enrollment.studentId);
  if (!isOwner && !isAdmin) notFound();

  const ecpayPendingInfo = enrollment.payment?.ecpayPaymentInfo as {
    paymentType?: string;
    bankCode?: string;
    vAccount?: string;
    paymentNo?: string;
    expireDate?: string;
  } | null;

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNav />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900">{enrollment.course.name}</h1>
          <Badge variant={ENROLLMENT_STATUS_BADGE[enrollment.status]} className="shrink-0">
            {ENROLLMENT_STATUS_LABELS[enrollment.status]}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          學生：{enrollment.student.chineseLastName}
          {enrollment.student.chineseFirstName} · 報名編號 {enrollment.code}
        </p>

        <Card className="mt-6">
          <CardContent className="pt-6">
            {enrollment.status === "PENDING_PAYMENT" && enrollment.payment && (
              <div className="space-y-5">
                <EcpayCheckoutButton enrollmentId={enrollment.id} />

                {ecpayPendingInfo && (
                  <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                    <p className="font-bold">
                      {ecpayPendingInfo.paymentType?.startsWith("ATM") ? "請至 ATM 或網路銀行轉帳" : "請至超商繳費"}
                    </p>
                    <dl className="mt-3 space-y-1">
                      {ecpayPendingInfo.bankCode && (
                        <div className="flex justify-between">
                          <dt>銀行代碼</dt>
                          <dd className="font-semibold">{ecpayPendingInfo.bankCode}</dd>
                        </div>
                      )}
                      {ecpayPendingInfo.vAccount && (
                        <div className="flex justify-between">
                          <dt>轉帳帳號</dt>
                          <dd className="font-semibold">{ecpayPendingInfo.vAccount}</dd>
                        </div>
                      )}
                      {ecpayPendingInfo.paymentNo && (
                        <div className="flex justify-between">
                          <dt>繳費代碼</dt>
                          <dd className="font-semibold">{ecpayPendingInfo.paymentNo}</dd>
                        </div>
                      )}
                      {ecpayPendingInfo.expireDate && (
                        <div className="flex justify-between">
                          <dt>繳費期限</dt>
                          <dd className="font-semibold">{ecpayPendingInfo.expireDate}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                  <div className="h-px flex-1 bg-slate-200" />
                  或
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="rounded-xl bg-sky-50 p-4 text-sm text-sky-900">
                  <p className="flex items-center gap-2 font-bold">
                    <Landmark className="h-4 w-4" />
                    親自匯款至以下帳戶
                  </p>
                  <dl className="mt-3 space-y-1">
                    <div className="flex justify-between">
                      <dt>銀行</dt>
                      <dd className="font-semibold">{enrollment.payment.bankCode}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>帳號</dt>
                      <dd className="font-semibold">{enrollment.payment.bankAccount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>金額</dt>
                      <dd className="font-semibold">{formatCurrency(enrollment.payment.amount.toString(), enrollment.payment.currency)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>備註／報名編號</dt>
                      <dd className="font-semibold">{enrollment.code}</dd>
                    </div>
                  </dl>
                </div>
                <PaymentProofForm enrollmentId={enrollment.id} />
              </div>
            )}

            {enrollment.status === "CONFIRMING" && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Clock className="h-10 w-10 text-amber-500" />
                <p className="font-bold text-slate-900">匯款審核中</p>
                <p className="text-sm text-slate-500">
                  已收到您於 {enrollment.payment?.transferDate ? formatDate(enrollment.payment.transferDate) : "-"} 的匯款資訊
                  （末5碼 {enrollment.payment?.transferLastFive}），行政人員確認後即會開通課程。
                </p>
              </div>
            )}

            {enrollment.status === "ACTIVE" && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <p className="font-bold text-slate-900">已開通，祝學習愉快！</p>
                {enrollment.course.materialUrl && (
                  <a href={enrollment.course.materialUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky-600 hover:underline">
                    下載課程教材
                  </a>
                )}
              </div>
            )}

            {(enrollment.status === "CANCELLED" || enrollment.status === "WITHDRAWN") && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <XCircle className="h-10 w-10 text-red-500" />
                <p className="font-bold text-slate-900">{ENROLLMENT_STATUS_LABELS[enrollment.status]}</p>
                {enrollment.payment?.rejectedReason && <p className="text-sm text-slate-500">原因：{enrollment.payment.rejectedReason}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
