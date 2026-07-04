"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { studentProfileSchema, emailSchema, passwordSchema } from "@/lib/schemas/auth";
import { registerWithCredentials } from "@/app/actions/auth";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const schema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .and(studentProfileSchema)
  .refine((d) => d.password === d.confirmPassword, { message: "兩次密碼不一致", path: ["confirmPassword"] });

type FormValues = z.infer<typeof schema>;

export function StudentRegisterForm({ onDone }: { onDone: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { gender: "MALE" } });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const { email, password, confirmPassword: _confirmPassword, ...profile } = values;
    const result = await registerWithCredentials({ role: "STUDENT", email, password, profile });
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("註冊成功！請至信箱收取驗證信。");
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Email" required error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </FormField>
        <FormField label="暱稱" error={errors.nickname?.message}>
          <Input {...register("nickname")} />
        </FormField>
        <FormField label="密碼" required error={errors.password?.message}>
          <Input type="password" {...register("password")} />
        </FormField>
        <FormField label="確認密碼" required error={errors.confirmPassword?.message}>
          <Input type="password" {...register("confirmPassword")} />
        </FormField>
        <FormField label="中文姓氏" required error={errors.chineseLastName?.message}>
          <Input {...register("chineseLastName")} />
        </FormField>
        <FormField label="中文名字" required error={errors.chineseFirstName?.message}>
          <Input {...register("chineseFirstName")} />
        </FormField>
        <FormField label="英文姓氏 (Last Name)" required error={errors.englishLastName?.message}>
          <Input {...register("englishLastName")} />
        </FormField>
        <FormField label="英文名字 (First Name)" required error={errors.englishFirstName?.message}>
          <Input {...register("englishFirstName")} />
        </FormField>
        <FormField label="英文中間名 (Middle Name)" error={errors.englishMiddleName?.message}>
          <Input {...register("englishMiddleName")} />
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
        <FormField label="其他聯繫方式" error={errors.otherContact?.message} className="sm:col-span-2">
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
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        建立學生帳號
      </Button>
    </form>
  );
}
