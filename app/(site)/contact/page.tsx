import type { Metadata } from "next";
import Image from "next/image";
import { PageMasthead, Band } from "@/components/PageShell";
import { EnquiryForm } from "@/components/EnquiryForm";
import { company, FOUNDED_YEAR } from "@/content/company";
import { services } from "@/content/inventorySchedule";
import { getContact } from "@/lib/store";
import { whatsappLink } from "@/lib/enquiry";

export async function generateMetadata(): Promise<Metadata> {
  const contact = getContact();
  return {
    title: "Contact",
    description: `Talk to Raja Enterprises about your programme. ${contact.addressLines.join(", ")}.`,
  };
}

const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; ref?: string; error?: string }>;
}) {
  const contact = getContact();
  const { sent, ref, error } = await searchParams;
  const wa = whatsappLink(contact.phone);

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

      <figure className="frame mt-[clamp(20px,3vw,44px)]">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[20px] bg-ink/5">
          <Image src="/media/events/aol-pavilion-night.67b84519.webp" alt="A large illuminated pavilion at night, reflected in still water." fill priority sizes="(max-width: 1024px) 96vw, 1280px" className="object-cover" />
        </div>
        <figcaption className="t-body-sm mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-light">
          <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
            Project photograph
          </span>
          <span>A Raja build at night. Supplied by the client.</span>
        </figcaption>
      </figure>


      {/* The form leads. Everything below it is reference — a visitor who has
          decided to make contact should not have to scroll past an address
          block to find the way to do it. */}
      <Band>
        <div className="frame grid gap-[clamp(32px,5vw,80px)] lg:grid-cols-[1.1fr_0.9fr]">
          <div data-band-item>
            <h2 className="t-work mb-2 text-ink">Start an enquiry</h2>
            <p className="t-body mb-[clamp(20px,2.4vw,32px)] max-w-[46ch] text-body-light">
              The more you can tell us about the site and the dates, the more useful our first
              reply will be.
            </p>
            <EnquiryForm sent={sent === "1"} error={error} reference={ref} phone={contact.phone} />
          </div>

          <div data-band-item className="flex flex-col gap-[clamp(24px,3vw,40px)]">
            {wa && (
              <div className="flex flex-col gap-3">
                <p className="t-eyebrow text-ink/50">WhatsApp</p>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-[52px] w-fit items-center gap-3 rounded-full bg-brand-blue px-7 text-white transition-colors duration-300 hover:bg-ink"
                >
                  <span className="t-body">Message us on WhatsApp</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>
                <p className="t-body-sm max-w-[38ch] text-body-light">
                  Opens WhatsApp with a message ready to send. This is the fastest way to reach us.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <p className="t-eyebrow text-ink/50">Address</p>
              <address className="t-body not-italic text-ink">
                {contact.addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </div>

            {contact.email && (
              <div className="flex flex-col gap-3">
                <p className="t-eyebrow text-ink/50">Email</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="t-tile [overflow-wrap:anywhere] text-ink transition-colors hover:text-accent"
                >
                  {contact.email}
                </a>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <p className="t-eyebrow text-ink/50">Telephone</p>
              <ul className="flex flex-col gap-1">
                {contact.phone && (
                  <li>
                    <a href={tel(contact.phone)} className="t-work text-ink transition-colors hover:text-accent">
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.landlines.map((n) => (
                  <li key={n}>
                    <a href={tel(n)} className="t-body text-body-light transition-colors hover:text-accent">
                      {n}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <p className="t-body-sm text-body-light">
              Est. {FOUNDED_YEAR}. {company.city}.
            </p>
          </div>
        </div>
      </Band>

      <Band>
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">What happens next</p>
          <ol className="grid gap-[clamp(20px,3vw,44px)] sm:grid-cols-3">
            {[
              ["01", "We read it ourselves", "Every enquiry is read by the people who would build the job, not by a call centre."],
              ["02", "We reply on WhatsApp", "Usually within one working day, with the questions we need answered to price it."],
              ["03", "We come and look", "For anything at scale we visit the site before quoting. Ground decides most of the cost."],
            ].map(([n, title, body]) => (
              <li key={n} data-band-item className="flex flex-col gap-2 border-t border-ink/15 pt-[clamp(12px,1.5vw,20px)]">
                <span className="t-eyebrow text-accent">{n}</span>
                <span className="t-work text-ink">{title}</span>
                <span className="t-body text-body-light">{body}</span>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <Band tone="ink">
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
