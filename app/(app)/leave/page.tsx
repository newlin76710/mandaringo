import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMyActiveEnrollments, getMyLeaveRequests, getLeavesForReviewer } from "@/lib/queries/leave";
import { LmsNav } from "@/components/lms/LmsNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubmitLeaveDialog } from "@/components/lms/SubmitLeaveDialog";
import { LeaveDecisionButtons } from "@/components/lms/LeaveDecisionButtons";
import { LEAVE_STATUS_LABELS, LEAVE_STATUS_BADGE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "請假 - Mandarin Go" };
export const dynamic = "force-dynamic";

export default async function LeavePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/leave");
  // Admin/Super Admin have no profile to complete — only Student/Parent/Teacher do.
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && !session.user.hasProfile) {
    redirect("/onboarding");
  }

  const isReviewer = ["TEACHER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNav />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-slate-900">請假管理</h1>
        {isReviewer ? await ReviewerView(session.user.id, session.user.role) : await RequesterView(session.user.id, session.user.role)}
      </div>
    </div>
  );
}

async function RequesterView(userId: string, role: "STUDENT" | "PARENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN") {
  const [enrollments, leaves] = await Promise.all([
    getMyActiveEnrollments(userId, role),
    getMyLeaveRequests(userId, role),
  ]);

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>申請請假</CardTitle>
          <SubmitLeaveDialog
            enrollments={enrollments.map((e) => ({
              id: e.id,
              label: `${e.course.name}（${e.student.chineseLastName}${e.student.chineseFirstName}）`,
            }))}
          />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>我的請假紀錄</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {leaves.length === 0 ? (
            <p className="text-sm text-slate-400">尚無請假紀錄</p>
          ) : (
            leaves.map((l) => (
              <div key={l.id} className="flex items-center justify-between border-b border-slate-50 py-2 text-sm last:border-0">
                <span>
                  {formatDate(l.date)} · {l.course.name} ·{" "}
                  {l.student.chineseLastName}
                  {l.student.chineseFirstName}
                </span>
                <Badge variant={LEAVE_STATUS_BADGE[l.status]}>{LEAVE_STATUS_LABELS[l.status]}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function ReviewerView(userId: string, role: "STUDENT" | "PARENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN") {
  const leaves = await getLeavesForReviewer(userId, role);
  const pending = leaves.filter((l) => l.status === "SUBMITTED");
  const decided = leaves.filter((l) => l.status !== "SUBMITTED");

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>待審核 ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-slate-400">目前沒有待審核的請假申請</p>
          ) : (
            pending.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 border-b border-slate-50 py-2 text-sm last:border-0">
                <div>
                  <p className="font-semibold text-slate-800">
                    {formatDate(l.date)} · {l.course.name} ·{" "}
                    {l.student.chineseLastName}
                    {l.student.chineseFirstName}
                  </p>
                  <p className="text-xs text-slate-400">{l.reason}</p>
                </div>
                <LeaveDecisionButtons leaveId={l.id} />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>審核紀錄</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {decided.length === 0 ? (
            <p className="text-sm text-slate-400">尚無紀錄</p>
          ) : (
            decided.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <span>
                  {formatDate(l.date)} · {l.course.name} ·{" "}
                  {l.student.chineseLastName}
                  {l.student.chineseFirstName}
                </span>
                <Badge variant={LEAVE_STATUS_BADGE[l.status]}>{LEAVE_STATUS_LABELS[l.status]}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
