# Business Flow & State Machines (v1)

## 1. Registration → enrollment → payment (end to end)

```
Guest visits /courses (public catalog)
        ↓
Register (/register) — pick role: Teacher / Parent / Student
        ↓
Fill profile fields (Sheet1 required fields for that role)
        ↓
Verification email sent → click link → EmailVerified
        ↓
Login
        ↓
[Parent] add/select a Student profile under their account
   (a Student who self-registered already has their own profile — no separate step)
        ↓
Browse /courses → open a course → "Enroll"
        ↓
Pick which Student this enrollment is for
        ↓
System creates Enrollment (status PENDING_PAYMENT) + Payment (status PENDING)
        ↓
Screen shows bank transfer details (bank name/account/reference = enrollment code)
        ↓
User submits transfer proof: last-5-digits + transfer date
        ↓
Enrollment → CONFIRMING, Payment → CONFIRMING
        ↓
Admin back office: Enrollments queue, filter "Confirming"
        ↓
Admin verifies against the real bank statement, clicks Approve (or Reject)
        ↓
Approve → Enrollment ACTIVE, Payment PAID, confirmedAt/confirmedBy stamped
        ↓
Email sent to Parent/Student ("enrollment confirmed")
        ↓
Student now appears on the Course roster → Teacher can take attendance
```

Reject path: Admin can reject with a reason → Enrollment → CANCELLED, Payment → CANCELLED,
notify the payer by email.

## 2. State machine — Enrollment / Payment

```
                 ┌────────────────┐
                 │ PENDING_PAYMENT │  (created at enroll time)
                 └───────┬────────┘
                         │ user submits transfer proof
                         ▼
                 ┌────────────────┐
                 │   CONFIRMING    │
                 └───┬────────┬───┘
        admin reject │        │ admin approve
                      ▼        ▼
             ┌───────────┐  ┌────────┐
             │ CANCELLED │  │ ACTIVE │
             └───────────┘  └───┬────┘
                                 │ admin/parent cancels mid-course
                                 ▼
                          ┌────────────┐
                          │ WITHDRAWN  │
                          └────────────┘
```

`Payment.status` mirrors `Enrollment.status` 1:1 in v1 (`PENDING`, `CONFIRMING`, `PAID`,
`CANCELLED`) since each enrollment has exactly one payment (no partial/installment
payments in v1).

## 3. State machine — Leave request

```
┌───────────┐   teacher rejects    ┌──────────┐
│ SUBMITTED │ ────────────────────▶│ REJECTED │
└─────┬─────┘                      └──────────┘
      │ teacher approves
      ▼
┌───────────┐
│ APPROVED  │
└───────────┘
```

Admin can override either terminal state at any time (audit-logged). There is no
make-up-class scheduling in v1 (Sheet2 #48 — "no make-up mechanism, credit rolls to next
term" — is itself a Phase 2/Credit-model concept); a v1 leave record is purely an
attendance annotation (`Attendance.status = EXCUSED`) once approved.

## 4. State machine — Attendance (per course, per date, per student)

```
UNMARKED → PRESENT
         → LATE
         → ABSENT
         → EXCUSED   (set automatically when a Leave request for that date is APPROVED)
```

Only the teacher(s) assigned to the course (or an Admin) can mark attendance. Attendance
rows are created on demand when a teacher opens the roster for a date — there's no
pre-generated recurring session calendar in v1 (that's Sheet2's `CLASS_SESSIONS` /
Zoom-integration concept, Phase 2).

## 5. Business rules enforced in v1 (guardrails)

- A Student cannot be marked `ACTIVE` on an Enrollment without a `PAID` Payment — this is
  enforced in the same server-action transaction, not just in the UI.
- Course materials (PDF) are only downloadable by Students whose Enrollment for that
  course is `ACTIVE`.
- A Teacher can only create/edit Courses where they are listed as primary or secondary
  teacher (or is Admin/Super Admin).
- A Teacher/Admin cannot hard-delete a Teacher record who has taught any course —
  deactivate (`User.isActive = false`) instead, so historical course/attendance records
  keep a valid reference.
- Course materials are never hard-deleted once published — `Course.archivedAt` hides them
  from the catalog without breaking existing Enrollment history.
- Enrollment capacity: `Course.currentCount` (derived: count of ACTIVE + CONFIRMING
  enrollments) must stay `<= Course.maxCapacity` (2–5 per Sheet1); enroll action rejects
  once full.
