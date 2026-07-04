import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMyProfile } from "@/app/actions/profile";
import { LmsNav } from "@/components/lms/LmsNav";
import { Card, CardContent } from "@/components/ui/card";
import { StudentProfileEditForm } from "@/components/lms/StudentProfileEditForm";
import { ParentProfileEditForm } from "@/components/lms/ParentProfileEditForm";
import { TeacherProfileEditForm } from "@/components/lms/TeacherProfileEditForm";

export const metadata: Metadata = { title: "會員中心 - 個人資料 - Mandarin Go" };
export const dynamic = "force-dynamic";

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profile");
  if (!session.user.hasProfile) redirect("/onboarding");

  const profile = await getMyProfile();
  if (!profile) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNav />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-extrabold text-slate-900">會員中心 — 個人資料</h1>
        <p className="mt-1 text-sm text-slate-500">隨時更新您的聯絡方式與其他資訊。</p>

        <Card className="mt-6">
          <CardContent className="pt-6">
            {profile.role === "STUDENT" && (
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
            {profile.role === "PARENT" && (
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
            {profile.role === "TEACHER" && (
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
