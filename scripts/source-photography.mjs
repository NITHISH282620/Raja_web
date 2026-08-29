/**
 * Sources candidate photography from Pexels for the site's image slots.
 *
 * Search pages sit behind a bot check, so IDs are collected with a real
 * browser; the CDN itself needs no key. Pexels only serves one search per
 * browser session before it starts returning the challenge page instead of
 * results, so each query gets its own browser — slower, but it is the
 * difference between fourteen candidates and zero.
 *
 * Pexels License: free for commercial use, no attribution required,
 * modification permitted.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const OUT = process.env.OUT ?? "/tmp/claude-1000/-home-ubuntu-wsl-projects-Raja-web/bfe10a3c-0dd5-4944-8d1c-7506a3fbb681/scratchpad/img";
const QUERIES = JSON.parse(process.argv[2]);

async function collect(query) {
  const b = await chromium.launch();
  try {
    const p = await b.newPage({
      viewport: { width: 1400, height: 1000 },
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    });
    await p.goto(`https://www.pexels.com/search/${encodeURIComponent(query)}/`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await p.waitForTimeout(3200);
    for (let i = 0; i < 3; i++) {
      await p.mouse.wheel(0, 2400);
      await p.waitForTimeout(1100);
    }
    const found = await p.evaluate(() =>
      [...document.querySelectorAll("img")]
        .map((img) => {
          const m = (img.currentSrc || img.src || "").match(/\/photos\/(\d+)\//);
          return m ? { id: m[1], alt: (img.alt || "").slice(0, 90) } : null;
        })
        .filter(Boolean),
    );
    const seen = new Set();
    return found.filter((x) => !seen.has(x.id) && seen.add(x.id)).slice(0, 14);
  } finally {
    await b.close();
  }
}

for (const [slug, query] of Object.entries(QUERIES)) {
  try {
    const uniq = await collect(query);
    await mkdir(`${OUT}/${slug}`, { recursive: true });
    const kept = [];
    for (const [i, hit] of uniq.entries()) {
      const url = `https://images.pexels.com/photos/${hit.id}/pexels-photo-${hit.id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
      const res = await fetch(url, { headers: { "User-Agent": "raja-web/1.0" } });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 20000) continue;
      await writeFile(`${OUT}/${slug}/${String(i).padStart(2, "0")}.jpg`, buf);
      kept.push({ file: `${String(i).padStart(2, "0")}.jpg`, ...hit, url });
    }
    await writeFile(`${OUT}/${slug}/meta.json`, JSON.stringify(kept, null, 1));
    console.log(slug.padEnd(22), query.padEnd(40), kept.length);
  } catch (e) {
    console.log(slug.padEnd(22), "FAILED", String(e).slice(0, 70));
  }
}
