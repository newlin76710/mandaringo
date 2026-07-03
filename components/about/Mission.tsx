import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Mission({ dict }: { dict: Dictionary }) {
  const t = dict.about.mission;
  return (
    <section className="py-20 sm:py-28">
      <div className="container-px grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-card">
            <Image src="/images/img01e.png" alt="" fill className="object-contain bg-sky-50 p-4" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <SectionHeading kicker={t.kicker} heading={t.heading} align="left" />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/70">
            {t.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
