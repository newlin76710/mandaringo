"use client";

import type { listEnrollmentsForAdmin } from "@/lib/queries/admin-lists";
import { AdminDataTable } from "@/components/lms/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";
import { PaymentActions } from "@/components/lms/admin/PaymentActions";
import { ENROLLMENT_STATUS_LABELS, ENROLLMENT_STATUS_BADGE } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

type Enrollment = Awaited<ReturnType<typeof listEnrollmentsForAdmin>>[number];

export function EnrollmentsTable({ enrollments }: { enrollments: Enrollment[] }) {
  return (
    <AdminDataTable
      data={enrollments}
      rowKey={(e) => e.id}
      searchPlaceholder="搜尋學生 / 課程 / 報名編號..."
      searchFn={(e, q) =>
        `${e.student.chineseLastName}${e.student.chineseFirstName}`.toLowerCase().includes(q) ||
        e.course.name.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q)
      }
      columns={[
        { header: "報名編號", cell: (e) => e.code },
        {
          header: "學生",
          cell: (e) => `${e.student.chineseLastName}${e.student.chineseFirstName}`,
        },
        { header: "課程", cell: (e) => e.course.name },
        { header: "金額", cell: (e) => formatCurrency(e.payment?.amount.toString() ?? "0", e.payment?.currency) },
        {
          header: "匯款資訊",
          cell: (e) =>
            e.payment?.transferLastFive ? (
              <span className="text-xs text-slate-500">
                末5碼 {e.payment.transferLastFive} · {e.payment.transferDate ? formatDate(e.payment.transferDate) : "-"}
              </span>
            ) : (
              "—"
            ),
        },
        { header: "狀態", cell: (e) => <Badge variant={ENROLLMENT_STATUS_BADGE[e.status]}>{ENROLLMENT_STATUS_LABELS[e.status]}</Badge> },
        {
          header: "操作",
          cell: (e) => (e.status === "CONFIRMING" ? <PaymentActions enrollmentId={e.id} /> : null),
        },
      ]}
    />
  );
}
