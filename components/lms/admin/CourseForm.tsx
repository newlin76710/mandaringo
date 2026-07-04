"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { courseSchema, type CourseInput, type CourseFormValues } from "@/lib/schemas/course";
import { createCourse, updateCourse } from "@/app/actions/course";
import { FormField } from "@/components/lms/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { COURSE_LEVEL_LABELS, DAY_OF_WEEK_LABELS } from "@/lib/constants";

type TeacherOption = { id: string; label: string };

export function CourseForm({
  teachers,
  lockPrimaryTeacher,
  course,
}: {
  teachers: TeacherOption[];
  lockPrimaryTeacher?: string;
  course?: CourseInput & { id: string };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: course ?? {
      currency: "TWD",
      minCapacity: 2,
      maxCapacity: 5,
      isPublished: false,
      primaryTeacherId: lockPrimaryTeacher ?? "",
      level: "LEVEL_1",
    },
  });

  async function onSubmit(values: CourseFormValues) {
    setSubmitting(true);
    if (course) {
      const result = await updateCourse(course.id, values);
      setSubmitting(false);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("課程已更新");
      router.push(`/admin/courses/${course.id}`);
    } else {
      const result = await createCourse(values);
      setSubmitting(false);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("課程已建立");
      router.push(`/admin/courses/${result.courseId}`);
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="課程名稱" required error={errors.name?.message} className="sm:col-span-2">
          <Input {...register("name")} />
        </FormField>
        <FormField label="課程介紹" error={errors.description?.message} className="sm:col-span-2">
          <Textarea {...register("description")} />
        </FormField>
        <FormField label="課程等級" required error={errors.level?.message}>
          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COURSE_LEVEL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField label="主要老師" required error={errors.primaryTeacherId?.message}>
          <Controller
            control={control}
            name="primaryTeacherId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={!!lockPrimaryTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="請選擇老師" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField label="課程費用" required error={errors.fee?.message}>
          <Input type="number" step="1" {...register("fee")} />
        </FormField>
        <FormField label="幣別" error={errors.currency?.message}>
          <Input {...register("currency")} />
        </FormField>
        <FormField label="開始日期" required error={errors.startDate?.message}>
          <Input type="date" {...register("startDate")} />
        </FormField>
        <FormField label="結束日期" required error={errors.endDate?.message}>
          <Input type="date" {...register("endDate")} />
        </FormField>
        <FormField label="上課星期" error={errors.dayOfWeek?.message}>
          <Controller
            control={control}
            name="dayOfWeek"
            render={({ field }) => (
              <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="請選擇" />
                </SelectTrigger>
                <SelectContent>
                  {DAY_OF_WEEK_LABELS.map((label, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField label="上課時間" error={errors.startTime?.message}>
          <Input type="time" placeholder="16:00" {...register("startTime")} />
        </FormField>
        <FormField label="時區" error={errors.timezone?.message}>
          <Input placeholder="Asia/Taipei" {...register("timezone")} />
        </FormField>
        <FormField label="主要地區" error={errors.region?.message}>
          <Input placeholder="London" {...register("region")} />
        </FormField>
        {!course && (
          <FormField label="地區代碼（用於課程編號）" required error={errors.regionCode?.message}>
            <Input placeholder="LDN" {...register("regionCode")} />
          </FormField>
        )}
        <FormField label="最少開班人數" error={errors.minCapacity?.message}>
          <Input type="number" {...register("minCapacity")} />
        </FormField>
        <FormField label="最多開班人數" error={errors.maxCapacity?.message}>
          <Input type="number" {...register("maxCapacity")} />
        </FormField>
        <FormField label="課程說明" error={errors.scheduleNote?.message} className="sm:col-span-2">
          <Textarea placeholder="每週一次，每次50分鐘，使用 Zoom 上課..." {...register("scheduleNote")} />
        </FormField>
        <FormField label="教材下載連結 (PDF)" error={errors.materialUrl?.message} className="sm:col-span-2">
          <Input placeholder="https://..." {...register("materialUrl")} />
        </FormField>
        <div className="flex items-center gap-2 sm:col-span-2">
          <Controller
            control={control}
            name="isPublished"
            render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isPublished" />}
          />
          <label htmlFor="isPublished" className="text-sm font-semibold text-slate-700">
            公開此課程（開放家長／學生於課程列表報名）
          </label>
        </div>
      </div>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {course ? "儲存變更" : "建立課程"}
      </Button>
    </form>
  );
}
