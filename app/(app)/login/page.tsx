import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/lms/LoginForm";

export const metadata: Metadata = { title: "登入 - Mandarin Go" };
export const dynamic = "force-dynamic";

function getEnabledProviders() {
  const providers: string[] = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) providers.push("google");
  if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) providers.push("facebook");
  if (process.env.LINE_CLIENT_ID && process.env.LINE_CLIENT_SECRET) providers.push("line");
  return providers;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    const { callbackUrl } = await searchParams;
    redirect(callbackUrl || "/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-white px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <h1 className="text-center text-2xl font-extrabold text-slate-900">歡迎回來</h1>
          <p className="mt-1 text-center text-sm text-slate-500">登入 Mandarin Go 學習平台</p>
          <div className="mt-6">
            <Suspense>
              <LoginForm enabledProviders={getEnabledProviders()} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
