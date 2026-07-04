"use client";

import Link from "next/link";
import type { listTeachersForAdmin } from "@/lib/queries/admin-lists";
import { AdminDataTable } from "@/components/lms/admin/AdminDataTable";
import { ActiveToggleButton } from "@/components/lms/admin/ActiveToggleButton";
import { Badge } from "@/components/ui/badge";
import { setTeacherActive } from "@/app/actions/admin-users";
import { AdminCreateTeacherDialog } from "@/components/lms/admin/AdminCreateTeacherDialog";

type Teacher = Awaited<ReturnType<typeof listTeachersForAdmin>>[number];

export function TeachersTable({ teachers }: { teachers: Teacher[] }) {
  return (
    <AdminDataTable
      data={teachers}
      rowKey={(t) => t.id}
      toolbar={<AdminCreateTeacherDialog />}
      searchPlaceholder="搜尋姓名 / Email / 電話..."
      searchFn={(t, q) =>
        `${t.chineseLastName}${t.chineseFirstName}`.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q)
      }
      columns={[
        {
          header: "老師",
          cell: (t) => (
            <Link href={`/admin/teachers/${t.id}`} className="font-semibold text-slate-800 hover:text-sky-600">
              {t.chineseLastName}
              {t.chineseFirstName}
            </Link>
          ),
        },
        { header: "Email", cell: (t) => t.email },
        { header: "電話", cell: (t) => t.phone },
        { header: "課程數", cell: (t) => t._count.primaryCourses + t._count.secondaryCourses },
        { header: "狀態", cell: (t) => <Badge variant={t.isActive ? "success" : "default"}>{t.isActive ? "在職" : "停用"}</Badge> },
        { header: "操作", cell: (t) => <ActiveToggleButton id={t.id} isActive={t.isActive} action={setTeacherActive} /> },
      ]}
    />
  );
}
