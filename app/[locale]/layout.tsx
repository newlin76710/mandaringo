import type { Metadata } from "next";
import { Baloo_2, Noto_Sans_SC, Noto_Sans_TC } from "next/font/google";
import "../globals.css";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-display" });
const notoTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-tc" });
const notoSC = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-sc" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL("https://mandaringo.co.uk"),
    alternates: {
      languages: {
        en: "/en",
        "zh-Hant": "/zh-Hant",
        "zh-Hans": "/zh-Hans",
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/images/shareimg.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={`${baloo.variable} ${notoTC.variable} ${notoSC.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <Header locale={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
