/** Minimal class joiner — avoids a dependency for what is three lines. */
export function clsx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
