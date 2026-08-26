import type { Metadata } from "next";
import { PageMasthead, Band } from "@/components/PageShell";
import { Placeholder } from "@/components/Placeholder";
import { company, contact } from "@/content/company";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Based in Bengaluru, deployed across India. Raja Enterprises transports and erects its own event infrastructure nationwide.",
};

/**
 * Locations verified from Raja's own project records. These are places work has
 * been delivered — not offices. No branch network is claimed, because none is
 * evidenced.
 */
const deliveredIn = [
  "Bengaluru, Karnataka",
  "Gayathri Vihar, Bengaluru",
  "Vidhana Soudha, Bengaluru",
  "Kanteerava Stadium, Bengaluru",
  "Palace Grounds, Bengaluru",
  "GKVK Campus, Bengaluru",
];

export default function LocationsPage() {
  return (
    <main id="main">
      <PageMasthead
        eyebrow={["Where we", "work"]}
        statement={[
          { text: "Based in Bengaluru. " },
          { text: "Deployed", accent: true },
          { text: " across India." },
        ]}
        lead="Twenty owned goods vehicles and a 300-strong field crew mean the fleet travels. Structures are transported, erected, run and struck by the same team that owns them."
      />

      <Band tone="ink">
        <div className="frame grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-[1fr_1fr]">
          <div data-band-item className="flex flex-col gap-4">
            <p className="t-eyebrow text-white/50">Head office</p>
            <address className="t-work not-italic text-white">
              {contact.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>
          <div data-band-item className="flex flex-col gap-4">
            <p className="t-eyebrow text-white/50">Reach</p>
            <p className="t-body text-body-dark">
              {company.name} has delivered event infrastructure across India for over four decades,
              operating from a single Bengaluru base rather than a branch network.
            </p>
          </div>
        </div>
      </Band>

      <Band>
        <div className="frame">
          <p className="t-eyebrow mb-[clamp(20px,2.4vw,34px)] text-ink/50">Venues delivered</p>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {deliveredIn.map((v) => (
              <li key={v} data-band-item className="t-work border-t border-ink/15 py-[clamp(12px,1.5vw,20px)] text-ink">
                {v}
              </li>
            ))}
          </ul>
          <div className="mt-[clamp(28px,3.4vw,48px)] max-w-[62ch]">
            <Placeholder
              label="Wider deployment map pending"
              note="Venues outside Karnataka are being confirmed against project records before publication."
              lines={2}
            />
          </div>
        </div>
      </Band>
    </main>
  );
}
