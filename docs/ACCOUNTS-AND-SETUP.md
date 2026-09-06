# Accounts, ownership and free-tier operations

**Date:** 2026-09-06
**Companion to:** `CLOUDFLARE-NEON-ARCHITECTURE.md` — which holds the
compatibility matrix, schema, storage, auth and security model. This document
adds only what that one does not: who owns what, what must be created, and how
we know when a free tier is running out.

Deliberately not repeated here. One source of truth per fact.

---

## 1. Account inventory

| Service | Purpose | Account required? | Free tier? | Paid required? | Expected cost | Owner | Credentials needed | When |
|---|---|---|---|---|---|---|---|---|
| **Hostinger** | Domain, DNS, business email, WordPress fallback | ✅ exists | n/a — prepaid to 2029 | ❌ **do not upgrade** | **₹0 additional** | **Client** | hPanel login (client keeps); DNS edit access at cutover only | Cutover only |
| **Cloudflare** | Workers runtime, CDN, HTTPS, DNS if delegated | ✅ **to create** | ✅ Workers Free | ❌ not initially | **₹0** → $5/mo only if CPU > 10 ms | **Client-controlled email** | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` (scoped: Workers Scripts Edit, R2 Edit) | Step 8 |
| **Neon** | Production PostgreSQL | ✅ **to create** | ✅ 0.5 GB / 100 CU-hrs | ❌ not initially | **₹0** | **Client-controlled email** | `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` for migrations | Step 5 |
| **Cloudflare R2** | `raja-media` (public), `raja-documents` (private) | Same Cloudflare account — **no separate signup** | ✅ 10 GB | ❌ | **₹0** | Client | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, bucket names | Step 7 |
| **GitHub** | Private source of record | ✅ exists | ✅ | ❌ | **₹0** | Current account/org — **stays private** | Deploy token for Cloudflare, or Wrangler CLI from local | Step 8 |
| **Vercel** | Preview only | ✅ exists | ✅ Hobby | ❌ | **₹0** | Developer | none new | Already in use |

**Not created:** Supabase, Fly.io, Auth0, Neon paid, Workers Paid, Hostinger
Business, VPS, Cloudflare Images. None has a demonstrated requirement.

**Total additional recurring cost: ₹0.**

## 2. Ownership plan

The production system must not depend on a developer's personal account. A
client whose site is locked inside someone else's login does not own their site.

| Account | Owner | Developer access | Why |
|---|---|---|---|
| Hostinger | Client | Temporary, for DNS cutover | Already client's; domain and email must never depend on us |
| Cloudflare | **Client-controlled email**, developer invited as member | Member, not owner | Runtime + DNS. If this is lost, the site is gone |
| Neon | **Client-controlled email**, developer invited | Member | Holds every enquiry and all content |
| R2 | Inherits Cloudflare | — | Same account |
| GitHub | Current org/account | Full | Code, not business data |
| Vercel | Developer | Full | Preview only; disposable |

**Practical route:** create Cloudflare and Neon against a client-owned mailbox
(e.g. `admin@rajaenterprises.co`, which the Hostinger plan already provides),
then invite the developer as a team member. Ownership is correct from day one
rather than needing a risky transfer later.

**Secrets never travel through chat and never enter git.** They go into
Cloudflare Worker secrets (`wrangler secret put`) and a local `.env.local` that
is git-ignored. `.env.example` documents the names only.

## 3. Free-tier ceilings vs expected Raja usage

Owner uses the admin ~2–3×/week. Public traffic low. Data volume small.

| Resource | Free ceiling | Expected Raja | Headroom |
|---|---|---|---|
| Workers requests | 100,000/day | < 1,000/day | ~100× |
| **Workers CPU** | **10 ms/request** | **unknown — must measure** | ⚠️ **the one real risk** |
| Workers bundle | 3 MiB compressed | unknown — must measure | ⚠️ measure at step 8 |
| Neon storage | 0.5 GB | < 50 MB (text + a few hundred rows) | ~10× |
| **Neon compute** | **100 CU-hrs/mo** | **< 10 CU-hrs if public pages are cached** | ⚠️ **only if ISR holds** |
| R2 storage | 10 GB | 15 MB today | ~600× |
| R2 egress | Free | — | ✅ |
| R2 Class A ops | 1M/mo | hundreds | ✅ |

**Two numbers decide whether this stays free**, and neither can be settled by
reading documentation:

1. **Worker CPU per dynamic request.** RSC render + database round trip against
   a 10 ms budget. Measured at step 10.
2. **Neon compute-hours.** 100 CU-hrs is ~4 days of continuous compute. Safe
   only while public pages are served from cache and do not wake the database.

## 4. Monitoring — a checklist, not a platform

Weekly, from the two dashboards. Five minutes.

| Check | Where | Amber | Red → act |
|---|---|---|---|
| Workers requests/day | CF → Workers → Metrics | > 50k/day | > 90k/day |
| Worker CPU p99 | CF → Workers → Metrics | > 7 ms | > 10 ms → **Workers Paid $5** |
| Bundle size | deploy output | > 2.5 MiB | > 3 MiB → **Workers Paid** |
| Neon compute-hours | Neon → Usage | > 60 CU-hrs | > 90 → check caching first, then **Neon Launch** |
| Neon storage | Neon → Usage | > 350 MB | > 450 MB |
| R2 storage | CF → R2 | > 7 GB | > 9 GB |

**A red on CPU or compute-hours is a caching bug before it is a billing event.**
Check that public pages are still statically served before paying anything.

## 5. Conditions for spending money

Money is spent only against a measurement, never a forecast.

| Spend | Only when |
|---|---|
| Workers Paid $5/mo | Measured p99 CPU > 10 ms on a dynamic route **after** confirming the route should not be cached; **or** bundle > 3 MiB |
| Neon Launch | Compute-hours > 90/mo **after** confirming public pages are not waking the DB |
| R2 paid | Storage > 10 GB |
| Hostinger Business | Only if Cloudflare is abandoned entirely |
| Vercel Pro | Only if Vercel becomes production. It is not. |

## 6. DNS cutover plan

Nothing here runs until staging has passed the full test matrix **and** written
approval is given.

**Before touching anything — record current state:**

```
dig rajaenterprises.co A          dig www.rajaenterprises.co CNAME
dig rajaenterprises.co MX         dig rajaenterprises.co TXT      (SPF)
dig <selector>._domainkey.rajaenterprises.co TXT                  (DKIM)
dig _dmarc.rajaenterprises.co TXT                                 (DMARC)
```
Saved to `docs/dns-before-cutover.txt`, committed, before any change.

**Email is the thing that must not break.** MX, SPF, DKIM and DMARC are
untouched by this migration. Only A/AAAA/CNAME for the apex and `www` change.
Any DNS plan that alters an MX record is wrong.

**Sequence:**
1. Lower TTL on A/CNAME to 300 s; wait for the old TTL to expire.
2. Add the Worker custom domain in Cloudflare; verify HTTPS on the staging host.
3. Point apex + `www` at the Worker. Decide and enforce one canonical host.
4. Verify: HTTPS, canonical tags, sitemap, robots, `/contact` submit, admin
   login, **and send a test email in and out**.
5. Leave WordPress installed and reachable by its Hostinger URL for 30 days.
6. Restore TTLs.

**Rollback:** revert the A/CNAME records to the previous values recorded in
step 0. Because MX/SPF/DKIM/DMARC were never touched, email is unaffected by
either the cutover or the rollback. WordPress is still installed, so recovery is
a DNS change, not a restore.

## 7. Implementation order

Steps 1–4 need no external account and start now. Full sequence in
`CLOUDFLARE-NEON-ARCHITECTURE.md` §8.

| Phase | Needs an account? |
|---|---|
| 1. Remove `DEV_PASSWORD`; PBKDF2 via Web Crypto | ❌ |
| 2. `images.unoptimized`, drop `sharp` | ❌ |
| 3. Repository + storage abstractions | ❌ |
| 4. Collapse duplicate sources of truth | ❌ |
| 5. Neon schema + migrations | ✅ Neon |
| 6. Driver swap SQLite → Neon | ✅ Neon |
| 7. Uploads → R2 | ✅ Cloudflare |
| 8. OpenNext + Wrangler, `*.workers.dev` | ✅ Cloudflare |
| 9–10. Test + **measure CPU** | ✅ |
| 11. Phone-first admin | — |
| 12. DNS cutover | ✅ Hostinger, on approval |
