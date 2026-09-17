"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, fadeUp, growRule, riseCard, release, entranceTrigger, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import type { Client } from "@/content/clients";
import { SECTION_IDS } from "@/content/navigation";

/** Flat-top hex badge, same silhouette the wall has always used. */
const HEX_PATH =
  "M37 4 L83 4 Q89 4 93 10 L112 44 Q116 52 112 60 L93 94 Q89 100 83 100 L37 100 Q31 100 27 94 L8 60 Q4 52 8 44 L27 10 Q31 4 37 4 Z";

/** Columns in the marquee. Odd count so client logos split evenly either
 * side of the centred Raja mark, which sits over the middle on its own —
 * it never scrolls. */
const COLUMNS = 7;

/** How many seconds a column takes to scroll one full loop. Columns nearer
 * the centre run a touch faster so the wall doesn't read as one mechanism
 * moving in lockstep. */
const columnDuration = (colIdx: number) => 22 + Math.abs(colIdx - (COLUMNS - 1) / 2) * 4;

/** Splits the published clients round-robin across the scrolling columns. */
function distributeColumns(clients: Client[]): Client[][] {
  const columns: Client[][] = Array.from({ length: COLUMNS }, () => []);
  clients.forEach((c, i) => columns[i % COLUMNS].push(c));
  return columns;
}

function MarqueeLogoTile({
  client,
  onSelect,
  onDeselect,
}: {
  client: Client;
  onSelect?: (client: Client) => void;
  onDeselect?: () => void;
}) {
  return (
    <div
      data-logo-tile
      title={`${client.name} - ${client.event}`}
      onMouseEnter={() => onSelect?.(client)}
      onMouseLeave={() => onDeselect?.()}
      onClick={() => onSelect?.(client)}
      className="group relative flex aspect-[120/104] w-full shrink-0 cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-105 select-none"
    >
      <svg viewBox="0 0 120 104" className="absolute inset-0 h-full w-full" fill="none">
        <path
          d={HEX_PATH}
          fill="#FFFFFF"
          stroke="#E2E5EA"
          strokeWidth="1.3"
          className="transition-colors duration-300 group-hover:stroke-brand-blue/50 group-hover:fill-[#FAFBFD]"
        />
      </svg>
      <div className="relative flex h-full w-full items-center justify-center p-[14%] pointer-events-none">
        <Image
          src={client.logo.src}
          alt={client.name}
          width={client.logo.width}
          height={client.logo.height}
          draggable={false}
          className="max-h-[58%] max-w-[74%] object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
}

/** One scrolling column: its client list rendered twice back to back, then
 * translated by exactly half its own height on a linear infinite loop — the
 * seam between the two copies is where the loop resets, and because both
 * copies are identical the reset is invisible. */
function MarqueeColumn({
  clients,
  direction,
  duration,
}: {
  clients: Client[];
  direction: "up" | "down";
  duration: number;
}) {
  const [selected, setSelected] = useState<Client | null>(null);

  if (clients.length === 0) return <div className="w-[clamp(72px,11vw,132px)]" aria-hidden />;

  return (
    <div
      className="marquee-col relative h-[clamp(260px,34vw,380px)] w-[clamp(72px,11vw,132px)] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]"
    >
      <div
        className="marquee-track flex flex-col gap-[clamp(14px,2vw,26px)]"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: direction === "down" ? "reverse" : "normal",
        }}
      >
        {[...clients, ...clients].map((c, i) => (
          <MarqueeLogoTile key={`${c.id}-${i}`} client={c} onSelect={setSelected} onDeselect={() => setSelected(null)} />
        ))}
      </div>
      {selected && (
        <div
          role="status"
          className="pointer-events-none absolute left-1/2 top-1/2 z-40 w-max max-w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#063c5a] px-3 py-2 text-center text-[11px] text-white shadow-xl"
        >
          <span className="block font-semibold">{selected.name}</span>
          <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-wider text-accent">
            {selected.event}
          </span>
        </div>
      )}
    </div>
  );
}

export function ClientsView({
  clients,
}: {
  /** The published client records. */
  clients: Client[];
  contact?: unknown;
  events?: unknown[];
}) {
  const columns = distributeColumns(clients);
  const root = useRef<HTMLElement>(null);

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
        riseCard(tl, q(scope, "[data-center-hexagon]"), { distance: 35, scaleFrom: 0.8 }, 0.35);
        fadeUp(tl, q(scope, "[data-marquee-wrap]"), { distance: 24 }, 0.3);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={SECTION_IDS.clients}
      className="relative w-full bg-paper py-[clamp(40px,6vw,90px)] flex flex-col"
    >
      <style jsx global>{`
        @keyframes marquee-scroll {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }
        .marquee-track {
          animation-name: marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .marquee-col:hover .marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>

      <div className="w-full">
        <div className="frame">
          <span
            data-divider
            aria-hidden
            className="block h-px w-full origin-left bg-ink/12 mb-[clamp(32px,5vw,70px)]"
          />
        </div>

        <div className="frame w-full">
          <div className="relative w-full py-10 sm:py-16 lg:py-20 rounded-[28px] sm:rounded-[44px] lg:rounded-[56px] bg-gradient-to-b from-white via-[#fafbfe] to-[#f0f3f7] border border-ink/8 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.08)] p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-blue/8 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-purple-500/8 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-brand-blue/5 blur-[110px]" />

            <div data-clients-header data-reveal className="mx-auto max-w-[760px] text-center mb-8 sm:mb-12 lg:mb-14">
              <p className="t-eyebrow text-accent font-mono tracking-[0.2em] uppercase text-xs sm:text-sm mb-3 font-medium">
                Institutional &amp; Enterprise Trust
              </p>
              <h2 className="text-[clamp(1.85rem,4.5vw,3.25rem)] font-bold text-ink tracking-tight leading-[1.08]">
                Partners &amp; Clients with Raja Enterprises
              </h2>
              <p className="mt-3.5 text-body-light text-sm sm:text-base md:text-lg leading-relaxed max-w-[58ch] mx-auto">
                From government summits to corporate forums and trade exhibitions &mdash; the organisations above
                have all built on Raja&rsquo;s ground.
              </p>
            </div>

            {/* Vertical marquee wall: alternating columns scroll up / down on
                an infinite loop. The Raja mark is fixed over the centre
                column and never moves. */}
            <div data-marquee-wrap className="relative w-full">
              <div className="flex items-center justify-center gap-[clamp(6px,1vw,16px)]">
                {columns.map((col, i) => (
                  <MarqueeColumn
                    key={i}
                    clients={col}
                    direction={i % 2 === 0 ? "up" : "down"}
                    duration={columnDuration(i)}
                  />
                ))}
              </div>

              {/* Central Hero Raja Hexagon — fixed, does not scroll.
                  Centred with inset-0 + m-auto rather than the usual
                  left/top-1/2 + -translate-1/2 trick: the entrance reveal
                  below animates this element's transform, and GSAP leaves
                  that as an inline style once the animation ends — which
                  would silently overwrite a transform-based centering and
                  leave the badge sitting low. inset/margin centering has no
                  such conflict. */}
              <div
                data-center-hexagon
                data-reveal
                className="group pointer-events-none absolute inset-0 z-30 m-auto flex items-center justify-center select-none"
                style={{
                  width: "clamp(84px,13.5vw,158px)",
                  height: "clamp(73px,11.7vw,137px)",
                  filter: "drop-shadow(0 0 45px rgba(6,60,90,0.4))",
                }}
              >
                {/* backdrop-blur has a hard edge wherever its own box ends —
                    without a mask that edge shows as a visible ring. Masking
                    the same element fades the blur strength itself to
                    nothing well before the box edge, so it reads as an
                    unbroken soft glow instead of a circle. */}
                <span
                  aria-hidden
                  className="absolute -inset-20 rounded-full backdrop-blur-3xl [mask-image:radial-gradient(circle,black_0%,black_38%,transparent_72%)] [-webkit-mask-image:radial-gradient(circle,black_0%,black_38%,transparent_72%)]"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(250,251,254,0.9) 0%, rgba(250,251,254,0.75) 25%, rgba(250,251,254,0.35) 45%, rgba(250,251,254,0) 68%)",
                  }}
                />
                <svg viewBox="0 0 158 137" className="relative aspect-[158/137] w-full drop-shadow-md" fill="none">
                  <defs>
                    <linearGradient id="reDarkHexWireframe" x1="79" y1="0" x2="79" y2="137" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#0c2333" />
                      <stop offset="50%" stopColor="#063c5a" />
                      <stop offset="100%" stopColor="#031622" />
                    </linearGradient>
                    <linearGradient id="reBorderGlowWireframe" x1="0" y1="0" x2="158" y2="137" gradientUnits="userSpaceOnUse">
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
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center p-[18%]">
                  <Image
                    src="/media/brand-raja-logo.webp"
                    alt="Raja Enterprises Logo"
                    width={180}
                    height={80}
                    draggable={false}
                    className="max-h-[46%] w-auto object-contain brightness-0 invert drop-shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
