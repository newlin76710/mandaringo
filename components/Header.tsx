"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles, LogIn } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/curriculum`, label: dict.nav.curriculum },
    { href: `/${locale}/resources`, label: dict.nav.resources },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  function isActive(href: string) {
    // "/" is served via a Middleware rewrite (not a redirect) to the resolved
    // locale's home page, so the browser's visible pathname stays "/" — treat
    // it as the home link being active too.
    return href === `/${locale}` ? pathname === href || pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md backdrop-blur-md" : "bg-white/70 backdrop-blur-sm"
      }`}
    >
      <div className="container-px flex h-20 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2.5 font-display">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-2xl shadow-soft">
            🐼
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold text-ink">Mandarin Go</span>
            <span className="block text-xs font-semibold text-sky-500">Fun · Learn · Grow</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
                isActive(link.href)
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-ink/70 hover:bg-sky-50 hover:text-sky-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher locale={locale} />
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-sky-50 hover:text-sky-600"
            title={dict.nav.portalLoginFull}
          >
            <LogIn className="h-4 w-4" />
            {dict.nav.portalLogin}
          </Link>
          <Link href={`/${locale}/contact`} className="btn-primary !px-5 !py-2.5 text-sm">
            <Sparkles className="h-4 w-4" />
            {dict.nav.cta}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-600 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-sky-100 bg-white px-5 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col gap-1.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-base font-semibold ${
                  isActive(link.href) ? "bg-sky-500 text-white" : "text-ink/80 hover:bg-sky-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-ink/80 hover:bg-sky-50">
              <LogIn className="h-4 w-4" />
              {dict.nav.portalLoginFull}
            </Link>
          </nav>
          <div className="mt-4 flex items-center justify-between gap-3">
            <LanguageSwitcher locale={locale} />
            <Link href={`/${locale}/contact`} className="btn-primary !px-5 !py-2.5 text-sm">
              {dict.nav.cta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
