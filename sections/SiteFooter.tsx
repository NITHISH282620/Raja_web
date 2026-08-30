"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, riseCard, release, entranceTrigger, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { Placeholder } from "@/components/Placeholder";
import { navItems } from "@/content/navigation";
import { company, FOUNDED_YEAR, yearsInOperation } from "@/content/company";
import type { ContactSettings } from "@/lib/store";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/raja-enterprises",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/rajaenterprises",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/rajaenterprises",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/919845044177",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
];

const disciplines = [
  "Government Summits & State Events",
  "Clear-Span German Hangers",
  "Mega Staging, Dais & Trusses",
  "Exhibitions & Octonorm Stalls",
  "Heavy-Duty Wooden Flooring",
  "Turnkey Tent Cities & Pavilions",
];

/**
 * SiteFooter Component:
 * - Brand Logo & Vision Blurb
 * - Social Media Channels (LinkedIn, Instagram, Facebook, WhatsApp)
 * - Navigation links
 * - Official Contact & Address
 * - Services & Capabilities
 * - Clean bottom legal bar
 */
export function SiteFooter({ contact }: { contact: ContactSettings }) {
  const hasContactDetails = Boolean(
    contact.email || contact.phone || contact.addressLines.length,
  );

  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: entranceTrigger(scope),
          onComplete: () => release(q(scope, "[data-reveal]")),
        });
        riseCard(tl, q(scope, "[data-footer-col]"), { stagger: 0.08, distance: 24, scaleFrom: 0.98 }, 0);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative w-full overflow-hidden bg-paper pt-[clamp(60px,8vw,96px)] border-t border-ink/10">
      <div className="frame grid gap-10 pb-[clamp(48px,6vw,72px)] sm:grid-cols-2 lg:grid-cols-12">
        {/* Col 1: Brand Logo, Tagline & Social Links (lg: 4 cols) */}
        <div data-footer-col data-reveal className="flex flex-col gap-5 lg:col-span-4">
          <Link href="/" className="inline-block w-fit" aria-label="Raja Enterprises - home">
            <div
              className="h-[40px] w-[140px] bg-brand-blue"
              style={{
                WebkitMaskImage: "url(/media/brand-raja-logo.webp)",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center left",
                maskImage: "url(/media/brand-raja-logo.webp)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center left",
              }}
            />
          </Link>
          <p className="t-body max-w-[32ch] text-body-light leading-relaxed">
            {company.name} ’ {yearsInOperation()} years building the physical infrastructure where
            India&rsquo;s largest gatherings and celebrations stand on.
          </p>

          {/* Social Media Links */}
          <div className="flex items-center gap-3 pt-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-surface text-ink/70 shadow-sm transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-accent hover:text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Navigation Links (lg: 2 cols) */}
        <nav data-footer-col data-reveal className="flex flex-col gap-3 lg:col-span-2" aria-label="Footer Navigation">
          <p className="t-eyebrow text-ink/50 font-mono text-xs tracking-wider uppercase">Sections</p>
          <ul className="flex flex-col gap-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-body text-body-light transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3: Contact Details (lg: 3 cols) */}
        <div data-footer-col data-reveal className="flex flex-col gap-3 lg:col-span-3">
          <p className="t-eyebrow text-ink/50 font-mono text-xs tracking-wider uppercase">Contact</p>
          {hasContactDetails ? (
            <address className="t-body not-italic text-body-light flex flex-col gap-1.5 leading-relaxed">
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="block transition-colors hover:text-accent font-medium text-ink pt-1">
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block transition-colors hover:text-accent font-medium text-ink">
                  {contact.email}
                </a>
              )}
            </address>
          ) : (
            <Placeholder label="Contact details pending" note={contact.note} lines={3} />
          )}
        </div>

        {/* Col 4: Services & Disciplines (lg: 3 cols) */}
        <div data-footer-col data-reveal className="flex flex-col gap-3 lg:col-span-3">
          <p className="t-eyebrow text-ink/50 font-mono text-xs tracking-wider uppercase">Services</p>
          <ul className="flex flex-col gap-2 text-body-light text-sm">
            {disciplines.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent/60 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & City Bar */}
      <div className="frame flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 py-6">
        <p className="t-eyebrow text-ink/40 font-mono text-xs">
          ’ {new Date().getFullYear()} {company.name} ’ Est. {FOUNDED_YEAR}
        </p>
        <p className="t-eyebrow text-ink/40 font-mono text-xs">
          {company.city}, Karnataka, India
        </p>
      </div>
    </footer>
  );
}