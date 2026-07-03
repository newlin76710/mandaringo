import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function EventsPreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.events;
  const items = dict.curriculum.events.items.slice(0, 3);

  return (
    <section className="py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} intro={t.intro} />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((event, i) => (
            <Reveal key={event.title} delay={i * 120}>
              <div className="card group h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1.5">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-ink">{event.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{event.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <Link href={`/${locale}/curriculum`} className="btn-secondary">
              {t.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
