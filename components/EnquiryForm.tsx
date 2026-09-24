"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry } from "@/app/(site)/contact/actions";
import { whatsappLink, BUDGET_BANDS, EVENT_TYPES } from "@/lib/enquiry";

const INPUT =
  "h-[52px] w-full rounded-[10px] border border-ink/15 bg-neutral-50 px-4 text-base text-ink " +
  "outline-none transition-all duration-300 placeholder:text-body-light/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15 focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]";

const ERRORS: Record<string, string> = {
  name: "Please tell us your name so we know who we are replying to.",
  reach: "Please add an email address or a phone number so we can reply.",
  rate: "That is several enquiries in a short time. Please wait a few minutes, or call the number on this page.",
  filetype: "We can read PDF, Word, Excel, PowerPoint, images and ZIP. Please attach one of those, or send it on WhatsApp instead.",
  filesize: "That file is over 8 MB. Please send a smaller version, or share a link in the notes.",
};

const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.zip";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group mt-4 inline-flex h-[54px] w-full items-center justify-center gap-3 rounded-full bg-brand-blue px-9 text-white transition-all duration-300 hover:bg-ink hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-blue/30 sm:w-fit sm:justify-start disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <span className="t-body">{pending ? "Submitting..." : "Submit your event brief"}</span>
      {!pending && (
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      )}
    </button>
  );
}

export function EnquiryForm({
  sent,
  error,
  reference,
  phone,
}: {
  sent: boolean;
  error?: string;
  reference?: string;
  phone?: string | null;
}) {
  const [fileName, setFileName] = useState<string>("");

  if (sent) {
    const wa = whatsappLink(phone, { reference });
    return (
      <div className="rounded-[15px] border border-ink/15 bg-white p-[clamp(20px,2.6vw,36px)]">
        <p className="t-work mb-3 text-ink">Thank you — that has reached us.</p>
        <p className="t-body mb-5 max-w-[46ch] text-body-light">
          We read every enquiry ourselves and will come back to you shortly.
          {reference ? (
            <>
              {" "}
              Your reference is{" "}
              <span className="font-mono text-ink" translate="no">
                {reference}
              </span>
              .
            </>
          ) : null}
        </p>
        {wa && (
          <>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-[54px] items-center gap-3 rounded-full bg-brand-blue px-8 text-white transition-colors duration-300 hover:bg-ink"
            >
              <span className="t-body">Continue on WhatsApp</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
            <p className="t-body-sm mt-3 max-w-[46ch] text-body-light">
              This opens WhatsApp with your reference already written. Fastest way to reach us.
            </p>
          </>
        )}
      </div>
    );
  }

  const message = error ? (ERRORS[error] ?? ERRORS.reach) : null;

  return (
    <form
      action={submitEnquiry}
      data-analytics-form
      className="flex flex-col gap-[clamp(32px,3vw,44px)] rounded-[15px] border border-ink/15 bg-white p-[clamp(20px,2.6vw,36px)]"
    >
      {message && (
        <p
          role="alert"
          aria-live="polite"
          className="t-body rounded-[10px] border border-accent/40 bg-accent/10 px-4 py-3 text-ink"
        >
          {message}
        </p>
      )}

      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* 01 ABOUT YOU */}
      <fieldset className="flex flex-col gap-[clamp(14px,1.6vw,20px)] border-0 p-0">
        <div className="mb-4 border-b border-ink/10 pb-4">
          <p className="t-eyebrow text-accent">01</p>
          <legend className="t-work text-ink font-semibold tracking-widest text-[16px] uppercase mt-1">
            About You
          </legend>
          <p className="t-body-sm text-body-light mt-1">Tell us who we should coordinate with.</p>
        </div>
        
        <div className="grid gap-[clamp(14px,1.6vw,20px)] sm:grid-cols-2">
          <Field label="Your name" name="name" required />
          <Field label="Company / Department" name="organisation" />
          <Field label="Work Email" name="email" type="email" />
          <Field label="Phone / WhatsApp" name="phone" type="tel" />
        </div>
      </fieldset>

      {/* 02 THE EVENT */}
      <fieldset className="flex flex-col gap-[clamp(14px,1.6vw,20px)] border-0 p-0">
        <div className="mb-4 border-b border-ink/10 pb-4">
          <p className="t-eyebrow text-accent">02</p>
          <legend className="t-work text-ink font-semibold tracking-widest text-[16px] uppercase mt-1">
            The Event
          </legend>
          <p className="t-body-sm text-body-light mt-1">Give us the basic site and scale information.</p>
        </div>

        <label className="flex flex-col gap-2">
          <span className="t-eyebrow text-ink/70 font-medium">Kind of Event</span>
          <select name="event_type" className={INPUT} defaultValue="">
            <option value="">Select one</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
            <option value="Other">Something else</option>
          </select>
        </label>

        <div className="grid gap-[clamp(14px,1.6vw,20px)] sm:grid-cols-2">
          <Field label="City" name="location" placeholder="Bengaluru, or wherever it is being built" />
          <Field label="Dates" name="event_date" placeholder="March 2027, or not yet fixed" />
          <Field label="Venue" name="venue" placeholder="Named venue, or open ground" />
          <Field label="Expected Attendance" name="attendance" placeholder="e.g. 5,000 over three days" />
        </div>

        <Field
          label="Scale of Build"
          name="requirement"
          placeholder="e.g. 40,000 sq ft covered, 60 stalls, raked seating"
        />

        <label className="flex flex-col gap-2">
          <span className="t-eyebrow text-ink/70 font-medium">Indicative Budget</span>
          <select name="budget" className={INPUT} defaultValue="">
            <option value="">Not decided yet / Select a range</option>
            {BUDGET_BANDS.map((band) => (
              <option key={band} value={band}>
                {band.replace(/^Rs /, "\u20b9 ").replace(/Rs /g, "\u20b9")}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      {/* 03 THE BRIEF */}
      <fieldset className="flex flex-col gap-[clamp(14px,1.6vw,20px)] border-0 p-0">
        <div className="mb-4 border-b border-ink/10 pb-4">
          <p className="t-eyebrow text-accent">03</p>
          <legend className="t-work text-ink font-semibold tracking-widest text-[16px] uppercase mt-1">
            The Brief
          </legend>
          <p className="t-body-sm text-body-light mt-1">Tell us anything else that will help us understand the requirement.</p>
        </div>

        <label className="flex flex-col gap-2">
          <span className="t-eyebrow text-ink/70 font-medium">Anything Else</span>
          <textarea
            name="message"
            rows={5}
            placeholder="What has to be built, what is already fixed, and what you still need decided."
            className="w-full rounded-[10px] border border-ink/15 bg-neutral-50 p-4 text-base text-ink outline-none transition-all duration-300 placeholder:text-body-light/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15 focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="t-eyebrow text-ink/70 font-medium">File upload for RFP / BOQ / Event Brief</span>
          <div className="relative flex flex-col items-center justify-center w-full min-h-[140px] rounded-[10px] border-2 border-dashed border-ink/20 bg-neutral-50 p-6 text-center transition-all duration-300 hover:border-brand-blue hover:bg-brand-blue/5 cursor-pointer">
            <input
              type="file"
              name="brief"
              accept={ACCEPT}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFileName(file.name);
                else setFileName("");
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload document"
            />
            {fileName ? (
              <div className="flex flex-col items-center gap-2 text-brand-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span className="t-body font-medium">{fileName}</span>
                <span className="t-body-sm text-ink/50 mt-1 hover:text-ink">Click to change file</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="t-body font-medium text-ink">Click or drag a file to attach</span>
                <span className="t-body-sm text-body-light">
                  Max 8 MB. Accepted: PDF, Word, Excel, PPT, Image, ZIP.
                </span>
              </div>
            )}
          </div>
        </label>
      </fieldset>

      <div className="mt-2 flex flex-col sm:flex-row items-center gap-6">
        <SubmitButton />
        {/* Secondary Contact */}
        <div className="hidden sm:block w-[1px] h-10 bg-ink/10" />
        <a href="#contact-details" className="t-body text-ink transition-colors hover:text-brand-blue">
          Message us on WhatsApp &rarr;
        </a>
      </div>
    </form>
  );
}

const AUTOCOMPLETE: Record<string, string> = {
  name: "name",
  email: "email",
  phone: "tel",
  organisation: "organization",
};

const INPUTMODE: Record<string, "tel" | "email" | "text"> = {
  phone: "tel",
  email: "email",
};

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="t-eyebrow text-ink/70 font-medium">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={INPUTMODE[name] ?? "text"}
        autoComplete={AUTOCOMPLETE[name] ?? "off"}
        className={INPUT}
      />
    </label>
  );
}
