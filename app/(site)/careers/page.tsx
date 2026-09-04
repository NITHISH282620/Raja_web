import type { Metadata } from "next";
import Image from "next/image";
import { PageMasthead, Band } from "@/components/PageShell";
import { SectionTitle } from "@/components/SectionTitle";
import { careersIntro, disciplines, roles } from "@/content/careers";
import { company } from "@/content/company";
import { getContact } from "@/lib/store";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Raja Enterprises builds India's largest temporary structures with its own crew. Site crew, fabrication, lighting and AV, project management, logistics and office roles in Bengaluru.",
};

export default function CareersPage() {
  const contact = getContact();

  return (
    <main id="main">
      <PageMasthead
        eyebrow={careersIntro.eyebrow}
        statement={careersIntro.statement}
        lead={careersIntro.lead}
      />

      <figure className="frame mt-[clamp(20px,3vw,44px)]">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[20px] bg-ink/5">
          <Image src="/media/events/eima-delegates-stand.5c782f20.webp" alt="Delegates beside a tractor on an exhibitor stand at an agricultural machinery fair." fill priority sizes="(max-width: 1024px) 96vw, 1280px" className="object-cover" />
        </div>
        <figcaption className="t-body-sm mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-light">
          <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
            Project photograph
          </span>
          <span>A Raja build in use — the crew that raises these structures is on our own payroll.</span>
        </figcaption>
      </figure>


      <Band>
        <div className="frame">
          <SectionTitle lead="What we" trail="hire for" className="mb-[clamp(32px,4.4vw,64px)]" />
          <ol className="grid gap-[clamp(24px,3vw,44px)] md:grid-cols-2 lg:grid-cols-3">
            {disciplines.map((d) => (
              <li key={d.index} data-band-item className="flex flex-col gap-3 border-t border-ink/12 pt-6">
                <span className="t-eyebrow tabular-nums text-accent">{d.index}</span>
                <h3 className="t-tile text-balance text-ink">{d.title}</h3>
                <p className="t-body-sm max-w-[44ch] text-body-light">{d.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      {/*
        Vacancies. Renders the honest state — "nothing listed, write to us
        anyway" — rather than a page of invented openings. One entry in
        `content/careers.ts` turns this into a real listing.
      */}
      <Band tone="ink">
        <div className="frame">
          <SectionTitle lead="Open" trail="positions" className="mb-[clamp(32px,4.4vw,64px)]" />

          {roles.length === 0 ? (
            <div data-band-item className="max-w-[62ch]">
              <p className="t-work mb-4 text-ink">No positions are listed right now.</p>
              <p className="t-body text-body-light">
                We read every application whether or not something is open, and the field crew grows
                ahead of the season. If you have worked on structures, staging, rigging or event
                logistics, write to us with what you have built and we will keep you on file.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {roles.map((role) => (
                <li
                  key={role.id}
                  data-band-item
                  className="grid gap-2 border-t border-ink/12 py-[clamp(18px,2.2vw,30px)] last:border-b sm:grid-cols-[1.2fr_1fr_auto] sm:items-baseline sm:gap-8"
                >
                  <h3 className="t-work text-ink">{role.title}</h3>
                  <p className="t-body text-body-light">{role.summary}</p>
                  <p className="t-eyebrow text-ink/50">
                    {role.location} · {role.type}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Band>

      <Band>
        <div className="frame flex flex-col items-start gap-6">
          <SectionTitle lead="Get in" trail="touch" rule={false} />
          <p data-band-item className="t-body max-w-[52ch] text-body-light">
            Send your details and what you have worked on. {company.city} based; the fleet travels.
          </p>
          {contact.email && (
            <a
              data-band-item
              href={`mailto:${contact.email}?subject=${encodeURIComponent("Application — Raja Enterprises")}`}
              className="group inline-flex h-[54px] items-center gap-3 rounded-full bg-brand-blue px-9 text-white transition-colors duration-300 hover:bg-ink"
            >
              <span className="t-body">Email your application</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          )}
        </div>
      </Band>
    </main>
  );
}
