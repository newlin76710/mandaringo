import Link from "next/link";
import Image from "next/image";
import { Settings } from "lucide-react";
import { auth } from "@/auth";
import { ROLE_LABELS } from "@/lib/constants";
import { UserMenu } from "@/components/lms/UserMenu";
import { MobileNavMenu } from "@/components/lms/MobileNavMenu";
import { Button } from "@/components/ui/button";

export async function LmsNav() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo goes back to the marketing site (前台), not deeper into the LMS. */}
        <Link href="/" className="flex items-center gap-2 font-display font-extrabold text-slate-900">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-100">
            <Image src="/images/img33.png" alt="Mandarin Go" fill className="object-contain p-0.5" />
          </span>
          Mandarin Go 學習平台
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/courses" className="hover:text-sky-600">
            課程列表
          </Link>
          {session?.user && (
            <Link href="/dashboard" className="hover:text-sky-600">
              會員中心
            </Link>
          )}
          {isAdmin && (
            <Button asChild variant="outline" size="sm" className="gap-1.5 border-sky-200 text-sky-600 hover:bg-sky-50">
              <Link href="/admin">
                <Settings className="h-3.5 w-3.5" />
                後台管理
              </Link>
            </Button>
          )}
          {session?.user ? (
            <UserMenu name={session.user.name ?? session.user.email ?? "使用者"} roleLabel={ROLE_LABELS[session.user.role]} />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">登入</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">註冊</Link>
              </Button>
            </div>
          )}
        </nav>

        <div className="md:hidden">
          <MobileNavMenu
            isLoggedIn={!!session?.user}
            isAdmin={isAdmin}
            roleLabel={session?.user ? ROLE_LABELS[session.user.role] : undefined}
          />
        </div>
      </div>
    </header>
  );
}
