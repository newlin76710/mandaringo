import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Philosophy from "@/components/home/Philosophy";
import Themes from "@/components/home/Themes";
import Programs from "@/components/home/Programs";
import WhyUs from "@/components/home/WhyUs";
import EventsPreview from "@/components/home/EventsPreview";
import Cta from "@/components/home/Cta";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <Stats dict={dict} />
      <Philosophy dict={dict} />
      <Themes dict={dict} />
      <Programs dict={dict} />
      <WhyUs dict={dict} />
      <EventsPreview locale={locale} dict={dict} />
      <Cta locale={locale} dict={dict} />
    </>
  );
}
