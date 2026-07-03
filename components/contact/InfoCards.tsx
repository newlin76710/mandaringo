import { MapPin, Mail, Handshake, Wifi } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function InfoCards({ dict }: { dict: Dictionary }) {
  const { location, methods, collaboration } = dict.contact;

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="card p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-ink">{location.heading}</h3>
          <p className="mt-2 text-sm font-semibold text-ink/70">{location.country}</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-ink/60">
            {location.areas.map((area) => (
              <li key={area} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                {area}
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-sky-600">
            <Wifi className="h-4 w-4" />
            {location.online}
          </p>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="card p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral-100 text-coral-600">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-ink">{methods.heading}</h3>
          <div className="mt-3 space-y-1.5 text-sm">
            <a href={`mailto:${methods.email}`} className="block font-semibold text-sky-600 hover:underline">
              {methods.email}
            </a>
            <a
              href="https://www.facebook.com/MandarinGoUK/"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-semibold text-sky-600 hover:underline"
            >
              {methods.facebookLabel}
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="card p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sunshine-100 text-sunshine-700">
            <Handshake className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-ink">{collaboration.heading}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">{collaboration.text}</p>
        </div>
      </Reveal>
    </div>
  );
}
