"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  BookMarked,
  Wallet,
  CalendarCheck,
  ClipboardList,
  ScrollText,
  Settings,
  ShieldCheck,
  IdCard,
} from "lucide-react";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "儀表板", icon: LayoutDashboard, roles: ["TEACHER", "ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/members", label: "網站會員", icon: IdCard, roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/students", label: "學生管理", icon: GraduationCap, roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/parents", label: "家長管理", icon: Users, roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/teachers", label: "老師管理", icon: BookOpen, roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/courses", label: "課程管理", icon: BookMarked, roles: ["TEACHER", "ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/enrollments", label: "報名 / 繳費審核", icon: Wallet, roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/attendance", label: "點名", icon: CalendarCheck, roles: ["TEACHER", "ADMIN", "SUPER_ADMIN"] },
  { href: "/leave", label: "請假審核", icon: ClipboardList, roles: ["TEACHER", "ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/settings", label: "系統設定", icon: Settings, roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/admins", label: "管理員管理", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
  { href: "/admin/audit-log", label: "系統紀錄", icon: ScrollText, roles: ["SUPER_ADMIN"] },
] as const;

export function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV.filter((item) => (item.roles as readonly string[]).includes(role));

  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block">
      <nav className="sticky top-16 flex flex-col gap-1 p-4">
        {items.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                active ? "bg-sky-50 text-sky-600" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
