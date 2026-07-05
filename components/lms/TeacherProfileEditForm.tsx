"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { teacherProfileEditSchema, type TeacherProfileEditInput } from "@/lib/schemas/auth";
import { updateMyProfile } from "@/app/actions/profile";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function TeacherProfileEditForm({
  defaultValues,
  targetId,
  action,
}: {
  defaultValues: TeacherProfileEditInput;
  /**
   * Pass both together to edit someone else's profile (the admin edit page) — `action`
   * must be a direct reference to a "use server" export, never an inline arrow function
   * wrapping one, since a Server Component can only hand a Client Component an actual
   * Server Action reference across the boundary, not a closure created around one.
   */
  targetId?: string;
  action?: (id: string, profile: TeacherProfileEditInput) => Promise<{ success?: true; error?: string }>;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherProfileEditInput>({ resolver: zodResolver(teacherProfileEditSchema), defaultValues });

  async function onSubmit(profile: TeacherProfileEditInput) {
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
        <FormField label="英文姓氏 (跟護照一樣)" required error={errors.englishLastName?.message}>
          <Input {...register("englishLastName")} />
        </FormField>
        <FormField label="英文名字 (跟護照一樣)" required error={errors.englishFirstName?.message}>
          <Input {...register("englishFirstName")} />
        </FormField>
        <FormField label="英文中間名" error={errors.englishMiddleName?.message}>
          <Input {...register("englishMiddleName")} />
        </FormField>
        <FormField label="性別" required error={errors.gender?.message}>
          <GenderSelect control={control} name="gender" />
        </FormField>
        <FormField label="Email" required error={errors.email?.message}>
          <Input type="email" {...register("email")} />
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
        <FormField label="戶籍地址／原居住地地址" error={errors.registeredAddress?.message}>
          <Input {...register("registeredAddress")} />
        </FormField>
        <FormField label="現居住地地址" error={errors.residentialAddress?.message}>
          <Input {...register("residentialAddress")} />
        </FormField>
        <FormField label="職業類別" error={errors.occupation?.message}>
          <Input {...register("occupation")} />
        </FormField>
        <FormField label="最高學歷" error={errors.educationLevel?.message}>
          <Input {...register("educationLevel")} />
        </FormField>
        <FormField label="緊急聯繫人姓名" error={errors.emergencyContactName?.message}>
          <Input {...register("emergencyContactName")} />
        </FormField>
        <FormField label="緊急聯繫人電話" error={errors.emergencyContactPhone?.message}>
          <Input {...register("emergencyContactPhone")} />
        </FormField>
        <FormField label="履歷／證照簡介" error={errors.bio?.message} className="sm:col-span-2">
          <Textarea placeholder="教學經歷、證照、可授課時段與程度..." {...register("bio")} />
        </FormField>
      </div>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        儲存變更
      </Button>
    </form>
  );
}
