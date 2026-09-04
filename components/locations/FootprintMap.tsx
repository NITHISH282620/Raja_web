"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  project,
  INDIA_BOUNDS,
  locationLabel,
  VERIFICATION_LABELS,
  type LocationSummary,
} from "@/content/locations";
import { CATEGORY_LABELS } from "@/content/projects";

/**
 * The geographic footprint.
 *
 * WHY THERE IS NO MAP LIBRARY. This plots about half a dozen points. MapLibre,
 * Leaflet or a WebGL globe would each add hundreds of kilobytes, a tile
 * dependency and in most cases an API key, to draw six dots on a marketing
 * page. None of that survives a performance budget on an image-heavy site.
 *
 * WHY IT IS A GRATICULE RATHER THAN A COUNTRY OUTLINE. Hand-authoring an India
 * silhouette accurate enough to publish is not something to do from memory, and
 * an approximate one is both amateurish and, on a site this careful about
 * claims, the wrong instinct. So the projection is real — equirectangular over
 * mainland India, the same maths a survey plot uses — and the graticule is
 * labelled in degrees. It reads as a site drawing rather than a decorative map,
 * which suits a contractor better anyway.
 *
 * ACCESSIBILITY. Every point is a real <button> in a list, reachable and
 * operable by keyboard, and the same information is rendered as a plain list
 * below the plot. Nothing here is hover-only.
 */
export function FootprintMap({ summaries }: { summaries: LocationSummary[] }) {
  const [activeId, setActiveId] = useState<string>(summaries[0]?.location.id ?? "");
  const gridId = useId();
  const active = summaries.find((s) => s.location.id === activeId) ?? summaries[0];

  const latLines = [10, 15, 20, 25, 30, 35];
  const lngLines = [70, 75, 80, 85, 90];

  return (
    <div className="grid gap-[clamp(20px,3vw,44px)] lg:grid-cols-[1.15fr_0.85fr]">
      {/* ---------------------------------------------------------- the plot */}
      <div className="relative">
        <div className="relative aspect-[23/30] w-full overflow-hidden rounded-[15px] border border-ink/15 bg-ink sm:aspect-[23/26]">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <pattern id={gridId} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10 0H0V10" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#${gridId})`} />
            {latLines.map((lat) => {
              const { y } = project(lat, INDIA_BOUNDS.minLng);
              return (
                <line
                  key={lat}
                  x1="0"
                  x2="100"
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,.13)"
                  strokeWidth="0.22"
                />
              );
            })}
            {lngLines.map((lng) => {
              const { x } = project(INDIA_BOUNDS.minLat, lng);
              return (
                <line
                  key={lng}
                  y1="0"
                  y2="100"
                  x1={x}
                  x2={x}
                  stroke="rgba(255,255,255,.13)"
                  strokeWidth="0.22"
                />
              );
            })}
          </svg>

          {/* degree labels, so the plot reads as a survey rather than an ornament */}
          {latLines.map((lat) => {
            const { y } = project(lat, INDIA_BOUNDS.minLng);
            return (
              <span
                key={lat}
                aria-hidden
                className="pointer-events-none absolute left-2 -translate-y-1/2 font-mono text-[9px] tracking-widest text-white/25"
                style={{ top: `${y}%` }}
              >
                {lat}&deg;N
              </span>
            );
          })}

          <ul className="absolute inset-0 m-0 list-none p-0">
            {summaries.map((s) => {
              const { x, y } = project(s.location.lat, s.location.lng);
              const isActive = s.location.id === active?.location.id;
              const evidenced = s.location.verification === "project-evidenced";
              return (
                <li
                  key={s.location.id}
                  className="absolute"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(s.location.id)}
                    aria-pressed={isActive}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span className="sr-only">
                      {locationLabel(s.location)} — {s.count}{" "}
                      {s.count === 1 ? "project" : "projects"}
                    </span>
                    <span
                      aria-hidden
                      className={[
                        "block rounded-full transition-all duration-300",
                        isActive ? "h-3.5 w-3.5" : "h-2.5 w-2.5 group-hover:h-3 group-hover:w-3",
                        evidenced ? "bg-white" : "bg-white/45 ring-1 ring-white/50",
                      ].join(" ")}
                    />
                    {isActive && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35"
                      />
                    )}
                  </button>
                  <span
                    aria-hidden
                    className={[
                      "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest transition-colors duration-300",
                      isActive ? "text-white" : "text-white/45",
                    ].join(" ")}
                  >
                    {locationLabel(s.location)}
                  </span>
                </li>
              );
            })}
          </ul>

          <p
            aria-hidden
            className="pointer-events-none absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-widest text-white/25"
          >
            Equirectangular &middot; mainland India
          </p>
        </div>

        <p className="t-body-sm mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-light">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ink" />
            Projects on record
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ink/35 ring-1 ring-ink/40" />
            Published by Raja, not yet corroborated
          </span>
        </p>
      </div>

      {/* ------------------------------------------------------- detail panel */}
      {active && (
        <div className="flex flex-col self-start">
          <p className="t-eyebrow text-ink/50">Selected</p>
          <h3 className="t-work mt-2 text-ink">{locationLabel(active.location)}</h3>
          <p className="t-body-sm font-mono text-body-light">
            {active.location.state} &middot; {active.location.lat.toFixed(3)}&deg;N{" "}
            {active.location.lng.toFixed(3)}&deg;E
          </p>

          <p className="t-body-sm mt-3">
            <span className="rounded-full bg-ink/[0.07] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/60">
              {VERIFICATION_LABELS[active.location.verification]}
            </span>
          </p>

          {active.location.image && (
            <figure className="mt-4">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-ink/5">
                <Image
                  src={active.location.image.src}
                  alt={active.location.image.alt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 420px"
                  className="object-cover"
                />
              </div>
              <figcaption className="t-body-sm mt-2 text-body-light">
                <span className="mr-2 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white">
                  Project photograph
                </span>
                From work at this location.
              </figcaption>
            </figure>
          )}

          {active.location.blurb && (
            <p className="t-body mt-4 max-w-[46ch] text-body-light">{active.location.blurb}</p>
          )}

          <dl className="mt-5 flex gap-8 border-t border-ink/15 pt-4">
            <div>
              <dd className="t-work font-mono text-ink">{active.count}</dd>
              <dt className="t-body-sm text-body-light">
                {active.count === 1 ? "Project" : "Projects"}
              </dt>
            </div>
            {active.sectors.length > 0 && (
              <div>
                <dd className="t-work font-mono text-ink">{active.sectors.length}</dd>
                <dt className="t-body-sm text-body-light">
                  {active.sectors.length === 1 ? "Sector" : "Sectors"}
                </dt>
              </div>
            )}
          </dl>

          {active.sectors.length > 0 && (
            <p className="t-body-sm mt-4 text-body-light">
              {active.sectors.map((s) => CATEGORY_LABELS[s as keyof typeof CATEGORY_LABELS]).join(" · ")}
            </p>
          )}

          {active.projects.length > 0 ? (
            <ul className="mt-4 flex flex-col">
              {active.projects.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="flex items-baseline justify-between gap-4 border-t border-ink/10 py-2.5"
                >
                  <span className="t-body-sm text-ink">{p.event}</span>
                  {p.year && (
                    <span className="font-mono text-[11px] text-body-light">{p.year}</span>
                  )}
                </li>
              ))}
              {active.projects.length > 5 && (
                <li className="t-body-sm border-t border-ink/10 py-2.5 text-body-light">
                  and {active.projects.length - 5} more
                </li>
              )}
            </ul>
          ) : (
            <p className="t-body-sm mt-4 text-body-light">
              No project record is attached to this location yet.
            </p>
          )}

          <Link
            href="/projects"
            className="group mt-5 inline-flex h-[48px] w-fit items-center gap-3 rounded-full bg-brand-blue px-6 text-white transition-colors duration-300 hover:bg-ink"
          >
            <span className="t-body">View projects</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
