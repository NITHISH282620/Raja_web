/**
 * The measurement contract.
 *
 * WHAT THIS IS AND IS NOT. It is a list of the events worth counting and a
 * transport that sends them. It is not an analytics vendor, and it deliberately
 * does not become one: there is no cookie, no localStorage entry, no device or
 * visitor identifier, and nothing is sent until `NEXT_PUBLIC_ANALYTICS_ENDPOINT`
 * names somewhere to send it. Unset — which is the default, and the state the
 * site ships in — the collector attaches no listeners and transmits nothing.
 *
 * WHY NO IDENTIFIER. Raja needs to know which pages produce briefs and which
 * calls-to-action get used. None of that requires knowing that two events came
 * from the same person, and once you can answer that question you are holding
 * personal data and owe the visitor a consent banner. Counting events without
 * joining them keeps the useful part and drops the liability.
 *
 * WHAT IS NEVER SENT. No field values. The enquiry form reports that a brief
 * was started and that one was submitted; it never reports what was typed into
 * it. The only payload is an event name, a path, and a short label naming which
 * control was used.
 */

export const ANALYTICS_EVENTS = [
  "page_view",
  "cta_click",
  "enquiry_start",
  "enquiry_submit",
  "enquiry_upload",
  "phone_click",
  "email_click",
  "whatsapp_click",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  /** Route the event happened on. Path only — never the query string, which on
   *  this site carries an enquiry reference. */
  path: string;
  /** Which control, e.g. "cta-primary" or "audience-card". */
  label?: string;
  /** Where on the page, e.g. "hero". Set from `data-analytics-location`. */
  location?: string;
}

export const ANALYTICS_ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT ?? "";

/** True when a destination has been configured. Nothing runs otherwise. */
export const analyticsEnabled = (): boolean => ANALYTICS_ENDPOINT.length > 0;

export function send(payload: AnalyticsPayload): void {
  if (!analyticsEnabled()) return;
  try {
    const body = JSON.stringify(payload);
    // `sendBeacon` survives the navigation a click is about to cause, which a
    // fetch from a unloading document does not.
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(ANALYTICS_ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(ANALYTICS_ENDPOINT, { method: "POST", body, keepalive: true });
  } catch {
    /* Measurement must never break the page it is measuring. */
  }
}
