/**
 * Visual inspection harness.
 *
 * Loads the running site at four viewports, walks it down in viewport-sized
 * steps, and captures a screenshot at each stop. Screenshots are taken by
 * scrolling rather than with fullPage:true on purpose — fullPage resizes the
 * viewport, which tears down every ScrollTrigger pin and would show us a page
 * that never exists for a real visitor.
 *
 * Also reports console errors, horizontal overflow, and pin/stack geometry.
 *
 * Run: node scripts/inspect.mjs [url]
 */
/**
 * Playwright is intentionally NOT a dependency of this project: its postinstall
 * downloads ~300MB of browsers, which would run on every Vercel build for
 * tooling that never executes in a deploy.
 *
 * To run this script:  npm i playwright --no-save && npx playwright install chromium
 */
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. Run:\n  npm i playwright --no-save && npx playwright install chromium");
  process.exit(1);
}
import { mkdir, rm, writeFile } from "node:fs/promises";

const URL = process.argv[2] ?? "http://localhost:4321/";
const OUT = "_inspection";

const VIEWPORTS = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "390x844", width: 390, height: 844, mobile: true },
];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const report = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: Boolean(vp.mobile),
    hasTouch: Boolean(vp.mobile),
    userAgent: vp.mobile
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
      : undefined,
  });

  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 300));
  });
  page.on("pageerror", (e) => errors.push(`PAGEERROR: ${String(e).slice(0, 300)}`));

  await page.goto(URL, { waitUntil: "networkidle", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);

  const dir = `${OUT}/${vp.name}`;
  await mkdir(dir, { recursive: true });

  const findings = { viewport: vp.name, errors, overflow: [], shots: [], sections: [] };

  // Section geometry, before any scrolling.
  findings.sections = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main > section, main > footer, footer")).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        id: el.id || el.tagName.toLowerCase(),
        top: Math.round(r.top + window.scrollY),
        height: Math.round(r.height),
      };
    }),
  );

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.ceil(pageHeight / vp.height);
  findings.pageHeight = pageHeight;
  findings.steps = steps;

  for (let i = 0; i < steps; i++) {
    const y = i * vp.height;
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(2600);

    // Horizontal overflow is measured while scrolled, because a mid-pin
    // transform is exactly when it appears.
    const over = await page.evaluate(() => {
      const doc = document.documentElement;
      if (doc.scrollWidth <= doc.clientWidth + 1) return null;
      const offenders = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > doc.clientWidth + 2 || r.left < -2) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className?.toString?.() ?? "").slice(0, 70),
            left: Math.round(r.left),
            right: Math.round(r.right),
          });
        }
        if (offenders.length > 6) break;
      }
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders };
    });
    if (over) findings.overflow.push({ y, ...over });

    const file = `${dir}/${String(i).padStart(2, "0")}.png`;
    await page.screenshot({ path: file });
    findings.shots.push(file);
  }

  report.push(findings);
  await context.close();
  console.log(
    `${vp.name.padEnd(10)} height=${pageHeight}  shots=${steps}  errors=${errors.length}  overflow=${findings.overflow.length}`,
  );
}

await browser.close();
await writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(`\nwrote ${OUT}/report.json`);
