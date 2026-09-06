"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { query } from "@/lib/db/neon";
import { putRecord } from "@/lib/db/content";
import { COLLECTIONS, readAll, readOne } from "@/lib/store";
import { BLANKS, FIELDS, setPath, type Field } from "./fields";

type Collection = keyof typeof COLLECTIONS;

/**
 * Saves one record from the field-driven editor.
 *
 * The important property here is that it is a MERGE, not a replace. The form
 * only carries the fields the schema chose to show; everything else on the
 * record — `clearance`, `status`, `gallery`, the grid geometry, the research
 * notes explaining where a figure came from — is read back off the existing
 * record and written through untouched.
 *
 * Replacing instead of merging would mean the first time anyone fixed a typo in
 * a project title, that project silently lost its media clearance and its
 * provenance note. Those fields exist precisely because this site publishes
 * claims about a real company.
 */
export async function saveRecordForm(formData: FormData) {
  if (!(await currentUser())) redirect("/admin/login");

  const key = String(formData.get("__collection")) as Collection;
  if (!(key in COLLECTIONS)) redirect("/admin");

  const existingId = String(formData.get("__id") ?? "");
  const isNew = !existingId;

  const id = isNew
    ? String(formData.get("__newId") ?? "").trim().toLowerCase()
    : existingId;

  if (isNew && !/^[a-z0-9-]+$/.test(id)) {
    redirect(`/admin/${key}/new?error=id`);
  }

  const base = isNew
    ? structuredClone(BLANKS[key])
    : ((await readOne(key, existingId) as unknown as Record<string, unknown> | null) ??
      structuredClone(BLANKS[key]));

  const next = structuredClone(base) as Record<string, unknown>;
  if ("id" in next) next.id = id;

  for (const field of FIELDS[key]) {
    applyField(next, field, formData);
  }

  // Copy the seed list into the database before the first edit, so taking
  // ownership of a collection is all-or-nothing rather than leaving the other
  // records stranded behind the seed fallback.
  const [{ n }] = await query<{ n: number }>(
    `SELECT COUNT(*)::int AS n FROM content_entries WHERE collection = $1`, [key]);
  const empty = n === 0;
  if (empty) {
    for (const [i, row] of (await readAll(key)).entries()) {
      await putRecord(key, row.id, row.data, { position: i, published: true });
    }
  }

  putRecord(key, id, next);
  revalidatePath("/", "layout");
  redirect(`/admin/${key}?saved=${encodeURIComponent(id)}`);
}

/** Writes one field from the form onto the record. */
function applyField(record: Record<string, unknown>, field: Field, formData: FormData) {
  if (field.type === "checkbox") {
    setPath(record, field.name, formData.get(field.name) === "1");
    return;
  }

  // A bare path. Empty clears it; nothing else about the record is touched.
  if (field.type === "imagePath") {
    const src = String(formData.get(field.name) ?? "").trim();
    setPath(record, field.name, src);
    return;
  }

  if (field.type === "image") {
    const src = String(formData.get(field.name) ?? "").trim();
    if (!src) {
      setPath(record, field.name, null);
      return;
    }
    // Preserve whatever the asset already carried (alt, clearance, credit,
    // focal point) and update only what the picker actually knows about.
    const previous = (getIn(record, field.name) ?? {}) as Record<string, unknown>;
    setPath(record, field.name, {
      clearance: "raja-original",
      alt: "",
      ...previous,
      src,
      width: Number(formData.get(`${field.name}__w`) ?? previous.width ?? 0) || previous.width || 1600,
      height: Number(formData.get(`${field.name}__h`) ?? previous.height ?? 0) || previous.height || 900,
    });
    return;
  }

  const raw = formData.get(field.name);
  if (raw === null) return;
  const value = String(raw).trim();

  if (field.type === "number") {
    setPath(record, field.name, value === "" ? 0 : Number(value));
    return;
  }

  // An empty text field means "nothing here", which the site renders as a
  // placeholder. Writing "" instead of null would render an empty element and
  // silently defeat that.
  setPath(record, field.name, value === "" ? null : value);
}

function getIn(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => {
    if (acc === null || acc === undefined || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[k];
  }, obj);
}
