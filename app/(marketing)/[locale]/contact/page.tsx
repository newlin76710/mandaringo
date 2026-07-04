import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import PageHero from "@/components/PageHero";
import InfoCards from "@/components/contact/InfoCards";
import ContactForm from "@/components/contact/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  return { title: `${dict.contact.hero.title} · Mandarin Go` };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHero title={dict.contact.hero.title} subtitle={dict.contact.hero.subtitle} image="/images/mainview4.jpg" />
      <section className="py-20 sm:py-28">
        <div className="container-px grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <InfoCards dict={dict} />
          <ContactForm dict={dict} />
        </div>
      </section>
    </>
  );
}
