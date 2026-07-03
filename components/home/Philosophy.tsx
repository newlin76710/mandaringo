import Image from "next/image";
import { Heart, Puzzle, Sparkles } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

const icons = [Heart, Puzzle, Sparkles];
const images = ["/images/img14.png", "/images/img15.png", "/images/img16.png"];
const tints = ["bg-sky-100", "bg-sunshine-100", "bg-coral-100"];

export default function Philosophy({ dict }: { dict: Dictionary }) {
  const t = dict.home.philosophy;
  return (
    <section className="py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={item.title} delay={i * 120}>
                <div className="card group h-full p-7 transition-transform duration-300 hover:-translate-y-1.5">
                  <div className={`relative mx-auto h-36 w-36 overflow-hidden rounded-full ${tints[i % tints.length]}`}>
                    <Image src={images[i % images.length]} alt="" fill className="object-contain p-6" />
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <Icon className="h-5 w-5 text-sky-500" />
                    <h3 className="text-center text-xl font-bold text-ink">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-center text-sm leading-relaxed text-ink/65">{item.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
