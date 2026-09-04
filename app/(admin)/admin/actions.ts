"use server";

import { redirect } from "next/navigation";
import { ENQUIRY_STATUSES } from "@/lib/enquiry";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

import {
  createSession,
  currentUser,
  destroySession,
  ensureSeedUser,
  findUser,
  pruneSessions,
  setPassword,
  verifyPassword,
} from "@/lib/auth";
import { db, deleteRecord, putRecord, putSetting, reorderRecords } from "@/lib/db";
import { COLLECTIONS, readAll } from "@/lib/store";

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
  ensureSeedUser();
  pruneSessions();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const user = findUser(email);
  if (!user || !verifyPassword(password, user.password)) {
    redirect(`/admin/login?error=credentials`);
  }

  await createSession(user.id);
  // Only ever redirect to a path on this site — `next` arrives from a query
  // string, and an open redirect is how a login page becomes a phishing page.
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/admin");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(formData: FormData) {
  const user = await guard();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");

  const row = findUser(user.email);
  if (!row || !verifyPassword(current, row.password)) {
    redirect("/admin/settings?error=password");
  }
  if (next.length < 10) {
    redirect("/admin/settings?error=short");
  }

  setPassword(user.id, next);
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
function materialise(collection: Collection) {
  const rows = readAll(collection);
  const empty = (db().prepare(`SELECT COUNT(*) AS n FROM records WHERE collection = ?`)
    .get(collection) as { n: number }).n === 0;
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

  putRecord(collection, id, data);
  publish();
  redirect(`/admin/${collection}?saved=${encodeURIComponent(id)}`);
}

export async function setPublished(collection: Collection, id: string, published: boolean) {
  await guard();
  materialise(collection);
  const row = readAll(collection).find((r) => r.id === id);
  if (row) putRecord(collection, id, row.data, { published });
  publish();
  revalidatePath(`/admin/${collection}`);
}

export async function removeRecord(collection: Collection, id: string) {
  await guard();
  materialise(collection);
  deleteRecord(collection, id);
  publish();
  redirect(`/admin/${collection}?removed=1`);
}

export async function moveRecord(collection: Collection, id: string, direction: -1 | 1) {
  await guard();
  materialise(collection);
  const ids = readAll(collection)
    .sort((a, b) => a.position - b.position)
    .map((r) => r.id);
  const i = ids.indexOf(id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  reorderRecords(collection, ids);
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

  putSetting("contact", {
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
  putSetting("hero", {
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
  putSetting("stats", stats);
  publish();
  redirect("/admin/settings?saved=stats");
}

/* --------------------------------- media ----------------------------------- */

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_BYTES = 200 * 1024 * 1024;

/**
 * Accepts an image or a video and records it in the media library.
 *
 * Images are re-encoded to WebP at a sane maximum width. That is not a nicety:
 * a phone photograph straight off a camera roll is 4-8 MB, and a client
 * uploading twenty of them would otherwise put 100 MB of originals on the
 * critical path of a marketing site. Videos are stored as-is — re-encoding
 * H.264 in a request handler would block for minutes.
 */
export async function uploadMedia(formData: FormData) {
  await guard();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/admin/media?error=empty");
  if (file.size > MAX_BYTES) redirect("/admin/media?error=size");

  await mkdir(UPLOAD_DIR, { recursive: true });

  const id = randomUUID();
  const buf = Buffer.from(await file.arrayBuffer());
  const isVideo = file.type.startsWith("video/");

  let src: string;
  let width = 0;
  let height = 0;
  let bytes = buf.length;

  if (isVideo) {
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4";
    src = `/uploads/${id}.${ext}`;
    await writeFile(join(UPLOAD_DIR, `${id}.${ext}`), buf);
  } else {
    const image = sharp(buf, { failOn: "none" }).rotate();
    const meta = await image.metadata();
    const out = await image
      .resize({ width: Math.min(meta.width ?? 2400, 2400), withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });

    src = `/uploads/${id}.webp`;
    await writeFile(join(UPLOAD_DIR, `${id}.webp`), out.data);
    width = out.info.width;
    height = out.info.height;
    bytes = out.data.length;
  }

  db()
    .prepare(
      `INSERT INTO media (id, src, width, height, alt, kind, bytes, credit, clearance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'raja-original')`,
    )
    .run(
      id,
      src,
      width,
      height,
      String(formData.get("alt") ?? "").trim(),
      isVideo ? "video" : "image",
      bytes,
      "Raja Enterprises",
    );

  publish();
  redirect("/admin/media?uploaded=1");
}

export async function updateMediaAlt(formData: FormData) {
  await guard();
  db()
    .prepare(`UPDATE media SET alt = ? WHERE id = ?`)
    .run(String(formData.get("alt") ?? "").trim(), String(formData.get("id") ?? ""));
  publish();
  redirect("/admin/media?saved=1");
}

export async function deleteMedia(id: string) {
  await guard();
  // The row goes; the file stays. A hard delete would break every page still
  // pointing at it, and disk is cheaper than a broken site. Orphans can be
  // swept later against the media table.
  db().prepare(`DELETE FROM media WHERE id = ?`).run(id);
  publish();
  revalidatePath("/admin/media");
}

/* -------------------------------- enquiries -------------------------------- */

export async function setEnquiryStatus(id: number, status: string) {
  await guard();
  // Validated against the allowed set rather than trusted: this writes straight
  // to a column the public site reads back.
  if (!(ENQUIRY_STATUSES as readonly string[]).includes(status)) return;
  db().prepare(`UPDATE enquiries SET status = ? WHERE id = ?`).run(status, id);
  revalidatePath("/admin/enquiries");
}

export async function saveEnquiryNotes(formData: FormData) {
  await guard();
  db()
    .prepare(`UPDATE enquiries SET notes = ? WHERE id = ?`)
    .run(String(formData.get("notes") ?? ""), Number(formData.get("id")));
  redirect("/admin/enquiries?saved=1");
}

export async function deleteEnquiry(id: number) {
  await guard();
  db().prepare(`DELETE FROM enquiries WHERE id = ?`).run(id);
  revalidatePath("/admin/enquiries");
}
