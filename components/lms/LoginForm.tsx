"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { FormField } from "@/components/lms/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const OAUTH_LABELS: Record<string, string> = {
  google: "使用 Google 繼續",
  facebook: "使用 Facebook 繼續",
  line: "使用 LINE 繼續",
};

export function LoginForm({ enabledProviders }: { enabledProviders: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setSubmitting(true);
    const result = await signIn("credentials", { ...values, redirect: false });
    setSubmitting(false);
    if (!result || result.error) {
      toast.error("Email 或密碼錯誤");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email" required error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </FormField>
        <FormField label="密碼" required error={errors.password?.message}>
          <Input type="password" autoComplete="current-password" {...register("password")} />
        </FormField>
        <div className="text-right">
          <Link href="/forgot-password" className="text-xs font-semibold text-sky-600 hover:underline">
            忘記密碼？
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          登入
        </Button>
      </form>

      {enabledProviders.length > 0 && (
        <>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            或
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="space-y-2">
            {enabledProviders.map((p) => (
              <Button
                key={p}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn(p, { callbackUrl })}
              >
                {OAUTH_LABELS[p] ?? p}
              </Button>
            ))}
          </div>
        </>
      )}

      <p className="text-center text-sm text-slate-500">
        還沒有帳號？{" "}
        <Link href="/register" className="font-semibold text-sky-600 hover:underline">
          立即註冊
        </Link>
      </p>
    </div>
  );
}
