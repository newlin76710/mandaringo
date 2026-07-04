# Mandarin Go — 快樂學中文

This repo hosts two applications for **Mandarin Go**, a Chinese language & culture
learning centre for children in London:

1. **The marketing site** (`app/(marketing)/[locale]/*`) — public, multilingual, SEO-first.
2. **The Mandarin Go LMS** (`app/(app)/*`) — the teaching platform: accounts, courses,
   enrollment & payment, attendance, and leave requests. See
   [`docs/lms/01_PRD.md`](./docs/lms/01_PRD.md) for the full product spec.

Both are one Next.js project (two Next.js "root layouts" via route groups — see
[Architecture](#architecture-two-root-layouts)), deployed together to Vercel.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS** for styling, **lucide-react** for icons
- Marketing site: locale-prefixed routing (`/en`, `/zh-Hant`, `/zh-Hans`) with a custom
  middleware-based i18n setup, **Formspree** for the contact form
- LMS: **Auth.js v5** (Google/Facebook/LINE OAuth + email/password) on **Prisma** +
  **Neon Postgres**, **Resend** for transactional email, **Zod** + **react-hook-form**
  for every form, hand-built shadcn-style primitives in `components/ui/`

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
app/(marketing)/[locale]/  Marketing site route segments (home, about, curriculum, resources, contact)
components/                 Marketing site shared UI (Header, Footer, Reveal, PageHero…)
components/home/            Marketing homepage sections
components/about/, curriculum/, resources/, contact/   Marketing page sections
lib/i18n/                   Locale config, dictionaries, getDictionary()
middleware.ts                Locale detection for "/" only (rewrite, not redirect)
public/images/, public/resources/   Legacy-site imagery, kept as static assets
legacy/                      The original static site, kept for reference/history

app/(app)/                  LMS routes — its own root layout, own <html>, Traditional Chinese only
  login/ register/ onboarding/ verify-email/ forgot-password/ reset-password/
  courses/ courses/[id]/     Public course catalog + enroll
  my/enrollments/            Parent/Student: enrollment status + bank-transfer payment proof
  dashboard/                 Role-aware home (Student / Parent / Teacher)
  attendance/                Teacher/Admin: per-course, per-date roster check-in
  leave/                     Submit (Student/Parent) + approve/reject (Teacher/Admin) leave requests
  admin/                     Back office: dashboard, students, parents, teachers, courses,
                             enrollments/payment verification, audit log (Super Admin)
components/lms/             LMS UI (forms, nav, dashboards)
components/lms/admin/       Back-office UI (sidebar, DataTable, course form, tables)
components/ui/              Hand-built shadcn-style primitives (Button, Input, Table, Dialog…)
app/actions/                Server actions: auth, family, course, enrollment, payment, attendance, leave
lib/queries/                Read-only Prisma queries used directly by Server Components
lib/schemas/                Zod schemas shared by forms and server actions
prisma/schema.prisma         Full data model (Postgres/Neon)
docs/lms/                   PRD, business-flow state machines, ERD, RBAC matrix, Phase 2 roadmap
```

## Architecture: two root layouts

Next.js normally has one `app/layout.tsx` owning the single `<html>`/`<body>` tag. This
project needs two, because the marketing site and the LMS are different products with
different chrome (multilingual header/footer vs. app sidebar/topbar) and different
languages (3-locale i18n vs. Traditional-Chinese-only). Next.js supports this natively via
**route groups**: `app/(marketing)/[locale]/layout.tsx` and `app/(app)/layout.tsx` are each
a root layout for their branch of the route tree. Navigating between the two triggers a
full page load instead of a soft client transition — correct here, since they share no
layout state. `middleware.ts`'s rewrite of bare `/` only ever targets the marketing site;
all LMS routes are plain top-level paths (`/login`, `/admin`, `/courses`, …) that never
pass through middleware at all (see [Vercel usage optimizations](#vercel-usage-optimizations)).

## Getting started

```bash
npm install
```

The marketing site works immediately with `npm run dev`. **The LMS needs a database
before any of its routes will respond** (it fails fast at query time, not at build time,
if `DATABASE_URL` is unset — the marketing site is unaffected either way):

1. Create a free project at [neon.tech](https://neon.tech) and copy its connection string
   into `DATABASE_URL` in `.env`.
2. Push the schema and seed sample data:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
   The seed script prints four login accounts (Super Admin / Admin / Teacher / Parent),
   all with password `Password123!`, plus one sample published course and one linked
   student — enough to exercise the whole enroll → pay → approve → attend → leave flow
   immediately.
3. `npm run dev`, then visit `/login`.

Useful Prisma scripts: `npm run db:studio` (visual data browser), `npm run db:migrate`
(generates a versioned migration instead of `db push`, for when the schema stabilizes).

### LMS environment variables

All in `.env` (see `.env.example` for the full list):

| Variable | Required for | Notes |
|---|---|---|
| `DATABASE_URL` | Everything | Neon Postgres connection string |
| `AUTH_SECRET` | Everything | Pre-generated for you; regenerate with `openssl rand -base64 32` if you want a fresh one |
| `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` | Everything | Set both to your real domain in production |
| `GOOGLE_CLIENT_ID` / `_SECRET` | Google sign-in | From Google Cloud Console → Credentials. Omit both to hide the Google button — no broken login flow ships either way |
| `FACEBOOK_CLIENT_ID` / `_SECRET` | Facebook sign-in | From developers.facebook.com |
| `LINE_CLIENT_ID` / `_SECRET` | LINE sign-in | From developers.line.biz |
| `RESEND_API_KEY`, `FROM_EMAIL` | Verification/reset/payment emails | Without a key, emails are logged to the server console instead of sent — registration and payment flows still work end to end |
| `BANK_NAME`, `BANK_CODE`, `BANK_ACCOUNT`, `BANK_ACCOUNT_NAME` | Enrollment payment screen | Shown to parents/students on the bank-transfer instructions page |

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

## LMS roles

| Role | Can do |
|---|---|
| `SUPER_ADMIN` | Everything Admin can, plus view the audit log |
| `ADMIN` | Manage students/parents/teachers, create/edit any course, approve/reject payments, review any leave request |
| `TEACHER` | Create/edit their own courses, take attendance and review leave for their own courses |
| `PARENT` | Add student profiles, enroll them in courses, pay, request leave, view attendance |
| `STUDENT` | Same as Parent, but for their own single profile (self-registration for older students) |

Full permission matrix: [`docs/lms/04_RBAC.md`](./docs/lms/04_RBAC.md).

## LMS: what's built vs. what's next

Built and fully working end to end: multi-role registration (email/password + Google/
Facebook/LINE), email verification, password reset, course creation (teacher and up),
public catalog, enroll → bank-transfer payment → admin verification → active, teacher
attendance check-in, and the leave request/approve/reject flow — with an audit log
entry on every mutation.

**Deliberately deferred** (these were still open policy questions in the source
spreadsheet, not implementation gaps — see [`docs/lms/01_PRD.md §7`](./docs/lms/01_PRD.md#7-phase-2-roadmap-deferred-from-sheet2)):
Credit/Term package purchasing, a formal placement-test workflow, waitlists, teacher
payroll, financial reporting/export, and LINE Notify push reminders.

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
