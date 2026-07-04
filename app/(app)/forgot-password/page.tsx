import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/lms/ForgotPasswordForm";

export const metadata: Metadata = { title: "忘記密碼 - Mandarin Go" };

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-white px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <h1 className="text-center text-2xl font-extrabold text-slate-900">忘記密碼</h1>
          <p className="mt-1 text-center text-sm text-slate-500">輸入註冊時使用的 Email</p>
          <div className="mt-6">
            <ForgotPasswordForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
