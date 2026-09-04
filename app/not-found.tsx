import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * The 404.
 *
 * No search box: this site has ten pages, so the useful response is the list
 * itself rather than a field to type into.
 */
const ROUTES: { href: string; label: string; blurb: string }[] = [
  { href: "/services", label: "Services", blurb: "Hangers, stalls, flooring, staging, scaffolding" },
  { href: "/projects", label: "Projects", blurb: "What we have built, and at what scale" },
  { href: "/inventory", label: "Inventory", blurb: "What we own and deploy" },
  { href: "/about", label: "About", blurb: "Who we are and how we work" },
  { href: "/contact", label: "Contact", blurb: "Start an enquiry" },
];

export default function NotFound() {
  return (
    <main id="main" className="frame flex min-h-[70svh] flex-col justify-center py-[clamp(80px,12vw,160px)]">
      <p className="t-eyebrow text-accent">404</p>
      <h1 className="t-statement mt-3 max-w-[16ch] text-ink">That page is not here.</h1>
      <p className="t-body mt-4 max-w-[52ch] text-body-light">
        The link may be out of date. Everything on the site is one of these.
      </p>
      <ul className="mt-[clamp(28px,4vw,52px)] grid gap-[clamp(14px,1.8vw,22px)] sm:grid-cols-2 lg:grid-cols-3">
        {ROUTES.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              className="group flex flex-col gap-1 rounded-[15px] border border-ink/12 bg-white p-[clamp(16px,2vw,24px)] transition-colors duration-300 hover:border-ink/30"
            >
              <span className="t-work text-ink">{r.label}</span>
              <span className="t-body-sm text-body-light">{r.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
