import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function EventsGrid({ dict }: { dict: Dictionary }) {
  const t = dict.curriculum.events;
  return (
    <section className="bg-sky-50/60 py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} intro={t.intro} />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((event, i) => (
            <Reveal key={event.title} delay={(i % 3) * 120}>
              <div className="card group h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1.5">
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
      </div>
    </section>
  );
}
