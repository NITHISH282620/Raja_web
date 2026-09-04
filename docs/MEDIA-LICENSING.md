# Media licensing record

Every non-Raja asset served from this site, with its source and the basis on
which it is used. Kept current as media changes.

## The three clearances

| Clearance | Meaning | May be captioned as Raja's work |
|---|---|---|
| `raja-original` | Photographed by or for Raja | **Yes** |
| `client-approved` | Supplied and approved by the client | **Yes** |
| `licensed` / `figma-supplied` | Third-party, licensed for commercial use | **Never** |

`research-only` never reaches production — `publishable()` returns null for it.

## Raja-original

| Asset | Source | Depicts | Used on |
|---|---|---|---|
| `hanger-frame-erection.8e578fc4.webp` | Supplied by the client, 2026-09-04 (`german_tent_raja.jpeg`) | A German hanger frame part-erected on open ground before cladding | `/services/german-hangers` hero · `/services` card |

This is the **only** Raja-original still photograph currently held. It is
captioned "Raja site photograph" wherever it appears.

## Representative — Pexels

All sourced through `scripts/source-photography.mjs`. **Pexels License:** free
for commercial use, no attribution required, modification permitted. Every one
is captioned "Representative — not a Raja project photograph" wherever it could
otherwise be read as evidence.

| Asset | ID | Source | License | Attribution | Used on |
|---|---|---|---|---|---|
| `service-exhibition-stalls.10a9e410.webp` | 35138560 | [link](https://www.pexels.com/photo/35138560/) | Pexels License | No | `/services` Exhibition Stalls card · `/projects` exhibition banner |
| `service-expo-structure.ef0551b6.webp` | 37439236 | [link](https://www.pexels.com/photo/37439236/) | Pexels License | No | `/services/german-hangers` 'In use' figure |
| `service-conference.9e8df1c8.webp` | 9275222 | [link](https://www.pexels.com/photo/9275222/) | Pexels License | No | `/services` Government Events card · `/projects` conference banner |
| `service-staging.0fb6d139.webp` | 36839425 | [link](https://www.pexels.com/photo/36839425/) | Pexels License | No | `/services` Staging & Seating card |
| `inventory-barricades.f368fe44.webp` | 33877383 | [link](https://www.pexels.com/photo/33877383/) | Pexels License | No | `/inventory` Barricades card |
| `inventory-fleet.13f2e483.webp` | 12555017 | [link](https://www.pexels.com/photo/12555017/) | Pexels License | No | `/inventory` Logistics Fleet card |
| `category-social.ff84e1c8.webp` | 30215011 | [link](https://www.pexels.com/photo/30215011/) | Pexels License | No | `/projects` weddings & social sector banner |
| `category-corporate.1ccebf22.webp` | 16859956 | [link](https://www.pexels.com/photo/16859956/) | Pexels License | No | `/projects` corporate sector banner |
| `category-cultural.a36405bc.webp` | 15203359 | [link](https://www.pexels.com/photo/15203359/) | Pexels License | No | `/projects` cultural sector banner |

## Deliberately not used

**`events photos/` (92 files, client-supplied 2026-09-04).** Photographs *of*
the 27 events, collected from the web — filenames show Google Images defaults
(`images-1.jpeg`), Twitter/X media IDs (`Fp_M1w2aAAAsN36.jpg`), Flickr IDs, news
article slugs, and the client organisations' own site assets. They are
third-party copyrighted works with unresolved rights, and a photograph of an
event does not establish who built it. They remain research-only and gitignored,
as `client-gallery/` already records.

**Three categories have no honest photograph** and use typography and verified
figures instead:

| Category | Why nothing was used |
|---|---|
| Climate control | Searches return domestic split-unit air conditioners — misleading beside a 5,00,000 sq ft claim |
| Logistics | Returns US-market semi trailers and a U-Haul; wrong market, reads as imported stock |
| Government & public sector *(project banner)* | Candidates were US-market imagery, the wrong category, or a duplicate of a frame already shipped for staging. That sector leads with its engagement count instead |
| Event scaffolding | Returns construction-site scaffolding, which the brief explicitly excludes. Event production scaffolding is a distinct subject and no suitable frame was found |

A second sourcing round found usable frames for **barricades** and **logistics fleet**, which now replace mismatched images on `/inventory`. **Climate control** was searched twice and still has nothing honest — every result is a domestic split-unit air conditioner or a distant industrial plant. That card now leads with its verified capacity figure instead of a photograph.

Replacing these three with Raja's own photographs is the highest-value media
task available.

## Sourced but not shipped

Two further frames were sourced and reviewed — a lighting truss against open sky
and rows of stacked event seating — but no card on the site currently needs
them, and shipping unused binaries into a public repository is only clutter.
They can be re-sourced in a minute from `scripts/source-photography.mjs` with
the queries `stage lighting rig spotlights concert` and
`conference hall rows of chairs audience`.
