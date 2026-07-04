"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { resetPasswordSchema } from "@/lib/schemas/auth";
import { resetPassword } from "@/app/actions/auth";
import { FormField } from "@/components/lms/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = { token: string; password: string; confirmPassword: string };

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { token } });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const result = await resetPassword(values);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("密碼已重設，請重新登入");
    router.push("/login");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="新密碼" required error={errors.password?.message}>
        <Input type="password" {...register("password")} />
      </FormField>
      <FormField label="確認新密碼" required error={errors.confirmPassword?.message}>
        <Input type="password" {...register("confirmPassword")} />
      </FormField>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        重設密碼
      </Button>
    </form>
  );
}
