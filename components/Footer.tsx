import Link from "next/link";
import Image from "next/image";
import { Facebook, Mail } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/curriculum`, label: dict.nav.curriculum },
    { href: `/${locale}/resources`, label: dict.nav.resources },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-coral-500/10 blur-3xl" />

      <div className="container-px relative flex flex-col gap-10 py-14 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5 font-display">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-100">
              <Image src="/images/img33.png" alt="Mandarin Go" fill className="object-contain p-1" />
            </span>
            <span className="text-lg font-extrabold">Mandarin Go</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{dict.footer.tagline}</p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.facebook.com/MandarinGoUK/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-sky-500"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${dict.contact.methods.email}`}
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-sky-500"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
            {dict.footer.quickLinks}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/80 transition-colors hover:text-sky-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
            {dict.contact.methods.heading}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li>{dict.contact.location.country}</li>
            <li>
              <a href={`mailto:${dict.contact.methods.email}`} className="hover:text-sky-300">
                {dict.contact.methods.email}
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/MandarinGoUK/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-300"
              >
                {dict.contact.methods.facebookLabel}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/50">
        {dict.footer.rights}
      </div>
    </footer>
  );
}
