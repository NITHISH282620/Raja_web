import type { Metadata } from "next";
import Image from "next/image";
import { PageMasthead, Band } from "@/components/PageShell";
import { Placeholder } from "@/components/Placeholder";
import { publishedProjects } from "@/content/works";
import { clsx } from "@/lib/clsx";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Programmes, congresses, exhibitions and state ceremonies whose physical environment was built by Raja Enterprises.",
};

export default function PortfolioPage() {
  const projects = publishedProjects();
  const [lead, ...rest] = projects;

  return (
    <main id="main">
      <PageMasthead
        eyebrow={["Notable", "works"]}
        statement={[
          { text: "You don’t " },
          { text: "see", accent: true },
          { text: " us.\nYou see what we " },
          { text: "build", accent: true },
          { text: "." },
        ]}
        lead="Selected programmes. Each entry lists what was built, where, and at what scale."
      />

      {/* Lead project — the widest image gets the strongest position. */}
      {lead && (
        <Band>
          <div className="frame">
            <article data-band-item className="flex flex-col gap-[clamp(20px,3vw,40px)]">
              {lead.hero && (
                <div className="relative aspect-[16/8] w-full overflow-hidden rounded-[20px] bg-ink-soft">
                  <Image
                    src={lead.hero.src}
                    alt={lead.hero.alt}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                    style={lead.hero.focal ? { objectPosition: lead.hero.focal } : undefined}
                  />
                </div>
              )}
              <div className="grid gap-[clamp(14px,2vw,32px)] lg:grid-cols-[1fr_1fr]">
                <div className="flex flex-col gap-3">
                  <p className="t-eyebrow text-ink/55">
                    {lead.eyebrow}
                    {lead.year && ` — ${lead.year}`}
                  </p>
                  <h2 className="t-work max-w-[18ch] text-balance text-ink">{lead.title}</h2>
                </div>
                {lead.summary ? (
                  <p className="t-body max-w-[62ch] text-body-light">{lead.summary}</p>
                ) : (
                  <Placeholder label="Case study summary pending" note={lead.note} lines={3} />
                )}
              </div>
            </article>
          </div>
        </Band>
      )}

      {/* The rest, image-led. */}
      <Band tone="ink">
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-white/50">Selected programmes</p>
          <ul className="grid gap-[clamp(20px,2.6vw,40px)] md:grid-cols-2">
            {rest.map((p) => (
              <li key={p.id} data-band-item className="flex flex-col gap-4">
                <div
                  className={clsx(
                    "relative aspect-[4/3] w-full overflow-hidden rounded-[20px]",
                    p.hero ? "bg-ink-soft" : "border border-dashed border-white/15 bg-white/[0.03]",
                  )}
                >
                  {p.hero ? (
                    <Image
                      src={p.hero.src}
                      alt={p.hero.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="object-cover"
                      style={p.hero.focal ? { objectPosition: p.hero.focal } : undefined}
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="t-eyebrow text-white/35">Photography pending</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="t-eyebrow text-white/50">
                    {p.eyebrow}
                    {p.year && ` — ${p.year}`}
                  </p>
                  <h3 className="t-tile text-balance text-white">{p.title}</h3>
                  <p className="t-body-sm text-body-dark">{p.organization}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="t-body-sm mt-[clamp(28px,3.4vw,48px)] max-w-[62ch] text-body-dark">
            Further programmes are being prepared for publication as client approvals and original
            photography are confirmed.
          </p>
        </div>
      </Band>
    </main>
  );
}
