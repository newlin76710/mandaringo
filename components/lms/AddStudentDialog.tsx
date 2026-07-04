"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { studentProfileSchema, type StudentProfileInput } from "@/lib/schemas/auth";
import { addChildStudent } from "@/app/actions/family";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const schema = studentProfileSchema.and(z.object({ relationship: z.string().min(1, "請輸入與孩子的關係") }));
type FormValues = StudentProfileInput & { relationship: string };

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { gender: "MALE" } });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const result = await addChildStudent(values);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("已新增學生資料");
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          新增學生
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增學生資料</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="與孩子的關係" required error={errors.relationship?.message}>
              <Input placeholder="媽媽 / 爸爸 / 監護人" {...register("relationship")} />
            </FormField>
            <FormField label="性別" required error={errors.gender?.message}>
              <GenderSelect control={control} name="gender" />
            </FormField>
            <FormField label="中文姓氏" required error={errors.chineseLastName?.message}>
              <Input {...register("chineseLastName")} />
            </FormField>
            <FormField label="中文名字" required error={errors.chineseFirstName?.message}>
              <Input {...register("chineseFirstName")} />
            </FormField>
            <FormField label="英文姓氏" required error={errors.englishLastName?.message}>
              <Input {...register("englishLastName")} />
            </FormField>
            <FormField label="英文名字" required error={errors.englishFirstName?.message}>
              <Input {...register("englishFirstName")} />
            </FormField>
            <FormField label="暱稱" error={errors.nickname?.message}>
              <Input {...register("nickname")} />
            </FormField>
            <FormField label="出生年月日" required error={errors.birthDate?.message}>
              <Input type="date" {...register("birthDate")} />
            </FormField>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            儲存
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
