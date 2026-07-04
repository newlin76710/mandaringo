"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { parentProfileSchema, type ParentProfileInput } from "@/lib/schemas/auth";
import { updateMyProfile } from "@/app/actions/profile";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ParentProfileEditForm({ defaultValues }: { defaultValues: ParentProfileInput }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentProfileInput>({ resolver: zodResolver(parentProfileSchema), defaultValues });

  async function onSubmit(profile: ParentProfileInput) {
    setSubmitting(true);
    const result = await updateMyProfile(profile);
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
        <FormField label="地址" error={errors.address?.message}>
          <Input {...register("address")} />
        </FormField>
        <FormField label="其他聯繫方式" error={errors.otherContact?.message}>
          <Input placeholder="Facebook / Line / WhatsApp / WeChat ID" {...register("otherContact")} />
        </FormField>
        <FormField label="職業類別" error={errors.occupation?.message}>
          <Input {...register("occupation")} />
        </FormField>
        <FormField label="最高學歷" error={errors.educationLevel?.message}>
          <Input {...register("educationLevel")} />
        </FormField>
        <FormField label="次要聯繫人姓名" error={errors.secondaryContactName?.message}>
          <Input {...register("secondaryContactName")} />
        </FormField>
        <FormField label="次要聯繫人電話" error={errors.secondaryContactPhone?.message}>
          <Input {...register("secondaryContactPhone")} />
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
