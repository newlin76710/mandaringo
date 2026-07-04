"use client";

import Link from "next/link";
import type { listCoursesForAdmin } from "@/lib/queries/admin-lists";
import { AdminDataTable } from "@/components/lms/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";
import { COURSE_LEVEL_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

type Course = Awaited<ReturnType<typeof listCoursesForAdmin>>[number];

export function CoursesTable({ courses }: { courses: Course[] }) {
  return (
    <AdminDataTable
      data={courses}
      rowKey={(c) => c.id}
      searchPlaceholder="搜尋課程名稱 / 編號 / 老師..."
      searchFn={(c, q) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        `${c.primaryTeacher.chineseLastName}${c.primaryTeacher.chineseFirstName}`.toLowerCase().includes(q)
      }
      columns={[
        {
          header: "課程",
          cell: (c) => (
            <Link href={`/admin/courses/${c.id}`} className="font-semibold text-slate-800 hover:text-sky-600">
              {c.name}
              <span className="ml-1.5 text-xs text-slate-400">{c.code}</span>
            </Link>
          ),
        },
        { header: "等級", cell: (c) => <Badge variant="info">{COURSE_LEVEL_LABELS[c.level]}</Badge> },
        { header: "主要老師", cell: (c) => `${c.primaryTeacher.chineseLastName}${c.primaryTeacher.chineseFirstName}` },
        { header: "人數", cell: (c) => `${c._count.enrollments}/${c.maxCapacity}` },
        { header: "費用", cell: (c) => formatCurrency(c.fee.toString(), c.currency) },
        { header: "期間", cell: (c) => `${formatDate(c.startDate)} ~ ${formatDate(c.endDate)}` },
        {
          header: "狀態",
          cell: (c) =>
            c.archivedAt ? (
              <Badge variant="default">已封存</Badge>
            ) : c.isPublished ? (
              <Badge variant="success">公開中</Badge>
            ) : (
              <Badge variant="warning">未公開</Badge>
            ),
        },
      ]}
    />
  );
}
