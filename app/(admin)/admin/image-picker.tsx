"use client";

import { useState } from "react";

export interface MediaChoice {
  src: string;
  width: number;
  height: number;
  alt: string;
  label: string;
}

/**
 * Picks a photograph for a field.
 *
 * Holds the chosen `src` in a hidden input so the surrounding server-action
 * form submits it like any other field — no client-side save, no fetch, no
 * optimistic state to reconcile.
 *
 * The width and height travel with the choice because `next/image` needs the
 * intrinsic dimensions to reserve space, and a picker that returned only a URL
 * would push that problem onto every page that renders the result.
 */
export function ImagePicker({
  name,
  value,
  options,
}: {
  name: string;
  value: { src?: string; width?: number; height?: number } | null;
  options: MediaChoice[];
}) {
  const [chosen, setChosen] = useState(value?.src ?? "");
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.src === chosen);

  const width = current?.width ?? value?.width ?? 0;
  const height = current?.height ?? value?.height ?? 0;

  return (
    <div>
      <input type="hidden" name={name} value={chosen} />
      <input type="hidden" name={`${name}__w`} value={width} />
      <input type="hidden" name={`${name}__h`} value={height} />

      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
        {chosen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={chosen}
            alt=""
            style={{
              width: 168,
              height: 116,
              objectFit: "cover",
              borderRadius: 10,
              border: "1px solid var(--color-hairline)",
              background: "var(--color-mist)",
            }}
          />
        ) : (
          <div
            style={{
              width: 168,
              height: 116,
              borderRadius: 10,
              border: "1px dashed var(--color-hairline)",
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              color: "var(--color-body-dark)",
            }}
          >
            No image
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="admin-actions">
            <button
              type="button"
              className="admin-btn"
              data-variant="ghost"
              style={{ height: 34 }}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Choose image"}
            </button>
            {chosen && (
              <button
                type="button"
                className="admin-btn"
                data-variant="ghost"
                style={{ height: 34 }}
                onClick={() => setChosen("")}
              >
                Remove
              </button>
            )}
          </div>
          {chosen && (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-body-dark)", wordBreak: "break-all", maxWidth: 320 }}>
              {chosen}
              {width > 0 && ` · ${width}×${height}`}
            </p>
          )}
        </div>
      </div>

      {open && (
        <div
          className="admin-media-grid"
          style={{ marginTop: 14, maxHeight: 340, overflowY: "auto", padding: 4 }}
        >
          {options.length === 0 && (
            <p className="admin-sub">
              No images yet. Upload some in the Media library and they will appear here.
            </p>
          )}
          {options.map((o) => (
            <button
              key={o.src}
              type="button"
              className="admin-media-item"
              onClick={() => {
                setChosen(o.src);
                setOpen(false);
              }}
              style={{
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
                outline: chosen === o.src ? "2px solid var(--color-brand-blue)" : undefined,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.src} alt="" loading="lazy" />
              <div className="admin-media-meta">{o.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
