"use client";

import { createContext, useActionState, useContext } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { AuthState } from "@/app/(auth)/actions";

/** Values echoed back by a failed action so fields survive the submit reset. */
const FormValuesContext = createContext<Record<string, string>>({});

/** Per-field validation messages from the last failed action. */
const FieldErrorsContext = createContext<Record<string, string>>({});

/** Minimal shared form shell for the auth pages — persistent labels, inline errors, loading state. */
export function AuthForm({
  action,
  eyebrow,
  title,
  subtitle,
  submitLabel,
  children,
  footer,
}: {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  submitLabel: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {}
  );

  return (
    <form action={formAction} noValidate>
      {eyebrow ? (
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-lp-hairline bg-lp-surface/60 px-3 py-1 text-xs text-lp-muted">
          <Sparkles className="h-3 w-3" />
          {eyebrow}
        </div>
      ) : null}
      <h1 className="font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">{title}</h1>
      {subtitle ? <p className="mt-3 text-lp-muted">{subtitle}</p> : null}

      <FormValuesContext.Provider value={state.values ?? {}}>
        <FieldErrorsContext.Provider value={state.fieldErrors ?? {}}>
          <div className="mt-8 flex flex-col gap-4">{children}</div>
        </FieldErrorsContext.Provider>
      </FormValuesContext.Provider>

      {state.error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-red-600">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p role="status" className="mt-4 text-sm font-medium text-lp-primary">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="group mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-lp-ink px-5 text-sm font-medium text-lp-bg transition-all hover:bg-lp-ink/90 disabled:opacity-50"
      >
        {pending ? "One moment…" : submitLabel}
        {!pending && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
      </button>

      {footer ? (
        <div className="mt-8 text-sm text-lp-muted">{footer}</div>
      ) : null}
    </form>
  );
}

export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  action,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  /** Optional trailing control on the label row, e.g. a "Forgot?" link. */
  action?: React.ReactNode;
}) {
  const values = useContext(FormValuesContext);
  const fieldError = useContext(FieldErrorsContext)[name];
  return (
    <div className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <label
          htmlFor={`f-${name}`}
          className="text-xs font-medium uppercase tracking-widest text-lp-muted"
        >
          {label}
        </label>
        {action}
      </div>
      <input
        id={`f-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={values[name] ?? ""}
        required
        aria-invalid={fieldError ? true : undefined}
        aria-describedby={fieldError ? `f-${name}-error` : undefined}
        className={`w-full rounded-xl border bg-lp-surface px-4 py-3 text-sm text-lp-ink placeholder:text-lp-muted focus:outline-none focus:ring-2 focus:ring-lp-ink/10 ${
          fieldError ? "border-red-500 focus:border-red-500" : "border-lp-hairline focus:border-lp-ink"
        }`}
      />
      {fieldError ? (
        <p id={`f-${name}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {fieldError}
        </p>
      ) : null}
    </div>
  );
}
