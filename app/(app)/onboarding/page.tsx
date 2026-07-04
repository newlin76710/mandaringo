import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingView } from "@/components/lms/OnboardingView";

export const metadata: Metadata = { title: "完成帳號設定 - Mandarin Go" };

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/onboarding");
  if (session.user.hasProfile) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-16">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-6">
          <h1 className="text-center text-2xl font-extrabold text-slate-900">完成帳號設定</h1>
          <p className="mt-1 text-center text-sm text-slate-500">請選擇您的身份並填寫基本資料</p>
          <div className="mt-8">
            <OnboardingView />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
