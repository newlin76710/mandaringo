"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { markAttendance } from "@/app/actions/attendance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ATTENDANCE_STATUS_LABELS } from "@/lib/constants";
import type { AttendanceStatus } from "@prisma/client";

type RosterRow = {
  student: { id: string; chineseFirstName: string; chineseLastName: string };
  attendance: { status: AttendanceStatus; note: string | null } | null;
};

const STATUS_OPTIONS: AttendanceStatus[] = ["PRESENT", "LATE", "ABSENT", "EXCUSED"];

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  PRESENT: "bg-emerald-500 text-white border-emerald-500",
  LATE: "bg-amber-500 text-white border-amber-500",
  ABSENT: "bg-red-500 text-white border-red-500",
  EXCUSED: "bg-sky-500 text-white border-sky-500",
};

export function AttendanceRosterForm({ courseId, date, roster }: { courseId: string; date: string; roster: RosterRow[] }) {
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(roster.map((r) => [r.student.id, r.attendance?.status ?? "PRESENT"]))
  );
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(roster.map((r) => [r.student.id, r.attendance?.note ?? ""]))
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    const result = await markAttendance({
      courseId,
      date,
      records: roster.map((r) => ({
        studentId: r.student.id,
        status: statuses[r.student.id],
        note: notes[r.student.id],
      })),
    });
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("點名已儲存");
  }

  if (roster.length === 0) {
    return <p className="text-sm text-slate-400">此課程在該日期沒有在學學生。</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {roster.map((r) => (
          <div key={r.student.id} className="flex flex-col gap-2 rounded-lg border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold text-slate-800">
              {r.student.chineseLastName}
              {r.student.chineseFirstName}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatuses((s) => ({ ...s, [r.student.id]: status }))}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                    statuses[r.student.id] === status ? STATUS_COLORS[status] : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {ATTENDANCE_STATUS_LABELS[status]}
                </button>
              ))}
              <Input
                className="h-8 w-36 text-xs"
                placeholder="備註"
                value={notes[r.student.id]}
                onChange={(e) => setNotes((n) => ({ ...n, [r.student.id]: e.target.value }))}
              />
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        儲存點名紀錄
      </Button>
    </div>
  );
}
