"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/schemas/auth";
import { requestPasswordReset } from "@/app/actions/auth";
import { FormField } from "@/components/lms/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = { email: string };

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <MailCheck className="h-10 w-10 text-sky-500" />
        <p className="text-sm text-slate-600">若此 Email 已註冊，我們已寄出重設密碼的連結，請至信箱查收。</p>
      </div>
    );
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    await requestPasswordReset(values);
    setSubmitting(false);
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Email" required error={errors.email?.message}>
        <Input type="email" {...register("email")} />
      </FormField>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        寄送重設密碼連結
      </Button>
    </form>
  );
}
