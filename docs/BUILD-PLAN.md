# Build plan

What is being built, in what order, and what is deliberately being left until
later.

The homepage design is **approved and frozen**. Nothing in this plan changes it.

---

## 1. Live status — read this first

Deployed at `raja-web-jet.vercel.app`. Route check:

| Route | Status | |
|---|---|---|
| `/` `/about` `/inventory` `/portfolio` `/legacy` `/locations` `/careers` | `200` | fine |
| **`/contact`** | **`500`** | **the only conversion path on the site is dead** |
| **`/admin`** | **`500`** | **the whole CMS is dead** |

### Why

This is not a bug in the code. It is the architecture meeting the wrong host.

The admin writes to disk — SQLite at `.data/`, uploads at `public/uploads/`.
Vercel's serverless filesystem is read-only and ephemeral. The README already
warned about this in as many words.

`/contact` is *dynamic* (it reads `searchParams` for the `?sent=1` / `?error=1`
redirect), so `getContact()` runs at request time, opens SQLite, and crashes.
`/locations` calls the exact same function but is *static*, so it ran at build
time and got baked in — which is why it survives and contact does not.

**Consequence:** every enquiry submitted through the website is currently lost,
and nobody can edit any content. Fixing this is not an improvement, it is a
prerequisite. See Track 3.

---

## 2. Scope — now versus held

| | Now | Held |
|---|---|---|
| Homepage | Mobile responsive **only** — design frozen | — |
| Interior pages | Design + motion + scroll | — |
| Hosting | Move off serverless, restore contact + admin | — |
| Operations console | — | Phase 2 |
| Tender radar | — | Phase 2 |
| Project / service / city pages | — | Phase 2 |

**On "held".** These are sequenced, not withheld. Project pages need real
photographs; the tender work needs a job record; the console needs three years
of ledger. None of that exists yet, and shipping any of it against stock
imagery and guessed numbers would be worse than not shipping it. If asked, that
is the honest answer and it holds up.

---

## 3. Track 1 — homepage: mobile only

Design approved. **Do not restyle, recompose, or "improve" anything.** The only
work is making the approved composition hold below 1024px.

Responsive coverage today, measured as breakpoint usages per 100 lines:

| Section | Breakpoints | Lines | Per 100 | Risk |
|---|---|---|---|---|
| `Legacy.tsx` | 10 | 293 | **3** | **High** — pinned sticky curtain |
| `Resources.tsx` | 7 | 189 | **3** | Medium |
| `Works.tsx` | 16 | 370 | **4** | **High** — pinned card stack |
| `Process.tsx` | 10 | 229 | 4 | Medium |
| `Inventory.tsx` | 8 | 146 | 5 | Medium — bento grid |
| `RecentExecutions.tsx` | 9 | 158 | 5 | Medium |
| `Clients.tsx` | 25 | 359 | 6 | Low — honeycomb |
| `SiteFooter.tsx` | 19 | 230 | 8 | Low |
| `Capabilities.tsx` | 26 | 271 | 9 | Low |
| `Events.tsx` | 24 | 235 | 10 | Low |
| `Hero.tsx` | 18 | 88 | **20** | Lowest |

Density is a proxy, not proof — but the two lowest scores sit on the two most
structurally complex sections, and both depend on `position: sticky` with
pinned scroll. That is exactly what breaks on small viewports.

**Order of work:** `Legacy` → `Works` → `Inventory` → `Process` → `Resources` →
`RecentExecutions`. Test at 360, 390, 414 and 768.

- [ ] Legacy — pinned curtain behaviour below `lg`
- [ ] Works — card stack and scrub on touch
- [ ] Inventory — bento reflow
- [ ] Process — three-stage sequence stacking
- [ ] Resources — full-bleed stat rows
- [ ] RecentExecutions — card row
- [ ] Verify no horizontal overflow at any breakpoint (`npm run inspect`)
- [ ] Verify reduced-motion and no-JS still readable (`npm run check:fallbacks`)

---

## 4. Track 2 — interior pages: design and motion

### The gap

Every page has an animated hero. Almost nothing below the hero moves.

| Page | Animated | Not animated |
|---|---|---|
| `/about` | 5 of 5 — **complete** | — |
| `/legacy` | 1 of 5 | `LegacyOrigins` `LegacyPivot` `LegacyEvolution` `LegacyTrust` |
| `/inventory` | 1 of 4 | `InventoryCatalog` `InventoryCompliance` `InventoryEstimator` |
| `/portfolio` | 1 of 3 | `PortfolioGrid` `PortfolioMatrix` |
| `/locations` | via `PageShell` only | no bespoke components |
| `/careers` | via `PageShell` only | no bespoke components |
| `/contact` | via `PageShell` only | `EnquiryForm` |

**`/about` is the reference implementation.** All five of its components already
use the motion system correctly. Match its behaviour rather than inventing new
patterns per page.

### The vocabulary already exists

`motion/primitives.ts` exports a complete set. This work is *applying* it, not
designing it:

`fadeUp` · `fadeIn` · `riseCard` · `land` · `growRule` · `settle` ·
`revealLines` · `countUp` · `parallax` · `release` · `entranceTrigger` · `q`

with `EASE`, `DUR`, `STAGGER`, `SHIFT` in `motion/ease.ts`, and three gates:
`MOTION_OK`, `MOTION_DESKTOP`, `MOTION_COMPACT`.

### Assignment

| Component | Lines | Motion |
|---|---|---|
| `LegacyOrigins` | 64 | `revealLines` on the statement, `growRule` on the divider |
| `LegacyPivot` | 64 | `fadeUp` + `growRule` |
| `LegacyEvolution` | 106 | `riseCard` staggered across the era cards |
| `LegacyTrust` | 77 | `land` staggered on the trust points |
| `InventoryCatalog` | 203 | `riseCard` stagger on rows, `growRule` on dividers |
| `InventoryCompliance` | 94 | `fadeUp` + `growRule` |
| `InventoryEstimator` | 227 | **`countUp` on the output figures** — it already computes numbers, this is what `countUp` is for |
| `PortfolioGrid` | 229 | `riseCard` stagger, `parallax` on the imagery |
| `PortfolioMatrix` | 66 | `growRule` then `fadeUp` per row |
| `EnquiryForm` | 127 | `fadeUp` on field groups — but see below, this one is mainly a responsive job |

Every timeline goes behind `entranceTrigger` and calls `release()` on
completion, as the About components already do.

### Responsive weak points on the interior

Same measure, per 100 lines:

| Component | Per 100 | Note |
|---|---|---|
| `EnquiryForm` | **1.6** | thinnest on the entire site — and it is the conversion form |
| `PageShell` | **2.2** | carries `/locations`, `/careers` **and** `/contact` |
| `PortfolioMatrix` | 9 | |

Fixing `PageShell` fixes three pages at once. Do it first.

- [ ] `PageShell` responsive pass — unblocks locations, careers, contact
- [ ] `EnquiryForm` responsive pass — highest commercial value on the site
- [ ] Legacy: 4 components
- [ ] Inventory: 3 components
- [ ] Portfolio: 2 components

---

## 5. Track 3 — launch blockers

Verified against the repo. The first three stop launch.

| # | Finding | Where |
|---|---|---|
| 1 | **Hosting** — SQLite + filesystem writes cannot run on serverless; contact and admin are 500 | deployment |
| 2 | `SITE_URL` is the placeholder `https://rajaenterprises.example` — breaks canonicals and social previews | `app/(site)/layout.tsx` |
| 3 | Default admin password in source *and* published in the README | `lib/auth.ts:67` |
| 4 | No `sitemap.ts`, no `robots.ts`, no JSON-LD | — |
| 5 | No rate limit on the enquiry form — the only unauthenticated write path | `app/(site)/contact/actions.ts` |
| 6 | Playfair Display loads 4 weights, referenced nowhere | `app/(site)/layout.tsx` |
| 7 | `font-semibold` (600) used 82× incl. every `SectionTitle`, but Poppins loads only 400/500/700 — synthesised or snapped | `app/(site)/layout.tsx` |
| 8 | 6 unresolved content records | `npm run audit:content` |

6 and 7 are a single edit: dropping the dead family and adding the missing
weight is a **net reduction of three font files** and fixes the rendering of
every section heading on the site.

**Hosting target:** a normal Node host with a persistent volume, in `ap-south-1`.
The enquiry form collects names, emails and phone numbers from Indian data
principals, so in-region hosting keeps DPDP obligations straightforward.
Nightly backup of the database and uploads, and a restore actually tested.

---

## 6. Held for Phase 2

Planned, costed, not started. Each is blocked on something real.

| Item | Blocked on |
|---|---|
| Operations console — money, jobs, stock, pipeline | Three years of job ledger |
| Photo capture discipline on jobs | A live job to capture |
| Project pages | Real photographs, which come from the photo card |
| Service pages | A rate card |
| City pages | Evidenced work in that city — build Bengaluru only, add a city when a real job lands there |
| Tender radar | Nothing technical; it is simply after the site |

The order matters: the console produces the photographs and job records that
the project and service pages need. Building those pages first means building
them twice.

---

## 7. Sequence

| Phase | Work | Done when |
|---|---|---|
| 1a | Track 3 blockers 1–3 | Contact form accepts an enquiry on the real domain |
| 1b | Track 1 homepage mobile | No overflow at 360–768, pinned sections behave |
| 1c | Track 2 interior pages | Every page has motion below the hero |
| 1d | Track 3 blockers 4–8 | Indexed, hardened, fonts correct |
| 2 | Held items above | — |

1a is genuinely urgent and independent of everything else. Enquiries are being
lost right now.

---

## 8. Open questions

1. What is the real domain, and who controls the DNS?
2. Which host — the site needs a persistent volume, so the current one will not do
3. Is `/about` the agreed motion reference for the other pages?
4. Are the six open content records answerable, or do they need the client?
5. How much photography of past work already exists?
