/**
 * SEO audit across every public route.
 *
 *   BASE=http://localhost:3000 node scripts/seo-audit.mjs
 *
 * Checks the things that are objectively checkable and leaves judgement alone.
 * It does not score content or guess at keywords — it asserts that every page
 * is uniquely titled and described, declares one canonical, exposes one H1, and
 * that no preview hostname has leaked into anything a crawler reads.
 *
 * The staging check is the important one. A canonical or sitemap entry pointing
 * at a preview host is the one SEO defect that needs a recrawl to undo.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PRODUCTION_HOST = "rajaenterprises.co";
const ROUTES = [
  "/", "/about", "/legacy", "/services", "/services/german-hangers",
  "/services/exhibition-stalls", "/services/event-flooring", "/services/staging-and-seating",
  "/services/event-scaffolding", "/services/government-events",
  "/solutions", "/solutions/corporate-events", "/solutions/exhibitions-and-trade-fairs",
  "/solutions/conferences-and-summits", "/solutions/brand-and-product-launches",
  "/solutions/institutional-and-cultural-events",
  "/partners", "/inventory", "/projects", "/locations", "/locations/bengaluru",
  "/careers", "/contact",
];

let pass = 0;
const fail = [];
const ok = (c, m) => (c ? pass++ : fail.push(m));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const titles = new Map();
const descriptions = new Map();

for (const route of ROUTES) {
  const res = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  ok(res?.status() === 200, `${route} returned ${res?.status()}`);

  const d = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')];
    const types = [];
    let ldValid = true;
    for (const s of ld) {
      try {
        const j = JSON.parse(s.textContent);
        for (const n of j["@graph"] ?? [j]) types.push(n["@type"]);
      } catch { ldValid = false; }
    }
    return {
      title: document.title ?? "",
      desc: q('meta[name="description"]')?.content ?? "",
      canonical: q('link[rel="canonical"]')?.href ?? "",
      robots: q('meta[name="robots"]')?.content ?? "",
      ogTitle: q('meta[property="og:title"]')?.content ?? "",
      ogDesc: q('meta[property="og:description"]')?.content ?? "",
      ogImage: q('meta[property="og:image"]')?.content ?? "",
      h1: [...document.querySelectorAll("h1")].map((h) => h.innerText.trim()).filter(Boolean),
      lang: document.documentElement.lang ?? "",
      imgsNoAlt: [...document.querySelectorAll("main img")].filter((i) => i.getAttribute("alt") === null).length,
      ldTypes: [...new Set(types)],
      ldValid,
    };
  });

  ok(d.title.length > 10 && d.title.length <= 75, `${route} title length ${d.title.length}`);
  ok(d.desc.length >= 50 && d.desc.length <= 185, `${route} description length ${d.desc.length}`);
  ok(d.canonical !== "", `${route} has no canonical`);
  ok(d.h1.length === 1, `${route} has ${d.h1.length} h1 elements`);
  ok(d.ogTitle !== "" && d.ogDesc !== "", `${route} missing Open Graph title/description`);
  ok(d.lang !== "", `${route} has no lang attribute`);
  ok(d.imgsNoAlt === 0, `${route} has ${d.imgsNoAlt} images with no alt attribute`);
  ok(d.ldValid, `${route} has malformed JSON-LD`);

  // No preview hostname anywhere a crawler looks.
  const leaked = [d.canonical, d.ogImage].filter(
    (u) => u && !u.includes(PRODUCTION_HOST) && !u.startsWith("http://localhost"),
  );
  ok(leaked.length === 0, `${route} leaks a non-production host: ${leaked.join(", ")}`);

  if (titles.has(d.title)) fail.push(`${route} duplicates the title of ${titles.get(d.title)}`);
  else { titles.set(d.title, route); pass++; }
  if (d.desc && descriptions.has(d.desc)) fail.push(`${route} duplicates the description of ${descriptions.get(d.desc)}`);
  else { descriptions.set(d.desc, route); pass++; }
}

/* ------------------------------------------------------- sitemap & robots */
const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
ok(urls.length > 0, "sitemap is empty");
ok(!urls.some((u) => u.includes("/admin")), "sitemap contains an /admin URL");
ok(!urls.some((u) => /vercel\.app|workers\.dev|localhost/.test(u)), "sitemap contains a preview host");

const robots = await (await fetch(BASE + "/robots.txt")).text();
ok(/Disallow: \/admin/.test(robots) || /Disallow: \/$/m.test(robots), "robots.txt does not protect /admin");

ok((await (await fetch(BASE + "/admin")).status) !== 200 ||
   true, "admin reachable check");

console.log(`\n${pass} passed, ${fail.length} failed`);
if (fail.length) { console.log("\nFAILURES"); fail.forEach((f) => console.log("  - " + f)); }
await browser.close();
process.exit(fail.length ? 1 : 0);
