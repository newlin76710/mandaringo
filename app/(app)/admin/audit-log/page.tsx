import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "系統紀錄 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function AuditLogPage() {
  const session = await auth();
  if (session?.user.role !== "SUPER_ADMIN") redirect("/admin");

  const logs = await prisma.auditLog.findMany({
    include: { actor: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">系統紀錄（最近 200 筆）</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>時間</TableHead>
            <TableHead>操作人</TableHead>
            <TableHead>動作</TableHead>
            <TableHead>對象</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap text-xs text-slate-500">
                {formatDate(log.createdAt, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </TableCell>
              <TableCell className="text-sm">{log.actor?.name ?? log.actor?.email ?? "系統"}</TableCell>
              <TableCell className="text-sm font-mono text-slate-600">{log.action}</TableCell>
              <TableCell className="text-xs text-slate-400">
                {log.entityType}
                {log.entityId ? ` #${log.entityId.slice(0, 8)}` : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
