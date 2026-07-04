# ERD (v1)

Full column-level detail lives in [`prisma/schema.prisma`](../../prisma/schema.prisma) —
this is the relationship overview.

```
User ──1:1── Student
User ──1:1── Teacher
User ──1:1── Parent
User ──1:N── Account          (OAuth links)
User ──1:N── Session
User ──1:N── AuditLog

Parent ──M:N── Student   (via ParentStudent, carries `relationship` e.g. 媽媽/爸爸)

Teacher ──1:N── Course   (as primaryTeacher)
Teacher ──M:N── Course   (as secondary teacher, via CourseTeacher)

Course ──1:N── Enrollment
Student ──1:N── Enrollment
Enrollment ──1:1── Payment

Course ──1:N── Attendance
Student ──1:N── Attendance

Course ──1:N── Leave
Student ──1:N── Leave
Enrollment ──1:N── Leave   (leave is always against a specific enrollment/course)
```

Key design choices:

- `User` is the auth identity (email, password hash, role, OAuth accounts). `Student` /
  `Teacher` / `Parent` are **profile** tables holding the Sheet1 domain fields, each with
  an optional 1:1 `userId` — optional because a Student profile can exist without its own
  login (created by a Parent) or with one (self-registered older student).
- `ParentStudent` is a join table, not a foreign key on `Student`, because Sheet1 allows a
  student to have more than one recorded guardian and a parent to have several children.
- `Enrollment` and `Payment` are split 1:1 rather than merged, so Phase 2 can add
  multi-payment/installment support without reshaping `Enrollment`.
- `AuditLog` is a generic `(actorId, action, entityType, entityId, metadata, createdAt)`
  table written to on every create/update/delete/login/payment-decision, per the
  mega-spec's audit requirement — not a per-table shadow-history table (that's Phase 2 if
  full point-in-time history is needed).
