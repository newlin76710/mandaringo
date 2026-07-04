"use client";

import { useState } from "react";
import { GraduationCap, Users, BookOpen } from "lucide-react";
import { StudentOnboardingForm } from "@/components/lms/StudentOnboardingForm";
import { ParentOnboardingForm } from "@/components/lms/ParentOnboardingForm";
import { TeacherOnboardingForm } from "@/components/lms/TeacherOnboardingForm";
import type { RegisterableRole } from "@/lib/constants";

const ROLE_OPTIONS: { role: RegisterableRole; title: string; desc: string; icon: typeof Users }[] = [
  { role: "PARENT", title: "我是家長", desc: "管理孩子的報名、繳費與請假", icon: Users },
  { role: "STUDENT", title: "我是學生", desc: "適合可以自行登入上課的學生", icon: GraduationCap },
  { role: "TEACHER", title: "我是老師", desc: "開課、點名、審核請假", icon: BookOpen },
];

export function OnboardingView() {
  const [role, setRole] = useState<RegisterableRole | null>(null);

  if (!role) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {ROLE_OPTIONS.map(({ role: r, title, desc, icon: Icon }) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-6 text-center transition-colors hover:border-sky-400 hover:bg-sky-50"
          >
            <Icon className="h-8 w-8 text-sky-500" />
            <span className="font-bold text-slate-900">{title}</span>
            <span className="text-xs text-slate-500">{desc}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setRole(null)}
        className="mb-4 text-sm font-semibold text-slate-500 hover:text-slate-700"
      >
        ← 重新選擇身份
      </button>
      {role === "STUDENT" && <StudentOnboardingForm />}
      {role === "PARENT" && <ParentOnboardingForm />}
      {role === "TEACHER" && <TeacherOnboardingForm />}
    </div>
  );
}
