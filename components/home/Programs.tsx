import {
  MessagesSquare,
  PenTool,
  GraduationCap,
  NotebookPen,
  PersonStanding,
  Palette,
  FlaskConical,
  Calculator,
  UserCheck,
  Wifi,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

const icons = [
  MessagesSquare,
  PenTool,
  GraduationCap,
  NotebookPen,
  PersonStanding,
  Palette,
  FlaskConical,
  Calculator,
  UserCheck,
];

const tints = [
  "bg-sky-500",
  "bg-coral-500",
  "bg-sunshine-500",
  "bg-leaf-500",
  "bg-sky-500",
  "bg-coral-500",
  "bg-sunshine-500",
  "bg-leaf-500",
  "bg-sky-500",
];

export default function Programs({ dict }: { dict: Dictionary }) {
  const t = dict.home.programs;
  return (
    <section className="py-20 sm:py-28">
      <div className="container-px">
        <Reveal>
          <SectionHeading kicker={t.kicker} heading={t.heading} intro={t.intro} />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={item.title} delay={(i % 6) * 90}>
                <div className="card flex h-full items-start gap-4 p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tints[i % tints.length]} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <div className="mt-10 flex items-center justify-center gap-2 text-sm font-semibold text-sky-600">
            <Wifi className="h-4 w-4" />
            {t.formatsNote}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
