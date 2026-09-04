import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageMasthead, Band } from "@/components/PageShell";
import {
  servicePillars,
  groupedCapabilities,
  markets,
  servicesIntro,
} from "@/content/services";
import { getStats } from "@/lib/store";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Event Infrastructure Services — Hangers, Stalls, Flooring, Staging",
  description:
    "German hangers, exhibition stalls, event flooring, staging, scaffolding and turnkey event infrastructure. Owned inventory and in-house crew, Bengaluru since 1977.",
  alternates: { canonical: abs("/services") },
};

/**
 * The services hub.
 *
 * Three tiers, matching `content/services.ts`: pillars get cards and, where
 * `page` is true, their own route; grouped capabilities are listed plainly
 * because nobody commissions barricading on its own; markets answer the
 * separate question of whether Raja builds for events like yours.
 */
export default function ServicesPage() {
  const stats = getStats();

  return (
    <main id="main">
      <PageMasthead
        eyebrow={servicesIntro.eyebrow}
        statement={servicesIntro.statement}
        lead={servicesIntro.lead}
      />

      <Band>
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">Core services</p>
          <ul className="grid gap-[clamp(18px,2.4vw,32px)] sm:grid-cols-2">
            {servicePillars.map((s) => {
              const inner = (
                <>
                  {/* Image-led where an honest photograph exists. Where one does
                      not — flooring and scaffolding — the tile leads with the
                      figure instead, which is real, rather than with a stock
                      photograph that would only be decoration. */}
                  {s.image ? (
                    <span className="relative block aspect-[16/10] overflow-hidden rounded-[10px] bg-ink/5">
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="(max-width: 640px) 92vw, 44vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      {s.image.clearance !== "licensed" && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
                          {s.image.clearance === "raja-original" ? "Raja site photograph" : "Project photograph"}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="flex aspect-[16/10] flex-col justify-end rounded-[10px] bg-ink px-5 py-4 text-white">
                      <span className="font-mono text-[clamp(1.5rem,3.4vw,2.4rem)] leading-none">
                        {s.capacity[0]?.value ?? s.title.split(" ")[0]}
                      </span>
                      <span className="t-body-sm mt-1 text-white/60">
                        {s.capacity[0]?.label ?? "Owned and crewed in house"}
                      </span>
                    </span>
                  )}
                  <span className="t-eyebrow mt-4 block text-accent">
                    {String(s.order + 1).padStart(2, "0")}
                  </span>
                  <span className="t-work mt-1 block text-ink">{s.title}</span>
                  <span className="t-body mt-2 block text-body-light">{s.summary}</span>
                  {s.page && (
                    <span className="t-body-sm mt-4 inline-flex items-center gap-2 text-brand-blue">
                      Read more <span aria-hidden>&rarr;</span>
                    </span>
                  )}
                </>
              );

              return (
                <li
                  key={s.slug}
                  data-band-item
                  className="group overflow-hidden rounded-[15px] border border-ink/12 bg-white p-[clamp(14px,1.6vw,20px)] transition-colors duration-300 hover:border-ink/25"
                >
                  {s.page ? (
                    <Link href={`/services/${s.slug}`} className="block">
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Band>

      <Band tone="ink">
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">
            Delivered as part of a build
          </p>
          <ul className="grid gap-x-[clamp(24px,3vw,56px)] sm:grid-cols-2 lg:grid-cols-3">
            {groupedCapabilities.map((c) => (
              <li
                key={c.title}
                data-band-item
                className="border-t border-ink/15 py-[clamp(14px,1.7vw,22px)]"
              >
                <p className="t-work text-ink">{c.title}</p>
                <p className="t-body mt-1 text-body-light">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <Band>
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">Who we build for</p>
          <ul className="grid gap-[clamp(18px,2.2vw,30px)] sm:grid-cols-2 lg:grid-cols-3">
            {markets.map((m) => (
              <li key={m.title} data-band-item className="flex flex-col gap-2">
                <p className="t-work text-ink">{m.title}</p>
                <p className="t-body text-body-light">{m.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <Band tone="ink">
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">
            Owned, not sub-hired
          </p>
          <dl className="grid gap-[clamp(20px,3vw,44px)] sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                data-band-item
                className="flex flex-col gap-1 border-t border-ink/15 pt-[clamp(12px,1.5vw,20px)]"
              >
                <dt className="t-body-sm order-2 text-body-light">{s.label}</dt>
                <dd className="t-work order-1 font-mono text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>

    </main>
  );
}
