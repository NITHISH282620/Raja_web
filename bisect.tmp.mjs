const W = "http://localhost:3500";
const retry = async (u,o,n=3)=>{for(let i=0;i<n;i++){try{return await fetch(u,o)}catch(e){if(i===n-1)throw e;await new Promise(r=>setTimeout(r,1500))}}};
const lh = await (await retry(W+"/admin/login")).text();
const aid = lh.match(/name="(\$ACTION_ID_[^"]+)"/)?.[1];
const fd = new FormData(); if (aid) fd.append(aid,"");
fd.append("next","/admin"); fd.append("email",process.env.RAJA_ADMIN_EMAIL); fd.append("password",process.env.RAJA_ADMIN_PASSWORD);
const r = await retry(W+"/admin/login",{method:"POST",body:fd,redirect:"manual"});
const ck = (r.headers.getSetCookie?.()||[]).find(c=>c.startsWith("raja_session="))?.split(";")[0];

const page = await (await retry(W+"/admin/media",{headers:{Cookie:ck}})).text();
const at = page.indexOf('name="file"');
const form = page.slice(page.lastIndexOf("<form", at), page.indexOf("</form>", at));
const ids = [...form.matchAll(/name="(\$ACTION[^"]+)"/g)].map(m=>m[1]);

for (const kb of [100, 500, 1200, 2500, 3800]) {
  const bytes = new Uint8Array(kb*1024);
  crypto.getRandomValues(bytes.subarray(0, Math.min(65536, bytes.length)));
  const up = new FormData();
  for (const id of ids) up.append(id,"");
  up.append("file", new Blob([bytes],{type:"image/webp"}), `probe-${kb}.webp`);
  up.append("alt", `bisect ${kb}`); up.append("width","10"); up.append("height","10");
  const res = await retry(W+"/admin/media",{method:"POST",body:up,redirect:"manual",headers:{Cookie:ck}});
  const loc = res.headers.get("location")||"";
  console.log(`  ${String(kb).padStart(4)} KB -> ${res.status} ${loc.includes("uploaded=1")?"OK":loc||""}`);
}
