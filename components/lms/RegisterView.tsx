"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, BookOpen, ArrowLeft, MailCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ParentRegisterForm } from "@/components/lms/ParentRegisterForm";
import { TeacherRegisterForm } from "@/components/lms/TeacherRegisterForm";
import type { RegisterableRole } from "@/lib/constants";

const ROLE_OPTIONS: { role: RegisterableRole; title: string; desc: string; icon: typeof Users }[] = [
  { role: "PARENT", title: "我是家長", desc: "管理孩子的報名、繳費與請假", icon: Users },
  { role: "TEACHER", title: "我是老師", desc: "開課、點名、審核請假", icon: BookOpen },
];

export function RegisterView() {
  const [role, setRole] = useState<RegisterableRole | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <MailCheck className="h-12 w-12 text-sky-500" />
          <h2 className="text-lg font-bold text-slate-900">請至信箱完成驗證</h2>
          <p className="text-sm text-slate-500">我們已寄出驗證信，請點擊信中連結完成帳號啟用，即可登入。</p>
          <Link href="/login" className="text-sm font-semibold text-sky-600 hover:underline">
            前往登入
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!role) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-2xl font-extrabold text-slate-900">建立 Mandarin Go 帳號</h1>
        <p className="mt-2 text-center text-sm text-slate-500">請選擇您的身份</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
        <p className="mt-3 text-center text-xs text-slate-400">
          想讓孩子使用自己的帳號登入？請先以家長身份註冊，再從會員中心新增學生資料。
        </p>
        <p className="mt-6 text-center text-sm text-slate-500">
          已經有帳號了？{" "}
          <Link href="/login" className="font-semibold text-sky-600 hover:underline">
            立即登入
          </Link>
        </p>
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardContent className="pt-6">
        <button
          type="button"
          onClick={() => setRole(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          重新選擇身份
        </button>
        {role === "PARENT" && <ParentRegisterForm onDone={() => setDone(true)} />}
        {role === "TEACHER" && <TeacherRegisterForm onDone={() => setDone(true)} />}
      </CardContent>
    </Card>
  );
}
