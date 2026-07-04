import type { Metadata } from "next";
import { Baloo_2, Noto_Sans_TC } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthSessionProvider } from "@/components/lms/AuthSessionProvider";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-display" });
const notoTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-tc" });

export const metadata: Metadata = {
  title: "Mandarin Go 學習平台",
  description: "Mandarin Go 中文教學平台 — 課程、報名、繳費、出缺席、請假一站管理。",
  robots: { index: false, follow: false },
};

// This is a second Next.js "root layout" (Next.js supports multiple root layouts via
// route groups). The LMS app is a distinct product from the marketing site — a different
// UI shell (app sidebar/topbar vs marketing header/footer), single-language (Traditional
// Chinese) instead of the marketing site's en/zh-Hant/zh-Hans — so it gets its own <html>
// instead of nesting under app/(marketing)/[locale]/layout.tsx.
export default function AppRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${baloo.variable} ${notoTC.variable}`}>
      <body className="min-h-screen bg-slate-50 text-ink antialiased">
        <AuthSessionProvider>
          {children}
          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
