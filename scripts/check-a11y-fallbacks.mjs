/**
 * Verifies the two states where the motion system must get out of the way:
 * a visitor who has asked for reduced motion, and a visitor with no JS at all.
 *
 * In both cases every element the timelines would normally reveal must be
 * fully opaque and in its resting position — the page has to be readable and
 * complete without GSAP ever running.
 *
 * Run: node scripts/check-a11y-fallbacks.mjs [url]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL = process.argv[2] ?? "http://localhost:4321/";
const OUT = "_inspection/fallbacks";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
let failures = 0;

async function audit(label, contextOptions, { javaScriptEnabled = true } = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled,
    ...contextOptions,
  });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90_000 });
  await page.waitForTimeout(2500);

  const result = await page.evaluate(() => {
    const hidden = [];
    for (const el of document.querySelectorAll("[data-reveal], [data-reveal-rule]")) {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      // Elements inside the closed menu overlay are meant to be hidden.
      if (el.closest("#site-menu")) continue;
      if (rect.width === 0 && rect.height === 0) continue;
      const opacity = parseFloat(style.opacity);
      // scaleX(0) collapses a rule to nothing; the identity matrix must not
      // be mistaken for it, so compare the actual a/d scale components.
      const m = style.transform.match(/matrix\(([-\d.]+),\s*[-\d.]+,\s*[-\d.]+,\s*([-\d.]+)/);
      const flattened = m ? Math.abs(parseFloat(m[1])) < 0.01 || Math.abs(parseFloat(m[2])) < 0.01 : false;
      // 0.6 and 0.7 opacities are authored states in the design (inactive
      // process steps, eyebrow rules), so only near-invisible counts.
      if (opacity < 0.5 || flattened) {
        hidden.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.toString?.() ?? "").slice(0, 60),
          opacity,
          transform: style.transform.slice(0, 40),
        });
      }
    }
    return {
      hidden,
      totalRevealTargets: document.querySelectorAll("[data-reveal], [data-reveal-rule]").length,
      headingText: document.querySelector("h1")?.textContent ?? null,
      sectionCount: document.querySelectorAll("main > section, footer").length,
      bodyText: document.body.innerText.replace(/\s+/g, " ").trim().length,
      motionReady: document.documentElement.classList.contains("motion-ready"),
    };
  });

  await page.screenshot({ path: `${OUT}/${label}.png` });
  await context.close();

  const ok = result.hidden.length === 0 && result.bodyText > 2000 && result.headingText;
  if (!ok) failures++;

  console.log(`\n${ok ? "PASS" : "FAIL"}  ${label}`);
  console.log(`  motion-ready class : ${result.motionReady}`);
  console.log(`  reveal targets     : ${result.totalRevealTargets}`);
  console.log(`  still hidden       : ${result.hidden.length}`);
  console.log(`  h1                 : ${result.headingText}`);
  console.log(`  sections in DOM    : ${result.sectionCount}`);
  console.log(`  readable text      : ${result.bodyText} chars`);
  if (result.hidden.length) {
    result.hidden.slice(0, 5).forEach((h) => console.log(`    - ${h.tag} ${h.cls} opacity=${h.opacity}`));
  }
}

await audit("reduced-motion", { reducedMotion: "reduce" });
await audit("no-javascript", {}, { javaScriptEnabled: false });

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : "\nboth fallbacks pass");
process.exit(failures ? 1 : 0);
