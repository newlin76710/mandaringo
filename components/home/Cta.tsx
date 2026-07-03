import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Cta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.cta;
  return (
    <section className="py-12 sm:py-16">
      <div className="container-px">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-500 to-coral-500 px-8 py-16 text-center shadow-soft sm:px-16">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-white/10" />
            <h2 className="relative font-display text-3xl font-extrabold text-white sm:text-4xl">{t.heading}</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base text-white/90 sm:text-lg">{t.text}</p>
            <Link
              href={`/${locale}/contact`}
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-sky-600 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {t.button}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
