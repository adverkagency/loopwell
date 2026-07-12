"use client";

import { createContext, useActionState, useContext } from "react";
import type { AuthState } from "@/app/(auth)/actions";

/** Values echoed back by a failed action so fields survive the submit reset. */
const FormValuesContext = createContext<Record<string, string>>({});

/** Per-field validation messages from the last failed action. */
const FieldErrorsContext = createContext<Record<string, string>>({});

/** Minimal shared form shell for the auth pages — persistent labels, inline errors, loading state. */
export function AuthForm({
  action,
  title,
  subtitle,
  submitLabel,
  children,
  footer,
}: {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  title: string;
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
      <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-ink-secondary">{subtitle}</p>
      ) : null}

      <FormValuesContext.Provider value={state.values ?? {}}>
        <FieldErrorsContext.Provider value={state.fieldErrors ?? {}}>
          <div className="mt-6 flex flex-col gap-4">{children}</div>
        </FieldErrorsContext.Provider>
      </FormValuesContext.Provider>

      {state.error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-danger">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p role="status" className="mt-4 text-sm font-medium text-success">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-rest-xs transition hover:bg-primary-hover hover:shadow-lift active:scale-[0.97] disabled:opacity-45 disabled:shadow-none"
      >
        {pending ? "One moment…" : submitLabel}
      </button>

      {footer ? (
        <div className="mt-5 text-center text-sm text-ink-secondary">
          {footer}
        </div>
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
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const values = useContext(FormValuesContext);
  const fieldError = useContext(FieldErrorsContext)[name];
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`f-${name}`} className="text-sm font-medium text-ink-secondary">
        {label}
      </label>
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
        className={`min-h-11 rounded-field border-[1.5px] bg-elevated px-3 text-base text-ink placeholder:text-ink-muted transition focus:shadow-focus-ring focus:outline-none ${
          fieldError
            ? "border-danger focus:border-danger"
            : "border-hairline-strong focus:border-teal-500"
        }`}
      />
      {fieldError ? (
        <p id={`f-${name}-error`} role="alert" className="text-sm font-medium text-danger">
          {fieldError}
        </p>
      ) : null}
    </div>
  );
}
