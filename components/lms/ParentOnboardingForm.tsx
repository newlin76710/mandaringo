"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { parentProfileSchema, emailSchema, type ParentProfileInput } from "@/lib/schemas/auth";
import { completeOnboarding } from "@/app/actions/auth";
import { FormField } from "@/components/lms/FormField";
import { GenderSelect } from "@/components/lms/GenderSelect";
import { PhoneInput } from "@/components/lms/PhoneInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({ email: emailSchema }).and(parentProfileSchema);
type FormValues = ParentProfileInput & { email: string };

export function ParentOnboardingForm() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { gender: "FEMALE" } });

  // Most OAuth sign-ins already have an email on the session — pre-fill it so the user
  // only has to type one when the provider genuinely didn't return one (e.g. LINE
  // without the email scope, or a declined Facebook email permission).
  useEffect(() => {
    if (session?.user?.email) setValue("email", session.user.email);
  }, [session?.user?.email, setValue]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const { email, ...profile } = values;
    const result = await completeOnboarding({ role: "PARENT", email, profile });
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
        <FormField label="性別" required error={errors.gender?.message}>
          <GenderSelect control={control} name="gender" />
        </FormField>
        <FormField label="Email" required error={errors.email?.message}>
          <Input type="email" {...register("email")} />
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
      <p className="text-xs text-slate-400">地址、其他聯繫方式、職業、次要聯繫人等其他資料，之後可以在「會員中心」隨時補填。</p>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        完成設定
      </Button>
    </form>
  );
}
