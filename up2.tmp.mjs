import { chromium } from "playwright";
import { Pool } from "@neondatabase/serverless";
const W = "https://raja-enterprises-one.vercel.app";
const b = await chromium.launch(); const p = await b.newPage();
const bad = [];
p.on("response", r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url().replace(W,"").slice(0,60)}`); });

await p.goto(W+"/admin/login",{waitUntil:"domcontentloaded"});
await p.fill('input[name="email"]',process.env.RAJA_ADMIN_EMAIL);
await p.fill('input[name="password"]',process.env.RAJA_ADMIN_PASSWORD);
await Promise.all([p.waitForURL(/\/admin(?!\/login)/,{timeout:30000}).catch(()=>{}),p.click('button[type="submit"]')]);
await p.goto(W+"/admin/media",{waitUntil:"networkidle"});

const pool = new Pool({connectionString:process.env.DATABASE_URL});
const before = (await pool.query("SELECT COUNT(*)::int n FROM media")).rows[0].n;

await p.setInputFiles("#file","/tmp/big-photo.png");
await p.fill("#alt","browser upload probe");
await p.waitForTimeout(6000);
const hint = await p.evaluate(()=>[...document.querySelectorAll(".hint")].map(e=>e.textContent.trim()).find(t=>/Ready to upload/.test(t))??"-");
console.log("  resizer:", hint);
console.log("  w/h fields:", await p.inputValue('input[name="width"]'), "x", await p.inputValue('input[name="height"]'));

// the Upload button is the submit INSIDE the upload form
await p.click('form:has(#file) button[type="submit"]');
await p.waitForTimeout(10000);
console.log("  final URL:", p.url().replace(W,""));
console.log("  error page:", (await p.content()).includes("couldn't load") ? "YES 500" : "no");
console.log("  failed reqs:", bad.length?bad.join(" | "):"none");

const row = (await pool.query("SELECT id,object_key,size_bytes,width,height,mime_type FROM media WHERE alt_text=$1 ORDER BY created_at DESC LIMIT 1",["browser upload probe"])).rows[0];
if (row) {
  console.log(`  STORED: ${row.object_key} ${row.width}x${row.height} ${(row.size_bytes/1024).toFixed(0)}KB ${row.mime_type}`);
  const img = await fetch(W+"/uploads/"+row.object_key.replace(/^uploads\//,""));
  console.log("  served back:", img.status, img.headers.get("content-type"));
  await pool.query("DELETE FROM media WHERE id=$1",[row.id]);
  const { AwsClient } = await import("aws4fetch");
  const c = new AwsClient({accessKeyId:process.env.R2_ACCESS_KEY_ID,secretAccessKey:process.env.R2_SECRET_ACCESS_KEY,service:"s3",region:"auto"});
  await c.fetch(`https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/raja-public-media/${row.object_key}`,{method:"DELETE"});
  console.log("  cleaned up; media:", (await pool.query("SELECT COUNT(*)::int n FROM media")).rows[0].n, `(was ${before})`);
} else console.log("  NOT STORED");
await pool.end(); await b.close();
