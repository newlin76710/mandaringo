import { GraduationCap, Landmark, Globe2, CalendarClock } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

const icons = [GraduationCap, Landmark, Globe2, CalendarClock];

export default function WhyUs({ dict }: { dict: Dictionary }) {
  const t = dict.home.why;
  return (
    <section className="bg-ink py-20 text-white sm:py-28">
      <div className="container-px">
        <Reveal>
          <span className="section-kicker !bg-white/10 !text-sky-300">{t.kicker}</span>
          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold sm:text-4xl">{t.heading}</h2>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {t.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={item.title} delay={i * 120}>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
