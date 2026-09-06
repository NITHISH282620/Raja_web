# Production architecture review — Vercel + Supabase

**Date:** 2026-09-06
**Status:** design approved by owner; implementation not started
**Supersedes:** `HOSTING-ARCHITECTURE.md` (Hostinger Business, ~₹70/mo).
That recommendation was cheaper and remains technically sufficient. The owner
has chosen this architecture deliberately, and it buys things the cheap option
does not: managed Postgres without SQLite's single-writer limit, row-level
security as a database guarantee rather than application discipline, managed
auth, off-site backups, and upload reliability from a phone on mobile data.

---

## 0. What is in the repository today

Established by inspection, not assumption.

| Layer | Current state |
|---|---|
| Content | 22 modules in `content/`, ~3,500 lines of hand-maintained TypeScript |
| CMS-backed already | 7 collections: projects, capabilities, inventory, process, clients, events, collage |
| Database | SQLite via `node:sqlite`; tables `users, sessions, records, settings, media, enquiries, enquiry_files` |
| Auth | Own scrypt + session-cookie implementation in `lib/auth.ts` |
| Media | 107 files, 26 MB, served from `public/media` |
| Env | `RAJA_DB_PATH`, `RAJA_ADMIN_EMAIL`, `RAJA_ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ANALYTICS_ENDPOINT` |

**The store already has the right shape.** `lib/store.ts` reads a collection
from the database and falls back to the `content/` seed when it has never been
written. That indirection is why this migration is a data move rather than a
rewrite: presentation components already receive data, and never reach for a
content module themselves.

### Three duplicate sources of truth — must be resolved during migration

The brief says no duplicate source of truth. Three exist today and must be
collapsed *before* the data reaches Postgres, not carried in:

1. **`works.ts` (182 lines) vs `projects.ts` (514 lines).** Both describe Raja
   projects. `works.ts` drives only the homepage Works rail; `projects.ts` is
   canonical and has four consumers. → one `projects` table, Works becomes a
   *selection* of it via `homepage_config`.
2. **`clients.ts` vs `clientRoster.ts` (`CLIENTS_27`).** Two client lists; the
   honeycomb reads one, the store reads the other. → one `clients` table.
3. **`inventory.ts` vs `inventoryCatalog.ts` vs `inventorySchedule.ts`.** Three
   overlapping inventory shapes. → one `inventory` table; the schedule becomes
   rows with a `capacity` and a `verified` flag.

---

## 1. Architecture

```
                        ┌──────────────────────────────┐
   rajaenterprises.co   │  HOSTINGER                   │
   ──────────────────►  │  domain registrar + DNS      │
                        │  business email (MX)         │
                        │  (no application hosting)    │
                        └───────────────┬──────────────┘
                                        │ CNAME / A
                                        ▼
   git push          ┌──────────────────────────────────┐
   ────────────────► │  GITHUB (private)                │
                     │  source of record for CODE       │
                     └───────────────┬──────────────────┘
                                     │ deploy hook
                                     ▼
                     ┌──────────────────────────────────┐
                     │  VERCEL (Pro)                    │
                     │  Next.js 16 — RSC + server actions│
                     │  ├── public site  (ISR + tags)   │
                     │  └── /admin       (dynamic)      │
                     └───────────────┬──────────────────┘
                        server-side  │  service role / user JWT
                                     ▼
                     ┌──────────────────────────────────┐
                     │  SUPABASE (Pro)                  │
                     │  ├── PostgreSQL  content + leads │
                     │  ├── Auth        admin identity  │
                     │  ├── Storage     media + docs    │
                     │  └── RLS         row-level rules │
                     └──────────────────────────────────┘
```

## 2. Why each service exists

| Service | Specific job | Why not something already owned |
|---|---|---|
| **Hostinger** | Domain, DNS, business email | Already paid to 2029. Keeping it costs nothing and moving email is gratuitous risk. |
| **GitHub (private)** | Source of record for code | Already in place. Private is required — the repo carries business content. |
| **Vercel Pro** | Runs Next.js: RSC, server actions, ISR, image optimisation | Hostinger Single has no Node runtime at all. Vercel also gives per-branch previews, which is how the owner reviews before publishing. |
| **Supabase Postgres** | Single production database | Replaces SQLite, which cannot survive a read-only serverless filesystem — the exact defect that took `/contact` down in production. |
| **Supabase Auth** | Admin identity | Replaces hand-rolled scrypt sessions. Gives email OTP, which matters: the owner is on a phone and should not type a password. |
| **Supabase Storage** | Public media + private documents | Replaces `public/media` (redeployment required to add an image) and the SQLite blob column for RFP/BOQ. |
| **Supabase RLS** | Authorization in the database | Makes "a lead cannot read another lead's document" a property of Postgres, not of remembering to write a check. |

**Explicitly not added:** Fly.io, Neon, Redis, a second storage provider, a
second database. No requirement here needs any of them. Revisit only on a
measured production signal.

## 3. Recurring cost exposure

| Item | Cost | Note |
|---|---|---|
| Vercel Pro | **$20/mo** per seat | **Hobby forbids commercial use.** A lead-generating business site is commercial under Vercel's fair-use terms — so the current `raja-web-jet.vercel.app` deployment needs regularising regardless of this migration. |
| Supabase Pro | **$25/mo** | Free tier **pauses a project after 7 days of inactivity** — unacceptable for a site whose whole job is inbound leads. |
| Hostinger | ₹0 marginal | Already prepaid to 2029-05-07 |
| **Total** | **≈ $45/mo ≈ ₹3,800/mo** | Plus metered overage |

**Metered overage to watch:** Vercel data transfer beyond 1 TB at $0.15/GB;
Supabase storage beyond 100 GB and egress beyond 250 GB. At this site's traffic
neither should trigger, but they are uncapped by default — set spend limits.

For contrast, the superseded Hostinger Business option was ≈ ₹70/mo. The
difference (≈ ₹3,730/mo, ≈ ₹45,000/yr) is the price of managed Postgres, RLS,
managed auth and off-site backups. That is a legitimate purchase; it should be a
knowing one.

## 4. Failure modes

| Failure | Blast radius | Mitigation |
|---|---|---|
| Supabase down | Site serves last ISR cache; admin and new enquiries fail | Cache pages generously; enquiry form falls back to the WhatsApp hand-off that already exists, so a lead is never lost |
| Supabase project paused (free tier) | Total content outage | Pro plan; do not run production on free |
| Vercel down | Site down | Accepted. DNS at Hostinger means a static fallback can be pointed at quickly |
| RLS policy wrong | Data exposure | Policies tested by an automated suite that asserts each role's reads/writes, run in CI |
| Service-role key leaked | Full database access | Server-only env var, never `NEXT_PUBLIC_`, never imported into a client component; rotate on suspicion |
| Migration data loss | Content loss | Content stays in git until parity is verified; migration is additive and re-runnable |
| Signed URL leaked | One document exposed | Short TTL (60s), generated per request after a server-side authorization check, and logged |
| Vercel bill spike | Financial | Set spend limits in both dashboards |

## 5. Vendor lock-in

| Component | Lock-in | Exit |
|---|---|---|
| Postgres | **Low** | Standard Postgres; `pg_dump` restores anywhere |
| Supabase Auth | **Medium** | Users live in `auth.users`; exporting identities and re-hashing is real work. Mitigated by keeping `profiles` in our own schema keyed by user id |
| Supabase Storage | **Low–medium** | S3-compatible; files copy out |
| RLS policies | **Low** | Plain Postgres policies, portable |
| Vercel | **Medium** | ISR, image optimisation and server actions are Next-specific but not Vercel-specific; runs on any Node host — the Hostinger Business option remains a live exit |
| Next.js | **High, pre-existing** | Not introduced by this decision |

Worst case, the exit is: `pg_dump`, copy the storage bucket, deploy the same
Next app to a Node host. Days, not a rewrite.

## 6. Security model

**Identity.** Supabase Auth. Email OTP as primary (the owner is on a phone;
one-time codes beat typing a password), password as fallback for staff.

**Roles.** `OWNER`, `CONTENT_MANAGER`, `SALES`, `ADMIN`, stored on `profiles`
and mirrored into the JWT via a custom claim so RLS can read it without a join.

**Authorization is enforced twice, deliberately:**
1. **In Postgres** via RLS — the guarantee.
2. **In server code** before every mutation — the readable rule, and what
   produces the audit log entry.

UI hiding is not authorization and is never relied on.

**Public reads** use the anon key with RLS that exposes only `status =
'published'` rows. If that key leaks it grants exactly what a visitor already
sees.

**The service-role key is server-only.** Never `NEXT_PUBLIC_`, never imported
into a client component. Used only in server actions and route handlers.

**Documents.** Private bucket, no public policy. Access path:
request → session check → role check → ownership/assignment check →
audit log write → 60-second signed URL. A lead can never guess another lead's
URL because no URL exists until authorization has already passed.

## 7. Data flow

**Publish**
```
admin edits draft → server action (role checked) → UPDATE + audit_logs
→ revalidateTag('projects') → ISR regenerates → public page updated
```

**Lead**
```
visitor submits brief → server action → INSERT enquiry (+ document to private bucket)
→ triage band computed server-side → admin inbox → assign → notes → follow-ups
→ status: NEW → CONTACTED → QUALIFIED → SITE_VISIT → PROPOSAL → NEGOTIATION → WON/LOST
```
The WhatsApp hand-off stays: if the insert fails, the visitor still leaves with a
reference and a prefilled message. A lead is never lost to an outage.

**Media**
```
phone upload → server action validates type/size → Supabase Storage
→ media_assets row (alt text, clearance, category) → referenced by FK
```
`clearance` and the `projectEvidence()` gate carry over unchanged — a
representative image still can never become proof of a Raja engagement.

## 8. Design

### A. Schema (19 tables)

```
profiles(id→auth.users, full_name, role, active, created_at)

media_assets(id, storage_path, width, height, alt, clearance, category,
             credit, focal, uploaded_by→profiles, created_at)

clients(id, name, slug, logo_id→media_assets, website, sector, description,
        featured, approval_status, display_order)

projects(id, slug, name, client_id→clients, year, location_id→locations,
         category, summary, scope, narrative, hero_id→media_assets,
         provenance, featured, status, display_order)
project_media(project_id, media_id, position)          -- gallery, M:N
project_services(project_id, service_id)               -- M:N

services(id, slug, title, short_desc, full_desc, hero_id→media_assets,
         capabilities[], applications[], status, display_order)
solutions(id, slug, title, headline, summary, audience, category,
          scope[], hero_id→media_assets, status, display_order)
inventory(id, name, category, description, capacity, unit, specs jsonb,
          applications[], image_id→media_assets, verified, status, display_order)
locations(id, slug, city, state, lat, lng, blurb, verification,
          image_id→media_assets, status)

enquiries(id, reference, name, organisation, email, phone, event_type,
          event_date, city, venue, attendance, requirement, message,
          budget_band, band, status, assigned_to→profiles, created_at)
enquiry_notes(id, enquiry_id→enquiries, author→profiles, body, created_at)
followups(id, enquiry_id→enquiries, due_on, assigned_to→profiles, note, done)
documents(id, enquiry_id→enquiries, storage_path, filename, mime, bytes,
          uploaded_at)

seo_metadata(id, route UNIQUE, title, description, canonical, og_title,
             og_description, og_image_id→media_assets, robots)
redirects(id, source UNIQUE, destination, permanent, active)
site_settings(key PK, value jsonb, updated_by→profiles, updated_at)
homepage_config(key PK, value jsonb)   -- featured project/client/capability ids
audit_logs(id, actor→profiles, action, entity, entity_id, metadata jsonb, at)
```

Client names and media URLs are referenced by foreign key, never copied.
`roles`/`permissions` are a Postgres enum plus a policy matrix rather than two
join tables — four fixed roles do not justify the indirection.

### B. RLS

| Table | anon | SALES | CONTENT_MANAGER | OWNER/ADMIN |
|---|---|---|---|---|
| content tables | `SELECT` where `status='published'` | read | read + write drafts | full, incl. publish |
| `enquiries` | `INSERT` only | read all, update own assigned | – | full |
| `enquiry_notes`, `followups` | – | full on assigned | – | full |
| `documents` | – | read only via authorized signed URL | – | full |
| `profiles` | – | own row | own row | full |
| `audit_logs` | – | – | – | read only; inserts are server-side |

Publishing is a separate permission from editing, per the brief.

### C. Auth
Supabase Auth, email OTP primary. `profiles.role` mirrored into a JWT claim so
policies read it without a join. Sessions via `@supabase/ssr` cookies.

### D. Buckets
- `public-media` — public read, authenticated write. Project images, logos,
  service/solution media.
- `enquiry-documents` — **private, no public policy.** RFP/BOQ only. Reached
  solely through short-lived signed URLs issued after a server-side check.

### E. Admin — phone-first
360–430px is the design target, not an afterthought. Cards, not tables. Sticky
bottom action bar within thumb reach. One-column forms, 44px minimum touch
targets, explicit Draft/Published state on every screen. Desktop is a
progressive enhancement of the same layout.

### F. Public data access
Server components read through the anon key with published-only RLS. No
Supabase client ships to the browser on public routes.

### G. Publishing / revalidation
Cache tagged per collection (`projects`, `services`, …). A publish action calls
`revalidateTag`, so one page's publish does not invalidate the site.

### H. Migration
`content/*.ts` → idempotent seed scripts. Duplicates collapsed first (§0).
Only the 43 unreferenced media files that survive the image audit are uploaded —
notably **not** `capability-structure.webp` (PONCHO 2025) or
`capability-exhibition.webp` (Baku), which are not Raja's work.

**Stays static (correctly not in the CMS):** navigation structure, `types.ts`,
motion config, CTA label constants, `lib/` helpers. These are code, not content.

## 9. Rollback

Every step is reversible:

1. Content remains in git until Supabase parity is verified — the seed fallback
   in `lib/store.ts` is the rollback.
2. Migration scripts are idempotent and re-runnable.
3. Vercel keeps immutable deployments: promote the previous one to roll back.
4. Supabase Pro has PITR; take a manual snapshot before each migration step.
5. DNS stays at Hostinger, so the domain can be repointed independently.

Point of no return: deleting the `content/` modules. That happens only after
production has served Supabase-backed content for one full week.

## 10. Implementation sequence

| # | Step | Gate |
|---|---|---|
| 1 | Provision Supabase; set env vars in Vercel | project reachable |
| 2 | Schema migration + enums | tables exist |
| 3 | RLS policies + automated policy test suite | tests pass for all four roles |
| 4 | Storage buckets + upload/download paths | private bucket denies anonymous |
| 5 | Collapse the three duplicate sources of truth | one model each |
| 6 | Seed migration, `content/` → Postgres | row counts match; site identical |
| 7 | Repoint public reads at Supabase behind a flag | visual diff clean |
| 8 | Auth cutover to Supabase Auth | owner can sign in by OTP on a phone |
| 9 | Enquiries + documents to Postgres/Storage | submit → row → private download |
| 10 | Admin, phone-first, screen by screen | each verified at 390px |
| 11 | Audit logging across all mutations | every action recorded |
| 12 | Security suite (see brief) | unauthorized access fails |
| 13 | Vercel Pro; custom domain; DNS at Hostinger | HTTPS, www policy, canonical |
| 14 | Production verification | forms, uploads, admin, email, WhatsApp |
| 15 | Remove `content/` modules | one week after step 14 |

Steps 1 and 13 need credentials I do not have. Everything from 2 to 12 can be
authored and tested against a local Supabase instance first.
