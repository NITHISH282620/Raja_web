import { submitEnquiry } from "@/app/(site)/contact/actions";
import { services } from "@/content/inventorySchedule";

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
 */
export function EnquiryForm({ sent }: { sent: boolean }) {
  if (sent) {
    return (
      <div className="rounded-[15px] border border-hairline bg-surface p-[clamp(20px,2.6vw,36px)]">
        <p className="t-work mb-3 text-ink">Thank you — that has reached us.</p>
        <p className="t-body max-w-[46ch] text-body-light">
          We read every enquiry ourselves and will come back to you shortly. If it is urgent, call
          the number on this page.
        </p>
      </div>
    );
  }

  return (
    <form
      action={submitEnquiry}
      className="flex flex-col gap-[clamp(14px,1.6vw,20px)]"
    >
      {/*
        Honeypot. Named like a real field and hidden from people, not from
        parsers — a bot filling every input is the cheapest spam signal there
        is, and it costs a legitimate visitor nothing.
      */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-[clamp(14px,1.6vw,20px)] sm:grid-cols-2">
        <Field label="Your name" name="name" required />
        <Field label="Organisation" name="organisation" />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
      </div>

      <label className="flex flex-col gap-2">
        <span className="t-eyebrow text-ink/60">Kind of event</span>
        <select
          name="event_type"
          className="h-[52px] rounded-[10px] border border-hairline bg-surface px-4 t-body text-ink outline-none transition-colors focus:border-brand-blue"
          defaultValue=""
        >
          <option value="">Select one</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value="Other">Something else</option>
        </select>
      </label>

      <div className="grid gap-[clamp(14px,1.6vw,20px)] sm:grid-cols-2">
        <Field label="Dates" name="event_date" placeholder="March 2027, or not yet fixed" />
        <Field label="Location" name="location" placeholder="City or venue" />
      </div>

      <label className="flex flex-col gap-2">
        <span className="t-eyebrow text-ink/60">What are you building?</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Expected footfall, floor area, whether you need structures, staging, stalls or all three."
          className="rounded-[10px] border border-hairline bg-surface p-4 t-body text-ink outline-none transition-colors focus:border-brand-blue"
        />
      </label>

      <button
        type="submit"
        className="group mt-2 inline-flex h-[54px] w-fit items-center gap-3 rounded-full bg-brand-blue px-9 text-white transition-colors duration-300 hover:bg-ink"
      >
        <span className="t-body">Send enquiry</span>
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      </button>
    </form>
  );
}

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
        autoComplete={
          { name: "name", email: "email", phone: "tel", organisation: "organization" }[name] ??
          "off"
        }
        className="h-[52px] rounded-[10px] border border-hairline bg-surface px-4 t-body text-ink outline-none transition-colors focus:border-brand-blue"
      />
    </label>
  );
}
