"use client";

import { useActionState } from "react";
import { ArrowRight, Check, Trash2 } from "lucide-react";
import { submitContact, submitDeletionRequest, type FormState } from "@/app/(marketing)/actions";
import { CONTACT_TOPICS } from "@/lib/validation/marketing";

const inputClass =
  "w-full rounded-xl border border-lp-hairline bg-lp-bg px-4 py-3 text-sm text-lp-ink placeholder:text-lp-muted focus:border-lp-ink focus:outline-none focus:ring-2 focus:ring-lp-ink/10";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-lp-muted">
      {children}
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

function SuccessPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-lp-primary/20 bg-lp-primary/5 p-6" role="status">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-lp-primary text-lp-primary-fg">
        <Check className="h-5 w-5" />
      </div>
      <div className="mt-4 font-display text-2xl text-lp-ink">{title}</div>
      <p className="mt-2 text-sm text-lp-muted">{body}</p>
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, {});

  if (state.ok) {
    return (
      <SuccessPanel
        title="Message received."
        body="Thanks for writing. We read every message and usually reply within a day."
      />
    );
  }

  const err = state.fieldErrors ?? {};
  const val = state.values ?? {};

  return (
    <form action={action} noValidate className="mt-8 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <FieldLabel>Name</FieldLabel>
          <input
            name="name"
            type="text"
            placeholder="Ava Chen"
            defaultValue={val.name}
            aria-invalid={err.name ? true : undefined}
            aria-describedby={err.name ? "contact-name-error" : undefined}
            className={inputClass}
          />
          <FieldError id="contact-name-error" message={err.name} />
        </label>
        <label className="block">
          <FieldLabel>Email</FieldLabel>
          <input
            name="email"
            type="email"
            placeholder="ava@example.com"
            defaultValue={val.email}
            aria-invalid={err.email ? true : undefined}
            aria-describedby={err.email ? "contact-email-error" : undefined}
            className={inputClass}
          />
          <FieldError id="contact-email-error" message={err.email} />
        </label>
      </div>
      <label className="block">
        <FieldLabel>Topic</FieldLabel>
        <select
          name="topic"
          defaultValue={val.topic ?? ""}
          aria-invalid={err.topic ? true : undefined}
          aria-describedby={err.topic ? "contact-topic-error" : undefined}
          className={inputClass}
        >
          <option value="" disabled>
            Choose one…
          </option>
          {CONTACT_TOPICS.map((t) => (
            <option key={t} value={t}>
              {t === "other" ? "Something else" : t[0].toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <FieldError id="contact-topic-error" message={err.topic} />
      </label>
      <label className="block">
        <FieldLabel>Message</FieldLabel>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us a little about what you need…"
          defaultValue={val.message}
          aria-invalid={err.message ? true : undefined}
          aria-describedby={err.message ? "contact-message-error" : undefined}
          className={inputClass}
        />
        <FieldError id="contact-message-error" message={err.message} />
      </label>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-lp-ink px-5 py-3 text-sm font-medium text-lp-bg transition-all hover:bg-lp-ink/90 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send message"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
      <p className="text-xs text-lp-muted">
        By sending, you agree to our privacy policy. We never share your details.
      </p>
    </form>
  );
}

export function DeletionForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitDeletionRequest,
    {}
  );

  if (state.ok) {
    return (
      <SuccessPanel
        title="Request received."
        body="We'll email the address you gave us to confirm before anything is deleted. Nothing is removed until you confirm."
      />
    );
  }

  const err = state.fieldErrors ?? {};
  const val = state.values ?? {};

  return (
    <form action={action} noValidate className="mt-8 grid gap-4">
      <label className="block">
        <FieldLabel>Email on account</FieldLabel>
        <input
          name="email"
          type="email"
          placeholder="ava@example.com"
          defaultValue={val.email}
          aria-invalid={err.email ? true : undefined}
          aria-describedby={err.email ? "del-email-error" : undefined}
          className={inputClass}
        />
        <FieldError id="del-email-error" message={err.email} />
      </label>
      <label className="block">
        <FieldLabel>Reason (optional)</FieldLabel>
        <textarea
          name="reason"
          rows={4}
          placeholder="Helps us understand — but never required."
          defaultValue={val.reason}
          className={inputClass}
        />
      </label>
      <label className="flex items-start gap-3 rounded-xl border border-lp-hairline bg-lp-bg/60 p-4 text-sm text-lp-ink">
        <input
          name="confirm"
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-lp-hairline accent-lp-primary"
          aria-describedby={err.confirm ? "del-confirm-error" : undefined}
        />
        <span>I understand this is permanent. My data cannot be restored.</span>
      </label>
      <FieldError id="del-confirm-error" message={err.confirm} />
      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-red-700 px-5 py-3 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        {pending ? "Sending…" : "Request deletion"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
