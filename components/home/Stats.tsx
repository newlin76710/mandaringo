import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Stats({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative z-10 -mt-6 sm:-mt-10">
      <div className="container-px">
        <Reveal>
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5 sm:grid-cols-4 sm:p-8">
            {dict.home.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-extrabold text-sky-500 sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-xs font-semibold text-ink/60 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
