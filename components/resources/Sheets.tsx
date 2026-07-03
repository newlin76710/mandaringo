import Image from "next/image";
import { Download } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Sheets({ dict }: { dict: Dictionary }) {
  const t = dict.resources.sheets;
  return (
    <section className="py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {t.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 90}>
              <div className="card overflow-hidden">
                <div className="relative aspect-square w-full bg-sky-50">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-3" />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-black/5 p-4">
                  <p className="text-sm font-semibold leading-snug text-ink/80">{item.title}</p>
                  <a
                    href={item.file}
                    download
                    aria-label={t.download}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white transition-colors hover:bg-sky-600"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
