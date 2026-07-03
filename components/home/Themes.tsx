import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

const themeImages = [
  "/images/img04.png",
  "/images/img05.png",
  "/images/img06.png",
  "/images/img07.png",
  "/images/img08.png",
  "/images/img09.png",
  "/images/img10.png",
  "/images/img11.png",
  "/images/img12.png",
  "/images/img13.png",
];

const tints = ["bg-sky-50", "bg-sunshine-50", "bg-coral-50", "bg-leaf-50"];

export default function Themes({ dict }: { dict: Dictionary }) {
  const t = dict.home.themes;
  return (
    <section className="bg-sky-50/60 py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} intro={t.intro} />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {t.items.map((theme, i) => (
            <Reveal key={theme} delay={(i % 5) * 90}>
              <div
                className={`group flex h-full flex-col items-center gap-3 rounded-2xl ${tints[i % tints.length]} p-5 text-center transition-transform duration-300 hover:-translate-y-1`}
              >
                <div className="relative h-16 w-16 transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                  <Image src={themeImages[i]} alt="" fill className="object-contain" />
                </div>
                <p className="text-sm font-bold text-ink/80 sm:text-base">{theme}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
