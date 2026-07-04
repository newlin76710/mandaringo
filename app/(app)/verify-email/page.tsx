import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { verifyEmail } from "@/app/actions/auth";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await verifyEmail(token) : { error: "缺少驗證碼" as const };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-white px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          {"success" in result ? (
            <>
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <h1 className="text-lg font-bold text-slate-900">Email 驗證成功</h1>
              <p className="text-sm text-slate-500">您的帳號已啟用，現在可以登入了。</p>
            </>
          ) : (
            <>
              <XCircle className="h-12 w-12 text-red-500" />
              <h1 className="text-lg font-bold text-slate-900">驗證失敗</h1>
              <p className="text-sm text-slate-500">{result.error}</p>
            </>
          )}
          <Link href="/login" className="mt-2 text-sm font-semibold text-sky-600 hover:underline">
            前往登入
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
