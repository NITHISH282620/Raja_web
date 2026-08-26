/**
 * Lists every content record the Figma file did not fully resolve.
 *
 * The design is semi-approved, so this is the working list of what still needs
 * a decision or an asset before launch. Everything below lives in content/ and
 * can be replaced without touching a component.
 *
 * Run: npx tsx scripts/content-audit.mjs   (or import the modules directly)
 */
import { readFile, readdir } from "node:fs/promises";

const files = (await readdir("content")).filter((f) => f.endsWith(".ts") && f !== "types.ts");
const rows = [];

for (const file of files) {
  const src = await readFile(`content/${file}`, "utf8");
  // Pair each status with the nearest preceding id/label so the row is useful.
  const re = /status:\s*"(provisional|pending)"(?:\s*as\s*const)?,?\s*\n\s*note:\s*(?:"([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = re.exec(src))) {
    const before = src.slice(0, m.index);
    const id = [...before.matchAll(/(?:^|\s)(?:id|title|label):\s*"([^"]+)"/g)].pop()?.[1] ?? "—";
    rows.push({ file, id, status: m[1], note: (m[2] ?? m[3]).trim() });
  }
}

const pending = rows.filter((r) => r.status === "pending");
const provisional = rows.filter((r) => r.status === "provisional");

const print = (label, list) => {
  if (!list.length) return;
  console.log(`\n${label} (${list.length})`);
  console.log("─".repeat(78));
  for (const r of list) {
    console.log(`  ${r.file.replace(".ts", "").padEnd(14)} ${r.id}`);
    console.log(`  ${" ".repeat(14)} ${r.note}\n`);
  }
};

print("PENDING — no content supplied", pending);
print("PROVISIONAL — present but duplicated, contradictory or truncated", provisional);
console.log(`\n${rows.length} unresolved content records across ${files.length} modules.`);
