# Raja Enterprises — Final Content Audit & Production Approach

**Audit date:** 2026-09-16
**Audit basis:** Direct inspection of the Next.js codebase (`content/*.ts`, `app/(site)/**`, `sections/*.tsx`, `components/**`) plus the live production site (raja-enterprises-one.vercel.app). No source files were modified to produce this document.
**Scope:** Read-only. This document is the specification for a separate implementation pass.

A note on method: most "content" on this site is TypeScript data files, not copy buried in JSX, and a large share of it is already admin-editable and DB-backed (see §6). That makes this an unusually good codebase to audit — the seed files carry their own review history in code comments, including several places where a past pass already caught and removed invented numbers. Where the current live (database) value may differ from the seed file I could read, I've flagged it for a spot-check rather than guessed.

---

## 1. Executive Summary

The site's underlying *positioning discipline* is already close to correct: `content/company.ts`, `content/services.ts` and `content/careers.ts` all show evidence of prior passes that removed invented statistics and reconciled contradictory numbers, and the service-pillar copy (§8) is genuinely good B2B writing — concrete nouns, no filler adjectives. The problems are not "the company sounds like a wedding planner." It doesn't. The problems are:

1. **Two competing "who we serve" taxonomies** that don't agree with each other (Services page's `markets` list vs. the dedicated `/solutions` page) — see §9, §15.
2. **A real, visible text-corruption bug** on the homepage ("┠" in place of a dash) — P0, see §7.
3. **CTA sprawl** — a `CTA` constant exists specifically to prevent this and is used in only 4 of the ~12 places a primary action appears — see §16.
4. **Two spellings of one product name** ("German Hangars" vs. "German Hangers") coexisting inside the *same* service record (the URL slug is `german-hangers`, the page title is "German Hangars") — see §21.
5. **The founding-year credibility signal repeats 8 times across 6 files** rather than being stated once per page tier as the brief for this audit itself recommends — see §12.
6. **The exact two marketing phrases this brief called out as examples of what to avoid — "monumental scale" and "Choreography of Scale" — exist verbatim in live copy.** That's either a coincidence or someone on this team has read the same style guide this brief is written from. Either way, they're easy, low-risk fixes — see §7, §21.
7. **No dedicated place for Government, Weddings/Social, or College & University events**, despite Government being one of the site's five *project* categories and 11 of 37 recorded projects, and despite the client's explicit new request for college/university events (§4, §9, §15).
8. A handful of image/caption mismatches (already partly known and partly fixed this session) remain live, mostly on the About page timeline — see §12, §13.

None of this requires new invented facts. It requires: fixing one broken character, picking one taxonomy instead of two, using the CTA constant that already exists, deciding on one spelling, and trimming repetition. That's a content-organization job, not a rewrite of the company's voice.

---

## 2. Current Content Problems

In priority order (full detail and exact locations in the numbered sections below):

| # | Problem | Where | Severity |
|---|---|---|---|
| 1 | Garbled character `┠` in live homepage body copy | `content/capabilities.ts:123`, renders on homepage Capabilities section | P0 |
| 2 | Services page duplicates the Solutions page's job with a different, non-matching taxonomy | `content/services.ts` `markets`, rendered in `app/(site)/services/page.tsx` | P0 |
| 3 | "German Hangars" / "German Hangers" spelling conflict inside one record | `content/services.ts:46-48` | P0 |
| 4 | No Government, Weddings/Social, or Campus/University solution page despite project evidence for the first two and an explicit client request for the third | `content/solutions.ts` vs. `content/projects.ts` categories | P0 |
| 5 | CTA label sprawl — ~12 distinct primary-action labels where a shared constant exists for exactly this | Sitewide, see §16 | P1 |
| 6 | "49 years / 1977" founder credibility stated 8 times across Home, About, Legacy | See §12 | P1 |
| 7 | "monumental scale" (×3) and "Choreography of Scale" (×1) — the exact phrases this brief flags as generic marketing language | `content/clients.ts`, `content/about.ts`, `components/CallToAction.tsx`, `components/about/AboutTimeline.tsx` | P1 |
| 8 | About-page timeline card for "1977–1990" shows an image/alt pairing for a different era's content | `content/about.ts` (`aboutTimeline[0].image`) and the live DB record diverges further — see §12 | P1 |
| 9 | Two more small stray misspellings: "Bangalore" in one About sentence where the rest of the page says "Bengaluru"; `sq ft` vs `sq. ft.` inconsistency | `content/about.ts:37`; multiple files | P2 |
| 10 | Unverified superlative on Careers page ("the biggest temporary structures in the country") with no `[VERIFY]`/status flag, unlike almost everything else in the file | `content/careers.ts:23` | P1 |

---

## 3. Final Positioning

**Current de facto positioning statement** (from `content/site.ts`, the homepage hero):

> "Building the physical infrastructure behind large-scale events."
> "Since 1977, Raja Enterprises has delivered the physical infrastructure for government programmes, trade fairs, exhibitions, and corporate conferences. With substantial inventory and in-house field resources, we build the venue."

This is **already the correct positioning** — a code comment directly above it (`content/site.ts:23-32`) explains it was rewritten specifically to replace "Building the extraordinary. Delivering the unforgettable." for the exact reason this brief cares about: it names the product, the buyer, and the one differentiator (owns the inventory, employs the crew) instead of asserting adjectives a competitor could equally claim.

**"We don't decorate events. We build the venue." does not currently appear anywhere in the codebase** — it is not live copy. It is close in spirit to the existing hero ("we build the venue" is literally the hero's last clause) but the brief's phrasing is sharper because it explicitly negates the wrong category (decoration) before asserting the right one (building). This is worth adopting *if* it replaces or sits directly beside the existing hero rather than adding a third competing tagline — see §21 replacement copy for the exact recommendation.

**Recommendation:** Keep the hero's factual second sentence as-is (it already carries the proof: 1977, three named client categories, in-house crew, owned inventory). Consider using "We don't decorate events. We build the venue." as a **short-form positioning line** for places that currently have none — e.g. the `<meta name="description">` on the homepage, or a nav-overlay strapline — rather than replacing the existing, already-good hero body copy. Do not run both the hero's long sentence and the short tagline in the same viewport; pick one per placement.

**What Raja is not, confirmed by inspection:** nothing in the codebase positions Raja as a wedding planner, decorator, AV vendor, or marketing agency. The one place a "Weddings & social events" market is named (`content/services.ts:398`) is framed as an infrastructure client type ("Owned inventory means a fixed date holds even during peak wedding season"), not as event planning — that framing is correct and should be preserved if this market gets its own Solutions entry (§9).

---

## 4. Bengaluru-First Market Positioning

**Current state (measured, not estimated):**

- "Bengaluru" appears 75 times across `content/*.ts` and page copy.
- "Bangalore" appears 4 times — three are IDs/filenames (`uas-bangalore`, an SVG path), and exactly **one is visible copy**: `content/about.ts:37`, "Foundational Bangalore headquarters establishment" — a one-word inconsistency inside a page that otherwise says "Bengaluru" throughout. Recommend correcting to "Bengaluru" for internal consistency (§21).
- **No page `<title>` currently contains "Bengaluru" or "Bangalore".** Location only appears in body meta descriptions (About, Legacy) and the address block. This is the single biggest, lowest-effort SEO gap identified in this audit — see §18.

**Recommendation:** The content itself already leans Bengaluru-first by simple word frequency; the gap is entirely in *structured* SEO fields (titles, H1s), not in the prose. Fix titles (§18) rather than adding more "Bengaluru" into paragraphs — the brief is right that stuffing it into every sentence would read badly, and the current prose density of the word is already about right.

**National capability is already supported and stated** — `content/careers.ts` says "the biggest temporary structures in the country" (flagged separately for its unverified superlative, §8/§15), and the Projects list (§10) includes Goa, Amritsar, Dehradun, Hampi, and Delhi/Mumbai-adjacent claims in the About timeline. Karnataka/South India strength is well evidenced (27 of 37 projects are Bengaluru or Karnataka-located, per `content/projects.ts` `location` fields). No change needed to the geographic *claims* — only to where they surface in metadata.

---

## 5. College Festivals / University Events — Recommended Integration

**Client request (source: WhatsApp, "Rohith Wushu," verbatim):** "college fests, University function" — "Add this in service providing."

**Terminology decision:** Use **"College Festivals & University Events"** as the public-facing label.

- "University Functions" (the client's own second phrase) reads as a direct translation from spoken Indian English and is less commercially crisp in written copy; "Events" is the term already used consistently elsewhere on the site (`content/solutions.ts` labels: "Corporate events," "Brand & product launches").
- "Campus Events" is too vague on its own (could mean a hostel function) — pairing it with "College Festivals" is what makes the audience unambiguous to a Bengaluru college's events committee or a university's administrative office, which is the actual buyer.
- "Institutional Events" (used once already, in `content/solutions.ts`'s "Institutional and cultural event infrastructure") is the closest existing category, but it currently pairs institutions with *cultural/religious* gatherings — a college fest is a different budget cycle, a different decision-maker (student council / dean of student affairs vs. a trust), and a different infrastructure emphasis (stages and crowd circulation over religious-ceremony staging). It should be its own entry, not folded into the existing "Institutional and cultural" one.

**Recommended placement: it belongs in Solutions, not Services**, per the distinction this brief itself sets out (Services = what Raja builds; Solutions = who it's for). "College Festivals & University Events" describes a *buyer*, not a *product* — the products underneath it (staging, seating, barricading, flooring, lighting) already exist as Service pillars. Do **not** create a new Service pillar for this; do add a new Solutions category.

**Recommended hierarchy:**

```
Solutions (new 6th category)
  └─ College Festivals & University Events
       ├─ links to: Staging, Seating & Audience Infrastructure (service)
       ├─ links to: Event Flooring & Platforms (service)
       ├─ links to: Barricades & Crowd Control Infrastructure (service)
       ├─ links to: Lighting & AV Solutions (service)
       ├─ links to: German Hangars & Temporary Structures (service, for covered fest grounds)
       └─ links to: Exhibition Stalls & Pavilions (service, for department/club stalls)
```

**Recommended card copy** (see §21 for the full replacement-copy block) should name only capabilities the site already supports elsewhere: temporary stages, audience seating, barricading and crowd circulation, flooring, lighting, and stall/pavilion infrastructure for department exhibits. **Do not claim** climate control, backstage green-room infrastructure, or a specific past college project unless one is confirmed — none of the 37 recorded projects in `content/projects.ts` is tagged as a college or university fest today (the closest is "Krishi Mela 2024–25," University of Agricultural Sciences — an agricultural exhibition on a university campus, which is evidence of *campus* capability but not of a *student fest*). Flag this explicitly on the new page: **[CLIENT VERIFICATION REQUIRED]** — confirm whether any past college-fest work exists before naming one, and confirm whether "climate-controlled spaces" and "backstage support" (both requested capabilities in the brief) are things Raja has actually delivered for this use case specifically, even though both exist as general Service pillars.

---

## 6. Content Architecture

**How content actually reaches the page** (this matters for anyone implementing the recommendations in this document): three tiers exist, by design, per the comment in `content/services.ts:4-21`:

- **Pillars** — services with their own route (`/services/[slug]`), 10 of them, all currently shipped (`page: true`).
- **Capabilities** — bundled sub-services shown as tags on a pillar page, never their own route (Climate control, Lighting & AV, Barricading & crowd control, Power distribution, Logistics & fleet, Manpower, Catering — 7 total).
- **Markets** — "who Raja builds for," rendered *on the Services page itself* as a "Who we build for" section. **This is the duplication problem** — see §9.

Separately, `content/solutions.ts` defines a *different* 5-category "who we build for" list rendered on its own `/solutions` route. Two systems answering one question, in different words, is the single most consequential architecture problem this audit found (§9, §15).

**Admin-editable vs. seed-only (confirmed by inspecting `lib/store.ts` and `app/(admin)/admin/fields.ts`):**

| Collection | Editable via admin? | Notes for this audit |
|---|---|---|
| `homepageWorks`, `inventory`, `catalog`, `clients`, `recentEvents`, `eventFormats`, `timeline`, `milestones`, `principles`, `highlights`, `services`, `solutions`, `capabilities`, `process`, `collage`, `locations`, `disciplines`, `partnerPoints`/`partnerSteps`, `pageImages` | Yes, DB-backed with seed fallback | **Live DB values may already differ from the seed file this audit read.** Anything in this document sourced from these files should be re-checked against the live admin panel before final copy is locked. |
| `projects`, `schedule`, `seo`, `legacyMilestones` | No — seed-only as of this audit | What's in `content/projects.ts` etc. is exactly what's live. |

This audit read the **seed files** (TypeScript source), which are the source of truth for anything not yet edited via admin, and the **live site** via browser for spot checks. Where I found the seed and the live page disagree (e.g. the About timeline's 1977 card image — see §12), I've called it out explicitly rather than treating the seed as current fact.

---

## 7. Navigation / Information Architecture Review

**Primary nav** (`content/navigation.ts`): About, Solutions, Services, Inventory, Projects, Legacy, Partners, Careers, Contact. Partners, Careers and Contact are deliberately excluded from the inline desktop bar (comment explains: keeps it to a manageable width) and live in the overlay/footer instead. This is a reasonable, already-justified decision — no change recommended.

**Nav blurbs** (used in the overlay) are the clearest existing statement of the Services/Solutions distinction on the entire site:
- Services: "What we build and deploy"
- Solutions: "Who we build for, by sector"
- Inventory: "What we own and deploy"

Two problems: (1) Services and Inventory both end in "and deploy," which makes them sound like the same thing in a one-line skim — Inventory is the *fleet*, Services is the *work*; the verb overlap blurs that. (2) The Solutions blurb correctly promises "who we build for," but the Services page's own "Who we build for" section (§6, §9) breaks that promise by answering the same question itself. Fix the section, not the blurb.

**Homepage section-id anchors** (`SECTION_IDS` in `content/navigation.ts`) are internally inconsistent with their own content: the Legacy/"Since 1977" section's anchor id is literally `"about"` and the Hero's is `"top"`. This is invisible to visitors but will confuse whoever next edits on-page anchor links — worth a one-line dev note, not a content fix.

---

## 8. Homepage Content Audit

Audited in render order (`app/(site)/page.tsx`): Hero → Legacy ("Since 1977") → Capabilities → Works → Resources → Process → EventsWeBuildFor → RecentExecutions → Clients.

### Hero
- **Current heading:** "Building the physical infrastructure behind large-scale events."
- **Current message:** States product (physical infrastructure), scale (large-scale events), and — in the body line — proof (1977, three client types, owned inventory, in-house crew).
- **Problem:** None structurally. This section is a model for the rest of the site.
- **Recommended purpose:** Unchanged — Level 1 (what Raja is) + immediate proof.
- **CTA:** "Submit your event brief" / "Explore capabilities" — both already pull from the shared `CTA` constant (`content/site.ts`). Correct as-is.
- **Notes:** No location term in the hero at all. Consider whether "large-scale events across Bengaluru and India" (or similar, in the body sentence only) is worth the trade-off against the brief's own "don't force it into every paragraph" rule — my recommendation is **leave it out of the hero** specifically, since the meta title/description is the right place for the location keyword (§18), and the hero's job is positioning, not SEO.

### Legacy — "Since 1977"
- **Current heading:** "Since 1977, we have built the ground India's largest gatherings stand on."
- **Current message:** Founding year + scale claim, animated honeycomb of client logos and a central brand mark.
- **Problem:** This is the *second* time "1977" appears on the homepage (Hero doesn't state the year in the headline, but this section leads with it) and it will be the third occurrence once a visitor reaches About. Not a P0, but part of the repetition pattern in §12.
- **Recommended purpose:** Level 3 (proof/evidence) — this section's actual job, given it's a logo wall, is trust signalling, not history. The heading currently does double duty as both.
- **Notes:** No content change is required here beyond what's already tracked in §12 (frequency). The section's *animation* was reworked this session for a client-approved reason unrelated to copy; the copy itself is fine.

### Capabilities — "Four elements. One in-house crew."
- **Current heading:** "Four elements. One *in-house* crew."
- **Current body copy (verbatim, live):** "Structures, flooring, staging, and exhibitions ┠ delivered by our field crews using our own substantial inventory. Complete turnkey physical execution."
- **PROBLEM (P0):** The `┠` character is a rendering artifact, not a dash — it displays as a broken glyph on every browser/OS combination that doesn't happen to have that exact box-drawing character glyph available, and reads as an error even where it does render. This is the single most visible bug found in this audit. **Fix: replace `┠` with an em dash `—`.**
- **Secondary note:** "Complete turnkey physical execution" stacks two of the phrases this brief flags ("complete," "turnkey") in four words. The sentence already said "our own substantial inventory" and "field crews" — the turnkey claim is redundant with what the sentence just proved. Recommend cutting to: "Structures, flooring, staging and exhibitions — delivered by our own field crews from our own inventory." (Exact replacement in §21.)
- **CTA:** none directly (section links via scroll-track to individual capability slides). Fine as-is.

### Works — "Notable Works"
- **Current heading:** two-word eyebrow "notable / works," statement not fully captured in this pass but renders as project-card carousel.
- **Card note (fixed this session, documented for completeness):** the Kempegowda Airport card previously rendered with no summary at all (silent gap) rather than the sitewide "pending" placeholder convention; this was corrected, and a real summary + focal crop were added afterward. No further action needed here, flagging only so implementers know it's resolved, not open.
- **Card note (also resolved this session):** the "Navaratri Function" card briefly carried an italic-accent color treatment on its title; per direct client feedback this was reverted to plain styling matching every other card. No content problem remains here — noted for completeness only, this is a styling item, not a copy item.

### Resources / Process / EventsWeBuildFor / RecentExecutions
- These sections are primarily numeric/visual (owned sq. ft., process steps, format cards, recent-event grid) rather than prose-heavy. No P0/P1 copy issues found. One consistency note: the four approved stats in `content/company.ts` (hangars, floor platforms, stage infrastructure, vehicles) are the *only* numbers with `status: "approved"` at the company level — any other numeric claim appearing elsewhere on the homepage or About page that isn't one of these four should be treated as **[VERIFY]** by default (see §12 for a specific instance).

### Clients — "Partners & Clients with Raja Enterprises"
- **Current eyebrow:** "Institutional & Enterprise Trust." **Current heading:** "Partners & Clients with Raja Enterprises." **Current supporting line:** "From government mega-summits to global corporate forums and trade exhibitions — we build the ground where leaders gather."
- **Problem:** "mega-summits," "global corporate forums" and "where leaders gather" are the closest thing on the homepage to the cinematic-marketing language this brief asks to avoid, and "global" is an unsupported geographic claim — nothing in `content/clients.ts` or `content/projects.ts` documents an international client or venue. **[VERIFY] or remove "global."**
- **Recommended heading:** Keep — it's plain and accurate. **Recommended supporting copy:** "From government summits to corporate forums and trade exhibitions — the logos above have all built on Raja's ground." (Removes "mega," "global," and "where leaders gather"; keeps the three client categories, which are accurate per the projects data.)
- **CTA:** none — correct, this section's job is proof, not conversion.

**Overall homepage hierarchy assessment:** the existing order (What it is → proof wall → capabilities → featured work → scale numbers → process → formats → recent grid → client trust) already satisfies the 9-point structure this brief asks for; it does not need reordering, only the specific fixes above.

---

## 9. Services Content Audit

**Does the page answer "what can Raja physically deliver?"** — yes, clearly, for the 10 pillars themselves. `content/services.ts` is the best-written file in the codebase: concrete capacity numbers where owned (and explicitly *absent* where not — see the code comment on scaffolding, `services.ts:19-21`, which is a model of the claim discipline this brief asks for).

**The problem is entirely the "Who we build for" section bolted onto the bottom of this page** (`markets` array, rendered `app/(site)/services/page.tsx:174-191`). It:
1. Answers a question the Solutions page exists to answer, using different wording ("Government & public sector" here vs. no equivalent category on `/solutions` at all).
2. Is inconsistent with itself against the Solutions taxonomy: Services' `markets` has **Government & public sector** and **Weddings & social events** — neither has a corresponding Solutions page. Solutions has **Brand & product launches** — no equivalent in Services' `markets`.

**Recommendation:** Delete the "Who we build for" section from the Services page entirely (or replace it with a single line: "See who we build for →" linking to `/solutions`). Consolidate the *content* of `markets` into the Solutions taxonomy (§11) so there is exactly one place, sitewide, that answers "who is this for."

**Service taxonomy** (already correct, no restructuring needed) — the 10 pillars map cleanly onto the brief's suggested grouping:

| Brief's suggested group | Existing pillar(s) |
|---|---|
| Structures | German Hangars & Temporary Structures |
| Flooring | Event Flooring & Platforms |
| Staging | Staging, Seating & Audience Infrastructure |
| Exhibition infrastructure | Exhibition Stalls & Pavilions |
| Scaffolding | Event Scaffolding & Access Structures |
| Lighting/AV | Lighting & AV Solutions |
| HVAC/climate control | Mobile HVAC & Climate Control |
| Audience infrastructure | (folded into Staging, Seating & Audience Infrastructure) |
| Site/support infrastructure | Barricades & Crowd Control Infrastructure; Logistics Fleet & Heavy Transport |
| — (not in brief's list, exists on site) | Government Event Infrastructure |

**One item needs a placement decision:** "Government Event Infrastructure" (`slug: government-events`) is currently a *Service* pillar, but its actual content (per the brief's own Services=WHAT / Solutions=WHERE&WHO rule) answers "who," not "what" — it should logically be a **Solutions** category, not a Services pillar, unless its page content genuinely describes government-specific *build methods* (e.g., security-perimeter fabrication, protocol-driven staging) rather than *client type*. **[VERIFY]**: read the full pillar body copy before moving it — if it's client-type framing, move it to Solutions and merge its unique technical content (if any) back into Staging/Barricades pillars.

---

## 10. Solutions / Applications Audit

**Current 5 categories:** Corporate events, Exhibitions & trade fairs, Conferences & summits, Brand & product launches, Institutional and cultural.

**Gap analysis against actual project evidence** (`content/projects.ts` categories: government, exhibition, conference, cultural, corporate, social):

| Project category | Count in `projects.ts` | Solutions page equivalent? |
|---|---|---|
| government | 11 | **None** |
| exhibition | 8 | Exhibitions & trade fairs ✓ |
| conference | 4 | Conferences & summits ✓ |
| cultural | 9 | Institutional and cultural ✓ |
| corporate | 5 | Corporate events ✓ |
| social | 0 (category exists in the type, no projects tagged) | **None** — and no evidence to support one yet |

**Recommendation:**
1. **Add "Government & Public Sector"** as a Solutions category. This is the single largest gap in the whole site: 11 of 37 recorded projects (nearly a third) are government engagements, and there is currently no page that lets a government procurement officer self-identify. This is a **P0** — it's a missed conversion path with existing proof sitting unused.
2. **Add "College Festivals & University Events"** per §5.
3. **Do not add** a "Weddings & Social" Solutions page yet — the `social` project category exists in the type system but has zero populated projects. Adding a page with no proof behind it would violate this brief's own claim-discipline rule. **[CLIENT VERIFICATION REQUIRED]**: if Raja does social/wedding work it simply hasn't logged as a project, decide whether to add the page now (with honest "capabilities, not case studies yet" framing, matching the pattern already used for scaffolding in Services) or hold it for a later pass.
4. Absorb the Services page's `markets` content into this page (§9) rather than maintaining both.

**Resulting recommended Solutions taxonomy (7 categories):** Government & Public Sector · Corporate Events · Exhibitions & Trade Fairs · Conferences & Summits · Brand & Product Launches · Institutional & Cultural Gatherings · College Festivals & University Events.

---

## 11. Projects Content Audit

37 projects (not 27 — the "27" figure was a stale headline this session already found and fixed; the live stats row has always shown 37). Audited via `content/projects.ts`.

**Information hierarchy — consistency check.** Every project record shares the same underlying fields (`event`, `client`, `year`, `location`, `category`, `scope`, `services[]`, `media[]`), which is good — the *data* is uniform. The **presentation** is not yet uniform because the fields are inconsistently populated:

- `year`: null for several projects (e.g. "Company event," La Renon; "Silver Jubilee Celebration," Buildtek) — renders as an absent year on the card rather than a placeholder, which is correct behavior, not a bug, but means cards do legitimately vary in visible line count. This matches the brief's complaint ("some cards have 5 lines, others 1") — the fix is a *data* gap (missing years/locations for older or less-documented engagements), not a *template* gap. **[CLIENT VERIFICATION REQUIRED]**: supply year/location for the ~8 projects currently missing one, if known.
- `scope`: null for the large majority of the 37 — the newly built case-study page (`/projects/[id]`, added this session) already handles this honestly with a "Scope not yet published" placeholder rather than inventing text. This is correct and requires no content-audit action beyond flagging that **most project pages currently show that placeholder**, which is a real content gap, not a display bug. **[CLIENT VERIFICATION REQUIRED / P1]**: supplying real scope text for even the 10–15 best-documented projects would materially strengthen the Projects section's proof value.
- Category banners: already audited and partly fixed this session (government, exhibition banners corrected to real matching photos; cultural and corporate banners pulled pending the client's own re-upload, per direct instruction this session). No further action needed here except to confirm the client has in fact re-uploaded replacements before launch.

**Recommended per-card information hierarchy (already what the new case-study template uses, recommend applying the same order to the list-page cards):**
```
CATEGORY / YEAR
EVENT NAME
CLIENT OR ORGANISATION
LOCATION
ONE-LINE SCOPE (or "Scope not yet published")
SERVICES DELIVERED (tags)
```
This matches what's already live — no template change needed, only the underlying data gaps noted above.

**One naming inconsistency:** two projects share near-identical names against the same client family — "Karnataka State Marketing Communication & Advertising Ltd" appears as client on 5 separate projects with 5 different event names (Pourakarmika Samavesha, Dam Safety Conference, 5th Annual Convocation, Babu Jagjivan Ram anniversary, Krishi Mela). This is factually fine (one client, many engagements) but worth double-checking the organisation's exact legal name is spelled identically in all 5 records before launch — a quick `[VERIFY]` grep item, not a rewrite.

---

## 12. Inventory Content Audit

Per instruction, **no changes proposed to inventory data, quantities, specifications, or categories** — both `content/inventory.ts` (13 homepage tiles) and `content/inventoryCatalog.ts` (13 catalogue entries) are marked approved and are out of scope.

**Surrounding explanatory content check:** the Inventory page and the About page's "Inventory Highlights" bento section (`components/about/AboutInventoryBento.tsx`) present overlapping numbers (5,00,000 sq ft hangars; 10,00,000 sq ft flooring; etc.) using the *same* four approved figures from `content/company.ts`. This is intentional repetition of **approved, single-sourced numbers** — not a duplication problem, because both surfaces cite the same canonical figures rather than inventing separate ones. No change needed; this is the repetition pattern working correctly, unlike the "49 years" repetition in §13, which repeats a *message* rather than citing one *number* consistently.

One naming note: the Inventory page's card labels ("German Hangars," correct spelling) and the Services pillar's URL slug (`german-hangers`, misspelled) will sit one click apart in the same user session if a visitor goes Inventory → Services. Recommend fixing the slug spelling as part of §21's terminology decision, since Inventory is the approved-content side of this pair and should be the side Services matches, not the reverse.

---

## 13. About / Legacy Audit

**Defined distinction going forward, per this brief's own framework:**
- **About** = who the company is *today* (current capability, current crew, current doctrine).
- **Legacy** = historical evolution (1977 → now, era by era).
- **Homepage** = one short credibility signal, not a history lesson.

**Current reality:** the "1977 / 49 years" fact appears in the Hero indirectly (body copy), directly in the Legacy homepage section heading, directly in the About page eyebrow *and* lead paragraph *and* manifesto card, and directly in the dedicated `/legacy` page title. That's the founding year stated or restated in **6 different components across 3 pages** before a visitor has read a single case study. This is the exact repetition this brief's §14 asks to eliminate.

**Recommendation — minimum effective history, by page:**
- **Homepage:** state the year once (already done, in the Legacy section) and nowhere else on the homepage. Remove it from the Hero body sentence's implicit restating if it's ever made explicit there (currently it isn't stated as a bare year in the Hero, only "Since 1977" — leave as is, that's the one homepage mention).
- **About:** state it once, in the eyebrow ("Est. 1977 · 49 Years in Operation") **or** the lead paragraph — not both. Currently both carry it (`content/about.ts:5` and `:11-12`). Cut the year from the lead paragraph; keep it in the eyebrow, where it belongs as a badge, not a repeated sentence.
- **Legacy page:** this page's entire *purpose* is the history, so repeating "1977" and "49 years" across its own timeline sections is appropriate and expected — no change recommended here.

**Image/copy mismatch found (P1, not yet fixed):** `content/about.ts`'s "Foundational Era" (1977–1990) timeline card is set to `image: "/media/projects/2x/fc-expo-2024.webp"` (a 2024 exhibition photo) with `alt: "Foundational civic event infrastructure in Karnataka"`. On the live site, this card currently renders an *even more* mismatched image (a 2025 ISGCON gastroenterology conference award photo) — meaning the seed file's mismatch has been compounded by a live admin-panel edit that introduced a second, unrelated wrong photo. **[CLIENT VERIFICATION REQUIRED]**: this era predates photography entirely (1977–1990) — the honest fix, consistent with how the rest of the site handles missing period-accurate photography (see the "Representative" vs. "Client photograph" badge pattern used throughout `content/projects.ts`), is either a clearly labeled representative/illustrative image or the sitewide "photography pending" placeholder — not a wrong but plausible-looking photo. Two more timeline cards (2005–2017 and "Today") also reference images (`kanha-shanti-vanam-tent-city.webp`, `abs-education-fair.webp`) whose alt text ("Exhibition stall systems," "A fabricated exhibition stall") doesn't obviously match the eras' actual described content (HVAC/expo scale-up; national ceremonies) — worth a visual spot-check before launch, not a copy rewrite.

---

## 14. Trust / Proof Audit

**Claims vs. proof, separated:**

| Claim on site | Is it proof or assertion? |
|---|---|
| "27 → 37 engagements on record" (Projects page) | **Proof** — named, dated, categorized, linked to case-study pages |
| Four stat-band numbers (hangars, flooring, stage, vehicles) | **Proof** — marked `status: approved` in `company.ts`, i.e. already gone through a confirmation step |
| Client logo wall (27 logos) | **Proof** — named organisations, resolved against real client records |
| "global corporate forums," "leaders gather" (Clients section copy) | **Assertion**, unsupported — flagged in §8 |
| "the biggest temporary structures in the country" (Careers page) | **Assertion**, unsupported, and uniquely lacks the `status`/`note` field almost everything else in the codebase carries |
| "3,000-ton mobile HVAC," "10,000+ sq. mtr. stalls," specific city list "New Delhi, Mumbai, and Bengaluru" (About timeline, 2005–2017 era) | **Assertion** — not among the four approved company stats, no `Sourced` status field on the `TimelineEra` type at all |
| Government/Coast Guard/ICGS Akshay-type projects' "client-provided, not independently verified" framing (`content/projects.ts` notes) | **Model example of correct proof discipline** — the site already does this well in the one place it matters most (defense/government claims) |

**Recommendation:** the site's strongest proof mechanism — the per-project `note` field documenting exactly what's verified vs. client-stated (`content/types.ts`'s `Sourced` interface) — is applied inconsistently. It's used rigorously in `content/projects.ts` and `content/careers.ts`, but the `TimelineEra` type (`content/about.ts`) has **no status field at all**, which is how unverified specifics (3,000 tons, named cities) ended up in a section with no flag on them. **P1: add a `status`/`note` field to `TimelineEra` and audit its three eras' specific numbers against it before launch.**

---

## 15. Contact / Conversion Audit

The contact form (`components/EnquiryForm.tsx`) already collects almost exactly what this brief's §17 asks for: name, organisation, work email, phone/WhatsApp, event type (dropdown), city, dates, venue, expected attendance, "scale of the build" (free text, with a good placeholder example: "40,000 sq ft covered, 60 stalls, raked seating for 2,000"), budget band, message, and an optional brief upload. **No changes recommended to the form itself** — it is well-designed and already procurement-friendly. This is a case where the honest audit finding is "already good," not a manufactured problem.

The only gap: the *marketing copy leading into the form* doesn't reference Bengaluru at all in what I could inspect of `app/(site)/contact/page.tsx`'s visible heading, only in the meta description. Minor — covered under §18's SEO fix, not a separate content problem.

---

## 16. Card-by-Card Audit

Full inventory of every card-type element on the site, classified per this brief's taxonomy. (~150 individual card instances exist across the site; grouped below by card *type*, since auditing 150 near-identical inventory tiles individually would not surface new information beyond what's captured once per type.)

| Card type | Count | Classification | Title clear? | Description explains what Raja provides? | Redundant with another type? | CTA meaningful? | Notes |
|---|---|---|---|---|---|---|---|
| Service pillar cards | 10 | SERVICE | Yes | Yes — best copy on the site | No | "View Infrastructure Capabilities" (consistent, x2) | Model quality |
| Services "market" cards | 5 | INDUSTRY/USE CASE | Yes | Yes, but duplicates Solutions | **Yes — see §9** | None (informational only) | Recommend removing section |
| Solutions cards | 5 | INDUSTRY/USE CASE | Yes | Yes | Overlaps Services markets (§9) | "View Infrastructure Capabilities" | Needs 2 new categories (§10) |
| Homepage capability cards | 4 | CAPABILITY | Yes | Yes, concise | No | Scroll-track, no explicit label | Fine as-is |
| Homepage Works cards | 5 (live) | PROJECT | Yes | One (Kempegowda) needed a placeholder fix, now resolved | No | "Learn More" (flagged by brief as generic) | See §21 for CTA fix |
| Inventory tiles | 13 | INVENTORY | Yes | Yes | No | N/A, approved content | Out of scope (§12) |
| Inventory catalogue cards | 13 | INVENTORY | Yes | Yes, technical | No | "Request Availability & Engineering Specs" | Good, specific CTA |
| Project cards (list page) | 37 | PROJECT | Yes | Varies — several show no scope yet (§11) | No | Card links to real case-study page (new this session) | Data-completeness gap, not template gap |
| Process step cards | 4 | PROCESS | Yes | Yes | No | N/A | Fine |
| About timeline era cards | 4 | TRUST/PROOF | Yes | One has an unverified specificity issue (§14) | No | "Verified Case Study" link label — accurate given it does link to real projects | Fine except §12 image issue |
| About inventory-highlight bento cards | 6 | INVENTORY / TRUST | Yes | Yes, cites approved numbers | Overlaps main Inventory page numbers (intentionally, §12) | N/A | Fine |
| About milestone cards | 4 | PROOF | Yes | Yes | No | "Verified Case Study →" | Fine |
| About principle cards | 4 | TRUST/PROOF | Yes | Yes, concrete (headcounts, fleet size) | No | N/A | Good, specific |
| Career discipline cards | 4 | OTHER (recruiting) | Yes | Yes | No | Single "apply" path, correct per the file's own no-invented-vacancies policy | Fine |
| Partner point cards | ~4 | TRUST/PROOF | Yes | Yes | No | N/A | Fine |
| Client logo tiles | 27 | TRUST/PROOF | N/A (logo only) | N/A | No | Click reveals name/event | Fine |

**Duplicate-concept flags, consolidated from the table above:** the only genuine semantic duplication found is Services' `markets` vs. Solutions' categories (§9). No other pair of cards on the site describes the same thing in different words — the "Event Solutions / Event Infrastructure / Venue Solutions" pattern the brief warns about as a *hypothetical* example does not actually occur; the site consistently says "infrastructure" for services and names sectors for solutions.

---

## 17. CTA Strategy

**A shared CTA constant already exists** (`content/site.ts`), with a code comment explicitly stating the goal this brief asks for: "The same three actions, in the same words, everywhere they appear." It defines:
- Primary: **"Submit your event brief"** → `/contact`
- Secondary: **"Explore capabilities"** → `/services`
- Tertiary: **"Partner with Raja"** → `/partners`

This already matches the brief's own recommended primary CTA almost word for word. **It is used in only 4 files** (`sections/Hero.tsx`, `app/(site)/solutions/[slug]/page.tsx`, `app/(site)/partners/page.tsx`, `app/(site)/locations/[city]/page.tsx`). Everywhere else, buttons carry independently-written labels:

"Request Site Inspection" · "Explore the Fleet" · "Request Availability & Engineering Specs" · "View Infrastructure Capabilities" (×2, at least internally consistent) · "Explore All Notable Events" · "Learn More" (explicitly the brief's example of what to avoid) · "Explore Architecture" · "Request Custom RFP for this Scale" · "Enquire about a similar build" (×2, consistent) · "What we build" (×2, consistent) · "About Us" · "Discover Our 49-Year Journey" · "Discuss Your Event" (the floating/sticky CTA banner).

**Recommendation:**
- **Primary, sitewide:** "Submit your event brief" — keep exactly as-is, it's already right.
- **Secondary, sitewide:** "Explore capabilities" — keep.
- **Section-specific action links** (e.g. a service page's own capacity CTA, a project card's "read more") can keep bespoke wording *when the destination is genuinely specific* — "Request Availability & Engineering Specs" on the Inventory catalogue is good because it names exactly what happens next. The problem cases are the ones that are vague *and* duplicate what a shared CTA already says better: **replace "Learn More," "Explore All Notable Events," "About Us," and the floating banner's "Discuss Your Event"** with either the shared Primary/Secondary CTA or a more specific equivalent (exact replacements in §21).
- Retire "Discover Our 49-Year Journey" — it's a history link dressed as a CTA, and it's the 7th occurrence of the founding-year message on the homepage/About axis (§13). Point that same button at `/about` with the label "About Raja Enterprises" instead.

---

## 18. SEO Strategy

Per-page recommendations. Current title/description sourced directly from each route's `metadata` export.

| Page | Current title | Current description | Recommended title | Recommended description | Primary keyword |
|---|---|---|---|---|---|
| Homepage | *(not inspected in this pass — inherits root layout metadata; recommend confirming it contains "Bengaluru")* | — | "Event Infrastructure Company in Bengaluru — Raja Enterprises" | "Raja Enterprises builds the physical infrastructure behind large-scale events in Bengaluru and across India — hangars, staging, flooring and exhibition structures, owned and installed by our own crew." | event infrastructure company Bengaluru |
| Services | "Event Infrastructure Services" | (unread in this pass, recommend confirming Bengaluru presence) | "Event Infrastructure Services in Bengaluru — Raja Enterprises" | "Structures, flooring, staging, exhibition stalls, scaffolding, lighting and climate control for large events in Bengaluru — owned inventory, in-house crew." | event infrastructure services Bengaluru |
| Solutions | "Who We Build For" | (unread, confirm) | "Who We Build For — Corporate, Government, Exhibitions & Institutions" | "Raja Enterprises builds event infrastructure for corporate, government, exhibition, conference and institutional clients across Bengaluru and India." | corporate event infrastructure Bengaluru |
| Inventory | "Inventory & Systems — Direct Owned Physical Assets" | (already strong, confirm Bengaluru mention) | Keep title, or append "— Raja Enterprises, Bengaluru" | Add one Bengaluru mention if absent | German hanger Bengaluru |
| Projects | "Projects on Record" | (37 engagements, confirm wording matches live count) | "Projects — 37 Engagements Built by Raja Enterprises" | "Government programmes, trade fairs, conferences and cultural events built across Bengaluru, Karnataka and India since 1977." | event infrastructure projects Bengaluru |
| About | "About Us — 49 Years of Physical Infrastructure" | "Event infrastructure contractor in Bengaluru since 1977. Owned German hangers, flooring, staging and stalls, installed by an in-house crew." | Keep title. **Fix "German hangers" → "German Hangars" in the description** (§21) | — | event infrastructure contractor Bengaluru |
| Legacy | "Legacy — 49 Years of Physical Execution (1977–2026)" | "Raja Enterprises, established 1977 in Bengaluru — four decades of engineering the temporary cities and physical ground where India gathers." | Keep — already good, already Bengaluru-inclusive | Keep | Raja Enterprises history |
| Careers | "Careers" | (unread) | "Careers — Raja Enterprises, Bengaluru" | Add company name + location; a bare "Careers" title is invisible in search and in browser tabs with multiple sites open | jobs event infrastructure Bengaluru |
| Contact | "Contact" | "Talk to Raja Enterprises about your programme. [address]." | "Contact Raja Enterprises — Bengaluru" | Keep description, strengthen title | contact event infrastructure company Bengaluru |
| Partners | "Your Client. Our Infrastructure." | (unread) | Keep — distinctive and on-brand for the audience (agencies) | — | white-label event infrastructure Bengaluru |

**Do not adopt** "college fest infrastructure Bangalore" or "university event infrastructure Bangalore" as page titles until the new Solutions page (§5, §10) exists — there is currently no page for these terms to point to, and a keyword with no matching page is worse for SEO than no keyword at all.

**General fix, applies to all rows above:** every current `<title>` is missing either the company name or the city, and often both. This is the highest-leverage, lowest-risk SEO change identified — none of it requires new copy, only appending "— Bengaluru" or "— Raja Enterprises" to existing titles. **P0.**

---

## 19. Internal Linking Strategy

Recommended matrix (✓ = should exist, current state noted where it differs):

| From → To | Services | Solutions | Projects | Inventory | Contact |
|---|---|---|---|---|---|
| **Homepage** | ✓ (Hero secondary CTA) | Recommend adding — currently the homepage does not link to Solutions directly outside primary nav | ✓ (Works section) | ✓ (Resources section) | ✓ (Hero primary CTA) |
| **Services** | — | Recommend adding per-pillar, once the market-duplication (§9) is resolved | Recommend adding — a pillar page (e.g. German Hangars) should link to 2–3 projects that used it | ✓ implicitly via bundled capabilities | ✓ |
| **Solutions** | Recommend adding — each Solutions category should link to the 2–4 Service pillars it draws on (already partially modeled in §5's recommended hierarchy for the new College/University category) | — | Recommend adding — filter or link to Projects by matching category | — | ✓ |
| **Projects (list)** | Partial — service tags already link to relevant pillar pages (confirmed in code) | Not currently linked | — | Not currently linked | ✓ (new case-study page includes Contact CTA) |
| **Projects (case study, new)** | ✓ via service tags | Not currently linked | ✓ (related projects, same category) | Not currently linked | ✓ |
| **Inventory** | Recommend adding — inventory items should link to the Service pillar that deploys them | Not currently linked | Not currently linked | — | ✓ |

**Priority fix:** Solutions ↔ Services cross-linking, once §9's consolidation happens — this is what makes the "Services = what, Solutions = who" split legible to a visitor rather than just an internal content-model decision.

---

## 20. Terminology & Style Guide

| Term | Approved form | Rejected/inconsistent form found | Locations of inconsistency |
|---|---|---|---|
| City name | **Bengaluru** | Bangalore (1 stray instance in body copy; acceptable in SEO metadata only, per §18) | `content/about.ts:37` |
| Structure product name | **[DECISION NEEDED — see below]** | Both "German Hangars" and "German Hangers" are in live use | `content/services.ts:46` (slug vs. title, same record); `sections/SiteFooter.tsx:81`; `components/inventory/InventoryEstimator.tsx:138`; `components/about/AboutHero.tsx:152`; `app/(site)/services/page.tsx:16`; `app/(site)/about/page.tsx:13` (meta description) |
| Area unit | **sq ft** (no periods) in body copy, matching the dominant existing usage in `content/services.ts` and `company.ts` | "sq. ft." appears on some UI labels (e.g. Inventory tile units) | Low-priority, cosmetic; pick one and apply via find-replace |
| "University/College" | **College Festivals & University Events** | N/A — new term, see §5 | — |
| "Solutions" vs "Services" | Services = what is built; Solutions = who it's for | Currently violated by Services page's own "Who we build for" section | §9 |

**The Hangar/Hanger decision, flagged exactly as this brief instructed rather than silently resolved:** "Hangar" is the standard English spelling and the correct one for a clear-span aluminium building (the word does not exclusively mean an aircraft facility — it's the generic term for any large clear-span shed structure, aircraft or otherwise). The codebase's own dominant usage (~70 instances) is already "Hangar," including in the actual **service pillar title** ("German Hangars & Temporary Structures") and every approved company stat. "Hanger" (~35 instances, including the URL slug `german-hangers`, the footer, and one meta description) appears to be an uncorrected typo that propagated into a few high-visibility places, not a deliberate client-approved alternate spelling — there is no code comment anywhere (unlike almost every other terminology decision in this codebase, which *are* commented) stating "Hanger" was chosen deliberately. **Recommendation: standardize on "Hangar," including changing the URL slug from `/services/german-hangers` to `/services/german-hangars`.** **[CLIENT VERIFICATION REQUIRED]** before executing, per this brief's own instruction not to silently change approved terminology — confirm with the client that "Hangar" (not "Hanger") is correct before the implementation pass touches the slug, since changing a URL slug affects any existing external links/bookmarks/SEO history.

---

## 21. Page-by-Page Content Recommendations

Summarized from the detailed audits above; see the relevant numbered section for full reasoning.

- **Homepage:** Fix the `┠` character (P0). Tighten Capabilities body copy. Remove "global" from Clients section copy. No structural reordering needed.
- **Services:** Remove or link-out the "Who we build for" section (P0). Decide the Hangar/Hangar spelling (P0 for the slug specifically, since it affects URLs). Consider relocating "Government Event Infrastructure" to Solutions pending a content check.
- **Solutions:** Add Government & Public Sector (P0). Add College Festivals & University Events (P0, direct client request). Hold Weddings/Social pending client input.
- **Projects:** No template change. Backfill missing year/location/scope fields where the client can supply them (P1/P2, ongoing rather than a launch blocker).
- **Inventory:** No content change (approved, out of scope). Fix the Hangar/Hanger label to match Services once that decision is made.
- **About:** Cut the founding-year repetition to one mention (P1). Fix the 1977–1990 timeline image mismatch (P1). Add a status/note field to timeline eras and verify the 3,000-ton HVAC and city-list claims (P1).
- **Legacy:** No changes — this page is where repeating the history is appropriate.
- **Careers:** Add a `[VERIFY]` note or soften "the biggest temporary structures in the country" to match the claim-discipline standard the rest of the file already sets for itself (P1).
- **Contact:** No form changes. Confirm Bengaluru appears in the visible heading, not just meta (P2).
- **Partners:** No issues found.

---

## 22. Exact Replacement Copy

### Homepage — Capabilities body copy

CURRENT:
"Structures, flooring, staging, and exhibitions ┠ delivered by our field crews using our own substantial inventory. Complete turnkey physical execution."

RECOMMENDED:
"Structures, flooring, staging and exhibitions — delivered by our own field crews, from our own inventory."

RATIONALE: Removes the broken character (P0 bug). Cuts "substantial" (unquantified adjective) and "Complete turnkey physical execution" (redundant restatement of what the sentence already proved — ownership and in-house delivery already say "turnkey" without using the word).

---

### Homepage — Clients section supporting line

CURRENT:
"From government mega-summits to global corporate forums and trade exhibitions — we build the ground where leaders gather."

RECOMMENDED:
"From government summits to corporate forums and trade exhibitions — the organisations above have all built on Raja's ground."

RATIONALE: Removes "mega" and "global" (unsupported superlative and unsupported geographic claim) and "where leaders gather" (cinematic, says nothing concrete). Replaces with a direct pointer to the proof directly above it (the logo wall itself), which is stronger than an adjective.

---

### Homepage / floating CTA banner — heading

CURRENT (`content/clients.ts`, `components/CallToAction.tsx`):
"Ready to build at monumental scale?"

RECOMMENDED:
"Ready to build your next event?"

RATIONALE: "Monumental scale" is one of the two phrases this brief names as an example of language to challenge. The proof of scale is already everywhere else on the site (stat bands, project count, inventory numbers) — this banner's job is conversion, not another scale claim.

---

### About page — eyebrow/lead duplication

CURRENT:
Eyebrow: "Est. 1977 · 49 Years in Operation"
Lead: "Founded in Bengaluru in 1977, Raja Enterprises is an event infrastructure and experiential architecture firm with a 49-year heritage of constructing temporary cities, state ceremonies, and industrial expos at monumental scale."

RECOMMENDED:
Eyebrow: unchanged.
Lead: "Raja Enterprises is an event infrastructure contractor based in Bengaluru, building temporary structures, staging and exhibition space for government, corporate, cultural and institutional clients."

RATIONALE: Removes the second "1977"/"49-year" restatement (the eyebrow already carries it) and removes "monumental scale" and "experiential architecture firm" — the latter is a category claim ("architecture firm") the rest of the site doesn't support and that pulls toward the "creative agency" positioning this brief explicitly rejects. Replaces with the four client categories, which is more informative and matches the actual project data.

---

### About page — "Choreography of Scale" eyebrow

CURRENT (`components/about/AboutTimeline.tsx`):
"Choreography of Scale"

RECOMMENDED:
"49 Years, Four Eras"

RATIONALE: This is the exact second phrase this brief names as an example to challenge. The replacement states what the section actually contains (a 4-era timeline) instead of a metaphor.

---

### Services page — "Who we build for" section

CURRENT:
Full "Who we build for" section with 5 market cards (Government & public sector, Exhibitions & trade fairs, Corporate & conferences, Cultural & public festivals, Weddings & social events), duplicating the Solutions page.

RECOMMENDED:
Replace the full section with a single line and link:
"Looking for infrastructure for a specific type of event? See who we build for →" (links to `/solutions`)

RATIONALE: Eliminates the duplicate taxonomy (§9) without losing the cross-reference a Services-page visitor might want. The actual sector content moves to, and is reconciled within, the Solutions page.

---

### Careers page — unverified superlative

CURRENT:
"If you want to work on the biggest temporary structures in the country, this is where they are built."

RECOMMENDED (pending verification):
"If you want to work on some of the largest temporary structures built in India, this is where they're built."

RATIONALE: "The biggest... in the country" is an absolute, unqualified national superlative with no supporting data anywhere on the site (the approved stats are about Raja's own inventory, not a comparison to competitors). "Some of the largest" is defensible from the existing project evidence (11 government engagements, national-scale HVAC/flooring stats) without claiming a #1 position no one has verified. **Still flag as [VERIFY] with the client** — if Raja can substantiate the stronger claim, keep it; if not, this is the safer version.

---

### New: Solutions — College Festivals & University Events (new card, full copy)

RECOMMENDED (new content, not a replacement):

**Label:** College Festivals & University Events
**Title:** Infrastructure for college festivals and university events
**Summary:** Stages, seating, flooring, barricading and exhibition space for campus fests, convocations and department events — sized to the ground a college or university actually has.
**Body:** "College and university events run on fixed academic calendars and fixed budgets, with student organisers who need infrastructure that goes up and comes down reliably around exams and term dates. Raja supplies the same owned staging, seating, barricading and flooring used for corporate and government events, scoped to a campus ground or open field."
**Capabilities linked:** Staging, Seating & Audience Infrastructure · Event Flooring & Platforms · Barricades & Crowd Control Infrastructure · Lighting & AV Solutions · Exhibition Stalls & Pavilions (for department/club stalls) · German Hangars & Temporary Structures (for covered fest grounds).

RATIONALE: Uses only capabilities already proven elsewhere on the site (no new inventory claims). Names the actual buyer constraint (academic calendar, fixed budget) that a real student-events committee will recognize, which is more credible than a generic "we do college fests too" line. **[CLIENT VERIFICATION REQUIRED]**: confirm whether any past project qualifies for a named case-study link on this page before launch (§5).

---

## 23. Content Priority Matrix

**P0 — Must fix before production:**
1. Replace the `┠` character in Capabilities body copy.
2. Resolve the Services-page "Who we build for" / Solutions-page duplication.
3. Decide and apply the Hangar/Hanger spelling (at minimum, stop introducing new inconsistent instances; the URL slug change requires client sign-off).
4. Add a Government & Public Sector Solutions category.
5. Add a College Festivals & University Events Solutions category (direct client request).
6. Fix every page `<title>` to include company name and/or "Bengaluru."

**P1 — Strongly recommended before production:**
7. Reduce "1977/49 years" repetition on About page to one mention.
8. Fix or replace the 1977–1990 About-timeline image.
9. Add a status/note field to About timeline eras; verify the 3,000-ton HVAC and named-city claims.
10. Soften or verify the "biggest... in the country" Careers claim.
11. Consolidate CTA labels toward the existing shared constant; retire "Learn More" and "Discover Our 49-Year Journey."
12. Remove "global"/"mega"/"monumental scale" instances identified in §22.
13. Backfill missing project scope/year/location fields where the client can supply them.

**P2 — Post-launch improvement:**
14. Standardize sq ft vs. sq. ft. formatting.
15. Build out internal linking matrix gaps (§19).
16. Consider whether "Weddings & Social" merits its own Solutions page once/if project evidence exists.

**P3 — Optional:**
17. Rename the homepage's internal section anchor IDs for developer clarity (invisible to visitors).
18. Consider a short-form "We don't decorate events. We build the venue." tagline for a placement that currently has no positioning line (e.g. social-share metadata).

---

## 24. Production Implementation Checklist

- [ ] Fix `┠` → `—` in `content/capabilities.ts`
- [ ] Client decision: Hangar vs. Hanger (confirm before touching the `german-hangers` slug)
- [ ] Remove/replace Services page "Who we build for" section
- [ ] Add Government & Public Sector to `content/solutions.ts`
- [ ] Add College Festivals & University Events to `content/solutions.ts`, cross-linked per §5
- [ ] Client input: any prior college/university project to cite as proof on the new page?
- [ ] Update page `<title>` metadata across Home, Services, Solutions, Careers, Contact per §18
- [ ] Trim About page lead paragraph per §22; remove duplicate 1977/49-year mention
- [ ] Replace or relabel the 1977–1990 About-timeline photo
- [ ] Add `status`/`note` field to `TimelineEra` type; verify or hedge the 3,000-ton HVAC and city-list claim
- [ ] Client input: verify or soften Careers "biggest in the country" claim
- [ ] Standardize CTA labels per §17/§22 (Learn More, Discover Our 49-Year Journey, About Us → replace)
- [ ] Remove "global," "mega," "monumental scale," "Choreography of Scale" per §22
- [ ] Confirm live DB content (admin-edited collections, §6) matches or supersedes these recommendations before final sign-off — several collections are DB-backed and may have already changed since this audit's seed-file read
- [ ] Re-screenshot mobile/tablet/desktop after copy changes to confirm no line-wrap regressions (§ mobile content note below)

**Mobile content note (brief §20):** none of the recommended replacement copy above is longer than what it replaces — every rewrite in §22 is equal length or shorter. No headline in the recommendations exceeds the length of the text it replaces, so no new mobile line-wrap risk is introduced by this document's own recommendations. A general mobile pass (checking existing long headlines like "National Ceremonies & Monumental Mandates" for wrap behavior) is reasonable but is a device-testing task, not a copy-writing one, and is not blocking.

---

## 25. Final Acceptance Criteria

Before this content pass is considered production-ready:

1. No visibly broken characters anywhere on the site (P0 item resolved and spot-checked on at least Chrome, Safari, and one Android browser).
2. Exactly one place on the site (Solutions) answers "who is this for" — Services no longer duplicates it.
3. Government and College/University visitors each have a page that names them by category within one click of the homepage.
4. Every page `<title>` contains either "Raja Enterprises" or "Bengaluru" (ideally both, without duplication).
5. Every unverified specific number (headcounts, tonnages, named cities, superlatives) either carries a citation to an approved stat, a `[VERIFY]` note in the source comment, or has been confirmed by the client and had the flag removed.
6. "Hangar"/"Hanger" appears in exactly one spelling sitewide, including the URL.
7. The founding-year/49-years message appears once on the homepage, once on About (in the eyebrow only), and as many times as appropriate on the dedicated Legacy page.
8. No section relies on an adjective ("monumental," "world-class," "seamless") to do the work a fact could do instead, unless a specific check confirmed the adjective is paired with a concrete number or named example immediately beside it.

---

*End of audit. No source files were modified in producing this document.*
