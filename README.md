# Raja Enterprises

Large-scale event infrastructure — Bengaluru, since 1977.

Marketing site plus a content admin the client runs themselves.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · GSAP 3.15 ·
SQLite via `node:sqlite` (built into Node 22+, no native module)

## Layout

```
app/(site)/      the public site — layout, homepage, six interior pages
app/(admin)/     the content admin, on its own root layout
sections/        the homepage sections; index.tsx holds the server wrappers
components/      Eyebrow · Statement · SectionTitle · WorkCard · InventoryTile ·
                 EnquiryForm · PageTransition · SiteNav · PageShell
motion/          ease.ts (the two Figma curves) · primitives.ts · MotionProvider
content/         typed content modules — the SEED data and the shape the admin edits
lib/             db.ts (SQLite) · auth.ts (sessions) · store.ts (the read layer)
scripts/         asset pipeline, inspection, content audit, photo sourcing
client-gallery/  research dossier for the 27 client events
```

## Commands

| | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run inspect` | screenshot the running site at 4 viewports, report overflow + console errors |
| `npm run check:fallbacks` | verify reduced-motion and no-JS remain fully readable |
| `npm run audit:content` | list every unresolved content record |

`inspect` needs Playwright browsers: `npm i playwright --no-save && npx playwright install chromium`

---

## The admin

`/admin` — Raja signs in here to change anything on the site.

**Test credentials** (development default):

```
admin@rajaenterprises.co
raja-admin-2026
```

These are seeded on first visit and are shown on the login screen. **They stop
being shown, and stop working, the moment the password is changed in Settings —
or as soon as `RAJA_ADMIN_PASSWORD` is set in the environment.** Change them
before launch; the dashboard nags until you do.

### What it edits

| Section | What it controls |
|---|---|
| Projects | The case study cards on the homepage and portfolio page |
| Client events | The recent-engagements table |
| Capabilities | The four cards in the pinned carousel |
| Inventory | The owned-equipment tiles |
| Build process | The three stages: bare ground, structure, flooring |
| Clients | Logos above the closing call to action |
| Legacy photos | The scattered photographs in the "Since 1977" section |
| Media library | Upload photographs and video; images are resized and converted to WebP |
| Settings | Contact details, the hero headline, the four scale figures, password |
| Enquiries | Everyone who has used the contact form — the seed of the CRM |

Every save publishes immediately. Records can be reordered, and unpublished
without being deleted.

### How content resolves

Each collection has two sources: the typed modules in `content/` and whatever
the client has saved in the database.

**If a collection has never been written to, the seed in `content/` wins.**

So the site renders correctly on a machine with no database, and the first save
to a collection takes ownership of *that collection only*. This has one
consequence worth knowing:

> Once Raja has edited, say, Projects, changing `content/works.ts` no longer
> affects the site. The database is authoritative for that collection from then
> on. Delete `.data/raja.db` to fall back to the seeds again.

### Environment

```bash
RAJA_ADMIN_EMAIL=...       # seeds the first account (default: admin@rajaenterprises.co)
RAJA_ADMIN_PASSWORD=...    # set this in production
RAJA_DB_PATH=...           # default: .data/raja.db
```

### Deployment

The admin writes to the filesystem — SQLite at `.data/` and uploads at
`public/uploads/` — so it needs **a normal Node host with a persistent disk**: a
VPS, Render, Railway, Fly, or a container. Both paths are gitignored.

**It will not work on Vercel's serverless functions**, whose filesystem is
read-only and ephemeral. Moving there means swapping SQLite for Postgres and
uploads for blob storage; every query goes through `lib/db.ts` and
`lib/store.ts`, so that is two files, not a rewrite.

Back up by copying `.data/raja.db` and `public/uploads/`.

---

## Content status

The Figma design is **semi-approved**. Copy that was duplicated, contradictory
or absent is not invented — it lives in `content/` marked `provisional` or
`pending` and renders through a visible `<Placeholder>`. Run
`npm run audit:content` for the current list.

### Photography

The hero is Raja's own film. **Everything else is licensed stock** (Pexels
License: free for commercial use, no attribution required), and it is
**illustrative, not evidential** — it shows the category of work, not Raja's own
sites.

This matters most on the Projects cards and the Build process sequence, where
the photograph is doing the arguing. Replacing them with Raja's own photographs
through the Media library is the single biggest improvement available to this
site, and it needs no developer.

Media clearance is enforced in code, not by convention: `content/media.ts`
gates every asset, and `publishable()` returns null for anything uncleared, so a
research-only image cannot reach production even if it is wired into a content
module by mistake.

Replaced images carry a content hash in the filename
(`capability-staging.a1b2c3d4.webp`). Reusing a filename for different bytes is
what serves a stale photograph through the image optimiser, the CDN and the
visitor's browser.

## Motion

The Figma file holds a real keyframe timeline — 150 animated nodes on one
19-second cohort — decomposed into per-section GSAP timelines in `motion/`,
preserving the authored staggers and both easing curves.

- Display type is revealed **line by line** behind its own mask (`revealLines`),
  not faded as a block.
- Every timeline is gated behind `prefers-reduced-motion`, and the page is fully
  readable with JavaScript disabled.
- Entrances release their `will-change` when they finish, so the page does not
  accumulate compositor layers it will never animate again.
- There is deliberately **no smooth-scroll library**. It transforms the content
  wrapper, which breaks the `position: sticky` the Works card stack depends on
  and the nav's scroll listener. Native scroll with no layout jank is both safer
  and closer to how Apple and Stripe actually behave.

## client-gallery

Research only. Third-party image binaries are gitignored — this repository is
public and those rights are unresolved. `client-gallery/index.md` is the master
index.

Event evidence and Raja execution evidence are tracked separately, on purpose:
a photograph of an event never proves who built it.
