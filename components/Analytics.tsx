"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analyticsEnabled, send, type AnalyticsEvent } from "@/lib/analytics";

/**
 * The collector.
 *
 * One delegated listener on the document rather than a handler per control, so
 * adding a tracked element is a `data-analytics` attribute in the markup and
 * nothing else — no import, no wrapper component, no risk of a button losing
 * its measurement during a refactor.
 *
 * It attaches nothing at all when no endpoint is configured, so the default
 * build ships no listeners and no network calls.
 */
export function Analytics() {
  const pathname = usePathname();

  // Page views. Fires on route change too, because this is a client-routed app
  // and a server-side hit count would miss every navigation after the first.
  useEffect(() => {
    if (!analyticsEnabled()) return;
    send({ event: "page_view", path: pathname });
  }, [pathname]);

  useEffect(() => {
    if (!analyticsEnabled()) return;

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-analytics], a[href^='tel:'], a[href^='mailto:'], a[href*='wa.me']",
      );
      if (!el) return;

      const explicit = el.dataset.analytics;
      const href = el.getAttribute("href") ?? "";

      let event: AnalyticsEvent | null = null;
      if (href.startsWith("tel:")) event = "phone_click";
      else if (href.startsWith("mailto:")) event = "email_click";
      else if (href.includes("wa.me")) event = "whatsapp_click";
      else if (explicit) event = "cta_click";
      if (!event) return;

      send({
        event,
        path: window.location.pathname,
        label: explicit ?? el.dataset.analyticsLabel,
        location: el.dataset.analyticsLocation,
      });
    };

    /* Form engagement. "Started" is the first interaction with any field, which
       is the number that makes a submission rate meaningful — a form nobody
       touches and a form everybody abandons are different problems. Neither
       path reads a field's value. */
    let started = false;
    const onFormInteract = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const form = target?.closest("form[data-analytics-form]");
      if (!form) return;

      if (target instanceof HTMLInputElement && target.type === "file") {
        send({ event: "enquiry_upload", path: window.location.pathname });
      }
      if (started) return;
      started = true;
      send({ event: "enquiry_start", path: window.location.pathname });
    };

    const onSubmit = (e: Event) => {
      const form = (e.target as HTMLElement | null)?.closest("form[data-analytics-form]");
      if (!form) return;
      send({ event: "enquiry_submit", path: window.location.pathname });
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFormInteract, true);
    document.addEventListener("change", onFormInteract, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFormInteract, true);
      document.removeEventListener("change", onFormInteract, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}
