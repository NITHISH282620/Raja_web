"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, release, q } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";
import type { RosterEntry } from "@/content/clientRoster";

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
/*
 * These four numbers are measured off the production comb at 1440, not derived
 * from ideal hexagon geometry — and they are not the same thing. A perfect
 * honeycomb has a column pitch of 0.75·W and a row pitch of exactly H. Production
 * runs both slightly looser: 0.777·W across and 1.046·H down. That extra few per
 * cent is the difference between tiles that interlock and tiles that sit near
 * each other, and it is most of what "more space between the cards" means here.
 */
const COL_PITCH = 0.777; // of cell width, centre to centre
const COL_OVERLAP = 1 - COL_PITCH;
const ROW_GAP = 0.046; // of cell height, between tiles stacked in a column
const COL_DROP = (1 + ROW_GAP) / 2; // of cell height, applied to alternate columns
const PER_COL = 2;

/**
 * The hexagon fills its cell.
 *
 * Earlier passes inset it and got the air that way. Production does not: its
 * tile element measures 150x130 and the hexagon is the whole of it. All the
 * clear space comes from the pitch above being looser than a true honeycomb —
 * 0.777·W across instead of 0.75, 1.046·H down instead of 1.0 — which leaves a
 * thin, even gap at every interlocking point. Insetting on top of that shrank
 * the tiles for no reason and made every logo look small.
 */
const TILE_SCALE = 1;

/**
 * Rounded corners, via stroke rather than clip-path. `clip-path: polygon()`
 * cannot round a vertex; stroking the same polygon in its own fill colour with a
 * round line join does, and gives the drop shadow a soft edge to catch.
 */
const HEX_POINTS = "25,5 75,5 95,50 75,95 25,95 5,50";

/**
 * Corner radius, as stroke width.
 *
 * This has to stay small. The stroke straddles the path, so half of it becomes
 * the corner radius, and at 13 units against a 50-unit edge the arcs ate a
 * quarter of every side and the hexagon read as an octagon. Ten units — five of
 * radius — keeps four fifths of every edge straight, which is soft to the eye
 * and still unmistakably six-sided. The points above are inset by that five so
 * the finished shape fills its cell exactly.
 */
const HEX_ROUND = 10;
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
      {/*
        Three transforms, three elements. They cannot share one: the float
        keyframes animate `transform`, which replaces the whole property — so
        putting them on the centring element wiped its `-translate-x-1/2
        -translate-y-1/2` and every tile jumped half its own size out of place
        the moment the animation started. The cell itself carries GSAP's entrance
        transform, this box does the centring with `inset-0 m-auto` (no transform
        at all), the next one drifts, and the innermost one scales on hover.
      */}
      <div
        className="absolute inset-0 m-auto"
        style={{ width: `${TILE_SCALE * 100}%`, height: `${TILE_SCALE * 100}%` }}
      >
      <div
        className={[
          "h-full w-full",
          // Alternating drift so the comb breathes rather than pulsing in
          // unison. Both classes are gated on prefers-reduced-motion already.
          idx % 2 === 0 ? "animate-float" : "animate-float-delayed",
        ].join(" ")}
      >
      <div className="group relative h-full w-full transition-transform duration-300 hover:scale-[1.07]">
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
        {/*
                Production caps the mark at 86x58 inside a 120x104 tile, then
                scales the whole comb by 1.25 at xl — so the ratios are 71.7% of
                the tile's width and 55.8% of its height, and those two numbers
                are not independent. A flat-top hexagon is only full width across
                its middle and narrows to half width at the flats, so a mark of
                height h can be at most W·(1 - h/2H) wide. At 55.8% tall that
                allows 72.1% wide, and production sits at 71.7% — right on the
                limit. Change one and the other has to move with it.
              */}
              <span className="absolute inset-0 flex items-center justify-center">
          {entry.logo ? (
            <Image
              src={entry.logo.src}
              alt={entry.name}
              width={entry.logo.width}
              height={entry.logo.height}
              draggable={false}
              className="max-h-[55.8%] max-w-[71.7%] object-contain"
            />
          ) : (
            /* A monogram reads as deliberate; a truncated name reads as a
               rendering fault. The full name is still on the tile's title.

               Held to the same safe box as a logo, and for the same reason: a
               two- or three-line name is much taller than a wordmark, and the
               hexagon narrows as it goes, so the block that fits at the middle
               does not fit further up. Without the cap these overflowed the
               tile at every width. */
            <span className="flex max-h-[55.8%] max-w-[71.7%] flex-col items-center justify-center gap-0.5">
              <span className="font-display text-[clamp(15px,1.6vw,24px)] font-semibold leading-none tracking-tight text-brand-blue/75">
                {entry.monogram}
              </span>
              <span className="line-clamp-3 w-full text-center font-mono text-[7.5px] leading-[1.25] tracking-tight text-ink/45 sm:text-[8.5px]">
                {entry.shortName}
              </span>
            </span>
          )}
        </span>
      </div>
      </div>
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
            gap: `calc(var(--hex-h) * ${ROW_GAP})`,
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
   * Real logos sit nearest the Raja mark; monograms taper outward.
   *
   * The comb rests centred on the mark, so the columns either side of it are the
   * ones actually on screen when the section is read — everything else has to be
   * dragged to. Putting the organisations we hold a logo for in those columns
   * means the resting view is real marks rather than initials, and the tiles
   * still waiting on a logo file sit out at the edges where they are least
   * conspicuous.
   *
   * Within each group the order is engagement count, strongest first, so the
   * innermost tile of each wing is the client with the deepest record. The two
   * wings take alternate entries from each group rather than a half-slice, so
   * neither side ends up with all the strong marks.
   *
   * The left wing renders left-to-right and the mark is to its right, so its
   * array has to run in the opposite direction: weakest monogram at the far
   * left, strongest logo hard against the mark. The right wing reads the natural
   * way round.
   */
  const logos = roster.filter((e) => e.logo);
  const plain = roster.filter((e) => !e.logo);
  const pick = (xs: RosterEntry[], parity: 0 | 1) => xs.filter((_, i) => i % 2 === parity);

  const left = [...pick(plain, 0).reverse(), ...pick(logos, 0).reverse()];
  const right = [...pick(logos, 1), ...pick(plain, 1)];

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
        "[--hex-w:clamp(80px,20vw,116px)] md:[--hex-w:clamp(74px,10.4vw,150px)]",
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
            style={{
              // Production's mark is 1.47x the drawn width of a client tile.
              // The tiles are inset by TILE_SCALE and the mark is not, so its
              // cell has to carry that factor: 1.47 x 0.787.
              width: `calc(var(--hex-w) * ${1.47 * TILE_SCALE})`,
              height: `calc(var(--hex-h) * ${1.47 * TILE_SCALE})`,
            }}
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
