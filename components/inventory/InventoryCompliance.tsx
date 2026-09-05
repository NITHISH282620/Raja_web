import Link from "next/link";
import { compliancePosition } from "@/content/inventoryCatalog";
import { Reveal } from "@/motion/Reveal";

/**
 * Compliance and documentation.
 *
 * This section used to render a table of certifications with named issuing
 * authorities — SPG clearance, DIN 4102 fire ratings, wind and floor load
 * figures attributed to audits — none of which Raja supplied. The heading
 * claimed "Tested to Extreme Structural Thresholds" and the body asserted that
 * every batch of extrusion, membrane and timber is tested against national and
 * European standards.
 *
 * None of that could be evidenced, and a government tender checks exactly these
 * claims. What it says now is what is actually true and defensible: paperwork is
 * produced per job and issued to the client and the venue authority. That is a
 * stronger position than an unverifiable certificate table, because it invites
 * the question rather than pre-empting it.
 */
export function InventoryCompliance() {
  return (
    <section className="relative w-full border-t border-ink/10 bg-paper py-16 sm:py-24 md:py-32">
      <div className="frame">
        <div className="mb-10 flex max-w-3xl flex-col gap-4 sm:mb-14">
          <p className="t-eyebrow text-xs uppercase tracking-[0.2em] text-accent font-medium">
            Compliance
          </p>
          <h2 className="t-statement text-balance font-semibold text-ink">
            {compliancePosition.heading}
          </h2>
        </div>

        <Reveal
          as="div"
          variant="fadeUp"
          className="grid gap-[clamp(20px,3vw,56px)] lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="flex flex-col gap-[clamp(12px,1.5vw,20px)]">
            {compliancePosition.body.map((para) => (
              <p key={para.slice(0, 24)} className="t-body max-w-[60ch] leading-relaxed text-body-light">
                {para}
              </p>
            ))}
          </div>

          <aside className="flex flex-col gap-4 self-start rounded-[15px] border border-ink/12 bg-white p-[clamp(18px,2.2vw,28px)]">
            <p className="t-eyebrow text-ink/50">Why nothing is listed here</p>
            <p className="t-body text-body-light">{compliancePosition.note}</p>
            <Link
              href="/contact"
              className="group mt-1 inline-flex h-[48px] w-fit items-center gap-3 rounded-full bg-brand-blue px-6 text-white transition-colors duration-300 hover:bg-ink"
            >
              <span className="t-body">Request documentation</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
