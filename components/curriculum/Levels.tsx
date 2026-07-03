import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

const tints = [
  "from-sky-400 to-sky-500",
  "from-leaf-400 to-leaf-500",
  "from-sunshine-400 to-sunshine-500",
  "from-coral-400 to-coral-500",
  "from-sky-500 to-coral-500",
];

export default function Levels({ dict }: { dict: Dictionary }) {
  const t = dict.curriculum.levels;
  return (
    <section className="py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {t.items.map((level, i) => (
            <Reveal key={level.name} delay={i * 100}>
              <div className="card flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1.5">
                <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${tints[i % tints.length]}`}>
                  <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-white/40">
                    <Image src={level.image} alt={level.name} fill className="object-cover" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-extrabold text-ink">{level.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-sky-500">
                    {t.recommendedAge}: {level.age} {t.ages}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/60">{level.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
