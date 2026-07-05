import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMyProfile, getMyLoginMethods } from "@/app/actions/profile";
import { LmsNav } from "@/components/lms/LmsNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProfileEditForm } from "@/components/lms/StudentProfileEditForm";
import { ParentProfileEditForm } from "@/components/lms/ParentProfileEditForm";
import { TeacherProfileEditForm } from "@/components/lms/TeacherProfileEditForm";
import { LOGIN_METHOD_LABELS } from "@/lib/constants";

export const metadata: Metadata = { title: "會員中心 - 個人資料 - Mandarin Go" };
export const dynamic = "force-dynamic";

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profile");

  const profile = await getMyProfile();
  if (!profile) redirect("/onboarding");

  const loginMethods = await getMyLoginMethods();

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNav />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-slate-900">會員中心 — 個人資料</h1>
        <p className="mt-1 text-sm text-slate-500">隨時更新您的聯絡方式與其他資訊。</p>

        {loginMethods && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>登入方式</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {loginMethods.hasPassword && (
                <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  Email / 密碼
                </span>
              )}
              {loginMethods.providers.map((p) => {
                const config = LOGIN_METHOD_LABELS[p];
                if (!config) return null;
                return (
                  <span
                    key={p}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
                  >
                    {config.label}
                  </span>
                );
              })}
              {!loginMethods.hasPassword && loginMethods.providers.length === 0 && (
                <span className="text-xs text-slate-400">尚無登入方式資訊</span>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardContent className="pt-6">
            {profile.type === "STUDENT" && (
              <StudentProfileEditForm
                defaultValues={{
                  chineseFirstName: profile.data.chineseFirstName,
                  chineseLastName: profile.data.chineseLastName,
                  englishFirstName: profile.data.englishFirstName,
                  englishMiddleName: profile.data.englishMiddleName ?? undefined,
                  englishLastName: profile.data.englishLastName,
                  nickname: profile.data.nickname ?? undefined,
                  gender: profile.data.gender,
                  birthDate: toDateInput(profile.data.birthDate),
                  phone: profile.data.phone ?? undefined,
                  otherContact: profile.data.otherContact ?? undefined,
                  allergies: profile.data.allergies ?? undefined,
                  specialNeeds: profile.data.specialNeeds ?? undefined,
                  notes: profile.data.notes ?? undefined,
                }}
              />
            )}
            {profile.type === "PARENT" && (
              <ParentProfileEditForm
                defaultValues={{
                  chineseFirstName: profile.data.chineseFirstName,
                  chineseLastName: profile.data.chineseLastName,
                  englishFirstName: profile.data.englishFirstName,
                  englishLastName: profile.data.englishLastName,
                  gender: profile.data.gender,
                  phone: profile.data.phone,
                  nationality: profile.data.nationality ?? "",
                  postalCode: profile.data.postalCode ?? "",
                  address: profile.data.address ?? undefined,
                  otherContact: profile.data.otherContact ?? undefined,
                  occupation: profile.data.occupation ?? undefined,
                  educationLevel: profile.data.educationLevel ?? undefined,
                  secondaryContactName: profile.data.secondaryContactName ?? undefined,
                  secondaryContactPhone: profile.data.secondaryContactPhone ?? undefined,
                  notes: profile.data.notes ?? undefined,
                }}
              />
            )}
            {profile.type === "TEACHER" && (
              <TeacherProfileEditForm
                defaultValues={{
                  chineseFirstName: profile.data.chineseFirstName,
                  chineseLastName: profile.data.chineseLastName,
                  englishFirstName: profile.data.englishFirstName,
                  englishMiddleName: profile.data.englishMiddleName ?? undefined,
                  englishLastName: profile.data.englishLastName,
                  gender: profile.data.gender,
                  phone: profile.data.phone,
                  nationality: profile.data.nationality ?? "",
                  postalCode: profile.data.postalCode ?? "",
                  registeredAddress: profile.data.registeredAddress ?? undefined,
                  residentialAddress: profile.data.residentialAddress ?? undefined,
                  occupation: profile.data.occupation ?? undefined,
                  educationLevel: profile.data.educationLevel ?? undefined,
                  emergencyContactName: profile.data.emergencyContactName ?? undefined,
                  emergencyContactPhone: profile.data.emergencyContactPhone ?? undefined,
                  bio: profile.data.bio ?? undefined,
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
