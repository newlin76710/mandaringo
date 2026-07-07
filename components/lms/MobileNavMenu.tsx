"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, Settings, LogOut, UserCog, LogIn, UserPlus, BookOpen, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function MobileNavMenu({
  isLoggedIn,
  isAdmin,
  roleLabel,
}: {
  isLoggedIn: boolean;
  isAdmin: boolean;
  roleLabel?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 outline-none">
        <Menu className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {roleLabel && (
          <>
            <DropdownMenuLabel>{roleLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href="/courses">
            <BookOpen className="h-4 w-4" />
            課程列表
          </Link>
        </DropdownMenuItem>
        {isLoggedIn && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              會員中心
            </Link>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Settings className="h-4 w-4" />
              後台管理
            </Link>
          </DropdownMenuItem>
        )}
        {isLoggedIn ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserCog className="h-4 w-4" />
                編輯個人資料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-red-600">
              <LogOut className="h-4 w-4" />
              登出
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                登入
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register">
                <UserPlus className="h-4 w-4" />
                註冊
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
