"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { enrollStudent } from "@/app/actions/enrollment";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type StudentOption = { id: string; label: string; alreadyEnrolled: boolean };

export function EnrollWidget({ courseId, students, full }: { courseId: string; students: StudentOption[]; full: boolean }) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);

  if (students.length === 0) {
    return <p className="text-sm text-slate-500">請先於「我的主頁」新增學生資料，即可為其報名課程。</p>;
  }

  const selected = students.find((s) => s.id === studentId);

  async function handleEnroll() {
    if (!studentId) return;
    setSubmitting(true);
    const result = await enrollStudent(courseId, studentId);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("已建立報名，請完成匯款");
    router.push(`/my/enrollments/${result.enrollmentId}`);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        {students.length > 1 && (
          <Select value={studentId} onValueChange={setStudentId}>
            <SelectTrigger className="sm:w-56">
              <SelectValue placeholder="選擇學生" />
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button size="lg" disabled={full || submitting || selected?.alreadyEnrolled} onClick={handleEnroll} className="sm:flex-1">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {full ? "名額已滿" : selected?.alreadyEnrolled ? "已報名" : "立即報名"}
        </Button>
      </div>
      {selected?.alreadyEnrolled && (
        <p className="text-sm font-semibold text-emerald-600">此學生已報名這門課程，請至「我的報名」查看進度。</p>
      )}
    </div>
  );
}
