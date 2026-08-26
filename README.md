# Raja Enterprises

Large-scale event infrastructure — Bengaluru, since 1977.

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · GSAP 3.15

## Layout

```
app/         layout, page, globals.css (the whole token layer)
sections/    the nine sections of the Figma `main` frame
components/  Eyebrow · Statement · WorkCard · InventoryTile · Buttons · Placeholder
motion/      ease.ts (the two Figma curves) · primitives.ts · MotionProvider
content/     typed content modules — all unresolved copy lives here, not in markup
scripts/     asset pipeline, visual inspection, fallback checks, content audit
client-gallery/  research dossier for the 27 client events
```

## Commands

| | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run assets` | re-run the Figma asset pipeline into `public/` |
| `npm run inspect` | screenshot the running site at 4 viewports, report overflow + console errors |
| `npm run check:fallbacks` | verify reduced-motion and no-JS remain fully readable |
| `npm run audit:content` | list every unresolved content record |

`inspect` and `check:fallbacks` need Playwright browsers:
`npx playwright install chromium`

## Content status

The Figma design is **semi-approved**. Copy that was duplicated, contradictory
or absent in the file is not invented here — it lives in `content/` marked
`provisional` or `pending` and renders through a visible `<Placeholder>`.
Run `npm run audit:content` for the current list.

Before launch, four things need real content: the case studies, the
build-sequence photography, the client list, and contact details.

## Motion

The Figma file holds a real keyframe timeline — 150 animated nodes on one
19-second cohort. It is decomposed into nine per-section GSAP timelines in
`motion/`, preserving the authored staggers and both easing curves. Every
timeline is gated behind `prefers-reduced-motion`, and the page is fully
readable with JavaScript disabled.

## client-gallery

Research only. Third-party image binaries are gitignored — this repository is
public and those rights are unresolved. `client-gallery/index.md` is the master
index; each event folder holds `sources.md` and `manifest.json`.

Event evidence and Raja execution evidence are tracked separately, on purpose:
a photograph of an event never proves who built it.
