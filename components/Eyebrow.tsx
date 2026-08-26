import { clsx } from "@/lib/clsx";

/**
 * The mono label pair split by a hairline rule — `notable —— works`.
 *
 * Used eight times across the design and animated identically every time: the
 * labels fade in from either side while the rule grows from zero width. The
 * rule is a CSS element rather than the exported SVG so it can be scaled
 * without rasterising and inherits its colour from the ground.
 */
export function Eyebrow({
  items,
  tone = "dark",
  align = "start",
  className,
}: {
  items: readonly string[];
  tone?: "dark" | "light";
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "t-eyebrow flex items-center gap-[9px] whitespace-nowrap",
        align === "center" ? "justify-center" : "justify-start",
        tone === "light" ? "text-white" : "text-ink",
        className,
      )}
    >
      {items.map((item, i) => (
        <span key={item} className="contents">
          {i > 0 && (
            <span
              aria-hidden
              data-reveal-rule
              className="h-px w-[22.5px] shrink-0 bg-current opacity-70"
            />
          )}
          <span data-reveal>{item}</span>
        </span>
      ))}
    </p>
  );
}
