import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import PageHero from "@/components/PageHero";
import Sheets from "@/components/resources/Sheets";
import Songs from "@/components/resources/Songs";
import OtherResources from "@/components/resources/OtherResources";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  return { title: `${dict.resources.hero.title} · Mandarin Go` };
}

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHero
        title={dict.resources.hero.title}
        subtitle={dict.resources.hero.subtitle}
        image="/images/mainview5.jpg"
      />
      <Sheets dict={dict} />
      <Songs dict={dict} />
      <OtherResources dict={dict} />
    </>
  );
}
