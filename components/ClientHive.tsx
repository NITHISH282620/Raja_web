"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, release, q } from "@/motion/primitives";
import { EASE, MOTION_OK } from "@/motion/ease";
import type { RosterEntry } from "@/content/clientRoster";

/**
 * The client honeycomb, as a draggable rail.
 *
 * ONE COMPONENT FOR EVERY WIDTH. The section used to carry two separate
 * layouts — an absolutely positioned honeycomb for desktop and a grid for
 * mobile — which is why their spacing never matched: they were different
 * geometry maintained in two places. This is one tiling, and it is the same
 * arithmetic at 360px as at 1440px. Only the tile size changes.
 *
 * THE TILING. Tiles are flat-top hexes clipped to
 * `polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)`. Within a row
 * they overlap horizontally by a quarter of their width so the points nest;
 * rows overlap vertically by a quarter of their height and alternate rows are
 * pushed right by three-eighths of a width. Those three numbers are what make
 * a honeycomb rather than a grid of hexagons, and they are declared once
 * below.
 *
 * DRAGGING. Pointer events pan the rail directly. The element is also a normal
 * `overflow-x: auto` container, so a trackpad, a touch swipe, a scrollbar and
 * the keyboard all still work — the drag is an addition, never the only way
 * through. Wheel is deliberately left alone so a vertical scroll over the rail
 * still scrolls the page.
 */

/**
 * Flat-top hexagons tile in COLUMNS, not rows.
 *
 * A first pass laid them out in three horizontal rows and they refused to nest
 * — three separate strips with gaps between them. That is the geometry telling
 * you something: a flat-top hex has its points on the left and right, so
 * neighbours interlock sideways. Stack them vertically into a column, overlap
 * the next column by a quarter of a width so the points slot into the notches,
 * and drop alternate columns by half a height. That is a honeycomb, and it is
 * the same construction the desktop section already used.
 */
const COL_OVERLAP = 0.25; // of cell width — slots the points into the notches
const COL_DROP = 0.5; // of cell height, applied to alternate columns
const PER_COL = 3;

/**
 * The tile is drawn smaller than its cell.
 *
 * The honeycomb positions stay exactly as they are — that is what makes it a
 * comb rather than a grid — but each hexagon is inset inside its cell so the
 * tiles read as separate cards with air between them. Drawn edge to edge they
 * fused into one continuous white sheet with faint seams, which is not the
 * same object at all.
 */
const TILE_SCALE = 0.86;

/**
 * Rounded corners, via stroke rather than clip-path.
 *
 * `clip-path: polygon()` cannot round a vertex. Stroking the same polygon in
 * the fill colour with a round line join does, and costs nothing — the stroke
 * simply thickens each corner into an arc. It also gives the drop shadow a
 * soft edge to catch, which a hard clip never does.
 */
const HEX_POINTS = "25,1 75,1 99,50 75,99 25,99 1,50";

export function ClientHive({ roster }: { roster: RosterEntry[] }) {
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  /* Chunk into columns of three, so the comb reads top-to-bottom then across.
     The Raja mark is NOT in this list — it is pinned over the centre of the
     rail below, so the clients travel past it rather than carrying it along. */
  const columns: RosterEntry[][] = [];
  for (let i = 0; i < roster.length; i += PER_COL) {
    columns.push(roster.slice(i, i + PER_COL));
  }

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
      setDragging(true);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      // Only capture the pointer once it is clearly a drag, so a tap still
      // behaves like a tap and vertical scrolling is never stolen.
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
        // Gentle left-to-right pan as the section crosses the viewport. Scrubbed
        // rather than pinned: it adds movement without taking the page's scroll
        // away, and a reader who prefers to drag can still drag.
        const railEl = rail.current;
        if (railEl) {
          const proxy = { p: 0 };
          gsap.to(proxy, {
            p: 1,
            ease: "none",
            scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 0.8 },
            onUpdate: () => {
              const max = railEl.scrollWidth - railEl.clientWidth;
              if (max > 0) railEl.scrollLeft = proxy.p * max;
            },
          });
        }

        gsap.fromTo(
          tiles,
          { opacity: 0, scale: 0.86, y: 14 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            // Column-ish stagger so the comb builds outward rather than in a line.
            stagger: { each: 0.02, from: "start" },
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
      className="w-full"
      style={
        {
          // Flat-top hexagon: width to height is 2 : sqrt(3).
          "--hex-w": "clamp(84px, 12vw, 176px)",
          "--hex-h": "calc(var(--hex-w) * 0.866)",
        } as CSSProperties
      }
    >
      <div className="relative">
      <div
        ref={rail}
        role="group"
        aria-label="Clients and partners — scroll or drag to see more"
        tabIndex={0}
        className={[
          "w-full overflow-x-auto overflow-y-hidden pb-2 select-none",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue",
          dragging ? "cursor-grabbing" : "cursor-grab",
        ].join(" ")}
      >
        <div className="flex w-max items-start px-[clamp(16px,4vw,48px)] py-[clamp(8px,1.5vw,20px)]">
          {columns.map((col, ci) => (
            <div
              key={ci}
              className="flex flex-col"
              style={{
                marginLeft: ci === 0 ? 0 : `calc(var(--hex-w) * -${COL_OVERLAP})`,
                marginTop: ci % 2 === 1 ? `calc(var(--hex-h) * ${COL_DROP})` : 0,
              }}
            >
              {col.map((entry, idx) => {
                return (
                  <div
                    key={entry.id}
                    data-hive-tile
                    data-reveal
                    title={entry.name}
                    className="relative shrink-0"
                    style={{ width: "var(--hex-w)", height: "var(--hex-h)" }}
                  >
                    <div
                      className={[
                        "group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-[1.07]",
                        // Alternating drift, so the comb breathes rather than
                        // pulsing in unison. Both classes are already gated on
                        // prefers-reduced-motion in globals.css.
                        idx % 2 === 0 ? "animate-float" : "animate-float-delayed",
                      ].join(" ")}
                      style={{ width: `${TILE_SCALE * 100}%`, height: `${TILE_SCALE * 100}%` }}
                    >
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.10)]"
                        aria-hidden="true"
                      >
                        <polygon
                          points={HEX_POINTS}
                          fill="#ffffff"
                          stroke="#ffffff"
                          strokeWidth="13"
                          strokeLinejoin="round"
                        />
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
                          <span className="text-center font-mono text-[8px] leading-[1.3] tracking-tight text-ink/55 sm:text-[9px]">
                            {entry.shortName}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

        {/*
          The Raja mark does not travel with the clients — it is pinned over the
          centre of the rail, so they pass it rather than carry it. The halo
          behind it is the section's own background at partial opacity: it opens
          real space around the mark, the way the production layout does, while
          still letting tiles scroll underneath.
        */}
        <div
          data-hive-brand
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ width: "calc(var(--hex-w) * 2.3)", height: "calc(var(--hex-h) * 2.3)" }}
          aria-hidden="true"
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              // Matched to the panel's own mid tone rather than to `paper`:
              // the section sits on a white-to-#f0f3f7 gradient, so the page
              // background showed through as a grey disc. Opaque out to 66% so
              // tiles genuinely clear the mark instead of ghosting behind it.
              background:
                "radial-gradient(closest-side, #f7f9fc 66%, rgba(247,249,252,0.94) 82%, rgba(247,249,252,0) 100%)",
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: "calc(var(--hex-w) * 1.12)", height: "calc(var(--hex-h) * 1.12)" }}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full drop-shadow-[0_16px_30px_rgba(0,0,0,0.22)]"
            >
              <polygon
                points={HEX_POINTS}
                fill="var(--color-brand-blue)"
                stroke="var(--color-brand-blue)"
                strokeWidth="13"
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
                className="w-[62%] object-contain brightness-0 invert"
              />
            </span>
          </span>
        </div>
      </div>

      <p className="t-body-sm mt-4 flex items-center justify-center gap-2 text-body-light">
        <span aria-hidden>&larr;</span>
        Drag to see all {roster.length} commissioning bodies
        <span aria-hidden>&rarr;</span>
      </p>
    </div>
  );
}
