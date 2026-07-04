"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CourseOption = { id: string; name: string };

export function CourseDatePicker({
  courses,
  basePath,
  defaultCourseId,
  defaultDate,
}: {
  courses: CourseOption[];
  basePath: string;
  defaultCourseId?: string;
  defaultDate?: string;
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(defaultCourseId ?? courses[0]?.id ?? "");
  const [date, setDate] = useState(defaultDate ?? new Date().toISOString().slice(0, 10));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">課程</label>
        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger>
            <SelectValue placeholder="請選擇課程" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">日期</label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <Button disabled={!courseId} onClick={() => router.push(`${basePath}?courseId=${courseId}&date=${date}`)}>
        查看
      </Button>
    </div>
  );
}
