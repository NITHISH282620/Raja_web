# Owner verification checklist

**For the call of 2026-09-06.** Everything below is content only. The system is
technically complete; none of these items blocks going live, and every one of
them can be corrected afterwards.

**Nothing here has been guessed.** Where two sources of the site disagree, both
values are shown and the site continues to display what it displays today.

---

## A. Conflicts — two different values exist in the codebase

These are the ones that matter most. The site currently shows the left column.

### A1. Homepage project card titles

| Homepage shows today | Project record says |
|---|---|
| Tent City, Kanha Shanti Vanam | Tent city, Bengaluru |
| La Renon Exhibition Stalls | Company event |
| Navaratri Function | Navaratri Function 2023 |
| EIMA Agrimach 2024 | EIMA Agrimach 2024 ✅ agree |

**Ask:** which wording is correct for each?

### A2. EIMA homepage image

Homepage shows `eima-expo-crowd` (a crowded trade-fair ground). The project
record's first image is `eima-mahindra-stall`.

**Ask:** which photograph should lead the EIMA card?

### A3. Client names — the same organisation, two names

| | |
|---|---|
| Federation of Indian Chambers of Commerce & Industry (FICCI) | FICCI |
| Indian Society of Gastroenterology (ISGCON) | ISGCON Bengaluru |
| Collegedunia | Collegedunia Web |

**Ask:** full legal name or short name on the client wall?

Also: `KSMCAL — Dam Safety`, `ABS — Vidyapeeta Fair` and similar entries mix a
client with an event. **Ask:** confirm these split into client + project.

### A4. Capacity figures — with and without "+"

| Item | One place says | The other says |
|---|---|---|
| German hangers | 5,00,000**+** sq ft | 5,00,000 Sq. Ft. |
| Wooden floors | 10,00,000**+** sq ft | 10,00,000 Sq. Ft. |
| Staging | 1,00,000**+** sq ft | 1,00,000 Sq. Ft. |

**Ask:** is the true figure "at least" this, or exactly this?

## B. Figures to confirm

Currently published. All are Raja-supplied; none independently verified.

| Figure | Where |
|---|---|
| Established 1977 / 49 years | Site-wide |
| 5,00,000+ sq ft German hangers | Homepage, /inventory, /partners, Bengaluru |
| 10,00,000+ sq ft wooden flooring | Same |
| 1,00,000+ sq ft staging | Same |
| 15,000 sq m Octanorm & Maxima stalls | /inventory |
| 3,000 tons air-conditioning | /inventory |
| 1,00,000 RFT barricades | /inventory |
| 20 vehicles | /inventory |

## C. Claims that carry risk if wrong

Flagged previously and left in place for the owner to confirm.

| Claim | Page |
|---|---|
| **"49 Years Without a Structural Incident"** | /legacy |
| **"100% Certified Extrusions … 6061-T6 … verified tensile and shear thresholds"** | /legacy |
| "accompanied by certified structural test reports" | /inventory |
| "Tested Under Extreme Field Loads" | /inventory |
| "manufactured to strict German safety standards" | /inventory |
| Membrane 850 g/m², ridge height up to 12.5 m, clear-span list | /inventory |
| **Quote attributed to "Raju & Venkat, Founders"** | /legacy |

The safety record and the attributed quote carry the most exposure — an
unverifiable safety claim and words put in named people's mouths.

## D. Imagery

### D1. Images that are NOT Raja's work — must never be published as such
Found by opening every file rather than trusting its name:

| File | Actually shows |
|---|---|
| `capability-structure.webp` | **PONCHO 2025** — an Argentine craft fair |
| `capability-exhibition.webp` | **Baku Cinema Breeze Festival**, Azerbaijan |

Currently **unused**. They must not be assigned to any Raja project.

### D2. Missing imagery — NEEDS CLIENT IMAGE
- **Event scaffolding** — no photograph of a camera platform, lighting tower or
  raked seating deck exists. The page currently shows structural erection, with
  alt text saying exactly that.

### D3. Reused images — same photo in many places
| Photo | Uses |
|---|---|
| `kanha-canopy-assembly-aerial` | 10× across 5 routes |
| `isgcon-stage-lamp` | 9× |
| `german-hanger-aerial` | 8× (byte-identical to `kanha-canopy-night`) |

**Ask:** more photographs for these sections?

### D4. Project photographs to confirm
Confirm each is Raja's own work and cleared to publish: Kanha Shanti Vanam,
EIMA Agrimach, La Renon, Art of Living, ISGCON, FC Expo, ICGS Akshay,
Kempegowda T2, Karnataka swearing-in, Ambedkar Jayanti.

## E. Client list
27 organisations on the wall; **15 still show initials** because no logo file
exists — ABS, Buildtek, Central Silk Board, Kannada Sahitya Parishat, KSMCAL,
Karnataka Chalanachitra Academy, University of Agricultural Sciences and others.

**Ask:** logo files, and confirm every one of the 27 is a real client.

## F. Copy to confirm
- Homepage hero heading and paragraph
- The six capability labels
- Service page copy (6 pages)
- Solution page copy (5 pages)
- Partners page proposition
- About / Legacy narrative
- Contact details: **+91 98450 44177**, four landlines, `raju@rajaenterprises.co`

## G. Social profiles — currently removed
The three links previously on the site pointed at **other companies**: a
Punjabi-language Facebook page, a parked Instagram account with zero posts, and
"Raja Enterprises LLC", a retail business in Salt Lake City, Utah. They are
removed. **Ask:** the real profile URLs, if any exist.

---

## TECHNICALLY READY — no owner input needed

All 23 public routes · enquiry system end to end · admin authentication with no
default credentials · private document authorization · 390px mobile layout · SEO
metadata, sitemap, robots, structured data · 103-check E2E suite.

**Editable from the admin, on a phone, with no developer:**
projects · clients · capabilities · homepage inventory tiles · process steps ·
event categories · legacy collage · **service pages** · **solution pages** ·
**capacity figures** · hero text · contact details · site stats.

Verified live: changing a capacity figure in the admin updated /partners,
/locations/bengaluru and the homepage, then restored.

**Still needs a developer** — not yet in the admin: About, Legacy narrative,
Careers, Locations, the /inventory detailed catalogue, Partners page copy, and
per-page SEO overrides.

## What is NOT waiting on this call

Technically complete and verified: all 23 routes, the enquiry system end to end,
admin authentication, private document authorization, mobile layout at 390px,
SEO metadata, sitemap, robots, structured data, and the 103-check E2E suite.

**Content changes after the call do not need a developer** for: projects,
clients, capabilities, homepage inventory tiles, process steps, event
categories, the legacy collage, hero text, contact details and site stats.

**Content changes that DO still need a developer** — not yet in the admin:
service pages, solution pages, locations, About, Legacy, Careers, the
`/inventory` detailed catalogue, capacity figures, and per-page SEO. These are
the next build step.
