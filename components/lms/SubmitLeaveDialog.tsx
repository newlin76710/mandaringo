"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { submitLeaveRequest } from "@/app/actions/leave";
import { FormField } from "@/components/lms/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type EnrollmentOption = { id: string; label: string };

type FormValues = { enrollmentId: string; date: string; reason: string };

export function SubmitLeaveDialog({ enrollments }: { enrollments: EnrollmentOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { enrollmentId: enrollments[0]?.id ?? "" } });

  if (enrollments.length === 0) {
    return <p className="text-sm text-slate-400">目前沒有上課中的課程可以申請請假。</p>;
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const result = await submitLeaveRequest(values);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("已送出請假申請");
    reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          申請請假
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>申請請假</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="課程" required error={errors.enrollmentId?.message}>
            <Controller
              control={control}
              name="enrollmentId"
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇課程" />
                  </SelectTrigger>
                  <SelectContent>
                    {enrollments.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <FormField label="請假日期" required error={errors.date?.message}>
            <Input type="date" {...register("date", { required: "必填" })} />
          </FormField>
          <FormField label="請假原因" required error={errors.reason?.message}>
            <Textarea {...register("reason", { required: "必填" })} />
          </FormField>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            送出申請
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
