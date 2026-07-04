import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import PageHero from "@/components/PageHero";
import Levels from "@/components/curriculum/Levels";
import Themes from "@/components/home/Themes";
import Programs from "@/components/home/Programs";
import EventsGrid from "@/components/curriculum/EventsGrid";
import Cta from "@/components/home/Cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  return { title: `${dict.curriculum.hero.title} · Mandarin Go` };
}

export default async function CurriculumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHero
        title={dict.curriculum.hero.title}
        subtitle={dict.curriculum.hero.subtitle}
        image="/images/mainview3.jpg"
      />
      <section className="pt-16 sm:pt-20">
        <div className="container-px">
          <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-ink/70">{dict.curriculum.intro}</p>
        </div>
      </section>
      <Levels dict={dict} />
      <Themes dict={dict} />
      <Programs dict={dict} />
      <EventsGrid dict={dict} />
      <Cta locale={locale} dict={dict} />
    </>
  );
}
