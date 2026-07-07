"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
import { parentProfileSchema, emailSchema, type ParentProfileInput } from "@/lib/schemas/auth";
import { createParentAdmin } from "@/app/actions/admin-parents";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { PhoneInput } from "@/components/lms/PhoneInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const schema = z.object({ email: emailSchema }).and(parentProfileSchema);
type FormValues = ParentProfileInput & { email: string };

export function AdminCreateParentDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { gender: "FEMALE" } });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const result = await createParentAdmin(values);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("已新增家長");
    reset();
    setOpen(false);
    router.push(`/admin/parents/${result.parentId}`);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          新增家長
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增家長</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Email" required error={errors.email?.message} className="sm:col-span-2">
              <Input type="email" {...register("email")} />
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
            <FormField label="性別" required error={errors.gender?.message}>
              <GenderSelect control={control} name="gender" />
            </FormField>
            <FormField label="電話" required error={errors.phone?.message}>
              <PhoneInput control={control} name="phone" />
            </FormField>
            <FormField label="國籍／居住地" required error={errors.nationality?.message}>
              <Input {...register("nationality")} />
            </FormField>
            <FormField label="郵遞區號" required error={errors.postalCode?.message}>
              <Input {...register("postalCode")} />
            </FormField>
          </div>
          <p className="text-xs text-slate-400">
            建立後可於家長詳細頁面補齊其他資料。這筆資料尚未連結登入帳號——若家長之後想自行註冊，請先使用不同 Email，或聯繫行政人員協助處理，避免 Email 重複。
          </p>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            建立
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
