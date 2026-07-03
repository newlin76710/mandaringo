import Image from "next/image";
import { ExternalLink } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function OtherResources({ dict }: { dict: Dictionary }) {
  const t = dict.resources.other;
  return (
    <section className="py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {t.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 120}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex items-center gap-5 overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-ink">{item.title}</h3>
                </div>
                <ExternalLink className="h-5 w-5 shrink-0 text-sky-400 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
