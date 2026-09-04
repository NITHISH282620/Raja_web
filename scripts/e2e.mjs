/**
 * End-to-end checks against a running server.
 *
 *   BASE=http://localhost:3210 node scripts/e2e.mjs
 *
 * Covers the acceptance criteria that can be checked mechanically: every route
 * responds, the enquiry form actually writes an enquiry and offers a WhatsApp
 * hand-off, nothing overflows horizontally at the required widths, and no page
 * logs a console error. Anything it cannot judge — visual hierarchy, whether a
 * photograph is the right photograph — is left to human review by design.
 */
import { chromium, devices } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3210";
const WIDTHS = [360, 390, 414, 768, 1024, 1280, 1440, 1920];
const ROUTES = (process.env.ROUTES ?? [
  "/", "/about", "/legacy", "/inventory", "/services",
  "/services/german-hangers", "/projects", "/locations", "/careers", "/contact",
].join(",")).split(",").filter(Boolean);

let pass = 0;
let fail = 0;
const failures = [];
const ok = (name) => { pass++; console.log(`  PASS  ${name}`); };
const bad = (name, detail) => {
  fail++;
  failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
  console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch();

/* ---------------------------------------------- routes, console, overflow */
console.log("\nROUTES / CONSOLE / OVERFLOW");
for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));

  const res = await page
    .goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 45000 })
    .catch(() => null);
  const status = res?.status() ?? 0;
  if (status === 200) ok(`${route} 200`);
  else { bad(route, `status ${status}`); await ctx.close(); continue; }

  const h1 = await page.locator("h1").allTextContents();
  if (h1.length === 1 && h1[0].trim()) ok(`${route} one non-empty h1`);
  else bad(`${route} h1`, `found ${h1.length}`);

  let overflowed = null;
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(140);
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (over > 1 && !overflowed) overflowed = `${width}px by ${over}px`;
  }
  if (!overflowed) ok(`${route} no h-overflow at any width`);
  else bad(`${route} overflow`, overflowed);

  if (errors.length === 0) ok(`${route} no console errors`);
  else bad(`${route} console`, errors.slice(0, 2).join(" | ").slice(0, 160));
  await ctx.close();
}

/* ------------------------------------------------------ enquiry -> WhatsApp */
console.log("\nENQUIRY FLOW");
let issuedRef = null;
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  await page.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });

  const stamp = `E2E-${Date.now()}`;
  await page.fill('input[name="name"]', stamp);
  await page.fill('input[name="organisation"]', "E2E Test Co");
  await page.fill('input[name="phone"]', "9845000000");
  await page.fill('input[name="location"]', "Bengaluru");
  await page.fill('input[name="requirement"]', "40,000 sq ft covered");
  await page.selectOption('select[name="event_type"]', { index: 1 }).catch(() => {});
  await page.fill('textarea[name="message"]', "Automated end-to-end check.");
  await page.click('button[type="submit"]');
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(900);

  const body = (await page.textContent("body")) ?? "";
  if (/that has reached us/i.test(body)) ok("success state shown");
  else bad("success state", body.slice(0, 120));

  issuedRef = (body.match(/RE-\d{4}-[A-Z0-9]{4}/) ?? [])[0] ?? null;
  if (issuedRef) ok(`reference issued (${issuedRef})`);
  else bad("reference issued");

  const wa = await page.getAttribute('a[href^="https://wa.me/"]', "href").catch(() => null);
  if (wa && issuedRef && decodeURIComponent(wa).includes(issuedRef)) {
    ok("WhatsApp link carries the reference");
  } else {
    bad("WhatsApp link", wa ? "reference missing from prefilled text" : "no wa.me link");
  }

  await page.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
  const fs = await page.evaluate(() => {
    const el = document.querySelector('input[name="name"]');
    return el ? parseFloat(getComputedStyle(el).fontSize) : 0;
  });
  if (fs >= 16) ok(`input font-size ${fs}px, no iOS zoom`);
  else bad("input font-size", `${fs}px is under 16px`);

  await ctx.close();
}

/* ------------------------------------------------------------- validation */
console.log("\nVALIDATION");
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
  await page.fill('input[name="name"]', "No Contact Details");
  await page.evaluate(() => {
    document.querySelector('input[name="name"]')?.removeAttribute("required");
  });
  await page.click('button[type="submit"]');
  await page.waitForTimeout(900);
  const t = (await page.textContent("body")) ?? "";
  if (/email address or a phone number/i.test(t)) ok("rejects enquiry with no way to reply");
  else bad("reach validation", "no error shown");
  await ctx.close();
}

/* --------------------------------------------------- reduced motion / no-JS */
console.log("\nREDUCED MOTION / NO-JS");
{
  const ctx = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/about", { waitUntil: "load" });
  await page.waitForTimeout(1200);
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll("[data-reveal], [data-band-item]")].filter(
        (el) => parseFloat(getComputedStyle(el).opacity) < 0.9,
      ).length,
  );
  if (hidden === 0) ok("reduced motion leaves nothing hidden");
  else bad("reduced motion", `${hidden} elements under 0.9 opacity`);
  await ctx.close();

  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const p2 = await noJs.newPage();
  await p2.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const invisible = await p2.evaluate(
    () =>
      [...document.querySelectorAll("[data-reveal]")].filter(
        (el) => parseFloat(getComputedStyle(el).opacity) < 0.9,
      ).length,
  );
  if (invisible === 0) ok("no-JS homepage fully visible");
  else bad("no-JS", `${invisible} elements hidden`);
  await noJs.close();
}

/* --------------------------------------------------------------- keyboard */
console.log("\nKEYBOARD");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName ?? "?", text: (el?.textContent ?? "").trim().slice(0, 30) };
  });
  if (/skip/i.test(first.text)) ok(`first tab stop is the skip link`);
  else bad("skip link", `first tab stop was ${first.tag} "${first.text}"`);
  await ctx.close();
}

/* ---------------------------------------------------------------- SEO files */
console.log("\nSEO ARTEFACTS");
for (const [path, must] of [
  ["/robots.txt", /Sitemap:/i],
  ["/sitemap.xml", /<loc>/i],
]) {
  const r = await fetch(BASE + path).catch(() => null);
  const text = r && r.ok ? await r.text() : "";
  if (r?.ok && must.test(text)) ok(`${path} served and well formed`);
  else bad(path, r ? `status ${r.status}` : "no response");
}
{
  const r = await fetch(BASE + "/definitely-not-a-real-page-xyz").catch(() => null);
  if (r?.status === 404) ok("unknown route returns 404");
  else bad("404 status", r ? `got ${r.status}` : "no response");
}

await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
if (failures.length) {
  console.log("\nFAILURES");
  for (const f of failures) console.log(`  - ${f}`);
}
console.log("");
process.exit(fail ? 1 : 0);
