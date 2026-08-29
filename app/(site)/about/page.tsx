import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageMasthead, Band } from "@/components/PageShell";
import { SectionTitle } from "@/components/SectionTitle";
import { aboutIntro, aboutTimeline, principles } from "@/content/about";
import { company, FOUNDED_YEAR, yearsInOperation } from "@/content/company";
import { ROUTES } from "@/content/navigation";
import { getProcessSteps, getStats } from "@/lib/store";

export const metadata: Metadata = {
  title: "About",
  description: `Raja Enterprises has built the physical environment of India's largest gatherings since ${FOUNDED_YEAR}. Owned inventory, an in-house crew and one contract from bare ground to handover.`,
};

export default function AboutPage() {
  const stats = getStats();
  const steps = getProcessSteps();

  return (
    <main id="main">
      <PageMasthead
        eyebrow={aboutIntro.eyebrow}
        statement={aboutIntro.statement}
        lead={aboutIntro.lead}
      />

      {/* The claim, then the evidence for it. */}
      <Band>
        <div className="frame">
          <SectionTitle lead="What makes" trail="the difference" className="mb-[clamp(32px,4.4vw,64px)]" />
          <ol className="grid gap-[clamp(24px,3vw,48px)] md:grid-cols-2">
            {principles.map((p) => (
              <li key={p.index} data-band-item className="flex flex-col gap-3 border-t border-ink/12 pt-6">
                <span className="t-eyebrow tabular-nums text-accent">{p.index}</span>
                <h3 className="t-work max-w-[20ch] text-balance text-ink">{p.title}</h3>
                <p className="t-body max-w-[52ch] text-body-light">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      {/* The numbers, shared with the homepage so they can never disagree. */}
      <Band tone="ink">
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">By the numbers</p>
          <dl className="grid gap-[clamp(16px,2vw,32px)] sm:grid-cols-2 lg:grid-cols-5">
            {[{ label: "Years in operation", value: String(yearsInOperation()) }, ...stats].map((s) => (
              <div key={s.label} data-band-item className="flex flex-col gap-2 border-t border-ink/15 pt-5">
                <dd className="t-stat m-0 text-ink">{s.value}</dd>
                <dt className="t-stat-label text-body-light">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Band>

      <Band>
        <div className="frame">
          <SectionTitle lead="Since" trail={String(FOUNDED_YEAR)} className="mb-[clamp(32px,4.4vw,64px)]" />
          <ol className="grid gap-[clamp(20px,2.6vw,40px)] md:grid-cols-3">
            {aboutTimeline.map((t) => (
              <li key={t.label} data-band-item className="flex flex-col gap-3 border-t border-ink/12 pt-6">
                <span className="t-eyebrow text-accent">{t.year}</span>
                <h3 className="t-tile text-balance text-ink">{t.label}</h3>
                <p className="t-body-sm max-w-[46ch] text-body-light">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      {/* How a build runs, using the same three verified frames as the homepage. */}
      <Band tone="ink">
        <div className="frame">
          <SectionTitle lead="From bare" trail="ground" className="mb-[clamp(32px,4.4vw,64px)]" />
          <ol className="grid gap-[clamp(16px,2vw,28px)] md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.id} data-band-item className="flex flex-col gap-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[15px] bg-mist">
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
                  <span className="t-eyebrow text-ink/50">{step.index}</span>
                  <span className="t-eyebrow text-ink">{step.label}</span>
                </div>
                {step.caption && <p className="t-body-sm text-body-light">{step.caption}</p>}
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <Band>
        <div className="frame flex flex-col items-start gap-6">
          <SectionTitle lead="Build with" trail="us" rule={false} />
          <p data-band-item className="t-body max-w-[52ch] text-body-light">
            {company.name} works from a single Bengaluru base and deploys nationwide. Tell us the
            dates, the site and the scale.
          </p>
          <Link
            data-band-item
            href={ROUTES.contact}
            className="group inline-flex h-[54px] items-center gap-3 rounded-full bg-brand-blue px-9 text-white transition-colors duration-300 hover:bg-ink"
          >
            <span className="t-body">Start an enquiry</span>
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </Band>
    </main>
  );
}
