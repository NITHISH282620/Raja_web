import Image from "next/image";
import { Pill } from "@/components/Buttons";
import { Placeholder, PlaceholderImage } from "@/components/Placeholder";
import type { Project } from "@/content/works";
import { clsx } from "@/lib/clsx";

const TINT: Record<Project["tint"], string> = {
  pink: "bg-tint-pink",
  yellow: "bg-tint-yellow",
  blue: "bg-tint-blue",
  purple: "bg-tint-purple",
  green: "bg-tint-green",
  neutral: "bg-tint-neutral",
};

/**
 * Figma: 1250 x 600, tint ground, 628 x 582 image, 526px text column, 58px gap,
 * 9px padding on the image side and 28px on the text side.
 *
 * Below 1024 the two columns stack — a 526px text column beside a 628px image
 * has nowhere to go on a phone, and shrinking both produces a card where
 * neither the photograph nor the copy is legible.
 */
export function WorkCard({ work }: { work: Project }) {
  const media = work.hero ? (
    <div data-work-image className="absolute inset-0">
      <Image
        src={work.hero.src}
        alt={work.hero.alt}
        fill
        sizes="(max-width: 1023px) 100vw, 44vw"
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
        style={work.hero?.focal ? { objectPosition: work.hero.focal } : undefined}
      />
    </div>
  ) : (
    <PlaceholderImage className="absolute inset-0 h-full w-full" note={work.note} />
  );

  return (
    <article
      className={clsx(
        // `origin-top` so the scale-back applied as the next card is laid over
        // this one pivots from the top edge, which is the edge that stays put.
        "group flex h-full w-full origin-top flex-col overflow-hidden rounded-[20px] p-[9px] lg:flex-row lg:items-center lg:gap-[min(4.03vw,58px)]",
        work.reverse ? "lg:flex-row-reverse lg:pl-[9px] lg:pr-[28px]" : "lg:pl-[9px] lg:pr-[28px]",
        TINT[work.tint],
      )}
    >
      <div className="relative aspect-[628/420] w-full shrink-0 overflow-hidden rounded-[15px] lg:aspect-auto lg:h-full lg:w-[min(43.6vw,628px)] lg:rounded-[20px]">
        {media}
      </div>

      <div className="flex flex-col gap-[12px] px-[11px] py-[20px] lg:w-[min(36.5vw,526px)] lg:shrink-0 lg:px-0 lg:py-0">
        <p data-work-meta className="t-eyebrow text-ink">
          {work.eyebrow}
        </p>
        <h3 data-work-meta className="t-work text-balance text-ink">
          {work.title}
        </h3>

        {work.summary ? (
          <p data-work-meta className="t-body lg:max-w-[474px] text-body-light">
            {work.summary}
          </p>
        ) : (
          <Placeholder
            label="Case study summary pending"
            note={work.note}
            lines={4}
            className="lg:max-w-[474px]"
          />
        )}

        {work.href && (
          <div data-work-meta className="mt-2">
            <Pill href={work.href}>read the case study →</Pill>
          </div>
        )}
      </div>
    </article>
  );
}
