# Mandarin Go — 快樂學中文

A modern, multilingual marketing site for **Mandarin Go**, a Chinese language & culture
learning centre for children in London. Rebuilt from the legacy static site (now archived
in [`/legacy`](./legacy)) as a Next.js App Router project ready to deploy on Vercel.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS** for styling
- **lucide-react** for icons
- Locale-prefixed routing (`/en`, `/zh-Hant`, `/zh-Hans`) with a custom middleware-based
  i18n setup — no third-party i18n library required
- **Formspree** for the contact form (client-side POST, no backend needed)

## Languages

The site ships in three languages, matching the original site's audience:

| Locale     | Meaning              |
| ---------- | -------------------- |
| `en`       | English               |
| `zh-Hant`  | Traditional Chinese (繁體中文) |
| `zh-Hans`  | Simplified Chinese (简体中文)  |

Visiting `/` transparently serves the best-matching locale based on the `Accept-Language`
header (falls back to English) — see [Vercel usage optimizations](#vercel-usage-optimizations)
for why this is a rewrite, not a redirect. The language switcher in the header lets
visitors change locale at any time; the choice is remembered in a `NEXT_LOCALE` cookie.

All copy lives in `lib/i18n/dictionaries/{en,zh-Hant,zh-Hans}.ts`, typed against a shared
`Dictionary` type so the three files can't drift out of structural sync.

## Project structure

```
app/[locale]/            Route segments (home, about, curriculum, resources, contact)
components/              Shared UI (Header, Footer, Reveal, PageHero, SectionHeading…)
components/home/         Homepage sections
components/about/        About page sections (mission, founder, team, gallery)
components/curriculum/   Curriculum levels & events
components/resources/    Activity sheets, songs, other resources
components/contact/      Contact form + info cards
lib/i18n/                Locale config, dictionaries, getDictionary()
middleware.ts            Locale detection for "/" only (rewrite, not redirect)
public/images/           Reused photography/art from the legacy site
public/resources/        Downloadable activity sheets (jpg)
legacy/                  The original static site, kept for reference/history
```

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000 — it will redirect to `/en` (or your browser's language).

## Contact form (Formspree)

The contact form posts directly to Formspree from the browser — no server code required.

1. Create a form at [formspree.io](https://formspree.io) and copy its form ID (the part
   after `/f/` in the endpoint URL).
2. Set it in `.env` (already present in this repo, and intentionally **not** gitignored —
   `NEXT_PUBLIC_FORMSPREE_ID` is a client-exposed, non-secret value, so it's fine to commit
   it alongside the code instead of configuring it per-environment):
   ```
   NEXT_PUBLIC_FORMSPREE_ID=your_form_id
   ```
   `.env.example` is kept as a template only; `.env.local` (still gitignored) can be used
   to override it locally without touching the committed value.
3. Vercel picks up the committed `.env` automatically at build time — no dashboard
   configuration needed unless you want a different form ID per environment, in which case
   set `NEXT_PUBLIC_FORMSPREE_ID` under **Project Settings → Environment Variables**
   (it takes precedence over the committed `.env`).

Until this is configured, the form still renders and validates normally, but submitting
it shows a message asking visitors to email `info@mandaringo.co.uk` directly instead of
silently failing.

## Deploying to Vercel

```bash
npx vercel        # preview deploy
npx vercel --prod # production deploy
```

Or connect the GitHub repo in the Vercel dashboard for automatic deploys on push. No
special build configuration is needed — Vercel auto-detects Next.js.

## Vercel usage optimizations

This project is deliberately built to keep two Vercel usage metrics as close to zero as
possible:

**Edge Requests / Middleware invocations**

- `middleware.ts`'s `matcher` is scoped to `["/"]` only. Every internal link in the app
  already points at a locale-prefixed path (`/en/...`, `/zh-Hant/...`, `/zh-Hans/...`), so
  Middleware never runs for normal page navigation, static assets, or API routes — only
  for a bare visit to the domain root.
- That root request is handled with `NextResponse.rewrite()`, not `.redirect()`. A redirect
  costs two round trips (the 30x, then the browser's follow-up GET); a rewrite serves the
  resolved locale's already-prerendered page in a single response, with the URL bar staying
  at `/`. Repeat visits also skip the redirect loop entirely, since previously the app
  redirected on *every* request to `/`, even for returning visitors with a locale cookie.

**Image Optimization**

- `next.config.mjs` sets `images.unoptimized = true`, which turns off Vercel's on-demand
  Image Optimization entirely. `next/image` then renders a plain `<img>` pointing straight
  at the file in `public/`, so there's no `/_next/image` request (and no associated billed
  transformation) per image per breakpoint.
- To keep pages light without that runtime resizing, every image actually referenced by the
  UI was pre-resized to its real display size and recompressed once (mozjpeg/pngquant via
  `sharp`) before being committed — e.g. the ~470KB hero photo is now ~36KB, and the whole
  `public/images` folder dropped from 7.3MB to ~4MB. The full-resolution originals of the
  downloadable activity sheets in `public/resources/` were left untouched, since those are
  meant to be printed.
- If you add new images later, resize them to roughly their max on-screen display size
  (2x for retina) and compress before adding them to `public/`, since Vercel won't be doing
  it for you at request time anymore.

## Content notes

- Programme names, teacher credentials, curriculum levels and cultural activities were
  carried over from the legacy site's English/Chinese pages.
- A few offerings (Kids Yoga, Arts & Crafts, Science, Mathematics, Private Tutoring,
  Chinese Characters) and the `info@mandaringo.co.uk` contact address were sourced from
  Mandarin Go's current Wix site and folded into the "Programmes We Offer" section.
- Recurring events (Open Day, Chinese New Year, Holiday Camp, etc.) are presented without
  fixed dates, since those change every year — update `curriculum.events` in the
  dictionaries when real dates are confirmed, or add a dedicated "News" page later.
- There's no testimonials section yet — add one once real parent quotes are available,
  rather than shipping placeholder quotes.
