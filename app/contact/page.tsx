import type { Metadata } from "next";
import { PageMasthead, Band } from "@/components/PageShell";
import { company, contact, FOUNDED_YEAR } from "@/content/company";
import { services } from "@/content/inventorySchedule";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to Raja Enterprises about your programme. ${contact.addressLines.join(", ")}.`,
};

const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

export default function ContactPage() {
  return (
    <main id="main">
      <PageMasthead
        eyebrow={["Enquiries", "Bengaluru"]}
        statement={[
          { text: "Let’s build the ground " },
          { text: "your event stands", accent: true },
          { text: " on." },
        ]}
        lead="Tell us the dates, the site and the scale. We will tell you what it takes to build it."
      />

      <Band tone="ink">
        <div className="frame grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-3">
          <div data-band-item className="flex flex-col gap-4">
            <p className="t-eyebrow text-white/50">Address</p>
            <address className="t-body not-italic text-white">
              {contact.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>

          <div data-band-item className="flex flex-col gap-4">
            <p className="t-eyebrow text-white/50">Telephone</p>
            <ul className="flex flex-col gap-1">
              {contact.phone && (
                <li>
                  <a href={tel(contact.phone)} className="t-work text-white transition-colors hover:text-accent">
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.landlines.map((n) => (
                <li key={n}>
                  <a href={tel(n)} className="t-body text-body-dark transition-colors hover:text-accent">
                    {n}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-band-item className="flex flex-col gap-4">
            <p className="t-eyebrow text-white/50">Email</p>
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="t-tile [overflow-wrap:anywhere] text-white transition-colors hover:text-accent"
              >
                {contact.email}
              </a>
            )}
            <p className="t-body-sm text-body-dark">
              Est. {FOUNDED_YEAR}. {company.city}.
            </p>
          </div>
        </div>
      </Band>

      <Band>
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">What we take on</p>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s} data-band-item className="t-work border-t border-ink/15 py-[clamp(12px,1.5vw,20px)] text-ink">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Band>
    </main>
  );
}
