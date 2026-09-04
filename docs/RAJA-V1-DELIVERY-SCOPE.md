# Raja Enterprises — V1 Delivery Scope

**Companion to** `RAJA-WEBSITE-REDESIGN-SPEC.md` · **Status:** for approval
**Purpose:** remove every ambiguity from the first client delivery.

Approve this and "Implement V1" is unambiguous.

---

## 0. Readiness facts this document is built on

Measured in the repository, not estimated.

| Fact | Value | Consequence |
|---|---|---|
| Assets cleared `raja-original` | **4** — and all four are frames from the single AICOG 2019 hero film (`raja-hero-poster`, `aicog-2019-tent-city-dawn`, `raja-hero-loop` + mobile cut) | **Zero project photography exists** |
| Assets `licensed` (stock) | 11 | Illustrative only, never evidential |
| `public/uploads/` | **empty** | Raja has uploaded nothing |
| `media` table | **0 rows** | Media library never used |
| `enquiries` table | **0 rows** | No enquiry has ever been received — consistent with `/contact` returning 500 |
| `records` table | 6 rows, **all `inventory`** | Inventory is now DB-authoritative; editing `content/inventory.ts` no longer changes the site |
| `settings` table | 0 rows | Contact, stats and hero still come from seed |
| Unresolved content records | **6** | Listed in §2.4 |

### 0.1 A defect found during this pass

`content/types.ts` `ImageAsset` has **no `clearance` field**, and four
collections use it: `clients.logo`, `events.image`, `inventory.image`,
`legacy.image` — roughly 28 images.

The clearance gate in `content/media.ts` therefore covers only `works`,
`capabilities`, `process` and `site`. **Around half the site's imagery bypasses
the gate entirely.** The system is sound; its coverage is not. Closing this is a
V1 task (§9 step 3) because the publish gate in §4 depends on it.

---

## 1. The actual V1 website

Ten routes plus a 404. Nothing is included because it might be useful later.

### 1.1 `/` — Home  · **FROZEN**

| | |
|---|---|
| **Purpose** | Positioning, proof, conversion |
| **Sections** | Unchanged — Hero · Legacy · Capabilities · Works · Resources · Process · Events · RecentExecutions · Clients · Footer |
| **Content** | Exists |
| **Raja must provide** | Nothing |
| **CMS** | capabilities, inventory, process, clients, collage, projects, events, settings |
| **CTA** | Request a site visit → `/contact` |
| **SEO** | `Raja Enterprises — Event Infrastructure Company in Bengaluru \| Since 1977` |
| **Priority** | **P1** — mobile responsiveness only |

### 1.2 `/about`

| | |
|---|---|
| **Purpose** | Prove Raja owns the assets and employs the crew |
| **Sections** | AboutHero · AboutTimeline · AboutMilestones · AboutInventoryBento · AboutPrinciples · **+ closing CTA (new)** |
| **Content** | Exists |
| **Raja must provide** | Headcount ruling — 300 vs 460 (§2.4 #2) |
| **CMS** | settings.stats |
| **CTA** | View inventory → `/inventory` |
| **SEO** | `About Raja Enterprises — Owned Event Infrastructure & In-House Crew` |
| **Priority** | **P3** — already complete; add CTA, verify responsive |

### 1.3 `/legacy`

| | |
|---|---|
| **Purpose** | Turn 49 years into a delivery-risk argument |
| **Sections** | LegacyHero · Origins · Pivot · Evolution · Trust · **+ closing CTA (new)** |
| **Content** | Exists |
| **Raja must provide** | Nothing for V1 (archive photographs would improve it — not blocking) |
| **CMS** | collage, clients |
| **CTA** | See projects → `/projects` |
| **SEO** | `Raja Enterprises Since 1977 — 49 Years of Event Infrastructure` |
| **Priority** | **P3** — motion on 4 sections + responsive |

### 1.4 `/inventory`

| | |
|---|---|
| **Purpose** | The owned-asset proof behind every claim on the site |
| **Sections** | InventoryHero · InventoryCatalog · InventoryEstimator · InventoryCompliance · **+ closing CTA (new)** |
| **Content** | Exists — **note: DB-authoritative, edit via admin not `content/`** |
| **Raja must provide** | 3 missing capacity figures (§2.4 #4–6); compliance/certification documents if any |
| **CMS** | inventory (already written) |
| **CTA** | Request a site visit → `/contact` |
| **SEO** | `Event Infrastructure Inventory — German Hangers, Flooring, Staging \| Raja Enterprises` |
| **Priority** | **P3** — motion on 3 sections + responsive |

### 1.5 `/services` — **NEW**

| | |
|---|---|
| **Purpose** | Name what Raja sells in the buyer's words; route to detail |
| **Sections** | Masthead · Service grid (5 cards) · Grouped capabilities · Owned-not-rented stat band · CTA |
| **Content** | **Partially exists** — derived from `inventoryCatalog` + `inventorySchedule.services` |
| **Raja must provide** | Confirmation on **scaffolding** and **weddings/social** (§2.4 #7–8) |
| **CMS** | `services` (new collection) |
| **CTA** | Request a site visit |
| **SEO** | `Event Infrastructure Services — Hangers, Stalls, Flooring, Staging \| Bengaluru` |
| **Priority** | **P4** |

### 1.6 `/services/german-hangers` — **NEW**

The only dedicated service page in V1. Reasoning in §5.

| | |
|---|---|
| **Purpose** | Own the highest-intent term Raja can legitimately claim |
| **Sections (V1)** | Hero · What it is · Capacity · What comes with it · CTA |
| **Sections deferred** | Where it has been built *(needs projects)* · Specification notes *(needs data)* · FAQ *(needs data)* |
| **Content** | Capacity exists (5,00,000 sq ft). Descriptive copy to be written from existing material. |
| **Raja must provide** | Span/wind/load/anchoring specs; 4–6 real customer questions |
| **CMS** | `services` |
| **CTA** | Request a site visit |
| **SEO** | `German Hanger Rental & Temporary Structures in Bengaluru \| Raja Enterprises` |
| **Priority** | **P4** |

### 1.7 `/projects` — **REBUILT**

Index only. No detail pages in V1 — see §4.

| | |
|---|---|
| **Purpose** | Turn 49 years of work into browsable, honest evidence |
| **Sections** | PortfolioHero · Sector filter · **Fact-led project index** · PortfolioMatrix · Client roster · CTA |
| **Content** | **Exists and is strong** — 7 `notableEvents` records carry client, sector, venue, year, attendance, covered area, turnaround, security level, scope, equipment |
| **Raja must provide** | Photographs (not blocking for V1 — see §4) |
| **CMS** | `projects` (unified model), `clientEvents` |
| **CTA** | Request a site visit |
| **SEO** | `Projects — Government, Exhibition & Cultural Event Infrastructure \| Raja Enterprises` |
| **Priority** | **P4** |

### 1.8 `/locations`

| | |
|---|---|
| **Purpose** | State honestly that Raja is Bengaluru-based and deploys nationally |
| **Sections** | Masthead · Delivered-in list · Fleet & crew statement · Contact block · CTA |
| **Content** | Exists |
| **Raja must provide** | Confirm the office address is current |
| **CMS** | settings.contact |
| **CTA** | Contact |
| **SEO** | `Where We Work — Bengaluru & Pan-India Event Infrastructure` |
| **Priority** | **P5** |

### 1.9 `/careers`

| | |
|---|---|
| **Purpose** | Recruit crew; secondarily prove the in-house claim |
| **Sections** | Masthead · "The crew is the company" · Disciplines · **Roles (renders only if non-empty)** · Application CTA |
| **Content** | Exists |
| **Raja must provide** | Vacancy list **or** confirmation there are none (§2.4 #1) |
| **CMS** | `roles` (new) |
| **CTA** | Send an application |
| **SEO** | `Careers at Raja Enterprises — Event Infrastructure Crew, Bengaluru` |
| **Priority** | **P5** |

### 1.10 `/contact` — **HIGHEST COMMERCIAL PRIORITY**

| | |
|---|---|
| **Purpose** | Convert. The only conversion path on the site. |
| **Sections** | Masthead · Enquiry form · Direct contact · What happens next · Map |
| **Content** | Exists |
| **Raja must provide** | Confirm phone/email/address; say where notifications go |
| **CMS** | settings.contact; enquiries inbox |
| **CTA** | Submit the enquiry |
| **SEO** | `Contact Raja Enterprises — Event Infrastructure, Bengaluru` |
| **Priority** | **P1** — currently returns 500; every enquiry is being lost |

### 1.11 `/not-found` — **NEW**

Branded 404 with search-free routing back to `/`, `/services`, `/projects`,
`/contact`. Required because `/portfolio` and `/events/*` are being redirected.
**Priority P5.**

### 1.12 Not in V1

`/projects/[slug]` · the other four service pages · `/locations/bengaluru` ·
`/resources` · testimonials · certifications. All in V1.1/V2 per the spec §11.

---

## 2. Content readiness matrix

Strict. "Placeholder allowed" means the existing `<Placeholder>` component
renders a visible, honest gap — never invented content.

### 2.1 Pages

| Page / Section | Content exists | Needs Raja | Placeholder allowed | Blocker? |
|---|---|---|---|---|
| Home — all sections | ✅ | — | — | No |
| About — all 5 | ✅ | headcount ruling | ✅ | No |
| Legacy — all 5 | ✅ | archive photos *(optional)* | ✅ | No |
| Inventory — hero, catalog, estimator | ✅ | — | — | No |
| Inventory — compliance | ⚠️ partial | **certification documents** | ✅ | No |
| Inventory — capacity lines ×3 | ❌ | **3 capacity figures** | ✅ | No |
| Services — hub grid | ⚠️ derived | scaffolding + weddings ruling | ❌ | **Yes** |
| German hangers — hero, what, capacity, bundle | ✅ | — | — | No |
| German hangers — specs | ❌ | **span/wind/load/anchoring** | — *(omit section)* | No |
| German hangers — FAQ | ❌ | **4–6 real questions** | — *(omit section)* | No |
| Projects — index facts | ✅ | — | — | No |
| Projects — photography | ❌ | **cleared photographs** | ✅ *(§4 fallback)* | No |
| Projects — detail pages | ❌ | **cleared photographs** | ❌ | **Yes — deferred** |
| Locations — delivered-in | ✅ | address confirmation | — | No |
| Careers — disciplines | ✅ | — | — | No |
| Careers — vacancies | ❌ | **list or "none"** | ✅ *(open-application block)* | No |
| Contact — details | ✅ | confirm current | ❌ | **Yes** |
| Contact — notification target | ❌ | **email / WhatsApp** | ❌ | **Yes** |

### 2.2 What Raja must provide before V1 can complete

**Blocking (4):**

1. **Confirm contact details** — phone, landlines, email, address. Currently
   marked *"Confirm these are current before launch"* in `content/company.ts`.
2. **Where enquiry notifications go** — email address, WhatsApp number, or both.
3. **Does Raja do scaffolding?** Yes/no. Determines the services grid.
4. **Are weddings and social events still pursued?** Yes/no. Same.

**Non-blocking but reduces quality (5):**

5. Headcount ruling — 300 field workforce vs 460 total
6. Three missing inventory capacity figures
7. Confirmation of the corrected client-event organisation names
8. Vacancy list, or explicit "none currently"
9. Certification / compliance documents, if any exist

**The single biggest quality lever, not blocking V1:**

10. **Photographs.** Four frames from any live job — bare ground, mid-build,
    complete and empty, event live. Zero currently exist. These unlock
    `/projects/[slug]`, service evidence sections, and location pages.

### 2.3 What we will not fabricate

Project facts · client names · project photographs · certifications ·
testimonials · capacities · historical claims · locations worked in ·
services offered · headcount · turnaround times · security classifications.

Where any of these is missing the section either renders `<Placeholder>` or is
omitted from V1 entirely. Both are recorded above. This rule is already encoded
in `content/` and is not negotiable in V1.

### 2.4 The 6 open content records

| # | Module | Issue |
|---|---|---|
| 1 | careers | Office & accounts — no vacancy list supplied |
| 2 | capabilities | Headcount: 300+ field workforce vs 460 in-house |
| 3 | clientEvents | Confirm corrected org names (BANAGLORE→Bengaluru, ORGANAIZATION, BORAD→Board) |
| 4–6 | inventorySchedule | Three items named with no capacity figure |

---

## 3. "Dynamic website" — final definition

### 3.1 CMS-managed — Raja changes these without a developer

| Collection | What Raja controls | V1 |
|---|---|---|
| `projects` | Add/edit/reorder/unpublish projects; all facts; photographs | ✅ |
| `services` | Title, summary, body, image, order | ✅ |
| `capabilities` | The four homepage cards | ✅ existing |
| `inventory` | Tiles and catalogue entries | ✅ existing |
| `process` | The three build stages | ✅ existing |
| `clients` | Logos and names | ✅ existing |
| `collage` | Legacy photographs | ✅ existing |
| `clientEvents` | The engagements roster | ✅ existing |
| `roles` | Job openings — add, close, remove | ✅ new |
| `seo` | Title, description, OG image per route | ✅ new |
| `settings` | Phone, email, address, hero headline, the four stat figures | ✅ existing |
| `media` | Upload photographs and video; auto WebP + hashed filename | ✅ existing |
| `enquiries` | Read-only inbox | ✅ existing |

### 3.2 Developer-controlled — code and design

Page structure and section order · design tokens, type scale, colour, spacing ·
motion behaviour · navigation labels and IA · route creation · templates ·
the sector taxonomy (4 values — changing it changes filters and URLs) ·
clearance rules · form fields and validation · schema and redirects.

### 3.3 Future operating system — excluded

Receivables · job management · job costing · stock levels, availability,
dispatch, returns, condition · procurement · manpower and payroll · fleet ·
internal CRM, quoting, rate cards · tender intelligence · dashboards ·
analytics · any internal workflow.

**Boundary rule:** the website CMS holds *published* facts Raja is happy to
advertise. It never holds *operational* facts. If a field would change because
of a job running today, it does not belong here.

### 3.4 Deliberate CMS restraint

No page builder. No block editor. No arbitrary section composition. Raja edits
records inside a fixed, designed structure. This is what keeps a premium site
premium after six months of client edits.

---

## 4. Projects — V1 decision

### 4.1 Decision

| Route | V1 | Reason |
|---|---|---|
| `/projects` | ✅ **Ship** | The facts are real, rich and already written |
| `/projects/[slug]` | ❌ **Defer to V1.1** | **Zero cleared photographs exist.** A project page whose evidence is stock photography of somebody else's event is a false claim. |

### 4.2 The V1 fallback — a fact-led index

Because there are no photographs, the index leads with what *is* real and
happens to be more persuasive than imagery to this buyer:

- **Card face:** project title · client · year · venue
- **Fact strip:** covered area · attendance · turnaround · security level
- **Typographic treatment**, not photographic — the existing type scale, tint
  system and `growRule` dividers carry the design
- Imagery used **only** where clearance is `raja-original` or `client-approved`
- Sector filter across the four real sectors
- `PortfolioMatrix` retained — a comparison table of scale is genuinely strong
  evidence and needs no photographs at all

This is not a degraded experience. *"1,50,000 sq ft covered, 50,000 attendees,
48-hour turnkey, Z+ protocol"* is a stronger claim than a stock photograph, and
it is true.

### 4.3 Unblocking `/projects/[slug]`

One project with a cleared hero image publishes the first detail page. The
route, template and schema ship dormant in V1 so V1.1 is content entry, not
development.

---

## 5. Services — final hierarchy

### 5.1 Test applied

A dedicated page requires all four: (1) Raja genuinely provides it,
(2) authoritative information exists, (3) real user value, (4) maintainable.

### 5.2 Final structure

| Service | V1 | Verdict | Test failed |
|---|---|---|---|
| **German hangers & temporary structures** | ✅ **Page** | Owned 5,00,000 sq ft; highest intent; most differentiated | — |
| Exhibition stalls | V1.1 page | Genuinely provided; needs depth | (2) |
| Event flooring & platforms | V1.1 page | Owned 10,00,000 sq ft; needs depth | (2) |
| Staging & seating | V1.1 page | Owned 1,00,000 sq ft; needs depth | (2) |
| Government events *(segment)* | V1.1 page | Strongest credential; needs project evidence | (2) |
| Temporary structures | Merged | Same product as hangers | — |
| Air conditioning / climate control | Section | Owned; bought as part of a structure | (3) |
| Barricades & crowd control | Section | Owned; rarely bought alone | (3) |
| Logistics & fleet | Section | A capability, not a purchase | (3) |
| Lighting & AV | Section | Only referenced within staging | (1)(2) |
| Catering | Section, flagged | Marked `provisional` in source | (2) |
| Manpower | Section on `/about` | The in-house argument, not a line item | (3) |
| **Scaffolding** | ❌ **None** | **Claimed nowhere in Raja's material** | **(1)** |
| Weddings & social | ❌ **Pending ruling** | On the old site, absent from all current positioning and every project | **(1)** |

**V1 ships one service page.** Four thin service pages would repeat exactly the
mistake §6 rejects for cities.

---

## 6. Locations — final strategy

### 6.1 Decision

**Only Bengaluru is justified, and it ships in V1.1, not V1.**

Every venue in Raja's project records is Bengaluru — Gayathri Vihar, Vidhana
Soudha, Kanteerava Stadium, Palace Grounds, GKVK Campus, BGS Campus — except
Hampi, MM Hills and Kanha Shanti Vanam.

### 6.2 Why Bengaluru is V1.1 not V1

It depends on the `city` field, which arrives with the project model migration,
and it should show real Bengaluru projects. `/locations` (the hub) ships in V1
and carries the local signal in the meantime via the contact block and
`LocalBusiness` schema.

### 6.3 Evidence required per location page

| Requirement | Bengaluru | Karnataka | Hyderabad | Others |
|---|---|---|---|---|
| ≥1 published project with `city` set | ✅ many | ⚠️ 2–3 | ⚠️ 1 | ❌ none |
| ≥1 cleared photograph | ❌ | ❌ | ❌ | ❌ |
| Named venues | ✅ 6 | ✅ | ✅ 1 | ❌ |
| Address / physical presence | ✅ | — | ❌ | ❌ |
| **Verdict** | **Build V1.1** | V2 | Defer | **Never, on current evidence** |

### 6.4 Rule for adding a city

One published project with `city` set, one cleared photograph, one named venue.
Then the page is generated from evidence rather than written from a template.
**Mumbai, Delhi, Chennai, Pune, Goa, Kolkata and Bhubaneswar do not qualify and
must not be built.**

---

## 7. Homepage — frozen boundary

### 7.1 Cannot change

Desktop composition at ≥`lg` · section order · the visual direction · type
scale and font choices · colour and tint system · the pinned Legacy curtain and
pinned Works stack *(behaviour, not breakpoint handling)* · the honeycomb
Clients layout · hero video treatment · card geometry, radii, shadows ·
copy tone and hierarchy.

### 7.2 May change

| Allowed | Detail |
|---|---|
| **Responsive** | Layout below `lg`: stacking, reflow, column collapse, gutters, touch targets, safe-area insets |
| **Responsive type** | Clamp values below `lg` only. Desktop scale is fixed. |
| **Motion implementation** | Fixing a broken pin, mobile fallbacks, `MOTION_COMPACT` gating, `release()` on completion. **Not new animations.** |
| **Content corrections** | Factual fixes via CMS — the six open records, corrected names, real figures |
| **SEO metadata** | Title, description, OG, canonical, schema — invisible to the design |
| **Performance** | Font weights, image `sizes`, lazy-loading, bundle reduction |
| **Accessibility** | Focus states, contrast fixes, alt text, landmarks, skip-link |
| **Defect fixes** | Overflow, z-index, hydration mismatches, layout shift |

### 7.3 Rule

If a change would look different on a 1440px desktop screenshot, it is out of
scope. Anything else is permitted.

---

## 8. Motion implementation matrix

All primitives from `motion/primitives.ts`. `/about` is the reference.
Reduced motion is handled globally by `MotionProvider` + the `motion-ready`
inline script: **no timeline registers at all**, content sits at natural
opacity. The column below records only per-section exceptions.

| Page | Section | Motion | Trigger | Mobile | Reduced motion |
|---|---|---|---|---|---|
| `/` | *all* | **unchanged** | — | fix pins + `MOTION_COMPACT` | global |
| `/about` | *all 5* | **unchanged — reference** | entrance | already correct | global |
| `/about` | Closing CTA | `fadeUp` | `entranceTrigger` | same | global |
| `/legacy` | Hero | `revealLines` *(exists)* | mount | same | global |
| `/legacy` | Origins | `revealLines` + `growRule` | `entranceTrigger` | `fadeUp` only | global |
| `/legacy` | Pivot | `fadeUp` + `growRule` | `entranceTrigger` | same | global |
| `/legacy` | Evolution | `riseCard` stagger | `entranceTrigger` | stack, no h-scroll | global |
| `/legacy` | Trust | `land` stagger | `entranceTrigger` | 2-col grid | global |
| `/inventory` | Hero | `revealLines` + `countUp` *(exists)* | mount | same | global |
| `/inventory` | Catalog | `riseCard` stagger + `growRule` | `entranceTrigger` | table scrolls in container | global |
| `/inventory` | Estimator | **`countUp` on outputs** | on value change | same | **numbers set instantly** |
| `/inventory` | Compliance | `fadeUp` + `growRule` | `entranceTrigger` | same | global |
| `/services` | Masthead | `revealLines` | mount | same | global |
| `/services` | Service grid | `riseCard` stagger | `entranceTrigger` | 1-col, shorter stagger | global |
| `/services` | Grouped list | `fadeUp` | `entranceTrigger` | same | global |
| `/services` | Stat band | `countUp` | `entranceTrigger` | 2×2 | instant |
| `/services/german-hangers` | Hero | `revealLines` + `parallax` | mount / scroll | **no parallax** | global |
| `/services/german-hangers` | What it is | `fadeUp` | `entranceTrigger` | same | global |
| `/services/german-hangers` | Capacity | `countUp` | `entranceTrigger` | same | instant |
| `/services/german-hangers` | Bundle | `fadeUp` stagger | `entranceTrigger` | stack | global |
| `/projects` | Hero | `revealLines` *(exists)* | mount | same | global |
| `/projects` | Filter pills | **none** | — | h-scroll row | — |
| `/projects` | Index cards | `riseCard` stagger | `entranceTrigger` | 1-col | global |
| `/projects` | Matrix | `growRule` per row | `entranceTrigger` | own scroll container | global |
| `/projects` | Client roster | `fadeUp` | `entranceTrigger` | stack | global |
| `/locations` | Masthead | `revealLines` | mount | same | global |
| `/locations` | Venue list | `fadeUp` stagger | `entranceTrigger` | stack | global |
| `/locations` | Fleet | `countUp` | `entranceTrigger` | same | instant |
| `/careers` | Masthead | `revealLines` | mount | same | global |
| `/careers` | Disciplines | `fadeUp` stagger | `entranceTrigger` | stack | global |
| `/careers` | Roles | `riseCard` stagger | `entranceTrigger` | stack | global |
| `/contact` | Masthead | `revealLines` | mount | same | global |
| `/contact` | Form | `fadeUp` **once, on the group** | mount | same | global |
| `/contact` | Next steps | `fadeUp` stagger | `entranceTrigger` | stack | global |
| `/not-found` | — | **none** | — | — | — |

**No interior page pins.** Only the homepage. Adding pinned scroll elsewhere
would fight the nav scroll listener and flatten the homepage's distinctiveness.

**No parallax below `lg`, anywhere.**

---

## 9. Implementation order

Ordered by dependency and by commercial urgency, not by page.

| # | Step | Why here | Depends on |
|---|---|---|---|
| **1** | **Host migration** — persistent-volume Node host, `ap-south-1`, TLS, process manager, nightly DB + uploads backup, **restore tested** | `/contact` and `/admin` are 500. Enquiries are being lost every day. Nothing else matters until this is true. | Host + domain decision |
| **2** | **Launch-critical fixes** — real domain in `metadataBase`, rotate admin password, remove default from README, rate-limit the form, enquiry notification | Security and conversion | 1 |
| **3** | **Foundation** — add `clearance` to `ImageAsset`, migrate the 4 collections, unify the project data model, `services`/`roles`/`seo` collections + admin schemas | Everything downstream reads through this | — |
| **4** | **Shared templates** — `PageShell`/`PageMasthead`/`Band` responsive rebuild, `EnquiryForm` rebuild, `CallToAction`, service-page template, project-card template | Unblocks 3 existing pages and every new one at once | 3 |
| **5** | **Homepage responsive** — Legacy → Works → Inventory → Process → Resources → RecentExecutions → Clients → Footer | Approved and highest-traffic; design frozen | 4 |
| **6** | **`/contact`** — metadata, next-steps section, mobile form UX | Highest commercial value per hour spent | 4 |
| **7** | **Interior motion + responsive** — `/legacy` ×4, `/inventory` ×3, `/projects` ×2 | Uses the templates from 4 | 4 |
| **8** | **`/projects` rebuilt** — fact-led index, sector filter, matrix | Needs the unified model | 3, 4 |
| **9** | **`/services` + `/services/german-hangers`** | New pages, template already built | 4 |
| **10** | **`/locations`, `/careers`, `/not-found`, `/about` CTA** | Small, template-driven | 4 |
| **11** | **Fonts + performance** — drop Playfair, add Poppins 600, image `sizes` audit | Cheap, site-wide | — |
| **12** | **SEO** — `sitemap.ts`, `robots.ts`, `LocalBusiness` schema, breadcrumbs, per-page metadata, `/portfolio`→`/projects` and `/events/*`→`/projects/*` 301s | After routes are final | 8, 9, 10 |
| **13** | **Content entry** — close the 6 records, seed `services`/`seo` | Needs Raja's answers | Raja |
| **14** | **QA** — §10 acceptance | Last | all |

Steps 1 and 2 can begin immediately and are independent of every design decision.

---

## 10. Acceptance criteria

Objective. Each is pass/fail.

### Responsive
- No horizontal overflow on any route at **360, 390, 414, 768, 1024, 1440, 1920**
- Homepage desktop ≥`lg` is pixel-identical to the approved build
- All touch targets ≥44×44px; form inputs ≥16px font (no iOS zoom)
- Pinned homepage sections either pin correctly or fall back to normal flow — never half-pinned
- Safe-area insets respected on notched devices

### Visual consistency
- Every colour, radius, font and spacing value resolves from `globals.css` tokens — no literals
- Two font families, six weights, nothing else loads
- `Eyebrow`, `SectionTitle`, `Statement`, `CallToAction` used consistently on every interior page

### Motion
- Every animation uses a `motion/primitives.ts` export — no bespoke tweens
- Every timeline calls `release()` on completion
- No parallax and no pinning below `lg`
- `prefers-reduced-motion: reduce`: no timelines register; all content visible at natural opacity/position
- JS disabled: every page fully readable, no hidden content

### Accessibility
- Keyboard reachable throughout; visible focus on every interactive element
- Skip link works on all routes
- Body text ≥4.5:1 contrast, large text ≥3:1, in both themes
- One `<h1>` per page; heading levels not skipped
- Every image has meaningful `alt`, or `alt=""` where decorative
- Form inputs have real `<label>`s; errors linked via `aria-describedby`
- Zero critical axe violations

### Performance
- Lighthouse mobile ≥90 performance, ≥95 accessibility, ≥95 best practices, ≥95 SEO on `/`, `/services/german-hangers`, `/contact`
- LCP <2.5s, CLS <0.1, INP <200ms on a throttled mobile profile
- No layout shift from font swap
- All images via `next/image` with correct `sizes` (documented exceptions: SVG arcs, admin thumbnails)

### SEO
- Every route has a unique `title` and `description`; none duplicated
- `metadataBase` is the real domain; every canonical self-referencing and absolute
- `sitemap.xml` lists every published route; `robots.txt` allows all and disallows `/admin`
- `LocalBusiness` JSON-LD with address, telephone, geo; `BreadcrumbList` on detail pages; valid in Rich Results Test
- `/portfolio` and `/events/*` return **301**, not 404
- OG image renders correctly in a link preview

### Forms
- An enquiry submitted on production writes to `enquiries` **and** dispatches a notification
- Honeypot silently succeeds; rate limit rejects abuse without blocking real users
- Success and error states are visible and announced
- Server-side validation on every field; no reflection of user input

### CMS
- Login works; default password rejected
- Every V1 collection is creatable, editable, reorderable, unpublishable
- Image upload → WebP + content-hashed filename → renders on the public site
- An unpublished record disappears from the public site immediately
- Unknown keys survive a save (`clearance`, `status`, notes intact)
- A project without a cleared hero image **cannot be published**, and the admin says why

### Routes and errors
- Every route in §1 returns 200; `/admin` returns 200 when authenticated
- A nonexistent route returns the branded 404 with a 404 status
- No console errors or warnings on any route in production
- `npm run build` clean; `npm run lint` clean; `npm run inspect` and `npm run check:fallbacks` pass

### Content integrity
- `npm run audit:content` reports **zero blocking** records, or every remaining one renders a visible `<Placeholder>`
- No stock photograph is presented as Raja's own work
- No fabricated fact from the §2.3 list appears anywhere

### Deployment
- Runs on a persistent-volume host in `ap-south-1`
- TLS valid; HTTP redirects to HTTPS
- Nightly backup of `.data/` and `public/uploads/`, with **one restore actually performed and verified**
- Admin behind authentication; `/admin` excluded from `robots.txt` and the sitemap

---

## 11. Sign-off

Approving this document authorises implementation of §1 in the order of §9,
against the criteria of §10.

**Blocked until Raja answers §2.2 items 1–4.** Steps 1–5 and 7 of §9 can proceed
in parallel with those answers; steps 6, 9 and 13 cannot complete without them.

The homepage design remains frozen throughout. The internal operating system is
not part of this delivery.
