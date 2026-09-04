import type { Metadata } from "next";
import Link from "next/link";
import { PageMasthead, Band } from "@/components/PageShell";
import { Reveal } from "@/motion/Reveal";
import { FootprintMap } from "@/components/locations/FootprintMap";
import { locationSummaries, locationsIntro, locationLabel, VERIFICATION_LABELS } from "@/content/locations";
import { company } from "@/content/company";
import { getContact } from "@/lib/store";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Where We Build — Bengaluru & Pan-India Event Infrastructure",
  description:
    "Raja Enterprises is Bengaluru-based and deploys nationally. Every location shown is one Raja's own project records place it in.",
  alternates: { canonical: abs("/locations") },
};

export default function LocationsPage() {
  const contact = getContact();
  const summaries = locationSummaries();
  const total = summaries.reduce((n, s) => n + s.count, 0);

  return (
    <main id="main">
      <PageMasthead
        eyebrow={locationsIntro.eyebrow}
        statement={locationsIntro.statement}
        lead={locationsIntro.lead}
      />

      <Band>
        <div className="frame">
          <FootprintMap summaries={summaries} />
        </div>
      </Band>

      <Band tone="ink">
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">Footprint</p>
          <Reveal as="ul" variant="fadeUp" className="grid gap-[clamp(14px,1.8vw,24px)] sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map((s) => (
              <li key={s.location.id} className="flex flex-col gap-1 border-t border-ink/15 pt-[clamp(12px,1.5vw,20px)]">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="t-work text-ink">{locationLabel(s.location)}</span>
                  <span className="font-mono text-[13px] text-body-light">{s.count}</span>
                </span>
                <span className="t-body-sm text-body-light">{s.location.state}</span>
                <span className="t-body-sm font-mono text-[10px] uppercase tracking-widest text-ink/40">
                  {VERIFICATION_LABELS[s.location.verification]}
                </span>
              </li>
            ))}
          </Reveal>
          <p className="t-body mt-[clamp(24px,3vw,40px)] max-w-[62ch] text-body-light">
            {total} recorded engagements across {summaries.length} locations. Raja keeps no branch
            offices — the yard, the fleet and the crew are Bengaluru-based and travel to site. A
            location appears here only when a project record puts Raja there.
          </p>
        </div>
      </Band>

      <Band>
        <div className="frame flex flex-col gap-4">
          <p className="t-work text-ink">Building somewhere we have not been?</p>
          <p className="t-body max-w-[62ch] text-body-light">
            Twenty owned goods vehicles and an in-house crew mean distance is a logistics question,
            not a capability one. {company.city} to site, structures transported, erected, run and
            struck by the same team that owns them.
          </p>
          <p className="t-body max-w-[62ch] text-body-light">
            {contact.addressLines.join(", ")}.{" "}
            <Link href="/contact" className="text-brand-blue underline underline-offset-4">
              Start an enquiry
            </Link>
          </p>
        </div>
      </Band>
    </main>
  );
}
