import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "./lib/i18n/config";

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase());

  for (const lang of preferred) {
    if (lang.startsWith("zh")) {
      if (["zh-tw", "zh-hk", "zh-hant", "zh-mo"].includes(lang)) return "zh-Hant";
      return "zh-Hans";
    }
    if (lang.startsWith("en")) return "en";
  }

  return defaultLocale;
}

// Every internal link in the app already points at a locale-prefixed path
// (/en/..., /zh-Hant/..., /zh-Hans/...), so the ONLY request that ever needs
// locale resolution is the bare "/" (a fresh visit to the domain root). The
// matcher below scopes Middleware to just that one path — it never runs for
// /en/*, /zh-Hant/*, /zh-Hans/*, static assets, or anything else — which
// removes the vast majority of Middleware invocations we'd otherwise pay
// for on every single page view.
export function middleware(request: NextRequest) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : getPreferredLocale(request);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;

  // Rewrite (not redirect): the resolved locale's statically-generated page is
  // served under the original "/" URL in a single response, instead of a 302
  // that forces the browser to make a second round-trip request for /en.
  const response = NextResponse.rewrite(url);
  if (!cookieLocale) {
    response.cookies.set("NEXT_LOCALE", locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  }
  return response;
}

export const config = {
  matcher: ["/"],
};
