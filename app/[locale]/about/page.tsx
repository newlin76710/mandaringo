import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import PageHero from "@/components/PageHero";
import Mission from "@/components/about/Mission";
import Founder from "@/components/about/Founder";
import Team from "@/components/about/Team";
import Gallery from "@/components/about/Gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  return { title: `${dict.about.hero.title} · Mandarin Go` };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHero title={dict.about.hero.title} subtitle={dict.about.hero.subtitle} image="/images/mainview2.jpg" />
      <Mission dict={dict} />
      <Founder dict={dict} />
      <Team dict={dict} />
      <Gallery dict={dict} />
    </>
  );
}
