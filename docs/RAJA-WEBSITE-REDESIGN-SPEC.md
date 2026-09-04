# Raja Enterprises — Website Redesign Specification

**Status:** draft for approval · **Scope:** public website + website CMS only
**Homepage:** approved and frozen — see §0.2

---

## 0. Scope and rules

### 0.1 What this document covers

The public marketing website and the CMS that makes it editable. Nothing else.

"Dynamic website" is interpreted here as **a public website whose content Raja
can edit without a developer**. It is not the internal operating system. See
§12 for the explicit exclusion list.

### 0.2 The frozen homepage

`https://raja-web-jet.vercel.app/` is approved. The desktop composition, section
order, visual direction, typography and colour are **fixed**.

Permitted work on the homepage:

- mobile and tablet responsiveness
- responsive spacing and type-scale corrections
- genuine implementation defects
- performance and accessibility fixes that do not alter the composition

Not permitted: restructuring, resequencing, restyling, "improving", replacing
sections, or changing the desktop layout at any breakpoint above `lg`.

### 0.3 Deviations from the earlier SEO brief

The brief supplied earlier is good generic SEO advice. Three parts of it are
rejected here on evidence, and the reasoning is given at the point of decision:

| Earlier suggestion | Decision | Where |
|---|---|---|
| 9 city landing pages | **Rejected** — 1 built, others gated on evidence | §8 |
| `/event-scaffolding` page | **Rejected** — Raja does not claim scaffolding anywhere | §7 |
| `/lighting-av` page | **Downgraded to a section** — not a standalone claimed service | §7 |
| 8 blog articles | **Cut to 3** | §9.7 |
| `/portfolio` as the project route | **Changed to `/projects`** | §6.1 |

---

## 1. Audit of what exists

Measured against the repository at time of writing. Nothing was modified.

### 1.1 Routes

| Route | Render | State |
|---|---|---|
| `/` | Static | Approved, frozen |
| `/about` | Static | Complete — 5/5 sections animated |
| `/legacy` | Static | Partial — 1/5 sections animated |
| `/inventory` | Static | Partial — 1/4 sections animated |
| `/portfolio` | Static | Partial — 1/3 sections animated |
| `/locations` | Static | Thin — generic shell only |
| `/careers` | Static | Thin — generic shell, no vacancies |
| `/contact` | **Dynamic** | **500 on the live host** |
| `/events/[slug]` | SSG, 11 paths | Stub — placeholder body content |
| `/admin/*` | Dynamic | **500 on the live host** |

### 1.2 Design system — KEEP

`app/globals.css` defines a complete token layer under `@theme`:

- ink / paper / accent / brand-blue, six tint colours, three body greys
- radius scale (`card-sm` 10, `card-md` 15, `card-lg` 20, `pill` 66)
- `--spacing-gutter` 80px, `--container-frame` 1440px
- `--font-display` (Poppins), `--font-mono` (Roboto Mono)
- typographic classes `t-statement`, `t-body`, `t-eyebrow` etc.

This is coherent and sufficient. **No new design system.** Every new page draws
from these tokens.

### 1.3 Motion system — KEEP

`motion/primitives.ts` exports a complete vocabulary:

`fadeUp` · `fadeIn` · `riseCard` · `land` · `growRule` · `settle` ·
`revealLines` · `countUp` · `parallax` · `release` · `entranceTrigger` · `q`

`motion/ease.ts` exports `EASE`, `DUR`, `STAGGER`, `SHIFT` and three gates:
`MOTION_OK`, `MOTION_DESKTOP`, `MOTION_COMPACT`.

`MotionProvider` registers plugins; a synchronous inline script sets
`motion-ready` on `<html>` before paint so a no-JS or reduced-motion visitor
never sees hidden content. **This is a good system. Do not add a second one.**

### 1.4 Components — reusable inventory

| Component | Verdict |
|---|---|
| `Eyebrow`, `Statement`, `SectionTitle`, `Placeholder` | KEEP — use everywhere |
| `PageShell` (`PageMasthead`, `Band`) | **IMPROVE** — carries 3 pages, thinnest responsive coverage on the site |
| `WorkCard`, `InventoryTile`, `ClientEventList` | KEEP |
| `EnquiryForm` | **IMPROVE** — 2 breakpoints across 127 lines; it is the conversion form |
| `HeroMedia`, `PageTransition`, `SiteNav`, `CallToAction`, `Buttons` | KEEP |
| `about/*` (5) | KEEP — **the motion reference implementation** |
| `legacy/*` (5), `inventory/*` (4), `portfolio/*` (3) | IMPROVE — motion missing below hero |

### 1.5 Content model — REDESIGN (the main architectural finding)

**There are four overlapping models for what is conceptually one thing.**

| Module | Shape | Count | CMS? | Feeds |
|---|---|---|---|---|
| `content/works.ts` | `Project` | 4 | **yes** | homepage Works |
| `content/notableEvents.ts` | `NotableEvent` | 7 | no | `/portfolio` |
| `content/events.ts` | `RecentExecution` | 11 | no | homepage grid, `/events/[slug]` |
| `content/clientEvents.ts` | `ClientEvent` | 10 | yes | homepage table |

They describe the same real-world projects in incompatible shapes. Hampi Utsav
and GTE Expo each appear in two of them. Three of the four cannot be edited by
the client at all.

`NotableEvent` has by far the best field set — client, sector, venue,
attendance, covered area, turnaround, security level, scope highlights,
equipment deployed — and is the right basis for the unified model. **See §6.**

### 1.6 CMS — IMPROVE

Working today: SQLite via `node:sqlite`; `records` table (collection + JSON +
position + published); `settings`; `users`/`sessions`; `media`; `enquiries`.
Seed-fallback rule: a collection never written to falls back to `content/`.

Editable collections: `projects`, `events`, `capabilities`, `inventory`,
`process`, `clients`, `collage`. Settings: contact, stats, hero copy.

Field-schema-driven editor (`fields.ts`) with dot-path field names, and
unnamed keys preserved on save — so `clearance`, `status` and research notes
survive an edit. **This is well built.** Extensions needed in §5.

### 1.7 Media — KEEP

`content/media.ts` gates every asset by `clearance`
(`raja-original` · `client-approved` · `licensed` · `figma-supplied` ·
`research-only`). `publishable()` returns `null` for anything uncleared, so a
research image cannot reach production even if wired in by mistake.

Uploads are re-encoded to WebP via `sharp`, content-hashed into the filename.
Keep all of it.

**Constraint that shapes everything:** all current photography is licensed
stock, `clearance: "licensed"`, illustrative not evidential.

### 1.8 SEO — IMPROVE

| Item | State |
|---|---|
| Per-page `metadata` | Present on 6 of 7 — **`/contact` has none** |
| `metadataBase` | **Placeholder `https://rajaenterprises.example`** — breaks canonicals and OG images |
| JSON-LD | `Organization` only — no address or telephone, though `content/company.ts` now has both |
| `sitemap.ts` | **Missing** |
| `robots.ts` | **Missing** |
| Breadcrumbs | Missing |
| Image alt text | Present and well written throughout |
| OG images | Configured but pointing at the placeholder base |

### 1.9 Forms — IMPROVE

One public form: `submitEnquiry`. Length-capped per field, honeypot, silent
success on the honeypot path, nothing reflected back to the sender. Writes to
`enquiries`.

Missing: rate limiting (it is the only unauthenticated write path), and an
email or WhatsApp notification — an enquiry that nobody is told about is the
same as a lost enquiry.

### 1.10 Known defects

| # | Defect | Location |
|---|---|---|
| 1 | Host cannot run SQLite/filesystem writes; `/contact` + `/admin` are 500 | deployment |
| 2 | `SITE_URL` is a placeholder | `app/(site)/layout.tsx` |
| 3 | Default admin password in source and in the README | `lib/auth.ts:67` |
| 4 | No rate limit on the public form | `app/(site)/contact/actions.ts` |
| 5 | Playfair Display loads 4 weights, referenced nowhere | `app/(site)/layout.tsx` |
| 6 | `font-semibold` used 82× incl. every `SectionTitle`; Poppins loads only 400/500/700 | `app/(site)/layout.tsx` |
| 7 | `params` typed sync; Next 16 supplies a Promise | `app/(site)/events/[slug]/page.tsx` |
| 8 | `/events/[slug]` body is placeholder content | same |
| 9 | 6 unresolved content records | `npm run audit:content` |

Defects 5 and 6 are one edit: dropping the dead family and adding the missing
weight is a **net reduction of three font files** and fixes every heading.

### 1.11 Gap analysis summary

| Area | KEEP | IMPROVE | REDESIGN | NEW |
|---|---|---|---|---|
| Design tokens | ✓ | | | |
| Motion primitives | ✓ | | | |
| Homepage | ✓ (frozen) | mobile only | | |
| `/about` | ✓ | | | |
| `/legacy` `/inventory` `/portfolio` | | motion + responsive | | |
| `PageShell`, `EnquiryForm` | | ✓ | | |
| Project data model | | | ✓ | |
| `/events/[slug]` | | | ✓ → `/projects/[slug]` | |
| CMS collections | | ✓ | | services, locations, roles, testimonials, SEO |
| SEO infrastructure | | ✓ | | sitemap, robots, breadcrumbs, LocalBusiness |
| Services | | | | whole section |
| `/locations/bengaluru` | | | | ✓ |
| Media clearance | ✓ | | | |

---

## 2. Sitemap

### 2.1 Final routes

| Route | Type | Purpose | Phase |
|---|---|---|---|
| `/` | Core | Positioning, proof, conversion | V1 (frozen) |
| `/about` | Core | Who Raja is; owned assets and in-house crew | V1 |
| `/legacy` | Core | 1977→today; the durability argument | V1 |
| `/services` | Core hub | What Raja delivers; routes to detail pages | V1 |
| `/services/german-hangers` | SEO landing | Highest-intent term Raja can own | V1 |
| `/services/exhibition-stalls` | SEO landing | Second-highest intent | V1.1 |
| `/services/event-flooring` | SEO landing | Third | V1.1 |
| `/services/staging-and-seating` | SEO landing | Fourth | V1.1 |
| `/services/government-events` | Segment landing | Raja's strongest credential | V1.1 |
| `/inventory` | Core | Owned-asset schedule — the proof behind every claim | V1 |
| `/projects` | Core | Evidence index, filterable | V1 |
| `/projects/[slug]` | CMS detail | One project as evidence + SEO surface | V1.1 |
| `/locations` | Core | Where work has been delivered | V1 |
| `/locations/bengaluru` | SEO landing | The only evidenced city | V1.1 |
| `/careers` | Core | Recruitment; crew credibility | V1 |
| `/contact` | Core | **Conversion** | V1 |
| `/resources` | Secondary | Guides that attract buyers pre-enquiry | V2 |
| `/resources/[slug]` | CMS detail | Individual guide | V2 |

### 2.2 Rejected routes

| Route | Why not |
|---|---|
| `/services/event-scaffolding` | Raja claims hangers, flooring, staging, stalls, climate control, barricades, logistics. **Scaffolding appears nowhere.** Do not advertise a service that has not been confirmed. |
| `/services/lighting-av` | Lighting appears only as part of the staging package. Section on `/services/staging-and-seating`, not a page. |
| `/services/catering` | `inventorySchedule` marks catering `provisional`. Section only, until confirmed. |
| `/locations/{mumbai,delhi,chennai,pune,goa,kolkata,bhubaneswar,hyderabad}` | No evidenced delivered work. Thin duplicate pages are demoted by search engines and contradict the site's own stated policy of claiming nothing unevidenced. |
| `/team` | No headshots, no bios, no consent. |
| `/testimonials` (standalone) | Quotes belong beside the project they refer to. |
| `/blog` | `/resources` with three real guides. Not a volume play. |

### 2.3 Navigation

Primary (desktop bar): About · Services · Inventory · Projects · Legacy
Secondary (overlay/footer): Locations · Careers · Contact
Persistent CTA: **Request a site visit** → `/contact`

`Services` and `Projects` are new in the bar; `Notable Events` is renamed
`Projects` and repointed. Nav lives in `content/navigation.ts` — one edit.

---

## 3. Page-by-page specification

**Notation.** Each section is specified as a block. `CMS` names the collection
supplying it, or `static` where copy lives in `content/`. `Motion` names
primitives from §1.3. `Mobile` describes behaviour below `lg` (1024px).

---

### 3.0 `/` — Home · FROZEN

**Purpose** Positioning, proof, conversion. **Audience** All. **CTA** Contact.

No design changes. Mobile work only, in this order (worst responsive coverage
first, and the two pinned sections are highest-risk on touch):

1. `Legacy` — pinned sticky curtain; verify pin release and card drift below `lg`
2. `Works` — pinned card stack and scrub on touch
3. `Inventory` — bento reflow to a single column
4. `Process` — three stages stack vertically
5. `Resources` — full-bleed stat rows
6. `RecentExecutions` — card grid reflow
7. `Clients` — honeycomb collapse
8. `SiteFooter` — column stacking

Acceptance: no horizontal overflow at 360 / 390 / 414 / 768; `npm run inspect`
clean; `npm run check:fallbacks` passes; pinned sections either pin correctly or
degrade to normal flow — never half-pinned.

---

### 3.1 `/about`

**Purpose** Establish that Raja owns the assets and employs the crew — the one
fact separating it from a broker. **Audience** Procurement officers, agency
producers doing diligence. **CTA** View inventory → `/inventory`.

**Status: complete.** Motion already correct across all five sections. Work is
responsive verification only, plus adding the section below.

| # | Section | Detail |
|---|---|---|
| 1 | `AboutHero` | Statement + eyebrow. Motion `revealLines`. **Exists.** |
| 2 | `AboutTimeline` | Era-by-era. Motion `fadeUp` + `growRule`, pinned on desktop. **Exists.** |
| 3 | `AboutMilestones` | Milestone list. Motion `riseCard` stagger. **Exists.** |
| 4 | `AboutInventoryBento` | Owned-asset teaser. Motion `riseCard`. **Exists.** |
| 5 | `AboutPrinciples` | How Raja works. Motion `fadeUp` stagger. **Exists.** |
| 6 | **Closing CTA** *(new)* | `CallToAction`. Static. Links `/inventory` + `/contact`. Motion `fadeUp`. |

---

### 3.2 `/legacy`

**Purpose** Convert 49 years into a reason to trust delivery. **Audience**
Government officers assessing risk. **CTA** See projects → `/projects`.

| # | Section | Purpose | Content | Layout / visual | Media | Motion | Mobile | CMS | SEO |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `LegacyHero` | Frame the span | "Since 1977" statement | Full-bleed masthead | Archive photo | `revealLines` **(exists)** | Type scale down | static | H1 |
| 2 | `LegacyOrigins` | The founding | Founding narrative | Two-column text + rule | — | `revealLines` + `growRule` | Single column | static | — |
| 3 | `LegacyPivot` | The turn to scale | Shift to govt work | Statement band | — | `fadeUp` + `growRule` | Stack | static | — |
| 4 | `LegacyEvolution` | Decade progression | Era cards | Horizontal card row | Optional per era | `riseCard` stagger; horizontal scroll ≥`lg` | Vertical stack, no h-scroll | `collage` | — |
| 5 | `LegacyTrust` | Who has relied on it | Client marks | Logo grid | Client logos | `land` stagger | 2-col grid | `clients` | — |
| 6 | **Closing CTA** *(new)* | Route onward | — | `CallToAction` | — | `fadeUp` | — | static | internal links |

---

### 3.3 `/services` — hub *(new page)*

**Purpose** Name what Raja delivers in the buyer's own words, and route to the
detail pages that rank. **Audience** Anyone who arrived not knowing the scope.
**CTA** Request a site visit.

| # | Section | Purpose | Content | Layout | Media | Motion | Mobile | CMS | SEO |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Masthead | Position the category | "We build the venue" statement | `PageMasthead` | — | `revealLines` | Type scale | static | H1 + intro |
| 2 | Service grid | Route to detail | 5 cards: hangers, stalls, flooring, staging, government | 2-col ≥`md`, 1-col below | 1 photo per card | `riseCard` stagger | Single column | **`services`** | Internal links to each page |
| 3 | Grouped capabilities | Cover the rest honestly | Climate control, barricades, logistics fleet, catering *(provisional)* | Text list, no cards | — | `fadeUp` | Stack | `services` | Long-tail terms |
| 4 | Owned-not-rented | The differentiator | Four scale figures | Stat band | — | `countUp` | 2×2 grid | `settings.stats` | — |
| 5 | Closing CTA | Convert | — | `CallToAction` | — | `fadeUp` | — | static | — |

---

### 3.4 `/services/german-hangers` — template for all service pages

**Purpose** Own the highest-intent term in the category. **Audience** A buyer
who already knows they need a clear-span structure. **CTA** Request a site visit.

| # | Section | Purpose | Content | Layout | Media | Motion | Mobile | CMS | SEO |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Hero | Match query to answer | H1 naming the service + city; one-line answer | Split: statement / photo | Hangar photo | `revealLines`; `parallax` on image ≥`lg` | Photo above text | `services` | **H1, meta** |
| 2 | What it is | Answer the question a buyer types | Plain description: clear-span, column-free, monsoon-rated | Prose, 65ch | Diagram optional | `fadeUp` | — | `services.body` | Body terms |
| 3 | Capacity | Prove the scale | Owned sq ft, spans, configurations | Spec table | — | `countUp` on figures | Table scrolls in own container | `inventory` | Featured-snippet target |
| 4 | What comes with it | Increase basket size | Flooring, staging, climate control, barricades | Linked list | — | `fadeUp` stagger | Stack | `services.related` | Internal links |
| 5 | Where it has been built | Evidence | 3 project cards filtered to this service | Card row | Project photos | `riseCard` stagger | Single column | **`projects` filtered** | Internal links |
| 6 | Specification notes | Serve the technical buyer | Wind/load, anchoring, power, turnaround | Definition list | — | none | — | `services.specs` | Long-tail |
| 7 | FAQ | Capture question queries | 4–6 real questions incl. cost drivers | Accordion | — | none — instant | Native accordion | `services.faq` | **FAQPage schema** |
| 8 | Closing CTA | Convert | — | `CallToAction` | — | `fadeUp` | — | static | — |

The other four service pages use this identical structure. Only content changes.
**Do not design them individually.**

---

### 3.5 `/inventory`

**Purpose** The proof behind every claim made elsewhere. **Audience** Technical
buyers, tender evaluators. **CTA** Contact.

| # | Section | Detail | Motion | CMS |
|---|---|---|---|---|
| 1 | `InventoryHero` | Statement + scale figures | `revealLines` + `countUp` **(exists)** | `settings.stats` |
| 2 | `InventoryCatalog` | Six categories: hangars, flooring, staging, climate, barricades, fleet | **ADD** `riseCard` stagger on rows, `growRule` on dividers | `inventory` |
| 3 | `InventoryEstimator` | Attendees → material estimate | **ADD `countUp`** on outputs — it already computes numbers, this is exactly what `countUp` is for | static rules |
| 4 | `InventoryCompliance` | Standards and certification | **ADD** `fadeUp` + `growRule` | `inventory` |
| 5 | Closing CTA *(new)* | — | `fadeUp` | static |

The estimator is the strongest interactive asset on the site. Keep it public: it
qualifies leads before they reach the form, and it is genuinely useful.

---

### 3.6 `/projects` — index

**Purpose** Turn 49 years of work into browsable evidence. **Audience**
Everyone; the page diligence lands on. **CTA** Individual project → contact.

| # | Section | Purpose | Content | Layout | Motion | Mobile | CMS | SEO |
|---|---|---|---|---|---|---|---|---|
| 1 | `PortfolioHero` | Frame the body of work | Statement + counts | Masthead | `revealLines` **(exists)** | Scale | static | H1 |
| 2 | Filter bar *(new)* | Let a buyer self-select | Sector filters: state ceremonies · PM dedications · expos & summits · cultural & city | Pill row, horizontal scroll on mobile | none — instant, no animation on filter | Scrollable pills | `projects.sector` | Faceted, `noindex` on filtered views |
| 3 | `PortfolioGrid` | The evidence | Project cards: name, client, year, venue, covered area | Masonry ≥`lg`, 1-col below | **ADD** `riseCard` stagger + `parallax` on imagery | Single column | **`projects`** | Internal links |
| 4 | `PortfolioMatrix` | Scale at a glance | Comparison table | Table | **ADD** `growRule` then `fadeUp` per row | Scrolls in own container | `projects` | — |
| 5 | Client roster | Breadth | Org + event rows | `ClientEventList` | `fadeUp` | Stack | `clientEvents` | — |
| 6 | Closing CTA | Convert | — | — | `fadeUp` | — | static | — |

---

### 3.7 `/projects/[slug]` — detail *(replaces `/events/[slug]`)*

**Purpose** One project, fully evidenced — the single most valuable content type
for credibility, tenders and search. **Audience** Diligence and search.
**CTA** Contact, plus related services.

| # | Section | Content | Layout | Motion | Mobile | CMS |
|---|---|---|---|---|---|---|
| 1 | Breadcrumb | Home › Projects › {name} | Inline | none | Wraps | derived |
| 2 | Hero | Title, client, year, venue | Statement over hero image | `revealLines`; `parallax` ≥`lg` | Image above text | `projects` |
| 3 | Key facts | Attendance · covered area · turnaround · security level | 4-up spec band | `countUp` where numeric | 2×2 | `projects` |
| 4 | Summary | 2–3 paragraphs on what Raja built | Prose 65ch | `fadeUp` | — | `projects.summary` |
| 5 | Scope delivered | Bulleted scope highlights | Checklist | `fadeUp` stagger | Stack | `projects.scopeHighlights` |
| 6 | Equipment deployed | Label/value pairs | Spec table | `growRule` per row | Own scroll container | `projects.equipmentDeployed` |
| 7 | Gallery | 4–8 photographs | Grid, lightbox | `riseCard` stagger | 1-col, swipe | `projects.gallery` |
| 8 | Services used | Links to service pages | Chip row | `fadeUp` | Wrap | `projects.services` |
| 9 | Related projects | 3 from same sector | Card row | `riseCard` | Single column | `projects` |
| 10 | CTA | "Planning something similar?" | `CallToAction` | `fadeUp` | — | static |

**Gate:** a project publishes only when it has a hero image with clearance
`raja-original` or `client-approved`. A project page carrying stock photography
is worse than no project page — it makes the evidence claim false. Sections 7
and 3 render their `Placeholder` until real data exists.

---

### 3.8 `/locations` + `/locations/bengaluru`

**`/locations`** — hub. Purpose: state honestly that Raja is Bengaluru-based and
deploys nationally, without claiming branches. Sections: masthead ·
delivered-in list (from real project venues) · fleet statement (20 vehicles,
in-house crew) · CTA. Motion: `revealLines`, `fadeUp`, `countUp` on fleet.

**`/locations/bengaluru`** — the one real city landing page. Structure per §8.3.

---

### 3.9 `/careers`

**Purpose** Recruit crew and office staff; secondarily prove the in-house claim.
**Audience** Local labour market. **CTA** Send an application.

Sections: masthead · "the crew is the company" statement · disciplines (site
crew, fabrication, logistics, office) · **roles list — renders only if
`roles` is non-empty**, otherwise an open-application block · application CTA.

Motion: `revealLines`, `fadeUp` stagger on disciplines, `riseCard` on roles.

**No invented vacancies.** `content/careers.ts` already encodes this rule and it
stands.

---

### 3.10 `/contact`

**Purpose** Convert. The most commercially important page on the site.
**Audience** Buyers ready to talk. **CTA** Submit the enquiry.

| # | Section | Detail | Motion | Mobile |
|---|---|---|---|---|
| 1 | Masthead | "Start a conversation" | `revealLines` | Scale |
| 2 | Enquiry form | Name, email, phone, organisation, event type, event date, location, message | `fadeUp` on field groups only | **Single column, 16px+ inputs, correct `inputmode`/`autocomplete`, submit reachable without zoom** |
| 3 | Direct contact | Phone, landlines, email, address | `fadeUp` | Tap-to-call, tap-to-mail |
| 4 | What happens next | 3 steps: reply within one working day · site visit · written quote | `fadeUp` stagger | Stack |
| 5 | Map / directions | Static map image + directions link | none | Full width |

**Required fixes:** add `export const metadata`; rate-limit the action; send a
notification on submission (email or WhatsApp) — an enquiry nobody is told about
is a lost enquiry; and confirm the page renders on a host that can open SQLite.

---

## 4. Motion and scroll system

### 4.1 Principles

1. **One vocabulary.** Everything comes from `motion/primitives.ts`. No new
   animation library, no bespoke per-page tweens.
2. **`/about` is the reference.** When unsure how a section should behave, match
   the equivalent About section.
3. **Motion is entrance and emphasis, not decoration.** If a section reads fine
   static, it gets `fadeUp` and nothing more.
4. **Every timeline releases.** `release()` on completion so the page does not
   accumulate compositor layers.
5. **Readable with JS off.** `motion-ready` gating already guarantees this.
   Never park content at `opacity: 0` outside that gate.

### 4.2 Primitive assignment

| Primitive | Use for | Never for |
|---|---|---|
| `revealLines` | Page H1 and section statements only | Body copy, lists |
| `fadeUp` | The default for any block entering view | More than ~6 siblings at once |
| `riseCard` | Card grids and tiles, staggered | Text paragraphs |
| `land` | Logos, marks, badges | Long text |
| `growRule` | Dividers, table rows, timeline spines | Anything with content inside |
| `countUp` | Numerals with a unit — stats, capacities, estimator output | Years, dates, phone numbers |
| `parallax` | Large photographs, desktop only | Text, small images, anything above the fold on mobile |
| `settle` | Final resting adjustment after a pinned sequence | General entrance |

### 4.3 Scroll behaviour by page

| Page | Pinned/sticky | Horizontal | Parallax |
|---|---|---|---|
| `/` | Legacy curtain, Works stack — **frozen, do not alter** | Clients marquee | Legacy collage |
| `/about` | Timeline spine ≥`lg` | none | none |
| `/legacy` | none | Evolution card row ≥`lg` | none |
| `/services` | none | none | none |
| `/services/*` | none | none | Hero image ≥`lg` |
| `/inventory` | none | Catalog table scrolls in container | none |
| `/projects` | none | Filter pills on mobile | Grid imagery ≥`lg` |
| `/projects/[slug]` | none | none | Hero ≥`lg` |
| `/locations` `/careers` `/contact` | none | none | none |

**Only the homepage pins.** Adding pinned scroll to interior pages would fight
the nav's scroll listener and make every page feel the same.

### 4.4 Mobile and reduced motion

- Below `lg`: no parallax, no pinning, no horizontal scroll except the deliberate
  filter-pill row and table containers. Entrances become `fadeUp` at
  `DUR.short` with reduced `SHIFT`.
- Gate desktop-only work with `MOTION_DESKTOP`, compact behaviour with
  `MOTION_COMPACT`.
- `prefers-reduced-motion: reduce`: no timelines register at all; content is at
  natural opacity and position. Already handled by `MotionProvider` and the
  inline `motion-ready` script — **do not bypass it.**

### 4.5 Where motion must not be used

Filter and accordion state changes · form validation · the enquiry form itself
beyond a single entrance · anything that delays first paint of the H1 · nav
menus beyond the existing transition.

---

## 5. Dynamic website definition

### 5.1 The principle

Raja must be able to change anything that changes in the ordinary life of the
business — a new project, a new photograph, a price-free service description, a
phone number, a job opening — **without a developer**.

Raja must *not* be able to break the layout, the type scale, the colour system
or the page structure. The CMS edits content, never design.

### 5.2 Static vs dynamic

| Content | Static | CMS | Reason |
|---|---|---|---|
| Projects | | ✅ | Changes constantly; the core evidence asset |
| Project categories / sectors | ✅ | | A fixed taxonomy of 4; changing it changes filters and URLs |
| Project photos | | ✅ | Uploaded per job, forever |
| Services — copy, order, imagery | | ✅ | Wording is refined over time |
| Service *page existence* | ✅ | | A new service page needs sections, SEO and internal links — a code change |
| Inventory categories & items | | ✅ | Stock grows; capacities get corrected |
| Capacity numbers (the four stats) | | ✅ | Already in `settings.stats` |
| Locations — delivered-in list | | ✅ | Grows with every out-of-city job |
| Location *pages* | ✅ | | Each needs real evidence; see §8 |
| Testimonials | | ✅ | Arrive over time; attach to a project |
| Certifications / compliance | | ✅ | Expire and renew |
| Careers — disciplines | ✅ | | Rarely changes |
| Careers — job openings | | ✅ | **Must be client-editable or the page rots** |
| Resources / guides | | ✅ | Published over time |
| Downloads (capability sheet, PDF) | | ✅ | Versioned by the client |
| Company info — phone, email, address | | ✅ | Already in `settings.contact` |
| Hero headline + body | | ✅ | Already in `settings.hero` |
| Team | — | — | Not built; see §2.2 |
| Enquiries | | ✅ | Read-only inbox, already built |
| SEO metadata (title, description, OG) per page | | ✅ | **New** — the client should be able to fix a bad title |
| Page structure / section order | ✅ | | Design integrity |
| Design tokens, type scale, colour | ✅ | | Never editable |
| Navigation labels and order | ✅ | | Changing nav changes IA |

### 5.3 Minimum CMS for V1

Existing collections stay. Add:

| Collection | Fields (summary) | Phase |
|---|---|---|
| `projects` *(rebuilt — see §6)* | Full project record | V1 |
| `services` | slug, title, summary, body, specs, faq, image, order, related | V1 |
| `roles` | title, location, type, description, published | V1 |
| `seo` | route, title, description, ogImage | V1 |
| `testimonials` | quote, attribution, organisation, projectId, published | V1.1 |
| `certifications` | name, issuer, validUntil, document | V1.1 |
| `locations` | slug, city, body, projectIds, published | V1.1 |
| `resources` | slug, title, excerpt, body, image, published | V2 |

### 5.4 CMS constraints

- Every collection keeps the seed-fallback rule from `lib/store.ts`.
- Every image field keeps `clearance`; `publishable()` stays in the read path.
- Unknown keys stay preserved on save (already true in `save.ts`).
- **No numeric fields that imply operational truth** — no stock counts, no
  prices, no availability. Those belong to the operating system, not the website.

---

## 6. Project / portfolio system

### 6.1 Route decision

`/projects` and `/projects/[slug]`.

The earlier brief proposed `/portfolio`. "Portfolio" reads as agency language;
infrastructure and construction firms use "projects", and it matches how buyers
and tender documents refer to past work. `/portfolio` and `/events/[slug]` both
301 to the new routes. **Flag if you want `/portfolio` kept — it is a one-line
change, but do it before launch, not after indexing.**

### 6.2 Consolidating four models into one

Retire `works.Project`, `events.RecentExecution` and `notableEvents.NotableEvent`
into a single `Project` entity based on `NotableEvent`'s field set, which is
already the richest. `clientEvents` survives unchanged as a lightweight
credibility roster — it is a list of names, not projects.

Migration: map the 7 `NotableEvent` records directly; fold the 4 `works`
records in, filling missing fields with `null` rather than invention; use
`RecentExecution.size` as the new `gridSize` field for the homepage grid so the
approved homepage layout is unaffected.

### 6.3 Project fields

| Field | Type | CMS | Required to publish | Notes |
|---|---|---|---|---|
| `slug` | string | ✅ | ✅ | URL; immutable after publish |
| `title` | string | ✅ | ✅ | |
| `client` | string | ✅ | ✅ | Organisation |
| `sector` | enum(4) | ✅ | ✅ | Drives filters + related |
| `year` | string | ✅ | ✅ | |
| `venue` | string | ✅ | ✅ | Feeds location evidence |
| `city` | string | ✅ | ✅ | **New** — required for `/locations/*` |
| `summary` | text | ✅ | ✅ | 2–3 paragraphs |
| `attendance` | string | ✅ | | Renders `Placeholder` if absent |
| `coveredArea` | string | ✅ | | |
| `turnaroundTime` | string | ✅ | | |
| `securityLevel` | string | ✅ | | |
| `scopeHighlights` | string[] | ✅ | | |
| `equipmentDeployed` | {label,value}[] | ✅ | | |
| `heroImage` | MediaAsset | ✅ | ✅ **cleared** | See gate below |
| `gallery` | MediaAsset[] | ✅ | | |
| `services` | slug[] | ✅ | | Links to `/services/*` |
| `testimonialId` | ref | ✅ | | |
| `outcome` | text | ✅ | | Only where genuinely known |
| `featured` | bool | ✅ | | Homepage |
| `gridSize` | enum | ✅ | | Preserves the frozen homepage grid |
| `order`, `published` | | ✅ | | Existing record mechanics |

### 6.4 The publish gate

A project is publishable only when `slug`, `title`, `client`, `sector`, `year`,
`venue`, `city`, `summary` are present **and** `heroImage.clearance` is
`raja-original` or `client-approved`.

`licensed` stock does not satisfy the gate. This is the whole point: a project
page exists to be evidence, and stock photography of somebody else's event is
not evidence. The gate should be enforced in the admin, with a visible reason
shown to the editor rather than a silent failure.

### 6.5 How photographs become website assets

```
Job on site
   └─ 4 frames captured: bare ground · mid-build · complete empty · event live
        └─ uploaded via admin Media library
             └─ sharp → WebP, content-hashed filename
                  └─ clearance set to raja-original
                       └─ attached to the Project record
                            ├─ project hero + gallery
                            ├─ service page "where it has been built"
                            ├─ location page evidence
                            └─ homepage grid (approved layout unchanged)
```

One upload, five surfaces. **Until this loop runs, `/projects/[slug]` cannot be
published** — which is why it is V1.1, not V1.

---

## 7. Service architecture

### 7.1 What Raja actually claims

From `content/inventoryCatalog.ts` (six owned categories) and
`content/inventorySchedule.ts` (`services`, verbatim from Raja's own published
site):

**Owned:** German hangars · modular flooring · staging & dais · climate control ·
security barricades · logistics fleet
**Sold as:** events & conferences · exhibitions & trade shows · exhibition stall
fabrication · corporate events · government programmes · weddings & social events

### 7.2 Decision per candidate

| Candidate | Decision | Reason |
|---|---|---|
| German hangers | **Dedicated page** | Owned at 5,00,000 sq ft. Highest intent, most differentiated, clearest search demand. |
| Exhibition stalls | **Dedicated page** | Explicitly claimed as a service; strong commercial intent. |
| Event flooring | **Dedicated page** | Owned at 10,00,000 sq ft. Real and searchable. |
| Staging & seating | **Dedicated page** | Owned at 1,00,000 sq ft. Absorbs lighting and audience infrastructure. |
| Government events | **Dedicated page** (segment, not service) | Raja's single strongest credential; distinct buyer, distinct language. |
| Temporary structures | **Merge** into German hangers | Same product, different words. One page, both terms. |
| Air conditioning | **Section** on German hangers | Owned (`climate-control`) but bought as part of a structure. |
| Barricades / crowd control | **Section** on staging & seating | Owned, rarely bought alone. |
| Logistics / fleet | **Section** on `/about` and `/inventory` | A capability, not a purchase. |
| Lighting / AV | **Section** on staging | Referenced only within the staging package. |
| Catering | **Section**, flagged provisional | `inventorySchedule` marks it `provisional`. |
| Manpower | **Section** on `/about` | The in-house-crew argument, not a sellable line. |
| **Scaffolding** | **Do not build** | **Claimed nowhere in Raja's material.** Advertising it would generate enquiries Raja may be unable to service. Confirm with the client before any page exists. |
| Turnkey event infrastructure | **`/services` hub itself** | This is the hub's proposition, not a child page. |
| Weddings & social | **Defer** | Claimed on Raja's old site but absent from all current positioning and every project record. Confirm whether it is still pursued. |

### 7.3 Structure

All five service pages use the eight-section template in §3.4. Content differs;
structure does not.

---

## 8. Location architecture

### 8.1 Evidence check

Venues appearing in Raja's own project records: Gayathri Vihar · Vidhana Soudha ·
Kanteerava Stadium · Palace Grounds · GKVK Campus · BGS Campus — **all
Bengaluru**. Plus Hampi (Hampi Utsav), MM Hills, and Kanha Shanti Vanam near
Hyderabad.

### 8.2 Decision

| Location | Decision |
|---|---|
| **Bengaluru** | **Build.** Home city, godown, fleet, and the overwhelming majority of evidenced work. |
| Karnataka (Hampi, MM Hills, Mysuru) | **Defer to V2.** Real work exists; not yet enough for a standalone page. Covered by `/locations`. |
| Hyderabad | **Defer.** One project (Kanha Shanti Vanam). Build when a second lands. |
| Mumbai · Delhi · Chennai · Pune · Goa · Kolkata · Bhubaneswar | **Do not build.** No evidenced work. Thin city pages are demoted as doorway pages, and they contradict the site's own policy — `/locations` currently states, correctly, that no branch network is claimed. |

**Rule for adding a city:** one published project with `city` set, a cleared
photograph, and a named venue. Then the page is generated from real evidence
rather than written from a template.

### 8.3 `/locations/bengaluru` structure

| # | Section | Content | Motion | SEO |
|---|---|---|---|---|
| 1 | Hero | "Event infrastructure in Bengaluru" + one-line answer | `revealLines` | **H1 + meta** |
| 2 | Why local matters | Own godown, 20 vehicles, in-house crew — no sub-hire, no inter-state transport cost | `fadeUp` | Body terms |
| 3 | Venues built at | Real venue list from project records | `fadeUp` stagger | Local entities |
| 4 | Projects in Bengaluru | Cards filtered `city == "Bengaluru"` | `riseCard` | Internal links |
| 5 | Services here | All five, linked | `fadeUp` | Internal links |
| 6 | Contact block | Address, phone, map, hours | none | **LocalBusiness schema** |

---

## 9. SEO architecture

### 9.1 Homepage

**Title:** `Raja Enterprises — Event Infrastructure Company in Bengaluru | Since 1977`

**Description:** `Raja Enterprises builds the physical infrastructure behind large-scale events — German hangers, event flooring, staging and exhibition stalls. Owned inventory, in-house crew, Bengaluru since 1977.`

Rationale: names the category, the city and the differentiator, and it is
truthful. The current title says "Large-scale event infrastructure since 1977"
with no geography — invisible for every local query.

### 9.2 Fixes required

| Item | Action |
|---|---|
| `metadataBase` | Replace the `rajaenterprises.example` placeholder with the real domain — **blocks canonicals and OG images today** |
| `sitemap.ts` | Generate from routes + published `projects`, `services`, `locations` |
| `robots.ts` | Allow all; disallow `/admin`; reference the sitemap |
| `/contact` metadata | Missing entirely — add |
| JSON-LD | Extend `Organization` → **`LocalBusiness`** with address, telephone, geo, openingHours. The data now exists in `content/company.ts`; the schema predates it. |
| Breadcrumbs | Visible + `BreadcrumbList` on all detail pages |
| Per-page schema | `Service` on service pages, `Project`/`CreativeWork` on projects, `FAQPage` where an FAQ exists |
| Canonicals | Self-referencing everywhere; filtered `/projects?sector=` views `noindex,follow` |

### 9.3 URL structure

```
/                             /services/german-hangers
/about                        /services/exhibition-stalls
/legacy                       /services/event-flooring
/inventory                    /services/staging-and-seating
/services                     /services/government-events
/projects                     /projects/{slug}
/locations                    /locations/bengaluru
/careers  /contact            /resources/{slug}
```

Lowercase, hyphenated, no dates, no IDs. `/portfolio` → `/projects` 301;
`/events/{slug}` → `/projects/{slug}` 301.

### 9.4 Keyword clusters, ranked by realistic value

| Cluster | Target | Intent |
|---|---|---|
| German hanger rental / structure + Bengaluru, India | `/services/german-hangers` | **Highest** — differentiated, Raja owns the asset |
| Event infrastructure company Bengaluru / India | `/` and `/locations/bengaluru` | High — category-defining |
| Exhibition stall fabrication Bengaluru | `/services/exhibition-stalls` | High |
| Government event infrastructure contractor | `/services/government-events` | Medium volume, **highest deal value** |
| Event flooring / wooden platform rental | `/services/event-flooring` | Medium |
| Temporary structures / clear-span India | merged into hangers | Medium |
| `{project name}` + infrastructure | `/projects/{slug}` | Low volume, **high credibility** |

### 9.5 Internal linking

Every service page links to ≥3 projects using it. Every project links to every
service it used and to its city. `/locations/bengaluru` links to all services
and all Bengaluru projects. Hubs link down, details link up and across. No
orphan pages.

### 9.6 Image SEO

Already strong — alt text throughout is descriptive and specific. Continue:
descriptive filenames, real alt text naming what is in the frame, `next/image`
with correct `sizes`, WebP/AVIF via the existing pipeline.

### 9.7 Content programme — 3 guides, not 8

1. *What does a German hanger cost in India?* — a buyer with a budget typing a real question
2. *Infrastructure checklist for a 10,000-person event*
3. *How government event infrastructure is procured in Karnataka*

Ship one, measure, then decide on the others.

### 9.8 Off-site

Google Business Profile is the highest-return item on this entire list and needs
no code: claim it, categorise it, load real project photographs, and ask past
clients for reviews that **name the service used**. Do it in week one.

---

## 10. Content / data model

| Entity | Key fields | Relationships | Media | Status | Order | SEO fields |
|---|---|---|---|---|---|---|
| **Project** | §6.3 | → Service[], → Location, → Testimonial | hero + gallery | draft/published + clearance gate | manual | slug, title, description, OG |
| **Service** | slug, title, summary, body, specs[], faq[], relatedServices[] | → Project[] (reverse), → Service[] | hero, optional diagram | published | manual | slug, title, description |
| **Location** | slug, city, body, venues[] | → Project[] by `city`, → Service[] | hero, map | published | manual | slug, title, description |
| **Testimonial** | quote, name, role, organisation | → Project | optional logo | published | manual | — |
| **Certification** | name, issuer, validUntil | — | document | published | manual | — |
| **Role** (career) | title, discipline, location, type, body | — | — | published | manual | — |
| **Resource** | slug, title, excerpt, body | → Service[] | hero | published | date | slug, title, description |
| **Enquiry** | name, email, phone, org, eventType, date, location, message | → none | — | new/read/actioned | date | — |
| **SeoMeta** | route, title, description, ogImage | → route | og | — | — | — |
| **Settings** | contact, stats, hero copy | — | — | — | — | — |

`MediaAsset` (existing) is shared by all: `id, src, width, height, alt, focal,
clearance, credit`. **`clearance` is never optional.**

---

## 11. Delivery plan

### V1 — must ship

Everything needed for a credible, indexable, working site with no fabricated content.

1. **Host migration** — persistent-volume Node host in `ap-south-1`; `/contact` and `/admin` working *(blocking — enquiries are currently lost)*
2. Real domain + `metadataBase`; rotate admin credentials; rate-limit the form; enquiry notification
3. Homepage mobile responsiveness *(design frozen)*
4. `/legacy`, `/inventory`, `/portfolio→/projects` — motion + responsive completion
5. `PageShell` and `EnquiryForm` responsive rebuild
6. `/services` hub + `/services/german-hangers`
7. `/projects` index on the unified model
8. `/about` closing CTA; `/careers` roles-aware; `/contact` metadata + next-steps
9. `sitemap.ts`, `robots.ts`, `LocalBusiness` schema, breadcrumbs
10. Fonts: drop Playfair, add Poppins 600
11. Close the 6 open content records
12. CMS: `services`, `roles`, `seo` collections
13. Google Search Console + Business Profile

### V1.1 — immediately after launch

`/projects/[slug]` *(gated on first cleared photographs)* · remaining four service
pages · `/locations/bengaluru` · testimonials · certifications · project filtering

### V2 — once real content exists

`/resources` + 3 guides · additional location pages as evidence appears ·
project galleries at depth · case-study outcomes · capability-sheet download

### Future product — not this engagement

See §12.

### Dependency gates

| Gate | Blocks |
|---|---|
| Persistent host | Everything — the site cannot take an enquiry today |
| Real domain | All SEO |
| First 4 cleared photographs | `/projects/[slug]`, service evidence sections |
| Client sign-off on 6 content records | V1 completion |
| Confirmation on scaffolding & weddings | Whether those services exist at all |

---

## 12. NOT PART OF THIS WEBSITE DELIVERY

Explicitly excluded from this engagement. These belong to a separate internal
operating system and must not leak into the website CMS.

- Receivables, ageing, collections, DSO
- Job management, job packs, job costing
- Inventory stock levels, availability, dispatch, returns, condition grading
- Procurement, purchase orders, vendor management
- Manpower, rosters, attendance, payroll
- Vehicle and fleet management
- Internal CRM, quoting, rate cards, pipeline
- Tender monitoring and tender intelligence
- Operational dashboards and business analytics
- Any internal workflow, approval chain, or company operating system

**Boundary rule:** the website CMS holds *published* facts — a capacity Raja is
happy to advertise. It never holds *operational* facts — what is in the godown
today, what a job cost, who owes money. If a proposed field would change based
on a job that is currently running, it does not belong in the website CMS.

---

## 13. Decisions needed before Phase 1

| # | Question | Blocks |
|---|---|---|
| 1 | Real domain, and who controls DNS? | All SEO, OG images, launch |
| 2 | Which host? Current one cannot run this application. | Everything |
| 3 | `/projects` or keep `/portfolio`? | URL structure — decide before indexing |
| 4 | **Does Raja do scaffolding?** | Whether that page exists at all |
| 5 | Are weddings and social events still pursued? | Service scope |
| 6 | Answers to the 6 open content records, incl. the 300 vs 460 headcount contradiction | V1 completion |
| 7 | How many cleared photographs exist right now? | Timing of `/projects/[slug]` |
| 8 | Any certifications, licences or compliance documents to publish? | Certifications collection |
| 9 | Where should enquiry notifications go — email, WhatsApp, both? | Contact form completion |

---

*Approve this document and Phase 1 (V1, §11) can be implemented against it
without further design decisions. The homepage remains frozen throughout.*
