import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Star } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.hero;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sunshine-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-coral-200/40 blur-3xl" />

      <div className="container-px relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="section-kicker">
            <Star className="h-3.5 w-3.5 fill-sky-500 text-sky-500" />
            {t.badge}
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] text-ink sm:text-6xl">
            {t.title1}
            <br />
            <span className="text-sky-500">{t.title2}</span>
          </h1>
          <p className="mt-3 font-display text-2xl font-bold text-coral-500">{t.zh}</p>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">{t.desc}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href={`/${locale}/curriculum`} className="btn-primary">
              {t.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={`/${locale}/contact`} className="btn-secondary">
              <BookOpen className="h-4 w-4" />
              {t.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="blob-bg relative aspect-square w-full overflow-hidden bg-sky-200/60 shadow-soft">
            <Image
              src="/images/mainview.jpg"
              alt="Mandarin Go children learning Mandarin"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -left-6 -top-6 flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-white text-3xl shadow-card sm:-left-10 sm:-top-8 sm:h-24 sm:w-24">
            🧧
          </div>
          <div
            className="absolute -bottom-6 -right-4 flex h-24 w-24 animate-wiggle items-center justify-center rounded-2xl bg-sunshine-300 text-4xl shadow-card sm:-bottom-8 sm:-right-8 sm:h-28 sm:w-28"
            style={{ animationDelay: "0.4s" }}
          >
            🐉
          </div>
          <div className="absolute -right-6 top-1/3 hidden h-16 w-16 animate-float items-center justify-center rounded-full bg-leaf-300 text-2xl shadow-card sm:flex" style={{ animationDelay: "1s" }}>
            ✨
          </div>
        </div>
      </div>
    </section>
  );
}
