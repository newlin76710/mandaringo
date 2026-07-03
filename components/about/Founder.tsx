import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Founder({ dict }: { dict: Dictionary }) {
  const t = dict.about.founder;
  return (
    <section className="bg-sky-50/60 py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <span className="section-kicker mx-auto flex w-fit">{t.kicker}</span>
        </Reveal>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[280px_1fr]">
          <Reveal>
            <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full ring-8 ring-white shadow-soft">
              <Image src="/images/teacher01.jpg" alt={t.name} fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h3 className="text-center font-display text-2xl font-extrabold text-ink lg:text-left">{t.name}</h3>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-ink/70">
              {t.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
