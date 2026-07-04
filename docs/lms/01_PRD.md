# Mandarin Go LMS — PRD (v1)

Source of truth for requirements: `20260507MG系統建置.xlsx` (Sheet1: field-level data
requirements; Sheet2: 76-item business-rule confirmation checklist — most rows were still
**unanswered questions** at the time of writing, not settled decisions). This document
records what we decided for v1, and what's explicitly deferred.

## 1. What this is

A learning-management platform for Mandarin Go (Chinese language school for children in
London/UK, remote-first). It sits alongside the existing marketing site
(`mandaringo.co.uk`) in the same repo, as a separate application under `app/(app)/*`.

v1 scope, confirmed with the founder on 2026-07-03:

- **Registration**: Teachers, Parents, and Students can all self-register their own
  accounts (a Student account is realistic for older learners — 中學華語 level).
- **Auth**: email/password + Google + Facebook + Line OAuth (OAuth apps to be supplied by
  the founder via `.env`; the code path works with any subset configured).
- **Course creation permission**: Teacher role and above (Teacher, Admin, Super Admin).
- **Payment model**: **direct course purchase**, not the Credit/Term-pack model Sheet2
  hints at (explicitly deprioritized for v1 — see [Phase 2](#7-phase-2-roadmap-deferred-from-sheet2)).
  Parent/Student enrolls in one course → order → bank transfer → admin verifies → active.
  Mirrors the `3v3` badminton association site's payment flow.
- **Attendance**: teacher check-in per course per date (打卡).
- **Leave**: student/parent submits a leave request per course+date; teacher approves/
  rejects; admin can override.

## 2. Roles (RBAC)

| Role | Description |
|---|---|
| `SUPER_ADMIN` | Founder / system owner. Everything Admin can do, plus manage other Admins. |
| `ADMIN` | Back-office staff. Manage students/parents/teachers/courses/payments/leave. |
| `TEACHER` | Can create/edit their own courses, mark attendance, approve leave for their courses. |
| `PARENT` | Manages one or more linked Student profiles, enrolls them in courses, pays, requests leave. |
| `STUDENT` | Can self-register (older students). Views own courses/attendance, requests leave. |

Full permission matrix: [`04_RBAC.md`](./04_RBAC.md).

## 3. Data captured (from Sheet1)

**Student**: 中文姓名/姓氏, 英文名/中間名/姓氏, 暱稱, 性別, 出生日期, 唯一學號
(`YYYYMM` + region + sequence, e.g. `202609A0001`), 電話, Email, 其他聯繫方式, 主要家長 +
關係, 特殊需求/過敏備註.

**Parent**: 中文姓名, 英文名, 性別, 電話, Email（唯一）, 其他聯繫方式 (Facebook/Line/
WhatsApp/WeChat handle), 出生日期, 國籍/居住地, 郵遞區號, 地址, 職業類別, 最高學歷, 次要
聯繫人 + 聯繫方式, 備註. One parent can have multiple students; a student can have more
than one guardian (many-to-many via `ParentStudent`).

**Teacher**: 中文姓名, 英文名/中間名/姓氏（護照拼法一致）, 性別, 電話, Email（唯一）, 出生
日期, 國籍/居住地, 戶籍地址/現居地址, 郵遞區號, 職業類別, 最高學歷, 緊急聯繫人, 履歷/證照
備註.

**Course**: 課程編號（開班日期+地區+課程種類+序號), 課程名稱, 課程介紹, 課程等級
（對應鑑別系統 Level 1–5）, 課程費用, 開始/結束日期, 課程說明（頻率/時長/上課方式）,
上限人數（2–5 人）, 目前人數（衍生值）, 主要/次要老師, 開課時間 + 時區, 主要地區,
教材 PDF 上傳（付款後才可下載）.

## 4. Assessment levels (Sheet1, 鑑別系統)

| Level | Description |
|---|---|
| 1 | 主題中文 — no spoken foundation |
| 2 | 漢字好好玩 — starting to read/write characters |
| 3 | 小學國語 — grades 1–6 grammar/composition |
| 4 | 中學華語 — secondary school |
| 5 | 大學/成人 |

v1 stores `Course.level` as this enum and lets admins/teachers set it manually on the
course. The full assessment **workflow** (試聽 → 老師評分 4 個維度 0–4 分 → 行政確認 →
家長異議複評) from Sheet2 items #9–16 is **Phase 2** — v1 has no placement-test flow.

## 5. What's explicitly NOT in v1 (see Phase 2 for why)

- Credit packs / Terms / auto-renewal
- Waitlist + auto-open-parallel-class logic
- Formal level-assessment workflow (试听/評分/複評)
- Teacher payroll calculation
- Class recordings, Zoom integration, per-session video links
- Redemption codes
- Financial/analytics reports & Excel export
- LINE Notify / push notifications (email only for v1)
- Multi-language LMS UI (v1 admin/portal UI is Traditional Chinese only — the marketing
  site's `en`/`zh-Hans`/`zh-Hant` i18n is unrelated and unaffected)
- 2FA (schema leaves room for it, not implemented)

## 6. Confirmed business decisions (from clarifying questions, 2026-07-03)

1. Repo: same repo as the marketing site, structured with a clear front/back-office split
   like `3v3` (`app/(app)/admin/*` for back office).
2. Payment/enrollment model: direct per-course purchase (not Credit/Term).
3. Database: Neon Postgres (same setup as `3v3`), via `@prisma/adapter-neon`.
4. OAuth: code wired for Google/Facebook/Line; founder supplies real Client ID/Secret in
   `.env` afterward. Missing credentials simply omit that provider's button — no broken
   buttons ship.

## 7. Phase 2 roadmap (deferred from Sheet2)

Grounded in the *unanswered* Sheet2 rows — these need real policy decisions from the
founder before they can be built, not just engineering time:

- Credit/Term pack purchasing + per-session credit deduction + carry-over rules (#17–26)
- Trial class (試聽) flow: mandatory?, free or charged?, auto-matched or manually arranged? (#9–11)
- Formal placement assessment + parent-requested re-assessment (#12–16, #67)
- Seat-hold timeout after enrollment before payment releases the seat (#30)
- Class-change / drop-class policy mid-term (#31–32)
- Waitlist thresholds + auto-suggest parallel class (#33–34, #71)
- Attendance lateness definition, no-show handling (#39, #45–46)
- Class recording ownership, retention period (#41–42, #48–49)
- Leave cutoff window, credit retention on late cancellation, per-term leave cap (#44–48)
- Term renewal windows + reminder cadence (#51–56)
- Teacher payroll: rate basis, full-absence-but-teacher-present pay, payout cadence (#64–67, #74)
- Admin role tiers beyond Super Admin/Admin (#73)
- Reporting/export module (#74, #76)
