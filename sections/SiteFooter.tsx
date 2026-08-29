"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, riseCard, release, entranceTrigger, q } from "@/motion/primitives";
import { MOTION_OK } from "@/motion/ease";
import { Placeholder } from "@/components/Placeholder";
import { navItems } from "@/content/navigation";
import Link from "next/link";
import { company, FOUNDED_YEAR, yearsInOperation } from "@/content/company";
import type { ContactSettings } from "@/lib/store";

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
        riseCard(tl, q(scope, "[data-footer-col]"), { stagger: 0.1, distance: 24, scaleFrom: 0.98 }, 0);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative w-full overflow-hidden bg-paper pt-[clamp(64px,8vw,100px)] border-t border-ink/10">
      <div className="frame grid gap-10 pb-[clamp(48px,6vw,80px)] sm:grid-cols-2 lg:grid-cols-4">
        <div data-footer-col data-reveal className="flex flex-col gap-3">
          <p className="t-eyebrow text-ink/50 font-mono text-xs tracking-wider uppercase">Est. {FOUNDED_YEAR}</p>
          <p className="t-body max-w-[28ch] text-body-light">
            {company.name} ’ {yearsInOperation()} years building the physical environments where
            India&rsquo;s most important gatherings happen.
          </p>
        </div>

        <nav data-footer-col data-reveal className="flex flex-col gap-3" aria-label="Footer">
          <p className="t-eyebrow text-ink/50 font-mono text-xs tracking-wider uppercase">Sections</p>
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-body text-body-light transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div data-footer-col data-reveal className="flex flex-col gap-3">
          <p className="t-eyebrow text-ink/50 font-mono text-xs tracking-wider uppercase">Contact</p>
          {hasContactDetails ? (
            <address className="t-body not-italic text-body-light flex flex-col gap-1">
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="block transition-colors hover:text-accent mt-1">
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block transition-colors hover:text-accent">
                  {contact.email}
                </a>
              )}
            </address>
          ) : (
            <Placeholder label="Contact details pending" note={contact.note} lines={3} />
          )}
        </div>

        <div data-footer-col data-reveal className="flex flex-col gap-3">
          <p className="t-eyebrow text-ink/50 font-mono text-xs tracking-wider uppercase">Based in</p>
          <p className="t-body text-body-light">{company.city}, Karnataka, India</p>
        </div>
      </div>

      <div className="frame flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 py-6">
        <p className="t-eyebrow text-ink/40 font-mono text-xs">
          ’ {new Date().getFullYear()} {company.name}
        </p>
        <p className="t-eyebrow text-ink/40 font-mono text-xs">{company.city}, India</p>
      </div>
    </footer>
  );
}