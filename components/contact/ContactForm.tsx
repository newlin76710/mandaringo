"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type Status = "idle" | "sending" | "success" | "error" | "unconfigured";

export default function ContactForm({ dict }: { dict: Dictionary }) {
  const t = dict.contact.form;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

    if (!formId) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card p-7 sm:p-10">
      <h3 className="font-display text-2xl font-extrabold text-ink">{t.heading}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">{t.intro}</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink/80">
              {t.name} *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder={t.namePlaceholder}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink/80">
              {t.email} *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t.emailPlaceholder}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink/80">
              {t.phone}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder={t.phonePlaceholder}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div>
            <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-ink/80">
              {t.subject} *
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              placeholder={t.subjectPlaceholder}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ink/80">
            {t.message} *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder={t.messagePlaceholder}
            className="w-full resize-none rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <button type="submit" disabled={status === "sending"} className="btn-primary w-full sm:w-auto">
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.sending}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {t.submit}
            </>
          )}
        </button>

        {status === "success" && (
          <p className="flex items-center gap-2 text-sm font-semibold text-leaf-600">
            <CheckCircle2 className="h-4 w-4" />
            {t.success}
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-2 text-sm font-semibold text-coral-600">
            <AlertTriangle className="h-4 w-4" />
            {t.error}
          </p>
        )}
        {status === "unconfigured" && (
          <p className="flex items-center gap-2 text-sm font-semibold text-sunshine-700">
            <AlertTriangle className="h-4 w-4" />
            {t.configMissing}{" "}
            <a href={`mailto:${dict.contact.methods.email}`} className="underline">
              {dict.contact.methods.email}
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
