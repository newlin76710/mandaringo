"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { studentProfileSchema, type StudentProfileInput } from "@/lib/schemas/auth";
import { updateMyProfile } from "@/app/actions/profile";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function StudentProfileEditForm({
  defaultValues,
  targetId,
  action,
}: {
  defaultValues: StudentProfileInput;
  /**
   * Pass both of these together to edit someone else's profile (the admin edit page) —
   * `action` must be a direct reference to a "use server" export, never an inline arrow
   * function wrapping one (e.g. `(p) => updateStudentAdmin(id, p)`), since a Server
   * Component can only hand a Client Component an actual Server Action reference across
   * the boundary, not a closure created around one.
   */
  targetId?: string;
  action?: (id: string, profile: StudentProfileInput) => Promise<{ success?: true; error?: string }>;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentProfileInput>({ resolver: zodResolver(studentProfileSchema), defaultValues });

  async function onSubmit(profile: StudentProfileInput) {
    setSubmitting(true);
    const result = action && targetId ? await action(targetId, profile) : await updateMyProfile(profile);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("資料已更新");
    router.refresh();
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
        <FormField label="Email" error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </FormField>
        <FormField label="電話" error={errors.phone?.message}>
          <Input {...register("phone")} />
        </FormField>
        <FormField label="其他聯繫方式" error={errors.otherContact?.message}>
          <Input placeholder="Facebook / Line / WhatsApp / WeChat ID" {...register("otherContact")} />
        </FormField>
        <FormField label="過敏" error={errors.allergies?.message}>
          <Textarea {...register("allergies")} />
        </FormField>
        <FormField label="特殊需求" error={errors.specialNeeds?.message}>
          <Textarea {...register("specialNeeds")} />
        </FormField>
        <FormField label="備註" error={errors.notes?.message} className="sm:col-span-2">
          <Textarea {...register("notes")} />
        </FormField>
      </div>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        儲存變更
      </Button>
    </form>
  );
}
