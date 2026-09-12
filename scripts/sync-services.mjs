import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';
import { servicePillars } from '../content/services.ts';

const NS = "9f2b1c84-5f1e-4d6a-9d3b-1c7a6e2f0a11";

function uuid5(name) {
  const nsBytes = Buffer.from(NS.replace(/-/g, ""), "hex");
  const hash = createHash("sha1").update(nsBytes).update(Buffer.from(name, "utf8")).digest();
  const b = Buffer.from(hash.subarray(0, 16));
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

const sql = neon(process.env.DATABASE_URL);

console.log(`Syncing ${servicePillars.length} service pillars to Neon...`);

for (let i = 0; i < servicePillars.length; i++) {
  const service = servicePillars[i];
  const entryKey = `services-${i}`;
  const id = uuid5(`services:${entryKey}`);

  await sql`
    INSERT INTO content_entries (id, collection, entry_key, slug, title, data, sort_order, published)
    VALUES (${id}, 'services', ${entryKey}, ${service.slug}, ${service.title}, ${JSON.stringify(service)}, ${service.order}, true)
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      data = EXCLUDED.data,
      sort_order = EXCLUDED.sort_order,
      published = EXCLUDED.published,
      updated_at = now()
  `;
  console.log(`Synced: [${entryKey}] ${service.slug} -> ${service.title}`);
}

console.log("All services synced successfully!");
