"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { studentProfileSchema, type StudentProfileInput } from "@/lib/schemas/auth";
import { completeOnboarding } from "@/app/actions/auth";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function StudentOnboardingForm() {
  const router = useRouter();
  const { update } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentProfileInput>({ resolver: zodResolver(studentProfileSchema), defaultValues: { gender: "MALE" } });

  async function onSubmit(profile: StudentProfileInput) {
    setSubmitting(true);
    const result = await completeOnboarding({ role: "STUDENT", profile });
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
        <FormField label="英文姓氏" required error={errors.englishLastName?.message}>
          <Input {...register("englishLastName")} />
        </FormField>
        <FormField label="英文名字" required error={errors.englishFirstName?.message}>
          <Input {...register("englishFirstName")} />
        </FormField>
        <FormField label="英文中間名" error={errors.englishMiddleName?.message}>
          <Input {...register("englishMiddleName")} />
        </FormField>
        <FormField label="暱稱" error={errors.nickname?.message}>
          <Input {...register("nickname")} />
        </FormField>
        <FormField label="性別" required error={errors.gender?.message}>
          <GenderSelect control={control} name="gender" />
        </FormField>
        <FormField label="出生年月日" required error={errors.birthDate?.message}>
          <Input type="date" {...register("birthDate")} />
        </FormField>
        <FormField label="電話" error={errors.phone?.message}>
          <Input {...register("phone")} />
        </FormField>
        <FormField label="其他聯繫方式" error={errors.otherContact?.message}>
          <Input {...register("otherContact")} />
        </FormField>
        <FormField label="過敏" error={errors.allergies?.message}>
          <Textarea {...register("allergies")} />
        </FormField>
        <FormField label="特殊需求" error={errors.specialNeeds?.message}>
          <Textarea {...register("specialNeeds")} />
        </FormField>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        完成設定
      </Button>
    </form>
  );
}
