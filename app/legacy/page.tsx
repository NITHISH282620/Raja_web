import type { Metadata } from "next";
import Image from "next/image";
import { PageMasthead, Band } from "@/components/PageShell";
import { company, FOUNDED_YEAR, stats, yearsInOperation } from "@/content/company";
import { processSteps } from "@/content/process";

export const metadata: Metadata = {
  title: "Legacy",
  description: `Raja Enterprises, established ${FOUNDED_YEAR} in Bengaluru — delivering experiential event solutions across India for over four decades.`,
};

export default function LegacyPage() {
  return (
    <main id="main">
      <PageMasthead
        eyebrow={["Our legacy", `Established ${FOUNDED_YEAR}`]}
        statement={[
          { text: "Since 1977, building the " },
          { text: "physical environments", accent: true },
          { text: " where India gathers." },
        ]}
        lead={company.legacyStatement}
      />

      <Band tone="ink">
        <div className="frame grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-[1fr_1fr]">
          <div data-band-item className="flex flex-col gap-5">
            <p className="t-eyebrow text-white/50">Who we are</p>
            <p className="t-statement text-balance text-white">{company.positioning}</p>
          </div>
          <div data-band-item className="flex flex-col gap-4">
            <p className="t-eyebrow text-white/50">Disciplines</p>
            <ul className="flex flex-col">
              {company.disciplines.map((d) => (
                <li key={d} className="t-work border-t border-white/12 py-[clamp(10px,1.3vw,18px)] text-white">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      {/* Scale, stated plainly — the same figures as the homepage band. */}
      <Band>
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">By the numbers</p>
          <dl className="grid gap-[clamp(16px,2vw,32px)] sm:grid-cols-2 lg:grid-cols-4">
            {[{ label: "Years in operation", value: String(yearsInOperation()) }, ...stats].map((s) => (
              <div key={s.label} data-band-item className="flex flex-col gap-2 border-t border-ink/15 pt-5">
                <dd className="t-stat m-0 text-ink">{s.value}</dd>
                <dt className="t-stat-label text-body-light">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Band>

      {/* How a build actually happens — reuses the verified process frames. */}
      <Band tone="ink">
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-white/50">From bare ground</p>
          <ol className="grid gap-[clamp(16px,2vw,28px)] md:grid-cols-3">
            {processSteps.map((step) => (
              <li key={step.id} data-band-item className="flex flex-col gap-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[15px] bg-ink-soft">
                  {step.image && (
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="t-eyebrow text-white/50">{step.index}</span>
                  <span className="t-eyebrow text-white">{step.label}</span>
                </div>
                {step.caption && <p className="t-body-sm text-body-dark">{step.caption}</p>}
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </main>
  );
}
