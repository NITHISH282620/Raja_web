import { clsx } from "@/lib/clsx";

export interface Segment {
  text: string;
  accent?: boolean;
}

/**
 * The large Poppins statements, with coral highlights mid-sentence.
 *
 * The highlight is authored per segment rather than matched by string, because
 * in the design it lands on grammatical fragments ("building the", "in-house")
 * that no regex would pick out correctly.
 *
 * A literal "\n" in a segment forces a line break, matching the two-line
 * setting Figma uses for several of these.
 */
export function Statement({
  segments,
  className,
  tone = "dark",
  as: Tag = "h2",
}: {
  segments: readonly Segment[];
  className?: string;
  tone?: "dark" | "light";
  as?: "h1" | "h2" | "h3" | "p";
}) {
  return (
    <Tag className={clsx(tone === "light" ? "text-white" : "text-ink", "text-balance", className)}>
      {segments.map((segment, i) => (
        <span key={i} className={segment.accent ? "text-accent" : undefined}>
          {segment.text.split("\n").map((line, j) => (
            <span key={j} className="contents">
              {j > 0 && <br />}
              {line}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
