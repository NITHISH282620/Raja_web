const W = process.env.W;
const retry = async (u, o, n = 3) => {
  for (let i = 0; i < n; i++) {
    try { return await fetch(u, o); } catch (e) { if (i === n - 1) throw e; await new Promise(r => setTimeout(r, 1200)); }
  }
};

const lh = await (await retry(W + "/admin/login")).text();
const aid = lh.match(/name="(\$ACTION_ID_[^"]+)"/)?.[1];
const fd = new FormData();
if (aid) fd.append(aid, "");
fd.append("next", "/admin"); fd.append("email", process.env.RAJA_ADMIN_EMAIL); fd.append("password", process.env.RAJA_ADMIN_PASSWORD);
const login = await retry(W + "/admin/login", { method: "POST", body: fd, redirect: "manual" });
const cookie = (login.headers.getSetCookie?.() ?? []).find(c => c.startsWith("raja_session="))?.split(";")[0];
console.log("  login:", login.status, cookie ? "cookie ok" : "NO COOKIE");

// the media page and its upload form
const page = await retry(W + "/admin/media", { headers: { Cookie: cookie } });
const html = await page.text();
console.log("  /admin/media:", page.status);

const i = html.indexOf("<form");
const forms = [...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)].map(m => m[0]);
const uploadForm = forms.find(f => f.includes('name="file"'));
console.log("  upload form found:", Boolean(uploadForm));
if (!uploadForm) process.exit(0);

const ids = [...uploadForm.matchAll(/name="(\$ACTION[^"]+)"/g)].map(m => m[1]);
console.log("  action fields:", JSON.stringify(ids));

// a tiny real PNG
const png = Buffer.from(
  "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6360000002000100" +
  "05fe02fa0000000049454e44ae426082", "hex");

const up = new FormData();
for (const id of ids) up.append(id, "");
up.append("file", new Blob([png], { type: "image/png" }), "upload-probe.png");
up.append("alt", "upload probe");
up.append("width", "1");
up.append("height", "1");

const res = await retry(W + "/admin/media", {
  method: "POST", body: up, redirect: "manual", headers: { Cookie: cookie },
});
console.log("  UPLOAD ->", res.status);
console.log("  location:", res.headers.get("location") ?? "(none)");
if (res.status >= 400) {
  const body = await res.text();
  const digest = body.match(/digest["\s:]+"?(\d{6,})/)?.[1];
  console.log("  digest:", digest ?? "none");
  console.log("  body starts:", body.slice(0, 180).replace(/\s+/g, " "));
}
