"use client";

import Link from "next/link";
import type { listParentsForAdmin } from "@/lib/queries/admin-lists";
import { AdminDataTable } from "@/components/lms/admin/AdminDataTable";
import { ActiveToggleButton } from "@/components/lms/admin/ActiveToggleButton";
import { Badge } from "@/components/ui/badge";
import { setParentActive } from "@/app/actions/admin-users";
import { AdminCreateParentDialog } from "@/components/lms/admin/AdminCreateParentDialog";

type Parent = Awaited<ReturnType<typeof listParentsForAdmin>>[number];

export function ParentsTable({ parents }: { parents: Parent[] }) {
  return (
    <AdminDataTable
      data={parents}
      rowKey={(p) => p.id}
      toolbar={<AdminCreateParentDialog />}
      searchPlaceholder="搜尋姓名 / Email / 電話..."
      searchFn={(p, q) =>
        `${p.chineseLastName}${p.chineseFirstName}`.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q)
      }
      columns={[
        {
          header: "家長",
          cell: (p) => (
            <Link href={`/admin/parents/${p.id}`} className="font-semibold text-slate-800 hover:text-sky-600">
              {p.chineseLastName}
              {p.chineseFirstName}
            </Link>
          ),
        },
        { header: "Email", cell: (p) => p.email },
        { header: "電話", cell: (p) => p.phone },
        { header: "學生數", cell: (p) => p.students.length },
        { header: "狀態", cell: (p) => <Badge variant={p.isActive ? "success" : "default"}>{p.isActive ? "啟用" : "停用"}</Badge> },
        { header: "操作", cell: (p) => <ActiveToggleButton id={p.id} isActive={p.isActive} action={setParentActive} /> },
      ]}
    />
  );
}
