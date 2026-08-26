/**
 * Route QA: loads every route at desktop and mobile, screenshots each, and
 * reports status, console errors and horizontal overflow.
 *
 * Needs Playwright, which is deliberately not a dependency:
 *   npm i playwright --no-save && npx playwright install chromium
 */
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright not installed. Run:\n  npm i playwright --no-save && npx playwright install chromium");
  process.exit(1);
}
import { mkdir } from "node:fs/promises";
const ROUTES = ["/", "/inventory", "/portfolio", "/legacy", "/locations", "/contact"];
const VPS = [{n:"1440x900",w:1440,h:900},{n:"390x844",w:390,h:844,m:true}];
await mkdir("_inspection/pages", { recursive: true });
const b = await chromium.launch();
let fails = 0;
for (const vp of VPS) {
  const ctx = await b.newContext({ viewport:{width:vp.w,height:vp.h}, isMobile:!!vp.m, hasTouch:!!vp.m });
  for (const r of ROUTES) {
    const p = await ctx.newPage();
    const errs = [];
    p.on("console", m => { if (m.type()==="error") errs.push(m.text().slice(0,140)); });
    p.on("pageerror", e => errs.push("PAGEERROR "+String(e).slice(0,140)));
    const resp = await p.goto("http://localhost:4321"+r, { waitUntil:"networkidle", timeout:60000 });
    await p.waitForTimeout(2200);
    const over = await p.evaluate(()=> {
      const d=document.documentElement;
      return d.scrollWidth > d.clientWidth+1 ? {sw:d.scrollWidth, cw:d.clientWidth} : null;
    });
    const name = (r==="/"?"home":r.slice(1));
    await p.screenshot({ path:`_inspection/pages/${name}-${vp.n}.png` });
    const bad = errs.length || over || resp.status()!==200;
    if (bad) fails++;
    console.log(`${vp.n} ${name.padEnd(10)} status=${resp.status()} errors=${errs.length} overflow=${over?JSON.stringify(over):"none"}`);
    errs.slice(0,2).forEach(e=>console.log("    ! "+e));
    await p.close();
  }
  await ctx.close();
}
await b.close();
console.log(fails ? `\n${fails} route/viewport combos with issues` : "\nall routes clean");
