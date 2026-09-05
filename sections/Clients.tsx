"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, growRule, riseCard, release, entranceTrigger, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { CLIENTS_27, type ClientItem } from "@/content/clientRoster";
import { SECTION_IDS } from "@/content/navigation";
import { clsx } from "@/lib/clsx";

/* Rounded SVG Hexagon Path matching production */
const HEX_PATH =
  "M37 4 L83 4 Q89 4 93 10 L112 44 Q116 52 112 60 L93 94 Q89 100 83 100 L37 100 Q31 100 27 94 L8 60 Q4 52 8 44 L27 10 Q31 4 37 4 Z";

/* --------------------------------------------------------------------------
   Partition 27 clients:
   The 12 original clients sit in the 3 columns nearest to the Raja badge,
   so the resting view at initial load shows the exact 12 clients from production.
   The remaining 15 clients extend outward to the left and right wings.
   -------------------------------------------------------------------------- */

const leftRoster: ClientItem[] = [
  // Outer columns (revealed on drag right)
  CLIENTS_27.find((c) => c.id === "abs-business") || CLIENTS_27[8],
  CLIENTS_27.find((c) => c.id === "csb-silk-board") || CLIENTS_27[11],
  CLIENTS_27.find((c) => c.id === "vaidic-dharma") || CLIENTS_27[12],
  CLIENTS_27.find((c) => c.id === "karnataka-habitat") || CLIENTS_27[13],
  CLIENTS_27.find((c) => c.id === "adichunchanagiri") || CLIENTS_27[14],
  CLIENTS_27.find((c) => c.id === "uas-bangalore") || CLIENTS_27[15],
  CLIENTS_27.find((c) => c.id === "tribal-welfare") || CLIENTS_27[18],
  // 6 core clients nearest to the center Raja badge (Cols 4, 5, 6)
  CLIENTS_27.find((c) => c.id === "govt-karnataka") || CLIENTS_27[0],
  CLIENTS_27.find((c) => c.id === "govt-india") || CLIENTS_27[1],
  CLIENTS_27.find((c) => c.id === "ficci") || CLIENTS_27[6],
  CLIENTS_27.find((c) => c.id === "art-of-living") || CLIENTS_27[2],
  CLIENTS_27.find((c) => c.id === "collegedunia") || CLIENTS_27[9],
  CLIENTS_27.find((c) => c.id === "isgcon-bengaluru") || CLIENTS_27[3],
];

const rightRoster: ClientItem[] = [
  // 6 core clients nearest to the center Raja badge (Cols 0, 1, 2)
  CLIENTS_27.find((c) => c.id === "la-renon") || CLIENTS_27[4],
  CLIENTS_27.find((c) => c.id === "kanha-shanti") || CLIENTS_27[7],
  CLIENTS_27.find((c) => c.id === "gte-expo") || CLIENTS_27[10],
  CLIENTS_27.find((c) => c.id === "biffes") || CLIENTS_27[21],
  CLIENTS_27.find((c) => c.id === "tribevibe") || CLIENTS_27[22],
  CLIENTS_27.find((c) => c.id === "first-circle") || CLIENTS_27[5],
  // Outer columns (revealed on drag left)
  CLIENTS_27.find((c) => c.id === "ksmcal") || CLIENTS_27[16],
  CLIENTS_27.find((c) => c.id === "buildtek") || CLIENTS_27[17],
  CLIENTS_27.find((c) => c.id === "mm-hills") || CLIENTS_27[19],
  CLIENTS_27.find((c) => c.id === "skyblue-events") || CLIENTS_27[20],
  CLIENTS_27.find((c) => c.id === "ksmcal-dam-safety") || CLIENTS_27[23],
  CLIENTS_27.find((c) => c.id === "ksmcal-babu-jagjivan") || CLIENTS_27[24],
  CLIENTS_27.find((c) => c.id === "abs-vidyapeeta") || CLIENTS_27[25],
  CLIENTS_27.find((c) => c.id === "vaidic-dharma-trust") || CLIENTS_27[26],
];

// Helper to chunk roster into pairs of 2 per column
function chunkColumns(items: ClientItem[]): ClientItem[][] {
  const cols: ClientItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    cols.push(items.slice(i, i + 2));
  }
  return cols;
}

const leftColumns = chunkColumns(leftRoster);
const rightColumns = chunkColumns(rightRoster);

/* --- Single Hexagon Tile Component ---------------------------------------- */

function HexTile({
  client,
  idx,
  onSelect,
}: {
  client: ClientItem;
  idx: number;
  onSelect?: (client: ClientItem) => void;
}) {
  const isDelayed = idx % 2 === 1;

  return (
    <div
      data-hive-tile
      onClick={() => onSelect?.(client)}
      className={clsx(
        "group relative flex shrink-0 cursor-pointer select-none items-center justify-center transition-all duration-300",
        "h-[var(--hex-h)] w-[var(--hex-w)]",
        isDelayed ? "animate-float-delayed" : "animate-float"
      )}
      style={{
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.06))",
      }}
    >
      <div className="relative h-full w-full transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1 active:scale-95">
        <svg viewBox="0 0 120 104" className="h-full w-full drop-shadow-sm" fill="none">
          <path
            d={HEX_PATH}
            fill="#FFFFFF"
            stroke="#E2E5EA"
            strokeWidth="1.3"
            className="transition-colors duration-300 group-hover:stroke-brand-blue/40 group-hover:fill-[#FAFBFD]"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center p-2">
          <Image
            src={client.logo.src}
            alt={client.name}
            width={client.logo.width}
            height={client.logo.height}
            draggable={false}
            className="max-h-[55%] max-w-[72%] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Hover Tooltip on Desktop */}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#063c5a] px-3 py-1.5 text-[11px] text-white opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100">
          <span className="font-semibold">{client.name}</span>
          <span className="mx-1.5 text-white/60">•</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
            {client.event}
          </span>
          <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#063c5a]" />
        </div>
      </div>
    </div>
  );
}

/* --- Honeycomb Wing Component --------------------------------------------- */

function HoneycombWing({
  columns,
  isRight = false,
  onSelect,
}: {
  columns: ClientItem[][];
  isRight?: boolean;
  onSelect?: (client: ClientItem) => void;
}) {
  return (
    <div className="flex shrink-0 items-center">
      {columns.map((col, ci) => {
        // Drop alternate columns by half row to nest hexagons
        const isDropped = ci % 2 === (isRight ? 0 : 1);

        return (
          <div
            key={ci}
            className="flex flex-col"
            style={{
              gap: "calc(var(--hex-h) * 0.04)",
              marginLeft: ci === 0 ? 0 : "calc(var(--hex-w) * -0.225)",
              marginTop: isDropped ? "calc(var(--hex-h) * 0.52)" : 0,
            }}
          >
            {col.map((item, ri) => (
              <HexTile
                key={item.id}
                client={item}
                idx={ci * 2 + ri}
                onSelect={onSelect}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* --- Main Draggable Clients Section --------------------------------------- */

export function ClientsView({}: {
  clients?: unknown[];
  contact?: unknown;
  events?: unknown[];
}) {
  const root = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);

  /* Center the view on the Raja mark at initial load and on resize */
  const centreOnMark = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const mark = el.querySelector<HTMLElement>("[data-hive-brand]");
    if (!mark) return;
    const markRect = mark.getBoundingClientRect();
    const railRect = el.getBoundingClientRect();
    el.scrollLeft += markRect.left + markRect.width / 2 - (railRect.left + railRect.width / 2);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    // Small delay to ensure layout computation has settled
    const timeout = setTimeout(() => {
      centreOnMark();
    }, 60);

    const ro = new ResizeObserver(() => {
      centreOnMark();
    });
    ro.observe(el);

    return () => {
      clearTimeout(timeout);
      ro.disconnect();
    };
  }, [centreOnMark]);

  /* Drag & swipe gesture handling for both desktop mouse and mobile touch */
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let distance = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return; // Left click only
      isDown = true;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      distance = 0;
      setIsDragging(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      distance = Math.abs(dx);
      if (distance > 5) {
        setIsDragging(true);
        el.setPointerCapture?.(e.pointerId);
        el.scrollLeft = startScrollLeft - dx;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      setTimeout(() => setIsDragging(false), 60);
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

  /* GSAP Entrance Animations */
  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
          onComplete: () => release(q(scope, "[data-reveal], [data-reveal-rule]")),
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
          q(scope, "[data-hive-tile]"),
          { stagger: 0.02, distance: 20, scaleFrom: 0.9 },
          0.45
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id={SECTION_IDS.clients}
      className="relative flex w-full flex-col bg-paper py-[clamp(40px,6vw,90px)]"
    >
      <div className="w-full">
        <div className="frame">
          <span
            data-divider
            aria-hidden
            className="mb-[clamp(32px,5vw,70px)] block h-px w-full origin-left bg-ink/12"
          />
        </div>

        <div className="frame w-full">
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[28px] border border-ink/8 bg-gradient-to-b from-white via-[#fafbfe] to-[#f0f3f7] px-3 py-10 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.08)] sm:rounded-[44px] sm:px-8 sm:py-16 md:px-12 lg:min-h-[85vh] lg:rounded-[56px] lg:px-16 lg:py-20">
            {/* Atmospheric blurs */}
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
              className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/5 blur-[110px]"
            />

            {/* Header */}
            <div
              data-clients-header
              data-reveal
              className="mx-auto mb-8 max-w-[760px] text-center sm:mb-12 lg:mb-14"
            >
              <p className="t-eyebrow mb-2.5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent sm:text-sm">
                Institutional &amp; Enterprise Trust
              </p>
              <h2 className="text-[clamp(1.75rem,5vw,3.25rem)] font-bold leading-[1.1] tracking-tight text-ink">
                Partners &amp; Clients with Raja Enterprises
              </h2>
              <p className="mt-3 max-w-[58ch] text-xs leading-relaxed text-body-light sm:text-base md:text-lg">
                From government mega-summits to global corporate forums and trade exhibitions &mdash; we build the ground where leaders gather.
              </p>
            </div>

            {/* -------- DRAGGABLE HONEYCOMB TRACK (All Screens) -------- */}
            <div
              className={[
                "w-full select-none",
                /* Fluid Proportional Scaling for All Screens:
                   - Mobile (360-430px): tile width 78px, exactly fitting the card with soft edge fade
                   - Tablet (768px): tile width 100px
                   - Desktop (1024px+): tile width 120px, exactly matching Image 2's 12-tile resting frame */
                "[--hex-w:clamp(76px,18.5vw,120px)]",
                "[--hex-h:calc(var(--hex-w)*0.866)]",
              ].join(" ")}
            >
              <div
                ref={railRef}
                role="region"
                aria-label="Draggable clients honeycomb"
                tabIndex={0}
                className={clsx(
                  "flex w-full touch-pan-y overflow-x-auto overflow-y-hidden py-4 select-none",
                  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                  "[justify-content:safe_center]",
                  isDragging ? "cursor-grabbing" : "cursor-grab",
                  /* Soft gradient mask on both ends to fade off-screen tiles */
                  "[mask-image:linear-gradient(to_right,transparent,#000_28px,#000_calc(100%-28px),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,#000_56px,#000_calc(100%-56px),transparent)]"
                )}
              >
                <div className="flex w-max items-center gap-[clamp(8px,1.4vw,20px)] px-6">
                  {/* Left Wing (7 interlocking columns holding 13 clients) */}
                  <HoneycombWing
                    columns={leftColumns}
                    isRight={false}
                    onSelect={(c) => setSelectedClient(c)}
                  />

                  {/* Central Hero Raja Badge */}
                  <div
                    data-hive-brand
                    data-center-hexagon
                    data-reveal
                    className="relative flex shrink-0 cursor-pointer items-center justify-center transition-all duration-500 hover:scale-110 hover:rotate-1"
                    style={{
                      width: "calc(var(--hex-w) * 1.34)",
                      height: "calc(var(--hex-h) * 1.34)",
                      filter: "drop-shadow(0 0 38px rgba(6,60,90,0.45))",
                      zIndex: 30,
                    }}
                  >
                    <svg viewBox="0 0 158 137" className="h-full w-full drop-shadow-md" fill="none">
                      <defs>
                        <linearGradient
                          id="reDarkHexDraggable"
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
                          id="reBorderGlowDraggable"
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
                        fill="url(#reDarkHexDraggable)"
                        stroke="url(#reBorderGlowDraggable)"
                        strokeWidth="2.5"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
                      <Image
                        src="/media/brand-raja-logo.webp"
                        alt="Raja Enterprises Logo"
                        width={160}
                        height={60}
                        draggable={false}
                        className="max-h-[36px] w-auto object-contain brightness-0 invert drop-shadow-sm sm:max-h-[50px]"
                      />
                    </div>
                  </div>

                  {/* Right Wing (7 interlocking columns holding 14 clients) */}
                  <HoneycombWing
                    columns={rightColumns}
                    isRight={true}
                    onSelect={(c) => setSelectedClient(c)}
                  />
                </div>
              </div>

              {/* Mobile Tap Detail Card */}
              {selectedClient && (
                <div className="mx-auto mt-4 flex w-full max-w-[340px] items-center justify-between gap-3 rounded-xl bg-[#063c5a] px-4 py-2.5 text-[11px] text-white shadow-lg animate-fadeIn sm:hidden">
                  <div className="flex min-w-0 flex-col">
                    <span className="font-semibold truncate">{selectedClient.name}</span>
                    <span className="truncate font-mono text-[10px] uppercase tracking-wider text-accent">
                      {selectedClient.event}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="p-1 text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Drag Left / Right Hint */}
              <div className="mt-5 flex items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/40">
                <span aria-hidden="true" className="animate-pulse">&larr;</span>
                <span>Drag to explore all {CLIENTS_27.length} Commissioning Bodies</span>
                <span aria-hidden="true" className="animate-pulse">&rarr;</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}