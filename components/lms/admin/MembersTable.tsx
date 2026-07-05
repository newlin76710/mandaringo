"use client";

import type { listMembersForAdmin } from "@/lib/queries/admin-lists";
import { AdminDataTable } from "@/components/lms/admin/AdminDataTable";
import { DeleteMemberButton } from "@/components/lms/admin/DeleteMemberButton";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, LOGIN_METHOD_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type Member = Awaited<ReturnType<typeof listMembersForAdmin>>[number];

const IDENTITY_LABELS = [
  { key: "student" as const, label: "學生" },
  { key: "parent" as const, label: "家長" },
  { key: "teacher" as const, label: "老師" },
];

export function MembersTable({ members }: { members: Member[] }) {
  return (
    <AdminDataTable
      data={members}
      rowKey={(m) => m.id}
      searchPlaceholder="搜尋姓名 / Email..."
      searchFn={(m, q) => (m.name ?? "").toLowerCase().includes(q) || (m.email ?? "").toLowerCase().includes(q)}
      columns={[
        {
          header: "會員",
          cell: (m) => (
            <div>
              <p className="font-semibold text-slate-800">{m.name ?? "（未命名）"}</p>
              <p className="text-xs text-slate-400">{m.email ?? "—"}</p>
            </div>
          ),
        },
        {
          header: "登入方式",
          cell: (m) => (
            <div className="flex flex-wrap gap-1">
              {m.passwordHash && (
                <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700">
                  Email
                </span>
              )}
              {m.accounts.map((a) => {
                const config = LOGIN_METHOD_LABELS[a.provider];
                if (!config) return null;
                return (
                  <span
                    key={a.provider}
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${config.className}`}
                  >
                    {config.label}
                  </span>
                );
              })}
            </div>
          ),
        },
        {
          header: "目前角色",
          cell: (m) => <Badge variant="info">{ROLE_LABELS[m.role]}</Badge>,
        },
        {
          header: "身分",
          cell: (m) => (
            <div className="flex flex-wrap gap-1">
              {IDENTITY_LABELS.filter((i) => m[i.key]).map((i) => (
                <Badge key={i.key} variant="outline">
                  {i.label}
                </Badge>
              ))}
              {!m.student && !m.parent && !m.teacher && <span className="text-xs text-slate-400">尚未填寫</span>}
            </div>
          ),
        },
        { header: "狀態", cell: (m) => <Badge variant={m.isActive ? "success" : "default"}>{m.isActive ? "啟用" : "停用"}</Badge> },
        { header: "加入日期", cell: (m) => formatDate(m.createdAt) },
        {
          header: "操作",
          cell: (m) => <DeleteMemberButton userId={m.id} name={m.name ?? m.email ?? "此會員"} />,
        },
      ]}
    />
  );
}
