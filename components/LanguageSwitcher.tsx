"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

export default function LanguageSwitcher({
  locale,
  variant = "light",
}: {
  locale: Locale;
  variant?: "light" | "dark";
}) {
  const pathname = usePathname();
  const router = useRouter();

  function pathWithoutLocale() {
    const parts = pathname.split("/");
    parts.splice(1, 1);
    const rest = parts.join("/");
    return rest === "" ? "/" : rest;
  }

  function switchTo(next: Locale) {
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`;
    const rest = pathWithoutLocale();
    router.push(`/${next}${rest === "/" ? "" : rest}`);
  }

  return (
    <div
      className={`inline-flex items-center rounded-full p-1 text-sm font-semibold ${
        variant === "light" ? "bg-sky-50 ring-1 ring-sky-100" : "bg-white/10 ring-1 ring-white/20"
      }`}
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          className={`rounded-full px-3 py-1.5 transition-colors ${
            l === locale
              ? "bg-sky-500 text-white shadow-sm"
              : variant === "light"
                ? "text-sky-700 hover:bg-sky-100"
                : "text-white/80 hover:bg-white/10"
          }`}
        >
          {localeNames[l].short}
        </button>
      ))}
    </div>
  );
}
