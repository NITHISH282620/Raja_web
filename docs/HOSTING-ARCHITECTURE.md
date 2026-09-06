# Production hosting architecture — decision record

**Date:** 2026-09-06
**Question:** does this application need Supabase, or additional paid infrastructure?
**Answer:** no. It needs a one-tier upgrade of hosting the client already owns.

---

## 1. What the client already has

| | |
|---|---|
| Plan | Hostinger **Single Web Hosting** |
| Domain | rajaenterprises.co |
| Status | Active |
| Expires | 2029-05-07 |
| Renewal | ₹8,592 per 48 months (≈ ₹179/mo) |
| Subscription | 16CYBbUkVsS1A2CKS |

Prepaid to 2029. Any recommendation that discards this is destroying value the
client has already paid for, so the question is not "what would we build
greenfield" but "what is the smallest change that makes the existing asset
sufficient".

## 2. What the application actually requires

Measured against this repository, not assumed.

| Requirement | Evidence |
|---|---|
| A persistent Node.js process | 9 dynamic routes (`/admin/*`, `/contact`) plus middleware; `next build` marks them ƒ, server-rendered on demand |
| Server actions | 6 files contain `"use server"` — the enquiry form, admin save, media, settings |
| Node **22+** | `lib/db.ts` imports `node:sqlite`, which ships in Node 22 and later |
| A writable filesystem that survives requests | SQLite database plus private RFP/BOQ attachments |
| Private file storage outside the web root | Uploaded briefs must not be guessable public URLs |

**Static export is not an option.** `output: "export"` would remove server
actions, every dynamic route and middleware — which means deleting the enquiry
form and the entire admin. That is the product, not an implementation detail.

**Measured production footprint** (`next start`, all routes exercised, 39 requests):

| | |
|---|---|
| Idle RSS | 131 MB |
| After exercising every route | 157 MB |
| **Peak RSS (VmHWM)** | **159 MB** |
| Threads | 27 |
| Served static | 1.7 MB |
| Inodes (`node_modules` + build + public) | ≈ 35,000 |

## 3. The exact blocker

**Hostinger Single Web Hosting does not support Node.js.**

Hostinger's own documentation lists Node.js support as *Business Web Hosting*
and *Cloud* plans only (plus VPS). Single and Premium are shared PHP/MySQL
tiers with no Node runtime. There is no configuration, workaround or build
setting that puts a persistent Node process on the Single plan.

That is the single blocker. Everything else the application needs, the next
tier up already provides.

## 4. What Business Web Hosting provides

From Hostinger's Node.js deployment documentation and plan specifications:

| Capability | Business plan | This app needs |
|---|---|---|
| Node.js versions | 18 / 20 / 22 / **24** | 22+ ✅ |
| Next.js SSR | Explicitly supported | ✅ |
| Persistent server process | Yes — server-side apps run persistently, with a Restart control | ✅ |
| Writable filesystem | `/home/{user}/domains/{domain}/nodejs`, **separate from `public_html`** | ✅ — and private by construction |
| RAM | **3 GB** | 159 MB peak → **≈5% used** |
| CPU | 2 cores | ✅ |
| Storage | 50 GB NVMe | 1.7 MB static + media ✅ |
| Inodes | 600,000 | ≈35,000 → 6% ✅ |
| Databases | Unlimited MySQL, 3 GB each | Available as a fallback ✅ |
| Backups | Daily + on-demand | ✅ — Single has none |
| CDN | Included | ✅ |
| Deployment | GitHub integration or file upload | ✅ |

The Node app directory sitting *outside* `public_html` is the important detail
for RFP/BOQ security: uploaded documents are not reachable by URL at all, which
is a stronger position than a public bucket with signed URLs.

## 5. Architecture comparison

Recurring cost is the **marginal** cost over what the client already pays.

### A. Existing Hostinger Single only
- **Feasible:** ❌ No. No Node runtime.
- **Cost:** ₹0
- **Verdict:** Impossible without deleting the enquiry form and admin.

### B. Hostinger Single + Supabase
- **Feasible:** ❌ No. Supabase supplies a database, not a Node runtime. The
  Next.js server still has nowhere to run.
- **Cost:** ₹0–2,100/mo for a database that cannot be reached.
- **Verdict:** Solves a problem we do not have while leaving the actual blocker.

### C. Hostinger **Business** upgrade, native stack ← **RECOMMENDED**
- **Feasible:** ✅ Fully. Node 22+, SSR, persistent process, persistent private
  filesystem, MySQL available, daily backups.
- **Cost:** ≈ **₹70/mo** (Business ≈₹249 vs Single ≈₹179). Upgrade is one-click
  in hPanel, pay only the difference, site stays live, prepaid term preserved.
- **Complexity:** Lowest. No data-layer rewrite; SQLite already works on a
  persistent disk.
- **Security:** Strongest for documents — uploads live outside the web root and
  are unreachable by URL. Auth is already server-side scrypt with session
  cookies.
- **Performance:** 159 MB against 3 GB; local Indian data centre, better latency
  to Bengaluru buyers than a US/EU serverless region.
- **Migration risk:** Low. One deployment target change.

### D. Vercel + Supabase
- **Feasible:** ✅ Technically.
- **Cost:** ₹0 on free tiers, but Supabase free pauses after 7 days idle — not
  acceptable for a production site — so realistically **$25/mo ≈ ₹2,100/mo**,
  and Vercel Pro at $20/mo if limits are exceeded.
- **Complexity:** Highest. Rewrites the entire data layer, auth and storage.
- **Migration risk:** High. Three moving systems instead of one.
- **Verdict:** ~30× the marginal cost of C, to solve a problem C does not have.
  Rejected. **This is the option that is easiest for a developer and worst for
  the client**, which is precisely what the brief said not to choose.

### E. Hostinger + another backend
- **Feasible:** ✅ but unjustified. No requirement exists that Business does not
  already meet.
- **Verdict:** Rejected — no demonstrated technical need.

## 6. Decision

**Architecture C.** Upgrade the existing Hostinger subscription from Single to
Business, pay the difference, and run the whole application there:

```
rajaenterprises.co   Hostinger Business  Next.js (Node 22+), SSR, server actions
                                          SQLite on the persistent Node volume
                                          RFP/BOQ uploads outside public_html
                                          Daily backups included
Vercel                                    preview / staging only, unchanged
```

**Supabase is not required.** Every capability it was proposed for —
PostgreSQL, auth, storage, row-level security — is already met: SQLite on a
persistent disk, server-side scrypt auth with session cookies, private
filesystem storage, and authorization enforced in server code.

Revisit only if one of these becomes true:
- concurrent write volume outgrows SQLite (unlikely at this traffic; MySQL is
  available natively on the same plan as the first fallback);
- the site needs multiple app instances, which breaks a single-file database;
- the client wants managed off-site backups beyond Hostinger's daily ones.

## 7. Open items to confirm at deployment

These are not blockers; they are things to verify on the real box rather than
assert from documentation:

1. Exact CPU/RAM enforcement on the Business tier under sustained load.
2. That the Node app process is not aggressively idled between requests.
3. SQLite write-lock behaviour on Hostinger's storage under concurrent submits.
4. Whether the GitHub deployment integration runs `next build` on the server or
   expects a prebuilt artifact.
