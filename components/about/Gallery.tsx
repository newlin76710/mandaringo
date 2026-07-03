"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Gallery({ dict }: { dict: Dictionary }) {
  const t = dict.about.gallery;
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-sky-50/60 py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {t.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 120}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group relative block aspect-square w-full overflow-hidden rounded-2xl shadow-card"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/60 via-black/0 to-black/0 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <ZoomIn className="mb-1 h-5 w-5 text-white" />
                  <p className="text-center text-sm font-semibold text-white">{item.title}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative aspect-[4/3] w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <Image src={t.items[active].image} alt={t.items[active].title} fill className="rounded-2xl object-contain" />
            <p className="mt-3 text-center text-base font-semibold text-white">{t.items[active].title}</p>
          </div>
        </div>
      )}
    </section>
  );
}
