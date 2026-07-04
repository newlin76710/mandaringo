import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/lms/ResetPasswordForm";

export const metadata: Metadata = { title: "重設密碼 - Mandarin Go" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-white px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          {token ? (
            <>
              <h1 className="text-center text-2xl font-extrabold text-slate-900">重設密碼</h1>
              <div className="mt-6">
                <ResetPasswordForm token={token} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
              <p className="text-sm text-slate-500">此連結無效，請重新申請忘記密碼。</p>
              <Link href="/forgot-password" className="text-sm font-semibold text-sky-600 hover:underline">
                重新申請
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
