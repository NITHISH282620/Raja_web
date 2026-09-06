# Cloudflare + Neon — compatibility, cost and migration plan

**Date:** 2026-09-06
**Status:** architecture review. No code changed, nothing deployed.
**Supersedes:** `PRODUCTION-ARCHITECTURE.md` (Vercel Pro + Supabase, ≈$45/mo).

**Verdict: the architecture is viable, but the application cannot be deployed to
Workers as it stands.** Four hard incompatibilities exist. All four are already
being replaced by this plan, so the migration is bounded — but they are real
blockers, not adaptations, and none can be skipped.

---

## 1. Cloudflare compatibility matrix

Every Node-specific API in this repository, checked against the Workers runtime
with `nodejs_compat`.

| # | Where | API | Workers | Verdict | Smallest fix |
|---|---|---|---|---|---|
| 1 | `lib/db.ts:1` | `node:sqlite` `DatabaseSync` | **Non-functional stub** — imports, does nothing | ❌ **BLOCKER** | → Neon Postgres |
| 2 | `admin/actions.ts:212,230,244` | `node:fs/promises` write to `process.cwd()/public/uploads` | fs partially present; **no persistent writable disk** | ❌ **BLOCKER** | → R2 |
| 3 | `lib/db.ts:29,200` | `mkdirSync`, `process.cwd()` DB path | same | ❌ **BLOCKER** | removed with #1 |
| 4 | `lib/auth.ts:2` | `scryptSync` | `node:crypto` supported, **scrypt not confirmed** | ⚠️ **RISK** | → Web Crypto PBKDF2 |
| 5 | `package.json` | `sharp` (native addon) | Native addons unsupported | ⚠️ | → `images.unoptimized` |
| 6 | `admin/actions.ts:6` | `randomUUID` | ✅ supported | keep | — |
| 7 | `node:path` `join/dirname` | ✅ supported | keep | — |
| 8 | — | RSC / SSR / server actions / dynamic routes | ✅ via `@opennextjs/cloudflare` | keep | — |
| 9 | — | middleware | none exists | n/a | — |
| 10 | — | `@vercel/*`, `next/og`, `waitUntil` | none used | ✅ portable | — |

**On #5 — this one is free.** All 107 media files are already `.webp` (85) and
`.svg` (20), 15 MB total. They do not need runtime optimisation, so
`images: { unoptimized: true }` removes the `sharp` dependency at no visual
cost. **Cloudflare Images is not required**, which removes a $5/mo line item.

**On #4** — do not assume scrypt works. Web Crypto `PBKDF2` is available in
every runtime including Workers and Node, so moving to it removes the risk
*and* the portability problem in one change.

## 2. Runtime choice

**`@opennextjs/cloudflare` onto Workers**, not the legacy `next-on-pages`
Pages-only route. Pages is no longer the recommended path for a Next.js app that
needs SSR, server actions and ISR. OpenNext runs `next build` and adapts the
output; Wrangler runs it locally, which means the whole thing is testable before
any DNS is touched.

## 3. The cost question, answered honestly

### The free-tier ceiling that actually matters

| Limit | Workers **Free** | Workers **Paid ($5/mo)** |
|---|---|---|
| CPU per request | **10 ms** | 30 s (to 5 min) |
| Bundle size | **3 MiB** compressed | 10 MiB |
| Requests | 100k/day | unmetered |

**10 ms of CPU is the risk.** An RSC render plus a database round trip is
routinely more than that. Two things reduce the exposure:

- The public site is static/SSG. Static assets are served without invoking the
  Worker at all, so most traffic never spends Worker CPU.
- Only `/admin/*` and `/contact` are dynamic — low volume by nature.

**I will not claim the free tier is sufficient without measuring it.** The
honest position: deploy to Workers Free, measure CPU on the dynamic routes, and
if they exceed 10 ms, $5/mo is the fix. Budget for $5 and hope to spend $0.

### Neon free tier — and the condition attached to it

Free: **0.5 GB storage, 100 compute-hours/month**, autosuspend after 5 min idle.

Storage is a non-issue at this data volume. **Compute-hours are the trap:** 100
CU-hours is ~4 days of continuous running. If every public page render queried
Neon, trickle traffic through the day would keep the compute awake and blow the
budget in a week.

**Therefore ISR/static generation is not a performance choice here — it is the
thing that keeps Neon free.** Public pages are generated and cached; only admin
work and enquiry submissions wake the database.

### R2

15 MB of media against a 10 GB free allowance. Egress is free. **$0**, with room
for years of project photography.

### Total

| Component | Expected | Ceiling |
|---|---|---|
| Cloudflare Workers | **$0** | $5/mo if CPU exceeds 10 ms |
| Neon Postgres | **$0** | only if public pages are cached |
| R2 | **$0** | 10 GB free |
| Cloudflare Images | **not used** | — |
| Hostinger | ₹0 marginal | prepaid to 2029 |
| **Total additional** | **₹0 target, ≈₹420/mo (≈$5) realistic** | |

**One fact for the record, then I will stop raising it:** Hostinger Business at
≈₹70/mo marginal is cheaper than Workers Paid at ≈₹420/mo and needs none of the
four migrations above. The owner has ruled it out. Cloudflare + Neon is chosen
for scale-to-zero economics and portability, and remains far below the ≈₹3,800/mo
Vercel + Supabase option it replaces.

## 4. Authentication — no Supabase, no new vendor

Options considered against Workers compatibility, cost and maintenance:

| Option | Workers | Cost | Verdict |
|---|---|---|---|
| Supabase Auth | ✅ | $0–25 | Excluded by brief; adds a vendor for one feature |
| Auth.js v5 | ✅ | $0 | Works, but adds a dependency and an adapter for a four-user admin |
| **Own sessions, Web Crypto** | ✅ | $0 | **Chosen** |

**Keep the existing session model; replace the primitive.** `lib/auth.ts`
already implements sessions correctly — httpOnly cookie, server-side lookup,
expiry. Only the hash needs changing: `scryptSync` → Web Crypto **PBKDF2-SHA256**,
which exists in Workers and Node alike. Sessions move from SQLite to Neon.

That is a ~40-line change, adds no vendor, keeps the code portable, and removes
the scrypt uncertainty.

**Removed unconditionally:** `DEV_EMAIL` / `DEV_PASSWORD` in `lib/auth.ts:66-67`.
The current build falls back to a hard-coded password whenever
`RAJA_ADMIN_PASSWORD` is unset. The owner account will be created by a one-time
seed script that requires an env-supplied password and refuses to run without it.

## 5. Storage plan

| Bucket | Access | Contents |
|---|---|---|
| `raja-media` | **public read** | project images, client logos, service/solution media |
| `raja-documents` | **private, no public policy** | RFP / BOQ / event briefs |

Private access path — unchanged in principle from the previous design:
`request → session → role → ownership check → audit log → short-lived presigned URL`.
No URL exists until authorization has already passed, so there is nothing to
guess. Validation: extension allow-list, 8 MB cap, sanitised filename.

**Public media migration is deferred.** The 15 MB already ships in `public/` and
is served free from Cloudflare's edge. Moving it buys nothing today; new uploads
go to R2 from day one, and the existing set migrates only when the media library
needs to manage it.

## 6. Neon schema

The 19 models from the previous review carry over unchanged — they were designed
for plain Postgres, not for anything Supabase-specific, so nothing is lost by the
change of provider. Full table list and RLS-equivalent policy matrix in
`PRODUCTION-ARCHITECTURE.md` §8.

**One difference:** Neon has no Supabase-style RLS-with-JWT integration, so
authorization is enforced **in server code** with the database as a plain
Postgres. That is a genuine reduction in defence-in-depth and is stated plainly
rather than glossed: every query path must go through a repository layer that
takes the actor's role, and no route handler may build SQL directly.

**Still to collapse before migrating** (unchanged from previous review):
`works.ts` vs `projects.ts`; `clients.ts` vs `clientRoster.ts`;
three overlapping inventory modules.

## 7. Portability

Business logic must not import Cloudflare or Neon directly.

```
lib/db/index.ts        → repository interface (typed, provider-free)
lib/db/neon.ts         → Neon driver
lib/storage/index.ts   → storage interface: put / get / signUrl / delete
lib/storage/r2.ts      → R2 driver
lib/auth/index.ts      → session interface
```

Route handlers and server actions import only the interfaces. Swapping Neon for
another Postgres is one file; swapping R2 for S3 is one file.

## 8. Migration sequence

| # | Step | Gate |
|---|---|---|
| 1 | Remove `DEV_PASSWORD`; PBKDF2 via Web Crypto | admin login works locally, no fallback credential exists |
| 2 | `images.unoptimized`, drop `sharp` | visual diff clean at 8 widths |
| 3 | Repository + storage abstractions | app runs unchanged on SQLite behind the interface |
| 4 | Collapse the three duplicate sources of truth | one model each |
| 5 | Neon schema + migrations | tables exist, seed loads |
| 6 | Swap driver SQLite → Neon | e2e passes against Neon |
| 7 | Uploads → R2, documents private | unauthorized fetch denied |
| 8 | `@opennextjs/cloudflare`, local Wrangler | all routes render under workerd |
| 9 | Deploy to `*.workers.dev` staging | full public + admin test suite |
| 10 | **Measure CPU per dynamic route** | decides Free vs $5 Paid |
| 11 | Phone-first admin | verified at 390px |
| 12 | DNS cutover plan | only after written approval |

Steps 1–8 need no Cloudflare or Neon account and can start immediately.

## 9. WordPress and DNS — untouched

Nothing in this plan alters `rajaenterprises.co`. Staging runs on
`*.workers.dev`. WordPress stays live as the fallback.

Before any cutover, to be documented and verified: existing A/AAAA/CNAME, **MX,
SPF, DKIM, DMARC** (email must not break), TTL lowered ahead of the change, SSL
issued, www/non-www policy, and a tested rollback.

**Documented, not actioned** (per brief): the WordPress install reports 19
vulnerabilities, 21 pending plugin updates, and weekly-only backups. It is the
rollback target, so its health is worth attention before it is needed.

## 10. Failure modes

| Failure | Effect | Mitigation |
|---|---|---|
| Worker exceeds 10 ms CPU | 500s on dynamic routes | Measured at step 10; $5/mo Paid |
| Bundle exceeds 3 MiB | deploy fails | Measured at step 8; Paid raises to 10 MiB |
| Neon compute-hours exhausted | DB unavailable | Cache public pages; alert at 80% |
| Neon cold start after autosuspend | first admin request slow | Acceptable; public pages are cached |
| Neon down | admin + new enquiries fail | Public site serves cache; enquiry falls back to WhatsApp hand-off, so no lead is lost |
| R2 unavailable | uploads fail | Admin-only impact |
| No RLS backstop | a missed check is not caught by the DB | Repository layer is the only SQL path; role passed explicitly |
