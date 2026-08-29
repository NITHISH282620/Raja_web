import { notFound } from "next/navigation";
import Link from "next/link";
import { COLLECTIONS, readAll, readOne } from "@/lib/store";
import { db } from "@/lib/db";
import { BLANKS, FIELDS, getPath, setPath, type Field } from "../../fields";
import { META } from "../page";
import { DeleteRecord, Notice, PageHead } from "../../ui";
import { ImagePicker, type MediaChoice } from "../../image-picker";
import { saveRecordForm } from "../../save";

export const dynamic = "force-dynamic";

type Collection = keyof typeof COLLECTIONS;

/**
 * Everything the picker can offer: files uploaded through the admin, plus every
 * image already referenced anywhere in the content. Without the second half,
 * an editor opening a record on a fresh install would find an empty library and
 * no way to keep the photograph already on the page.
 */
function mediaChoices(): MediaChoice[] {
  const uploaded = db()
    .prepare(`SELECT src, width, height, alt FROM media WHERE kind = 'image' ORDER BY created_at DESC`)
    .all() as unknown as { src: string; width: number; height: number; alt: string }[];

  const seen = new Set(uploaded.map((m) => m.src));
  const inUse: MediaChoice[] = [];

  for (const key of Object.keys(COLLECTIONS) as Collection[]) {
    for (const row of readAll(key)) {
      for (const field of ["image", "hero", "logo"]) {
        const asset = (row.data as unknown as Record<string, unknown>)[field] as
          | { src?: string; width?: number; height?: number; alt?: string }
          | null;
        if (asset?.src && !seen.has(asset.src)) {
          seen.add(asset.src);
          inUse.push({
            src: asset.src,
            width: asset.width ?? 0,
            height: asset.height ?? 0,
            alt: asset.alt ?? "",
            label: asset.src.split("/").pop() ?? asset.src,
          });
        }
      }
    }
  }

  return [
    ...uploaded.map((m) => ({ ...m, label: `Uploaded · ${m.src.split("/").pop()}` })),
    ...inUse,
  ];
}

export default async function RecordEditor({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { collection, id } = await params;
  if (!(collection in COLLECTIONS)) notFound();
  const key = collection as Collection;
  const { error } = await searchParams;

  const isNew = id === "new";
  const record = isNew
    ? (BLANKS[key] as Record<string, unknown>)
    : (readOne(key, decodeURIComponent(id)) as unknown as Record<string, unknown> | null);
  if (!record) notFound();

  const fields = FIELDS[key];
  const options = mediaChoices();

  return (
    <>
      <PageHead
        title={isNew ? `New ${META[key].title.replace(/s$/, "").toLowerCase()}` : String(getPath(record, fields[0].name) || id)}
        sub={isNew ? "Fill this in and save. It goes live immediately." : `Editing in ${META[key].title}.`}
        action={
          <Link href={`/admin/${key}`} className="admin-btn" data-variant="ghost">
            ← Back to {META[key].title.toLowerCase()}
          </Link>
        }
      />

      {error === "json" && <Notice tone="error">That record could not be saved. Please try again.</Notice>}
      {error === "id" && <Notice tone="error">A short name is required, using letters, numbers and hyphens only.</Notice>}

      <form action={saveRecordForm} className="admin-card" style={{ maxWidth: 760 }}>
        <input type="hidden" name="__collection" value={key} />
        <input type="hidden" name="__id" value={isNew ? "" : decodeURIComponent(id)} />

        {isNew && (
          <div className="admin-field">
            <label htmlFor="__newId">Short name</label>
            <input
              id="__newId"
              name="__newId"
              className="admin-input"
              placeholder="aicog-2025"
              pattern="[a-z0-9-]+"
              required
            />
            <p className="hint">
              Used in the address and to identify this record. Lower case, hyphens instead of
              spaces. It cannot be changed later.
            </p>
          </div>
        )}

        {fields.map((field) => (
          <FieldControl key={field.name} field={field} record={record} options={options} />
        ))}

        <div className="admin-actions" style={{ marginTop: 24 }}>
          <button type="submit" className="admin-btn" data-variant="primary">
            {isNew ? "Create" : "Save changes"}
          </button>
          <Link href={`/admin/${key}`} className="admin-btn" data-variant="ghost">
            Cancel
          </Link>
        </div>
      </form>

      {!isNew && (
        <div style={{ marginTop: 28, maxWidth: 760 }}>
          <DeleteRecord collection={key} id={decodeURIComponent(id)} />
        </div>
      )}
    </>
  );
}

function FieldControl({
  field,
  record,
  options,
}: {
  field: Field;
  record: Record<string, unknown>;
  options: MediaChoice[];
}) {
  const raw = getPath(record, field.name);
  const id = `f_${field.name.replace(/\./g, "_")}`;

  if (field.type === "image") {
    return (
      <div className="admin-field">
        <label htmlFor={id}>{field.label}</label>
        {field.hint && <p className="hint">{field.hint}</p>}
        <ImagePicker
          name={field.name}
          value={(raw as { src?: string; width?: number; height?: number } | null) ?? null}
          options={options}
        />
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="admin-field">
        <label
          htmlFor={id}
          style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}
        >
          <input id={id} name={field.name} type="checkbox" defaultChecked={Boolean(raw)} value="1" />
          {field.label}
        </label>
        {field.hint && <p className="hint">{field.hint}</p>}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="admin-field">
        <label htmlFor={id}>{field.label}</label>
        <select id={id} name={field.name} className="admin-select" defaultValue={String(raw ?? "")}>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {field.hint && <p className="hint">{field.hint}</p>}
      </div>
    );
  }

  const value = raw === null || raw === undefined ? "" : String(raw);

  return (
    <div className="admin-field">
      <label htmlFor={id}>{field.label}</label>
      {field.type === "textarea" ? (
        <textarea id={id} name={field.name} className="admin-textarea" defaultValue={value} />
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type === "number" ? "number" : "text"}
          step={field.type === "number" ? "any" : undefined}
          className="admin-input"
          defaultValue={value}
          placeholder={"placeholder" in field ? field.placeholder : undefined}
        />
      )}
      {field.hint && <p className="hint">{field.hint}</p>}
    </div>
  );
}

export { getPath, setPath };
