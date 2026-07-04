import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROLE_LABELS } from "@/lib/constants";
import { AdminSidebar } from "@/components/lms/admin/AdminSidebar";
import { UserMenu } from "@/components/lms/UserMenu";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ALLOWED_ROLES = ["TEACHER", "ADMIN", "SUPER_ADMIN"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (!ALLOWED_ROLES.includes(session.user.role)) redirect("/dashboard");
  // Admin/Super Admin default to a Teacher profile (see completeOnboarding) — everyone
  // in this layout is expected to have completed one.
  if (!session.user.hasProfile) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-display font-extrabold text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-lg text-white">🐼</span>
            Mandarin Go 後台
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-semibold text-slate-500 hover:text-sky-600">
              會員中心
            </Link>
            <UserMenu name={session.user.name ?? session.user.email ?? "使用者"} roleLabel={ROLE_LABELS[session.user.role]} />
          </div>
        </div>
      </header>
      <div className="flex">
        <AdminSidebar role={session.user.role} />
        <main className="min-w-0 flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
