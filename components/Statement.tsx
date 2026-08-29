import { clsx } from "@/lib/clsx";

export interface Segment {
  text: string;
  accent?: boolean;
  id?: string;
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
/** A segment that is nothing but trailing punctuation. */
const PUNCTUATION_ONLY = /^[.,!?;:’'")\]]+$/;

/**
 * Folds punctuation-only segments into the segment before them.
 *
 * See the note on line breaking in the component below: a lone "." in its own
 * segment survives normal layout but not SplitText, which gives it a break
 * opportunity it should never have had.
 */
function mergePunctuation(segments: readonly Segment[]): Segment[] {
  return segments.reduce<Segment[]>((out, segment) => {
    const previous = out[out.length - 1];
    if (previous && PUNCTUATION_ONLY.test(segment.text)) {
      out[out.length - 1] = { ...previous, text: previous.text + segment.text };
      return out;
    }
    out.push(segment);
    return out;
  }, []);
}

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
    <Tag
      // `data-lines` is what CSS pre-hides and what `revealLines` unhides once
      // the per-line masks exist. Statements are never revealed as a block.
      data-lines
      className={clsx(tone === "light" ? "text-white" : "text-ink", "text-balance", className)}
    >
      {mergePunctuation(segments).map((segment, i) => (
        <span key={i} id={segment.id} className={segment.accent ? "text-accent" : undefined}>
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
