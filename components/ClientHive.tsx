"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, release, q } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";
import { weave, type RosterEntry } from "@/content/clientRoster";

/**
 * The client honeycomb.
 *
 * THE COMPOSITION IS WING / CENTRE / WING. This is the thing earlier passes got
 * wrong. The roster was rendered as one continuous left-to-right strip with the
 * Raja mark absolutely positioned over the middle of it, which meant the mark
 * sat *on top of* client tiles and hid them, and the strip ran off both edges of
 * the panel. Production does something different and better: the clients are
 * split into two combs, the Raja hexagon sits between them as a real element in
 * the flow, and the whole thing is centred and contained.
 *
 * So the mark is now a flex item, not an overlay. It occupies its own space, the
 * gap either side of it is real space rather than a radial gradient painted over
 * tiles, and nothing is ever obscured.
 *
 * ONE MARKUP TREE FOR EVERY WIDTH. Only two things change with the viewport: the
 * hexagon size, and whether the row needs to scroll. At desktop widths the whole
 * composition fits inside the frame and simply centres; below that the same row
 * becomes draggable. The geometry is identical at 360px and at 1440px, which is
 * what stopped desktop and mobile from drifting apart the way the two old
 * layouts did.
 */

/**
 * Flat-top hexagons tile in COLUMNS, not rows.
 *
 * A flat-top hex has its points on the left and right, so neighbours interlock
 * sideways. Stack them vertically into a column, overlap the next column by a
 * quarter of a width so the points slot into the notches, and drop alternate
 * columns by half a height. Those three numbers are the honeycomb.

 * TWO PER COLUMN. This is the production composition and it is deliberate: the
 * comb is two tiles deep, so a wing is three columns of two either side of the
 * Raja mark, and the whole thing reads as one compact cluster rather than as a
 * slab of logos. Deeper combs were tried — three and four per column — and both
 * fit more of the roster on screen at once, but neither is the shape this
 * section is supposed to be.
 *
 * The rest of the roster is not dropped for it. Every client sits in the same
 * two-deep strip; it simply runs wider than the frame, and the reader drags it
 * through. What is on screen at rest is production's twelve-tile composition,
 * centred on the mark. What is off screen is the other fifteen. */
const COL_OVERLAP = 0.25; // of cell width — slots the points into the notches
const COL_DROP = 0.5; // of cell height, applied to alternate columns
const PER_COL = 2;

/**
 * The tile is drawn smaller than its cell. The honeycomb positions stay exactly
 * as they are — that is what makes it a comb rather than a grid — but each
 * hexagon is inset inside its cell so the tiles read as separate cards with air
 * between them. Drawn edge to edge they fuse into one white sheet.
 *
 * The inset is what sets the gap, and the gap is uniform in every direction:
 * vertical neighbours sit H apart and diagonal neighbours sqrt(3)/2 · W apart,
 * which for a regular hexagon is the same distance. So one number controls the
 * whole comb's spacing. Production runs it looser than a first pass here did —
 * roughly a sixth of a tile of clear space rather than a tenth.
 */
const TILE_SCALE = 0.795;

/**
 * Rounded corners, via stroke rather than clip-path. `clip-path: polygon()`
 * cannot round a vertex; stroking the same polygon in its own fill colour with a
 * round line join does, and gives the drop shadow a soft edge to catch.
 */
const HEX_POINTS = "25,4 75,4 96,50 75,96 25,96 4,50";

/**
 * Corner radius, as stroke width.
 *
 * This has to stay small. The stroke straddles the path, so half of it becomes
 * the corner radius, and at 13 units against a 50-unit edge the arcs ate a
 * quarter of every side and the hexagon read as an octagon. Eight units — four
 * of radius — is the production corner: clearly softened, still unmistakably
 * six-sided. The points above are inset by that four so the finished shape
 * still fills its cell exactly.
 */
const HEX_ROUND = 8;
const HEX_ROUND_OUTER = HEX_ROUND + 1.5;

/**
 * Split a wing into columns of two, the way the production comb is built.
 *
 * A remainder lands in the outermost column as a single tile, which is the right
 * place for it: that column sits at the far edge of the pan, where a taper reads
 * as the comb running out rather than as a hole in it.
 */
function toColumns(entries: RosterEntry[]): RosterEntry[][] {
  const cols: RosterEntry[][] = [];
  for (let i = 0; i < entries.length; i += PER_COL) cols.push(entries.slice(i, i + PER_COL));
  return cols;
}

function Tile({ entry, idx }: { entry: RosterEntry; idx: number }) {
  return (
    <div
      data-hive-tile
      data-reveal
      title={entry.name}
      className="relative shrink-0"
      style={{ width: "var(--hex-w)", height: "var(--hex-h)" }}
    >
      <div
        className={[
          "group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-[1.07]",
          // Alternating drift so the comb breathes rather than pulsing in
          // unison. Both classes are gated on prefers-reduced-motion already.
          idx % 2 === 0 ? "animate-float" : "animate-float-delayed",
        ].join(" ")}
        style={{ width: `${TILE_SCALE * 100}%`, height: `${TILE_SCALE * 100}%` }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full drop-shadow-[0_8px_18px_rgba(15,26,48,0.08)]"
          aria-hidden="true"
        >
          {/* Two polygons, not one. The fat round-joined stroke is what rounds
              the vertices — clip-path cannot — so a border has to come from a
              second, very slightly larger hexagon sitting behind the white
              face. The 1.5-unit difference in stroke width is the hairline. */}
          <polygon points={HEX_POINTS} fill="#e4e9f0" stroke="#e4e9f0" strokeWidth={HEX_ROUND_OUTER} strokeLinejoin="round" />
          <polygon points={HEX_POINTS} fill="#ffffff" stroke="#ffffff" strokeWidth={HEX_ROUND} strokeLinejoin="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center px-[14%]">
          {entry.logo ? (
            <Image
              src={entry.logo.src}
              alt={entry.name}
              width={entry.logo.width}
              height={entry.logo.height}
              draggable={false}
              className="max-h-[52%] max-w-full object-contain"
            />
          ) : (
            /* A monogram reads as deliberate; a truncated name reads as a
               rendering fault. The full name is still on the tile's title. */
            <span className="flex flex-col items-center justify-center gap-0.5">
              <span className="font-display text-[clamp(14px,1.4vw,21px)] font-semibold leading-none tracking-tight text-brand-blue/75">
                {entry.monogram}
              </span>
              <span className="max-w-[78%] text-center font-mono text-[7px] leading-[1.25] tracking-tight text-ink/40 sm:text-[8px]">
                {entry.shortName}
              </span>
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

/** One comb of clients — half the roster, laid out in interlocking columns. */
function Wing({ entries, offset }: { entries: RosterEntry[]; offset: number }) {
  return (
    <div className="flex items-start">
      {toColumns(entries).map((col, ci) => (
        <div
          key={ci}
          className="flex flex-col"
          style={{
            marginLeft: ci === 0 ? 0 : `calc(var(--hex-w) * -${COL_OVERLAP})`,
            marginTop: ci % 2 === 1 ? `calc(var(--hex-h) * ${COL_DROP})` : 0,
          }}
        >
          {col.map((entry, idx) => (
            <Tile key={entry.id} entry={entry} idx={offset + ci + idx} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ClientHive({ roster }: { roster: RosterEntry[] }) {
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  /* Set the moment the reader takes hold of the row. After that the component
     stops re-centring it — nothing is more irritating than a rail that snaps
     back while you are reading it. */
  const touched = useRef(false);
  const [overflows, setOverflows] = useState(false);

  /*
   * Build each wing from its own mix of marks and monograms.
   *
   * Slicing the roster in half put all twelve logos in the left wing and all
   * fifteen monograms in the right. Weaving the roster first and then dealing
   * alternate entries into the wings was no better: the weave has a period of
   * roughly two, so taking every other entry sampled it at its own frequency
   * and de-interleaved it straight back into one wing of logos and one of
   * initials — plain aliasing.
   *
   * So the split happens before the weave. Each group is halved, and each wing
   * weaves its own share. Both sides then carry a comparable number of real
   * marks, spread through the comb rather than banked at one edge.
   */
  const logos = roster.filter((e) => e.logo);
  const plain = roster.filter((e) => !e.logo);
  const left = weave(
    logos.filter((_, i) => i % 2 === 0),
    plain.filter((_, i) => i % 2 === 0),
  );
  const right = weave(
    logos.filter((_, i) => i % 2 === 1),
    plain.filter((_, i) => i % 2 === 1),
  );

  /* ------------------------------------------------------------ dragging */
  useEffect(() => {
    const el = rail.current;
    if (!el) return;

    let down = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;

    const onDown = (e: PointerEvent) => {
      // Ignore secondary buttons so right-click and middle-click behave.
      if (e.button !== 0) return;
      down = true;
      moved = 0;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      touched.current = true;
      setDragging(true);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      // Capture only once it is clearly a drag, so a tap still behaves like a
      // tap and a vertical scroll is never stolen from the page.
      if (moved > 6) {
        el.setPointerCapture?.(e.pointerId);
        el.scrollLeft = startScroll - dx;
      }
    };
    const onUp = (e: PointerEvent) => {
      down = false;
      setDragging(false);
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    /* Whether the composition fits decides both the cursor and the hint. At
       desktop widths it does, and inviting a drag that does nothing is worse
       than offering no hint at all. */
    /* Centre on the Raja mark rather than on the far-left column. Centring the
       *content* is not the same thing — the two wings differ by a tile on an odd
       roster — so this centres the mark itself. It re-runs on resize because
       logos load late and change the fit after first paint. */
    const centreOnMark = () => {
      const mark = el.querySelector<HTMLElement>("[data-hive-brand]");
      if (!mark) return;
      // Measured from rendered rects rather than offsetLeft: the rail is not a
      // positioned element, so offsetLeft resolves against some ancestor
      // further up and lands the mark about 20px off centre.
      const markBox = mark.getBoundingClientRect();
      const railBox = el.getBoundingClientRect();
      el.scrollLeft += markBox.left + markBox.width / 2 - (railBox.left + railBox.width / 2);
    };
    const measure = () => {
      const over = el.scrollWidth - el.clientWidth > 4;
      setOverflows(over);
      if (over && !touched.current) centreOnMark();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onUp);
      ro.disconnect();
    };
  }, []);

  /* ------------------------------------------------------------- entrance */
  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tiles = q(scope, "[data-hive-tile]");
        // Movement here is manual: drag, swipe or arrow-key the row. There is
        // deliberately no scroll-driven pan — the section should sit still while
        // it is read, and move only when the reader moves it.
        gsap.fromTo(
          tiles,
          { opacity: 0, scale: 0.86, y: 14 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            stagger: { each: 0.02, from: "center" },
            ease: EASE.primary,
            scrollTrigger: { trigger: scope, start: "top 80%", once: true },
            onComplete: () => release(tiles),
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={[
        "w-full",
        /* Flat-top hexagon: width to height is 2 : sqrt(3).
           Two curves, because the two cases want opposite things. From 768px up
           the whole composition has to FIT the frame, so the tile is sized down
           to whatever that costs — the ceiling exists because above ~1440 the
           frame stops growing and the tile must stop with it. Below 768 it
           cannot fit at any readable size and drags instead, so there is no
           reason to shrink it: the tile goes back up to a size you can actually
           read a logo in. Both numbers are measured, not guessed. */
        "[--hex-w:clamp(70px,17.5vw,100px)] md:[--hex-w:clamp(64px,8.5vw,130px)]",
        "[--hex-h:calc(var(--hex-w)*0.866)]",
      ].join(" ")}
    >
      <div
        ref={rail}
        role="group"
        aria-label="Clients and partners"
        tabIndex={0}
        className={[
          "w-full overflow-x-auto overflow-y-hidden py-[clamp(6px,1.2vw,18px)] select-none",
          /* `safe center`, not plain centring. A centred flex child that is
             wider than its scroll container overflows equally on BOTH sides,
             and the left overflow sits at negative scroll offset where nothing
             can reach it — at 390px that hid a third of the roster outright and
             put the Raja mark 20px off centre no matter what scrollLeft was set
             to. `safe` falls back to start alignment the moment it overflows,
             so the whole row stays reachable; it still centres when it fits. */
          "flex [justify-content:safe_center]",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue",
          overflows ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default",
          /* Fade the two edges only while the row actually pans, so a cut-off
             hexagon reads as "there is more this way" rather than as a tile
             clipped by the card. Off entirely once everything fits. */
          overflows
            ? // Narrower on a phone: 78px of fade either side of a 305px rail
              // eats half the visible comb.
              "[mask-image:linear-gradient(to_right,transparent,#000_26px,#000_calc(100%-26px),transparent)] md:[mask-image:linear-gradient(to_right,transparent,#000_78px,#000_calc(100%-78px),transparent)]"
            : "",
        ].join(" ")}
      >
        <div className="flex w-max items-center gap-[clamp(12px,2vw,34px)] px-1">
          <Wing entries={left} offset={0} />

          {/*
            The Raja mark is a real element between the two wings, not an overlay
            on top of them. That is what gives it the clear space production has
            — the gap either side is actual layout, so no client tile is ever
            hidden behind it.
          */}
          <div
            data-hive-brand
            data-hive-tile
            data-reveal
            className="relative shrink-0"
            style={{ width: "calc(var(--hex-w) * 1.5)", height: "calc(var(--hex-h) * 1.5)" }}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full drop-shadow-[0_16px_30px_rgba(0,0,0,0.22)]"
              aria-hidden="true"
            >
              <polygon
                points={HEX_POINTS}
                fill="var(--color-brand-blue)"
                stroke="var(--color-brand-blue)"
                strokeWidth={HEX_ROUND}
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/media/brand-raja-logo.webp"
                alt="Raja Enterprises"
                width={220}
                height={68}
                priority
                draggable={false}
                className="w-[58%] object-contain brightness-0 invert"
              />
            </span>
          </div>

          <Wing entries={right} offset={left.length} />
        </div>
      </div>

      {overflows && (
        <p className="mt-4 flex items-center justify-center gap-2 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-body-light">
          <span aria-hidden>&larr;</span>
          Drag &mdash; {roster.length} commissioning bodies
          <span aria-hidden>&rarr;</span>
        </p>
      )}
    </div>
  );
}
