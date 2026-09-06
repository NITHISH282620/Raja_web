import { submitEnquiry } from "@/app/(site)/contact/actions";
import { whatsappLink, BUDGET_BANDS, EVENT_TYPES } from "@/lib/enquiry";

/**
 * The enquiry form.
 *
 * A plain server-action form: no client JavaScript, so it works before
 * hydration and on a bad connection, which for a contractor whose buyers
 * include government departments on office networks is not a hypothetical.
 *
 * The fields are the ones that make a first reply useful — what kind of event,
 * when, where, how big. A bare "message" box gets "please send details" and
 * costs a round trip.
 *
 * WHATSAPP. Raja runs customer conversations in WhatsApp, so the success state
 * hands the visitor a prefilled `wa.me` link rather than promising a callback.
 * The enquiry is already saved by then, so a visitor who never taps through is
 * still a recorded lead — and because a deep link only drafts a message in the
 * visitor's own client, nothing here claims a message was sent.
 *
 * Inputs are `text-base` (16px) rather than the site's `t-body` (14px at the
 * small end). Any input under 16px makes iOS Safari zoom the viewport on focus,
 * which on the one page that has to convert is a real cost.
 */

const INPUT =
  "h-[52px] w-full rounded-[10px] border border-ink/15 bg-white px-4 text-base text-ink " +
  "outline-none transition-colors placeholder:text-body-light/70 focus:border-brand-blue";

const ERRORS: Record<string, string> = {
  name: "Please tell us your name so we know who we are replying to.",
  reach: "Please add an email address or a phone number so we can reply.",
  rate: "That is several enquiries in a short time. Please wait a few minutes, or call the number on this page.",
  filetype: "We can read PDF, Word, Excel, PowerPoint, images and ZIP. Please attach one of those, or send it on WhatsApp instead.",
  filesize: "That file is over 8 MB. Please send a smaller version, or share a link in the notes.",
};

/** The attachment types the server accepts, mirrored here so the file picker
 *  filters rather than letting someone choose a file that will be rejected. */
const ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.zip";

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
      encType="multipart/form-data"
      data-analytics-form
      className="flex flex-col gap-[clamp(18px,2.2vw,28px)]"
    >
      {message && (
        <p
          role="alert"
          className="t-body rounded-[10px] border border-accent/40 bg-accent/10 px-4 py-3 text-ink"
        >
          {message}
        </p>
      )}

      {/*
        Honeypot. Named like a real field and hidden from people, not from
        parsers — a bot filling every input is the cheapest spam signal there
        is, and it costs a legitimate visitor nothing.
      */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* ---------------------------------------------------------- who */}
      <fieldset className="flex flex-col gap-[clamp(14px,1.6vw,20px)] border-0 p-0">
        <legend className="t-eyebrow mb-1 text-ink/45">Who you are</legend>
        <div className="grid gap-[clamp(14px,1.6vw,20px)] sm:grid-cols-2">
          <Field label="Your name" name="name" required />
          <Field label="Company or department" name="organisation" />
          <Field label="Work email" name="email" type="email" />
          <Field label="Phone / WhatsApp" name="phone" type="tel" />
        </div>
        <p className="t-body-sm -mt-1 text-body-light">
          A phone number or an email &mdash; either is enough for us to reply.
        </p>
      </fieldset>

      {/* -------------------------------------------------------- the event */}
      <fieldset className="flex flex-col gap-[clamp(14px,1.6vw,20px)] border-0 p-0">
        <legend className="t-eyebrow mb-1 text-ink/45">The event</legend>

        <label className="flex flex-col gap-2">
          <span className="t-eyebrow text-ink/60">Kind of event</span>
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
          <Field label="Expected attendance" name="attendance" placeholder="e.g. 5,000 over three days" />
        </div>

        <Field
          label="Scale of the build"
          name="requirement"
          placeholder="e.g. 40,000 sq ft covered, 60 stalls, raked seating for 2,000"
        />

        {/*
          Budget band, not a figure. Buyers who will not type a number will still
          pick a range, and a range is all the internal triage needs. "Not yet
          decided" is offered on purpose — leaving it out does not produce a
          budget, it produces a wrong one.
        */}
        <label className="flex flex-col gap-2">
          <span className="t-eyebrow text-ink/60">Indicative budget</span>
          <select name="budget" className={INPUT} defaultValue="">
            <option value="">Select a range</option>
            {BUDGET_BANDS.map((band) => (
              <option key={band} value={band}>
                {band.replace(/^Rs /, "\u20b9 ").replace(/Rs /g, "\u20b9")}
              </option>
            ))}
          </select>
          <span className="t-body-sm text-body-light">
            A range is enough. It tells us which of our crews and stock to put against it.
          </span>
        </label>
      </fieldset>

      {/* ------------------------------------------------------- the brief */}
      <fieldset className="flex flex-col gap-[clamp(14px,1.6vw,20px)] border-0 p-0">
        <legend className="t-eyebrow mb-1 text-ink/45">The brief</legend>

        <label className="flex flex-col gap-2">
          <span className="t-eyebrow text-ink/60">Anything else</span>
          <textarea
            name="message"
            rows={5}
            placeholder="What has to be built, what is already fixed, and what you still need decided."
            className="w-full rounded-[10px] border border-ink/15 bg-white p-4 text-base text-ink outline-none transition-colors placeholder:text-body-light/70 focus:border-brand-blue"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="t-eyebrow text-ink/60">Attach an RFP, BOQ or event brief</span>
          <input
            type="file"
            name="brief"
            accept={ACCEPT}
            className="w-full rounded-[10px] border border-dashed border-ink/25 bg-white p-4 text-base text-ink file:mr-4 file:rounded-full file:border-0 file:bg-ink/[0.06] file:px-4 file:py-2 file:text-sm file:text-ink hover:border-brand-blue/60"
          />
          <span className="t-body-sm text-body-light">
            Optional. PDF, Word, Excel, PowerPoint, images or ZIP, up to 8&nbsp;MB. If your
            document is larger, send it on WhatsApp after submitting.
          </span>
        </label>
      </fieldset>

      <button
        type="submit"
        className="group mt-2 inline-flex h-[54px] w-full items-center justify-center gap-3 rounded-full bg-brand-blue px-9 text-white transition-colors duration-300 hover:bg-ink sm:w-fit sm:justify-start"
      >
        <span className="t-body">Submit your event brief</span>
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      </button>
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
      <span className="t-eyebrow text-ink/60">
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
