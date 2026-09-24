import type { Metadata } from "next";
import Image from "next/image";
import { Band } from "@/components/PageShell";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getContact, pageImage } from "@/lib/store";
import { whatsappLink, telHref as tel } from "@/lib/enquiry";
import { abs } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContact();
  return {
    title: "Contact, Bengaluru",
    description: `Talk to Raja Enterprises about your programme. ${contact.addressLines.join(", ")}.`,
    alternates: { canonical: abs("/contact") },
  };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; ref?: string; error?: string }>;
}) {
  const contact = await getContact();
  const { sent, ref, error } = await searchParams;
  const wa = whatsappLink(contact.phone);
  const heroImg = await pageImage("contact-hero");

  return (
    <main id="main">
      <header className="relative overflow-hidden border-b border-ink/10 pb-16 pt-32 sm:pb-24 sm:pt-40 bg-paper">
        <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)]" style={{ backgroundSize: "32px 32px" }} />
        
        <div className="frame relative z-10">
          <div className="grid gap-[clamp(40px,5vw,80px)] lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="flex flex-col">
              <div className="mb-8 sm:mb-12">
                <div className="flex items-center gap-4">
                  <span className="h-[2px] w-8 sm:w-12 bg-brand-blue/60" />
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-blue font-bold">
                    Contact / Bengaluru
                  </span>
                </div>
              </div>
              <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl font-medium tracking-tight text-ink leading-[1.05] text-balance mb-6">
                Let’s build the ground <span className="text-accent">your event stands</span> on.
              </h1>
              <p className="text-base sm:text-lg text-body-light leading-relaxed max-w-md">
                Tell us the dates, the site and the scale. We will tell you what it takes to build it.
              </p>
            </div>
            <div className="relative">
              <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-ink/5 border border-ink/10 shadow-xl" style={{ position: "relative" }}>
                <Image 
                  src={heroImg?.image ?? "/media/projects/2x/art-of-living-navaratri-2023.webp"} 
                  alt={heroImg?.alt ?? "Raja build"} 
                  fill 
                  priority 
                  sizes="(max-width: 1024px) 96vw, 800px" 
                  className="object-cover" 
                />
              </figure>
              <figcaption className="t-body-sm mt-4 flex items-center gap-x-3 gap-y-1 text-body-light justify-end">
                <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
                  Project photograph
                </span>
                <span>Bengaluru base. Large-scale capability.</span>
              </figcaption>
            </div>
          </div>
        </div>
      </header>

      <Band>
        <div className="frame grid gap-[clamp(40px,5vw,80px)] lg:grid-cols-[1.2fr_0.8fr]">
          <div data-band-item>
            <h2 className="t-work mb-2 text-ink">Start an enquiry</h2>
            <p className="t-body mb-[clamp(24px,3vw,40px)] max-w-[46ch] text-body-light">
              The more you can tell us about the site and the dates, the more useful our first
              reply will be.
            </p>
            <EnquiryForm sent={sent === "1"} error={error} reference={ref} phone={contact.phone} />
          </div>

          <div data-band-item className="flex flex-col">
            <h2 className="t-work mb-6 text-ink">Visit Raja Enterprises</h2>
            
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[15px] bg-ink/5 mb-8 border border-ink/15 shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=Raja%20Enterprises,%20Chamrajpet,%20Bengaluru&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Raja Enterprises Location"
              />
            </div>

            <div className="flex flex-col gap-[clamp(24px,3vw,32px)] p-[clamp(20px,2.5vw,32px)] bg-ink/[0.02] rounded-[15px] border border-ink/5">
              <div className="flex flex-col gap-2">
                <p className="t-eyebrow text-ink/50">Address</p>
                <address className="t-body not-italic text-ink font-medium">
                  {contact.addressLines.map((l, i) => (
                    <span key={l} className="block">
                      {l}
                      {i === contact.addressLines.length - 1 ? "" : ","}
                    </span>
                  ))}
                  <span className="block mt-1 text-body-light">Bengaluru, India</span>
                </address>
              </div>

              <div className="flex flex-col gap-2">
                <p className="t-eyebrow text-ink/50">Telephone</p>
                <ul className="flex flex-col gap-1">
                  {contact.phone && (
                    <li>
                      <a href={tel(contact.phone)} className="t-body text-ink transition-colors hover:text-accent font-medium">
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

              {contact.email && (
                <div className="flex flex-col gap-2">
                  <p className="t-eyebrow text-ink/50">Email</p>
                  {[contact.email, ...(contact.secondaryEmails || [])].filter(Boolean).map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="t-body [overflow-wrap:anywhere] text-ink font-medium transition-colors hover:text-accent"
                    >
                      {email}
                    </a>
                  ))}
                </div>
              )}

              {wa && (
                <div className="flex flex-col gap-3 pt-4 border-t border-ink/10" id="contact-details">
                  <p className="t-eyebrow text-ink/50">WhatsApp</p>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-[44px] w-fit items-center gap-3 rounded-full bg-[#25D366] px-6 text-white transition-all duration-300 hover:bg-[#128C7E] hover:shadow-lg hover:shadow-[#25D366]/30"
                  >
                    <span className="t-body-sm font-medium">Message us on WhatsApp</span>
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 text-sm">
                      &rarr;
                    </span>
                  </a>
                  <p className="t-body-sm max-w-[38ch] text-body-light">
                    This is the fastest way to reach us.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Band>

      <Band tone="ink">
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(24px,3vw,40px)] text-ink/50 text-center sm:text-left">What happens next</p>
          <ol className="grid gap-[clamp(24px,4vw,60px)] sm:grid-cols-3 relative">
            <div className="hidden sm:block absolute top-6 left-0 right-0 h-[1px] bg-ink/10" />
            {[
              ["01", "We read it ourselves", "Every enquiry is read by the people who would build the job, not by a call centre."],
              ["02", "We reply on WhatsApp", "Usually within one working day, with the questions we need answered to price it."],
              ["03", "We come and look", "For anything at scale we visit the site before quoting. Ground decides most of the cost."],
            ].map(([n, title, body]) => (
              <li key={n} data-band-item className="flex flex-col gap-3 pt-4 sm:pt-10 relative">
                <span className="sm:absolute sm:top-[-16px] sm:left-0 sm:w-8 sm:h-8 sm:bg-ink/[0.055] sm:border sm:border-ink/20 sm:rounded-full sm:flex sm:items-center sm:justify-center t-eyebrow text-accent sm:text-[11px] bg-ink/5 w-fit px-3 py-1 rounded-full">{n}</span>
                <span className="t-work text-ink font-medium text-lg">{title}</span>
                <span className="t-body text-body-light">{body}</span>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <Band>
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">Capabilities / What we take on</p>
          <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Events and conferences",
              "Exhibitions and trade shows",
              "Exhibition stall fabrication",
              "Corporate events",
              "Government programmes",
              "Weddings and social events"
            ].map((s) => (
              <li key={s} data-band-item className="flex items-center gap-3 t-work py-3 text-ink border-b border-ink/10 last:border-0 sm:border-0">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Band>
    </main>
  );
}
