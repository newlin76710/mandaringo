"use client";

import Link from "next/link";
import type { listStudentsForAdmin } from "@/lib/queries/admin-lists";
import { AdminDataTable } from "@/components/lms/admin/AdminDataTable";
import { ActiveToggleButton } from "@/components/lms/admin/ActiveToggleButton";
import { Badge } from "@/components/ui/badge";
import { setStudentActive } from "@/app/actions/admin-users";
import { formatDate } from "@/lib/utils";

type Student = Awaited<ReturnType<typeof listStudentsForAdmin>>[number];

export function StudentsTable({ students }: { students: Student[] }) {
  return (
    <AdminDataTable
      data={students}
      rowKey={(s) => s.id}
      searchPlaceholder="搜尋姓名 / 學號 / Email..."
      searchFn={(s, q) =>
        `${s.chineseLastName}${s.chineseFirstName}`.toLowerCase().includes(q) ||
        `${s.englishFirstName} ${s.englishLastName}`.toLowerCase().includes(q) ||
        s.studentNumber.toLowerCase().includes(q) ||
        (s.email ?? "").toLowerCase().includes(q)
      }
      columns={[
        {
          header: "學生",
          cell: (s) => (
            <Link href={`/admin/students/${s.id}`} className="font-semibold text-slate-800 hover:text-sky-600">
              {s.chineseLastName}
              {s.chineseFirstName}
              <span className="ml-1.5 text-xs text-slate-400">{s.studentNumber}</span>
            </Link>
          ),
        },
        {
          header: "家長",
          cell: (s) =>
            s.parents.length > 0
              ? s.parents.map((p) => `${p.parent.chineseLastName}${p.parent.chineseFirstName}`).join("、")
              : "—",
        },
        { header: "報名數", cell: (s) => s._count.enrollments },
        { header: "加入日期", cell: (s) => formatDate(s.createdAt) },
        { header: "狀態", cell: (s) => <Badge variant={s.isActive ? "success" : "default"}>{s.isActive ? "在學" : "停用"}</Badge> },
        { header: "操作", cell: (s) => <ActiveToggleButton id={s.id} isActive={s.isActive} action={setStudentActive} /> },
      ]}
    />
  );
}
