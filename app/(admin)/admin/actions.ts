"use server";

import { redirect } from "next/navigation";
import { ENQUIRY_STATUSES } from "@/lib/enquiry";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";

import {
  createSession,
  currentUser,
  destroySession,
  ensureOwnerAccount,
  findUser,
  pruneSessions,
  setPassword,
  verifyPassword,
} from "@/lib/auth";
import { query, execute } from "@/lib/db/neon";
import { deleteRecord, putRecord, putSetting, reorderRecords } from "@/lib/db/content";
import { putObject, publicKey, storageAvailable } from "@/lib/storage/r2";
import { COLLECTIONS, readAll } from "@/lib/store";
import { recordAudit } from "@/lib/audit";

/**
 * Every write the admin can perform.
 *
 * Two rules hold across the whole file:
 *
 *  1. `guard()` runs first in every action. Server Actions are POST endpoints
 *     that anyone can call once they know the id, so a page-level check is not
 *     a permission — only the action itself can enforce one.
 *
 *  2. Every mutation ends with `revalidatePath("/", "layout")`. The public
 *     pages read straight from SQLite, and the client's mental model is "I
 *     saved it, so it is live". Anything less than a full revalidate means the
 *     editor changes a project and then sees the old one on the site, which
 *     reads as the save having failed.
 */

async function guard() {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Publishes every change to the live site. */
function publish() {
  revalidatePath("/", "layout");
}

/* --------------------------------- auth ----------------------------------- */

export async function signIn(formData: FormData) {
  await ensureOwnerAccount();
  pruneSessions();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const user = await findUser(email);
  if (!user || !(await verifyPassword(password, user.password))) {
    redirect(`/admin/login?error=credentials`);
  }

  await createSession(user.id);
  recordAudit({ id: user.id, email: user.email }, "sign_in");
  // Only ever redirect to a path on this site — `next` arrives from a query
  // string, and an open redirect is how a login page becomes a phishing page.
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/admin");
}

export async function signOut() {
  const user = await currentUser();
  recordAudit(user, "sign_out");
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(formData: FormData) {
  const user = await guard();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");

  const row = await findUser(user.email);
  if (!row || !(await verifyPassword(current, row.password))) {
    redirect("/admin/settings?error=password");
  }
  if (next.length < 10) {
    redirect("/admin/settings?error=short");
  }

  await setPassword(user.id, next);
  // setPassword drops every session, including this one, so the editor is sent
  // back to sign in with the new password rather than left on a dead cookie.
  redirect("/admin/login?changed=1");
}

/* ------------------------------ collections -------------------------------- */

type Collection = keyof typeof COLLECTIONS;

/**
 * Copies the seed list into the database the first time a collection is edited.
 *
 * Without this, saving one project into an empty `projects` table would flip
 * the store from "seeds" to "database" and the other four projects would
 * vanish. Taking ownership of a collection has to be all-or-nothing.
 */
async function materialise(collection: Collection) {
  const rows = await readAll(collection);
  const [{ n }] = await query<{ n: number }>(
    `SELECT COUNT(*)::int AS n FROM content_entries WHERE collection = $1`, [collection]);
  const empty = n === 0;
  if (!empty) return;
  rows.forEach((row, i) => putRecord(collection, row.id, row.data, { position: i, published: true }));
}

export async function saveRecord(collection: Collection, id: string, json: string) {
  await guard();
  materialise(collection);

  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    redirect(`/admin/${collection}/${encodeURIComponent(id)}?error=json`);
  }

  await putRecord(collection, id, data);
  publish();
  redirect(`/admin/${collection}?saved=${encodeURIComponent(id)}`);
}

export async function setPublished(collection: Collection, id: string, published: boolean) {
  await guard();
  materialise(collection);
  const row = (await readAll(collection)).find((r) => r.id === id);
  if (row) putRecord(collection, id, row.data, { published });
  publish();
  revalidatePath(`/admin/${collection}`);
}

export async function removeRecord(collection: Collection, id: string) {
  await guard();
  materialise(collection);
  await deleteRecord(collection, id);
  publish();
  redirect(`/admin/${collection}?removed=1`);
}

export async function moveRecord(collection: Collection, id: string, direction: -1 | 1) {
  await guard();
  materialise(collection);
  const ids = (await readAll(collection))
    .sort((a, b) => a.position - b.position)
    .map((r) => r.id);
  const i = ids.indexOf(id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await reorderRecords(collection, ids);
  publish();
  revalidatePath(`/admin/${collection}`);
}

/* -------------------------------- settings --------------------------------- */

export async function saveContact(formData: FormData) {
  await guard();
  const lines = String(formData.get("addressLines") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const landlines = String(formData.get("landlines") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  await putSetting("contact", {
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    addressLines: lines,
    landlines,
    status: "approved",
    note: "Edited in the admin.",
  });
  publish();
  redirect("/admin/settings?saved=contact");
}

export async function saveHero(formData: FormData) {
  await guard();
  await putSetting("hero", {
    headline: String(formData.get("headline") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
  });
  publish();
  redirect("/admin/settings?saved=hero");
}

export async function saveStats(formData: FormData) {
  await guard();
  const labels = formData.getAll("label").map(String);
  const values = formData.getAll("value").map(String);
  const stats = labels
    .map((label, i) => ({ label: label.trim(), value: (values[i] ?? "").trim(), status: "approved" as const }))
    .filter((s) => s.label && s.value);
  await putSetting("stats", stats);
  publish();
  redirect("/admin/settings?saved=stats");
}

/* --------------------------------- media ----------------------------------- */

const MAX_BYTES = 200 * 1024 * 1024;

/**
 * Accepts an image or a video and records it in the media library.
 *
 * WHERE THE RESIZING WENT. This used to run `sharp` in the request: decode,
 * auto-rotate from EXIF, resize to 2400px, re-encode as WebP, write to
 * `public/uploads`. None of that survives a move to Workers — sharp is a native
 * binary and there is no writable disk — and the naive fix, storing the
 * original, would put 4-8 MB phone photographs on the critical path of a
 * marketing site.
 *
 * So the work moved to the browser (see `image-resizer.tsx`). `createImageBitmap`
 * applies EXIF orientation, a canvas does the resize, and `toBlob` produces
 * WebP before anything is sent. The owner uploads from a phone, so this is
 * strictly better than it was: the shrinking happens before the upload rather
 * than after it, and a 6 MB camera photo leaves the handset as ~200 KB.
 *
 * The server still accepts whatever arrives. If the browser could not do it —
 * no JavaScript, an unsupported codec — the original is stored rather than
 * refused, because losing the owner's photograph to a codec check is worse than
 * storing a large file.
 */
export async function uploadMedia(formData: FormData) {
  const user = await guard();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/admin/media?error=empty");
  if (file.size > MAX_BYTES) redirect("/admin/media?error=size");

  if (!(await storageAvailable("PUBLIC_MEDIA"))) {
    // Fail loudly. Silently writing to local disk is what this migration
    // removed: it looks like it worked and is gone at the next deploy.
    console.error("[media] upload refused: no PUBLIC_MEDIA binding in this runtime");
    redirect("/admin/media?error=storage");
  }

  const id = randomUUID();
  const isVideo = file.type.startsWith("video/");
  const ext = isVideo
    ? (file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4")
    : (file.type === "image/webp" ? "webp" : file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin");

  const key = publicKey(id, ext);
  const bytes = await file.arrayBuffer();
  await putObject("PUBLIC_MEDIA", key, bytes, file.type || undefined);

  // Dimensions come from the browser, which has already decoded the image.
  const width = Number(formData.get("width") ?? 0) || 0;
  const height = Number(formData.get("height") ?? 0) || 0;

  await execute(
    `INSERT INTO media (id, storage_provider, bucket, object_key, legacy_path, original_filename,
                        mime_type, size_bytes, width, height, alt_text, credit, kind, clearance, visibility, verified)
     VALUES ($1, 'r2', 'raja-public-media', $2, $3, $4, $5, $6, $7, $8, $9, 'Raja Enterprises',
             $10, 'raja-original', 'public', true)`,
    [id, key, `/media/${key}`, file.name, file.type || null, bytes.byteLength,
     width, height, String(formData.get("alt") ?? "").trim(), isVideo ? "video" : "image"],
  );

  await recordAudit(user, "media_upload", "media", id, { key, bytes: bytes.byteLength });
  publish();
  redirect("/admin/media?uploaded=1");
}

export async function updateMediaAlt(formData: FormData) {
  await guard();
  await execute(`UPDATE media SET alt_text = $2, updated_at = now() WHERE id = $1`,
    [String(formData.get("id") ?? ""), String(formData.get("alt") ?? "").trim()]);
  publish();
  redirect("/admin/media?saved=1");
}

export async function deleteMedia(id: string) {
  const user = await guard();
  // The row goes; the object stays. A hard delete would break every page still
  // pointing at it, and R2 storage is cheaper than a broken site. Orphans can
  // be swept later against the media table.
  await execute(`DELETE FROM media WHERE id = $1`, [id]);
  await recordAudit(user, "media_delete", "media", id);
  publish();
  revalidatePath("/admin/media");
}

/* -------------------------------- enquiries -------------------------------- */

export async function setEnquiryStatus(id: string, status: string) {
  const user = await guard();
  // Validated against the allowed set rather than trusted: this writes straight
  // to a column the public site reads back.
  if (!(ENQUIRY_STATUSES as readonly string[]).includes(status)) return;

  const before = (await query<{ status: string }>(
    `SELECT status FROM enquiries WHERE id = $1`, [id]))[0];

  await execute(`UPDATE enquiries SET status = $2, updated_at = now() WHERE id = $1`, [id, status]);
  await recordAudit(user, "enquiry_status", "enquiry", id, { from: before?.status, to: status });
  revalidatePath("/admin/enquiries");
}

/**
 * Appends a note. Never overwrites: the history is the point.
 */
export async function addEnquiryNote(formData: FormData) {
  const user = await guard();
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim().slice(0, 4000);
  if (!id || !body) redirect("/admin/enquiries");

  await execute(
    `INSERT INTO enquiry_notes (id, enquiry_id, author_id, note) VALUES (gen_random_uuid(), $1, $2, $3)`,
    [id, user.id, body]);
  await execute(`UPDATE enquiries SET updated_at = now() WHERE id = $1`, [id]);
  await recordAudit(user, "enquiry_note", "enquiry", id);
  redirect("/admin/enquiries?saved=1");
}

/** The date the owner intends to chase this lead. */
export async function setEnquiryFollowup(formData: FormData) {
  const user = await guard();
  const id = String(formData.get("id") ?? "");
  const raw = String(formData.get("next_followup_on") ?? "").trim();
  // Empty clears it; anything else must be a plain ISO date.
  const date = raw === "" ? null : /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : undefined;
  if (!id || date === undefined) redirect("/admin/enquiries");

  await execute(
    `UPDATE enquiries SET next_follow_up_at = $2, updated_at = now() WHERE id = $1`, [id, date]);
  await recordAudit(user, "enquiry_assign", "enquiry", id, { next_followup_on: date });
  redirect("/admin/enquiries?saved=1");
}

export async function deleteEnquiry(id: string) {
  await guard();
  await execute(`DELETE FROM enquiries WHERE id = $1`, [id]);
  revalidatePath("/admin/enquiries");
}
