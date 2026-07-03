"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayCircle, X } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Songs({ dict }: { dict: Dictionary }) {
  const t = dict.resources.songs;
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-sky-50/60 py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {t.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 90}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className="card group relative block w-full overflow-hidden text-left"
              >
                <div className="relative aspect-video w-full">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
                    <PlayCircle className="h-12 w-12 text-white drop-shadow" />
                  </div>
                </div>
                <p className="p-4 text-sm font-semibold text-ink/80">{item.title}</p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label={dict.common.close}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="aspect-video w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="h-full w-full rounded-xl"
              src={`https://www.youtube.com/embed/${t.items[active].youtubeId}`}
              title={t.items[active].title}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
