"use client";

import Image from "next/image";
import { useState } from "react";
import { X, GraduationCap } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Team({ dict }: { dict: Dictionary }) {
  const t = dict.about.team;
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} intro={t.intro} />
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.members.map((member, i) => (
            <Reveal key={member.name} delay={i * 120}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group flex w-full flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-sky-100 transition-all group-hover:ring-sky-300">
                  <Image src={member.photo} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-bold text-ink">{member.name}</h3>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-500">
                  <GraduationCap className="h-4 w-4" />
                  {member.credentials[0]}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-sky-100">
                <Image src={t.members[active].photo} alt={t.members[active].name} fill className="object-cover" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink">{t.members[active].name}</h3>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm leading-relaxed text-ink/70">
              {t.members[active].credentials.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
