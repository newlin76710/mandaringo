# RBAC Matrix (v1)

Enforced in two layers: (1) route/layout guards in `app/(app)/**/layout.tsx` via
`auth()`, redirecting unauthorized roles; (2) every server action independently re-checks
the role/ownership before touching the database (never trust the UI having hidden a
button).

| Capability | SUPER_ADMIN | ADMIN | TEACHER | PARENT | STUDENT |
|---|:---:|:---:|:---:|:---:|:---:|
| View public course catalog | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register / login | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create/edit **own** Course | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create/edit **any** Course | ✅ | ✅ | ❌ | ❌ | ❌ |
| Archive Course | ✅ | ✅ | own only | ❌ | ❌ |
| Enroll a Student in a course | ✅ | ✅ (on behalf of) | ❌ | own students | self |
| Submit payment proof | ✅ | ✅ (on behalf of) | ❌ | own enrollments | own enrollments |
| Approve/reject payment | ✅ | ✅ | ❌ | ❌ | ❌ |
| Mark attendance | ✅ | ✅ | own courses | ❌ | ❌ |
| View attendance | ✅ | ✅ | own courses | own students | self |
| Submit leave request | ✅ | ✅ (on behalf of) | ❌ | own students | self |
| Approve/reject leave | ✅ | ✅ | own courses | ❌ | ❌ |
| CRUD Students | ✅ | ✅ | view own-course students | view/edit own | view/edit self |
| CRUD Parents | ✅ | ✅ | ❌ | view/edit self | ❌ |
| CRUD Teachers | ✅ | ✅ | view/edit self | ❌ | ❌ |
| Deactivate a Teacher/Admin | ✅ | teachers only | ❌ | ❌ | ❌ |
| Promote a user to Admin | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Audit Log | ✅ | ✅ | ❌ | ❌ | ❌ |

`Guest` (unauthenticated) can only see the public marketing site and the course catalog —
everything else redirects to `/login`.
