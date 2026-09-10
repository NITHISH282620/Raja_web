import { chromium } from "playwright";
import { Pool } from "@neondatabase/serverless";
const W = "https://raja-enterprises-one.vercel.app";
const b = await chromium.launch(); const p = await b.newPage();
const bad = [];
p.on("response", async r => {
  if (r.status() >= 400) {
    let body = "";
    try { body = (await r.text()).slice(0, 300).replace(/\s+/g, " "); } catch {}
    bad.push(`${r.status()} ${r.request().method()} ${r.url().replace(W,"").slice(0,50)}  ${body.slice(0,200)}`);
  }
});

await p.goto(W+"/admin/login",{waitUntil:"domcontentloaded"});
await p.fill('input[name="email"]',process.env.RAJA_ADMIN_EMAIL);
await p.fill('input[name="password"]',process.env.RAJA_ADMIN_PASSWORD);
await Promise.all([p.waitForURL(/\/admin(?!\/login)/,{timeout:30000}).catch(()=>{}),p.click('button[type="submit"]')]);
await p.goto(W+"/admin/media",{waitUntil:"networkidle"});

const pool = new Pool({connectionString:process.env.DATABASE_URL});
const before = (await pool.query("SELECT COUNT(*)::int n FROM media")).rows[0].n;

await p.setInputFiles("#file","/tmp/scaffholding (2).png");
await p.fill("#alt","repro probe");
await p.waitForTimeout(8000);
console.log("  resizer:", await p.evaluate(()=>[...document.querySelectorAll(".hint")].map(e=>e.textContent.trim()).find(t=>/Ready to upload/.test(t))??"-"));
console.log("  file now:", await p.evaluate(()=>{const f=document.getElementById("file").files[0];return `${f.name} ${f.type} ${Math.round(f.size/1024)}KB`}));
console.log("  w/h:", await p.inputValue('input[name="width"]'),"x",await p.inputValue('input[name="height"]'));

await p.click('form:has(#file) button[type="submit"]');
await p.waitForTimeout(15000);
console.log("  final URL:", p.url().replace(W,""));
console.log("  error page:", (await p.content()).includes("couldn't load") ? "YES 500" : "no");
bad.forEach(x=>console.log("  FAILED:", x));

const row=(await pool.query("SELECT object_key,width,height,size_bytes FROM media WHERE alt_text=$1 ORDER BY created_at DESC LIMIT 1",["repro probe"])).rows[0];
console.log("  stored:", row?`${row.object_key} ${row.width}x${row.height} ${Math.round(row.size_bytes/1024)}KB`:"NOTHING");
if(row){ await pool.query("DELETE FROM media WHERE alt_text=$1",["repro probe"]); }
console.log("  media count:", (await pool.query("SELECT COUNT(*)::int n FROM media")).rows[0].n, `(was ${before})`);
await pool.end(); await b.close();
