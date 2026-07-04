"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { teacherProfileSchema, type TeacherProfileInput } from "@/lib/schemas/auth";
import { completeOnboarding } from "@/app/actions/auth";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = TeacherProfileInput & { teacherAccessCode?: string };

export function TeacherOnboardingForm({ requireAccessCode = true }: { requireAccessCode?: boolean }) {
  const router = useRouter();
  const { update } = useSession();
  const [submitting, setSubmitting] = useState(false);

  const schema = requireAccessCode
    ? z.object({ teacherAccessCode: z.string().min(1, "請輸入老師註冊密碼") }).and(teacherProfileSchema)
    : z.object({ teacherAccessCode: z.string().optional() }).and(teacherProfileSchema);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { gender: "FEMALE" } });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const { teacherAccessCode, ...profile } = values;
    const result = await completeOnboarding({ role: "TEACHER", teacherAccessCode, profile });
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    await update();
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="中文姓氏" required error={errors.chineseLastName?.message}>
          <Input {...register("chineseLastName")} />
        </FormField>
        <FormField label="中文名字" required error={errors.chineseFirstName?.message}>
          <Input {...register("chineseFirstName")} />
        </FormField>
        <FormField label="英文姓氏 (跟護照一樣)" required error={errors.englishLastName?.message}>
          <Input {...register("englishLastName")} />
        </FormField>
        <FormField label="英文名字 (跟護照一樣)" required error={errors.englishFirstName?.message}>
          <Input {...register("englishFirstName")} />
        </FormField>
        <FormField label="性別" required error={errors.gender?.message}>
          <GenderSelect control={control} name="gender" />
        </FormField>
        <FormField label="電話" required error={errors.phone?.message}>
          <Input {...register("phone")} />
        </FormField>
        <FormField label="國籍／居住地" required error={errors.nationality?.message}>
          <Input {...register("nationality")} />
        </FormField>
        <FormField label="郵遞區號" required error={errors.postalCode?.message}>
          <Input {...register("postalCode")} />
        </FormField>
        {requireAccessCode && (
          <FormField label="老師註冊密碼" required error={errors.teacherAccessCode?.message} className="sm:col-span-2">
            <Input type="password" placeholder="請向行政人員索取" {...register("teacherAccessCode")} />
          </FormField>
        )}
      </div>
      <p className="text-xs text-slate-400">地址、學歷、緊急聯絡人、履歷簡介等其他資料，之後可以在「會員中心」隨時補填。</p>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        完成設定
      </Button>
    </form>
  );
}
