"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, growRule, riseCard, release, entranceTrigger, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { CLIENTS_27, type ClientItem } from "@/content/clientRoster";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

/* ==========================================================================
   PRODUCTION WIREFRAME GEOMETRY (Exact Mathematical Interlocking)
   Flat-top hex: flat edges top/bottom, pointed vertices left/right.
   COL_PITCH = 93px gives a tight, uniform ~2-4px interlocking chevron seam.
   Alternate columns are dropped by HALF_ROW = 54px.
   Hero hexagon = 158x137px, centered at (GRID_H - HERO_H) / 2 = 64.5px.
   ========================================================================== */

const HEX_W = 120;
const HEX_H = 104;
const COL_PITCH = 93;
const ROW_PITCH = 108;
const HALF_ROW = 54;

const HERO_W = 158;
const HERO_H = 137;
const WING_GAP = 2;

const COLS_PER_WING = 7;

/* SVG Hexagon Path matching production wireframe */
const HEX_PATH =
  "M37 4 L83 4 Q89 4 93 10 L112 44 Q116 52 112 60 L93 94 Q89 100 83 100 L37 100 Q31 100 27 94 L8 60 Q4 52 8 44 L27 10 Q31 4 37 4 Z";

/* Width & Coordinate calculations */
const LEFT_WING_W = (COLS_PER_WING - 1) * COL_PITCH + HEX_W; // 6 * 93 + 120 = 678px
const HERO_X = LEFT_WING_W + WING_GAP; // 678 + 2 = 680px
const RIGHT_WING_X = HERO_X + HERO_W + WING_GAP; // 680 + 158 + 2 = 840px
const TOTAL_TRACK_W = RIGHT_WING_X + (COLS_PER_WING - 1) * COL_PITCH + HEX_W; // 840 + 678 = 1518px

const GRID_H = ROW_PITCH + HALF_ROW + HEX_H; // 108 + 54 + 104 = 266px
const HERO_Y = (GRID_H - HERO_H) / 2; // (266 - 137) / 2 = 64.5px

/* --------------------------------------------------------------------------
   ROSTER ASSIGNMENT:
   Columns 4, 5, 6 of the Left Wing and Columns 0, 1, 2 of the Right Wing hold
   the 12 original wireframe clients flanking the central Raja badge.
   Columns 0-3 of Left Wing and 3-6 of Right Wing hold the other 15 clients.
   -------------------------------------------------------------------------- */

const leftColumnsData: ClientItem[][] = [
  // Col 0 (Far left)
  [
    CLIENTS_27.find((c) => c.id === "tribal-welfare") || CLIENTS_27[18],
    CLIENTS_27.find((c) => c.id === "abs-vidyapeeta") || CLIENTS_27[25],
  ],
  // Col 1
  [
    CLIENTS_27.find((c) => c.id === "adichunchanagiri") || CLIENTS_27[14],
    CLIENTS_27.find((c) => c.id === "uas-bangalore") || CLIENTS_27[15],
  ],
  // Col 2
  [
    CLIENTS_27.find((c) => c.id === "vaidic-dharma") || CLIENTS_27[12],
    CLIENTS_27.find((c) => c.id === "karnataka-habitat") || CLIENTS_27[13],
  ],
  // Col 3
  [
    CLIENTS_27.find((c) => c.id === "csb-silk-board") || CLIENTS_27[11],
    CLIENTS_27.find((c) => c.id === "abs-business") || CLIENTS_27[8],
  ],
  // Col 4 (Core Wireframe: Top = Karnataka Govt, Bottom = Govt of India)
  [
    CLIENTS_27.find((c) => c.id === "govt-karnataka") || CLIENTS_27[0],
    CLIENTS_27.find((c) => c.id === "govt-india") || CLIENTS_27[1],
  ],
  // Col 5 (Core Wireframe: Top = FICCI, Bottom = Art of Living)
  [
    CLIENTS_27.find((c) => c.id === "ficci") || CLIENTS_27[6],
    CLIENTS_27.find((c) => c.id === "art-of-living") || CLIENTS_27[2],
  ],
  // Col 6 (Core Wireframe next to Raja: Top = Collegedunia, Bottom = ISGCON)
  [
    CLIENTS_27.find((c) => c.id === "collegedunia") || CLIENTS_27[9],
    CLIENTS_27.find((c) => c.id === "isgcon-bengaluru") || CLIENTS_27[3],
  ],
];

const rightColumnsData: ClientItem[][] = [
  // Col 0 (Core Wireframe next to Raja: Top = La Renon, Bottom = Kanha Shanti)
  [
    CLIENTS_27.find((c) => c.id === "la-renon") || CLIENTS_27[4],
    CLIENTS_27.find((c) => c.id === "kanha-shanti") || CLIENTS_27[7],
  ],
  // Col 1 (Core Wireframe: Top = GTE Expo, Bottom = BIFFES)
  [
    CLIENTS_27.find((c) => c.id === "gte-expo") || CLIENTS_27[10],
    CLIENTS_27.find((c) => c.id === "biffes") || CLIENTS_27[21],
  ],
  // Col 2 (Core Wireframe: Top = TribeVibe, Bottom = First Circle)
  [
    CLIENTS_27.find((c) => c.id === "tribevibe") || CLIENTS_27[22],
    CLIENTS_27.find((c) => c.id === "first-circle") || CLIENTS_27[5],
  ],
  // Col 3
  [
    CLIENTS_27.find((c) => c.id === "ksmcal") || CLIENTS_27[16],
    CLIENTS_27.find((c) => c.id === "buildtek") || CLIENTS_27[17],
  ],
  // Col 4
  [
    CLIENTS_27.find((c) => c.id === "mm-hills") || CLIENTS_27[19],
    CLIENTS_27.find((c) => c.id === "skyblue-events") || CLIENTS_27[20],
  ],
  // Col 5
  [
    CLIENTS_27.find((c) => c.id === "ksmcal-dam-safety") || CLIENTS_27[23],
    CLIENTS_27.find((c) => c.id === "ksmcal-babu-jagjivan") || CLIENTS_27[24],
  ],
  // Col 6 (Far right)
  [
    CLIENTS_27.find((c) => c.id === "vaidic-dharma-trust") || CLIENTS_27[26],
    CLIENTS_27.find((c) => c.id === "first-circle") || CLIENTS_27[5],
  ],
];

/* --- Flat-Top Hex Badge Component ----------------------------------------- */

function FlatHexBadge({
  client,
  isDelayed,
  style,
  onSelect,
}: {
  client: ClientItem;
  isDelayed?: boolean;
  style: React.CSSProperties;
  onSelect?: (client: ClientItem) => void;
}) {
  return (
    <div
      data-logo-tile
      data-reveal
      title={`${client.name} - ${client.event}`}
      onClick={() => onSelect?.(client)}
      className={clsx(
        "group absolute flex items-center justify-center transition-all duration-300",
        "hover:scale-110 hover:-translate-y-1 hover:z-30 cursor-pointer select-none",
        isDelayed ? "animate-float-delayed" : "animate-float"
      )}
      style={{
        width: HEX_W,
        height: HEX_H,
        filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.07))",
        ...style,
      }}
    >
      <svg viewBox="0 0 120 104" className="w-full h-full drop-shadow-sm" fill="none">
        <path
          d={HEX_PATH}
          fill="#FFFFFF"
          stroke="#E2E5EA"
          strokeWidth="1.3"
          className="transition-colors duration-300 group-hover:stroke-brand-blue/50 group-hover:fill-[#FAFBFD]"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-2.5 pointer-events-none">
        <Image
          src={client.logo.src}
          alt={client.name}
          width={client.logo.width}
          height={client.logo.height}
          draggable={false}
          className="max-h-[58px] max-w-[86px] object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
}

/* --- Main Clients Section ------------------------------------------------- */

export function ClientsView({}: {
  clients?: unknown[];
  contact?: unknown;
  events?: unknown[];
}) {
  const root = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);
  const hasInteracted = useRef(false);

  /* GSAP Entrance Reveal Animations */
  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
          onComplete: () =>
            release(q(scope, "[data-reveal], [data-reveal-rule]")),
        });
        growRule(tl, q(scope, "[data-divider]"), { duration: 0.9 }, 0);
        fadeUp(tl, q(scope, "[data-clients-header]"), { distance: 20 }, 0.15);
        riseCard(
          tl,
          q(scope, "[data-center-hexagon]"),
          { distance: 35, scaleFrom: 0.8 },
          0.35
        );
        fadeUp(
          tl,
          q(scope, "[data-logo-tile]"),
          { stagger: 0.03, distance: 20, scaleFrom: 0.9 },
          0.45
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  /* Center the view on the Raja mark at rest */
  const centreOnMark = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const mark = el.querySelector<HTMLElement>("[data-hive-brand]");
    if (!mark) return;
    const markRect = mark.getBoundingClientRect();
    const railRect = el.getBoundingClientRect();
    const diff = (markRect.left + markRect.width / 2) - (railRect.left + railRect.width / 2);
    el.scrollLeft += diff;
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    // Small timeout to guarantee DOM geometry calculation is ready
    const timer = setTimeout(() => {
      centreOnMark();
    }, 50);

    const ro = new ResizeObserver(() => {
      if (!hasInteracted.current) {
        centreOnMark();
      }
    });
    ro.observe(el);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, [centreOnMark]);

  /* Smooth Mouse & Touch Dragging Handler */
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      setIsDragging(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) {
        hasInteracted.current = true;
        el.setPointerCapture?.(e.pointerId);
        el.scrollLeft = startScrollLeft - dx;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDown = false;
      setIsDragging(false);
      if (el.hasPointerCapture?.(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <section
      ref={root}
      id={SECTION_IDS.clients}
      className="relative w-full bg-paper py-[clamp(40px,6vw,90px)] flex flex-col"
    >
      <div className="w-full">
        {/* Top rule divider */}
        <div className="frame">
          <span
            data-divider
            aria-hidden
            className="block h-px w-full origin-left bg-ink/12 mb-[clamp(32px,5vw,70px)]"
          />
        </div>

        <div className="frame w-full">
          <div className="relative w-full py-10 sm:py-16 lg:py-20 rounded-[28px] sm:rounded-[44px] lg:rounded-[56px] bg-gradient-to-b from-white via-[#fafbfe] to-[#f0f3f7] border border-ink/8 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.08)] p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center overflow-hidden">
            {/* Atmospheric ambient lighting blurs */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-blue/8 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-purple-500/8 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-brand-blue/5 blur-[110px]"
            />

            {/* Section Header */}
            <div
              data-clients-header
              data-reveal
              className="mx-auto max-w-[760px] text-center mb-8 sm:mb-12 lg:mb-14"
            >
              <p className="t-eyebrow text-accent font-mono tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 font-medium">
                Institutional &amp; Enterprise Trust
              </p>
              <h2 className="text-[clamp(1.85rem,4.5vw,3.25rem)] font-bold text-ink tracking-tight leading-[1.08]">
                Partners &amp; Clients with Raja Enterprises
              </h2>
              <p className="mt-3.5 text-body-light text-sm sm:text-base md:text-lg leading-relaxed max-w-[58ch] mx-auto">
                From government mega-summits to global corporate forums and
                trade exhibitions &mdash; we build the ground where leaders
                gather.
              </p>
            </div>

            {/* Honeycomb Container */}
            <div className="relative w-full flex flex-col items-center">
              <div
                ref={railRef}
                role="region"
                aria-label="Partners and Clients Honeycomb Track"
                tabIndex={0}
                className={clsx(
                  "hive-rail relative w-full overflow-x-auto overflow-y-hidden select-none touch-pan-y py-3 sm:py-5",
                  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                  "[--comb-scale:0.70] min-[375px]:[--comb-scale:0.74] min-[440px]:[--comb-scale:0.80] sm:[--comb-scale:0.88] lg:[--comb-scale:1] xl:[--comb-scale:1.12]",
                  isDragging ? "cursor-grabbing" : "cursor-grab",
                  /* Soft gradient edge fade to signal scrollability */
                  "[mask-image:linear-gradient(to_right,transparent,#000_24px,#000_calc(100%-24px),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,#000_64px,#000_calc(100%-64px),transparent)]"
                )}
              >
                {/* Properly sized wrapper to eliminate any phantom layout whitespace */}
                <div
                  className="relative shrink-0 mx-auto my-auto"
                  style={{
                    width: `calc(${TOTAL_TRACK_W}px * var(--comb-scale, 1))`,
                    height: `calc(${GRID_H}px * var(--comb-scale, 1))`,
                  }}
                >
                  {/* Unscaled coordinate canvas scaled with origin-top-left */}
                  <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                      width: TOTAL_TRACK_W,
                      height: GRID_H,
                      transform: "scale(var(--comb-scale, 1))",
                    }}
                  >
                    {/* Left Wing Tiles (Cols 0 to 6) */}
                    {leftColumnsData.map((col, colIdx) => {
                      const colX = colIdx * COL_PITCH;
                      const isOdd = colIdx % 2 === 1;
                      const colDrop = isOdd ? HALF_ROW : 0;

                      return col.map((item, rowIdx) => {
                        const tileY = rowIdx * ROW_PITCH + colDrop;

                        return (
                          <FlatHexBadge
                            key={`left-${colIdx}-${rowIdx}`}
                            client={item}
                            isDelayed={(colIdx + rowIdx) % 2 === 1}
                            onSelect={(c) => setSelectedClient(c)}
                            style={{
                              left: colX,
                              top: tileY,
                            }}
                          />
                        );
                      });
                    })}

                    {/* Central Hero Raja Hexagon (Exact Production Wireframe) */}
                    <div
                      data-hive-brand
                      data-center-hexagon
                      data-reveal
                      className="group absolute flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110 hover:rotate-2 select-none"
                      style={{
                        left: HERO_X,
                        top: HERO_Y,
                        width: HERO_W,
                        height: HERO_H,
                        filter: "drop-shadow(0 0 45px rgba(6,60,90,0.4))",
                        zIndex: 25,
                      }}
                    >
                      <svg viewBox="0 0 158 137" className="w-full h-full drop-shadow-md" fill="none">
                        <defs>
                          <linearGradient
                            id="reDarkHexWireframe"
                            x1="79"
                            y1="0"
                            x2="79"
                            y2="137"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0%" stopColor="#0c2333" />
                            <stop offset="50%" stopColor="#063c5a" />
                            <stop offset="100%" stopColor="#031622" />
                          </linearGradient>
                          <linearGradient
                            id="reBorderGlowWireframe"
                            x1="0"
                            y1="0"
                            x2="158"
                            y2="137"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#eb5557" stopOpacity="0.65" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M48 5 L110 5 Q117 5 122 13 L148 58 Q153 68.5 148 79 L122 124 Q117 132 110 132 L48 132 Q41 132 36 124 L10 79 Q5 68.5 10 58 L36 13 Q41 5 48 5 Z"
                          fill="url(#reDarkHexWireframe)"
                          stroke="url(#reBorderGlowWireframe)"
                          strokeWidth="2.5"
                          className="transition-all duration-500 group-hover:stroke-accent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                        <Image
                          src="/media/brand-raja-logo.webp"
                          alt="Raja Enterprises Logo"
                          width={180}
                          height={80}
                          draggable={false}
                          className="max-h-[60px] w-auto object-contain brightness-0 invert drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* Right Wing Tiles (Cols 0 to 6) */}
                    {rightColumnsData.map((col, colIdx) => {
                      const colX = RIGHT_WING_X + colIdx * COL_PITCH;
                      const isOdd = colIdx % 2 === 1;
                      const colDrop = isOdd ? HALF_ROW : 0;

                      return col.map((item, rowIdx) => {
                        const tileY = rowIdx * ROW_PITCH + colDrop;

                        return (
                          <FlatHexBadge
                            key={`right-${colIdx}-${rowIdx}`}
                            client={item}
                            isDelayed={(colIdx + rowIdx) % 2 === 0}
                            onSelect={(c) => setSelectedClient(c)}
                            style={{
                              left: colX,
                              top: tileY,
                            }}
                          />
                        );
                      });
                    })}
                  </div>
                </div>
              </div>

              {/* Tap / Click Detail Card */}
              {selectedClient && (
                <div className="mx-auto mt-4 flex w-full max-w-[360px] items-center justify-between gap-3 rounded-xl bg-[#063c5a] px-4 py-3 text-xs text-white shadow-xl animate-fadeIn">
                  <div className="flex min-w-0 flex-col">
                    <span className="font-semibold truncate">{selectedClient.name}</span>
                    <span className="truncate font-mono text-[10px] uppercase tracking-wider text-accent mt-0.5">
                      {selectedClient.event}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="p-1 text-white/70 hover:text-white transition-colors"
                    aria-label="Close details"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Drag Left / Right Hint */}
              <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/40">
                <span aria-hidden="true" className="animate-pulse">&larr;</span>
                <span>Drag</span>
                <span aria-hidden="true" className="animate-pulse">&rarr;</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
