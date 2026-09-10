"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shrinks a photograph in the browser before it is uploaded.
 *
 * WHY THIS EXISTS. The server used to do this with sharp — decode, rotate from
 * EXIF, resize, re-encode. That cannot run on a serverless platform: sharp is a
 * native binary, and more immediately, a request body above roughly 4.5 MB is
 * rejected before any application code sees it. A photograph straight off a
 * phone is 3–8 MB, so uploading one failed with a bare server error.
 *
 * Doing the work here is better than doing it on the server anyway. The owner
 * uploads from a handset on mobile data: a 6 MB camera photo leaves the phone
 * as roughly 200 KB, so the upload is faster as well as possible.
 *
 * `createImageBitmap` with `imageOrientation: "from-image"` applies the EXIF
 * rotation, which is what stops portrait photos arriving on their side.
 *
 * IF ANYTHING HERE FAILS the original file is left untouched and submitted as
 * it is — an unsupported codec should mean "no shrinking", not "no upload".
 * Videos are never touched.
 */

const MAX_EDGE = 2400;
const QUALITY = 0.82;
/** Below this, re-encoding usually makes the file bigger, not smaller. */
const SKIP_UNDER_BYTES = 400 * 1024;

type Status = "idle" | "working" | "done" | "skipped";

export function ImageResizer({ inputId }: { inputId: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [detail, setDetail] = useState("");
  const widthRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input) return;

    async function onChange() {
      const file = input?.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
        setStatus("skipped");
        setDetail("");
        return;
      }

      setStatus("working");
      setDetail("");

      try {
        const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
        const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
        const w = Math.round(bitmap.width * scale);
        const h = Math.round(bitmap.height * scale);

        if (widthRef.current) widthRef.current.value = String(w);
        if (heightRef.current) heightRef.current.value = String(h);

        // Already small and already on-scale: sending the original is better
        // than re-encoding it.
        if (scale === 1 && file.size < SKIP_UNDER_BYTES) {
          bitmap.close();
          setStatus("done");
          setDetail(`${w}×${h}, ${Math.round(file.size / 1024)} KB`);
          return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no 2d context");
        ctx.drawImage(bitmap, 0, 0, w, h);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/webp", QUALITY),
        );
        if (!blob) throw new Error("toBlob returned nothing");

        const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
        const resized = new File([blob], name, { type: "image/webp" });

        const dt = new DataTransfer();
        dt.items.add(resized);
        if (input) input.files = dt.files;

        setStatus("done");
        setDetail(
          `${w}×${h}, ${Math.round(file.size / 1024)} KB → ${Math.round(blob.size / 1024)} KB`,
        );
      } catch {
        // Leave the original in place. The server still accepts it; a very
        // large one may be refused, and the message will say so.
        setStatus("skipped");
        setDetail("");
      }
    }

    input.addEventListener("change", onChange);
    return () => input.removeEventListener("change", onChange);
  }, [inputId]);

  return (
    <>
      <input ref={widthRef} type="hidden" name="width" defaultValue="0" />
      <input ref={heightRef} type="hidden" name="height" defaultValue="0" />
      {status === "working" && <p className="hint">Preparing the photograph&hellip;</p>}
      {status === "done" && detail && <p className="hint">Ready to upload &mdash; {detail}</p>}
    </>
  );
}
