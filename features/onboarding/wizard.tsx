"use client";

import { useState, useTransition } from "react";
import { completeOnboarding } from "@/features/habits/actions";
import { HABIT_TEMPLATES } from "@/features/habits/templates";
import { CheckIcon, HabitIcon } from "@/components/ui/icons";

/**
 * First-run Setup Wizard — target under 60 seconds:
 * 1. tap-pick 3–5 starter habits (no typing)
 * 2. goal step: stubbed skip-only in M1 (goal engine lands in M3)
 * 3. first win → server creates habits + pre-completes the first
 */
export function OnboardingWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [picked, setPicked] = useState<string[]>(
    HABIT_TEMPLATES.slice(0, 3).map((t) => t.name)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function togglePick(name: string) {
    setPicked((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 5) return prev; // max 5 — UI shows the hint
      return [...prev, name];
    });
  }

  function finish() {
    setError(null);
    startTransition(async () => {
      const res = await completeOnboarding({
        habit_names: picked,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      if (res?.error) setError(res.error);
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* progress */}
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={3}
        aria-label="Onboarding progress"
        className="mb-8 flex gap-2"
      >
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1 flex-1 rounded-full transition ${
              n <= step ? "bg-primary" : "bg-hairline"
            }`}
          />
        ))}
      </div>

      {step === 1 ? (
        <section aria-labelledby="onb-h1" className="flex flex-1 flex-col">
          <h1 id="onb-h1" className="text-3xl font-bold tracking-tight text-ink">
            Pick 3–5 habits to start
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Tap the ones you want to track. No typing — you can add custom
            habits later.
          </p>
          <div
            role="group"
            aria-label="Starter habit templates"
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {HABIT_TEMPLATES.map((t) => {
              const selected = picked.includes(t.name);
              return (
                <button
                  key={t.name}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => togglePick(t.name)}
                  className={`relative flex flex-col items-center gap-2 rounded-card border-2 bg-elevated px-3 py-5 text-center text-sm font-medium shadow-rest-xs transition hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.97] ${
                    selected
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-hairline text-ink-secondary hover:border-teal-300"
                  }`}
                >
                  {selected ? (
                    <span className="absolute right-2 top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-on-primary">
                      <CheckIcon size={11} />
                    </span>
                  ) : null}
                  <HabitIcon
                    name={t.icon}
                    size={28}
                    className={selected ? "text-teal-600" : "text-ink-muted"}
                  />
                  {t.name}
                </button>
              );
            })}
          </div>
          <p aria-live="polite" className="tabular sticky bottom-4 mt-8 text-center text-sm text-ink-muted">
            {picked.length} selected
            {picked.length < 3 ? " — pick at least 3" : ""}
            {picked.length === 5 ? " — that's the max to start" : ""}
          </p>
          <div className="mt-auto flex justify-end pt-8">
            <button
              type="button"
              disabled={picked.length < 3}
              onClick={() => setStep(2)}
              className="flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-on-primary shadow-rest-xs transition hover:bg-primary-hover disabled:opacity-45"
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section aria-labelledby="onb-h2" className="flex flex-1 flex-col">
          <h1 id="onb-h2" className="text-3xl font-bold tracking-tight text-ink">
            Set one goal{" "}
            <span className="text-sm font-normal text-ink-muted">(optional)</span>
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Goals arrive with the Goals tab in an upcoming update — you&apos;ll
            be able to add one there any time. Nothing to do here yet.
          </p>
          <div className="mt-6 rounded-card bg-elevated ring-1 ring-border p-6 text-sm text-ink-secondary shadow-rest">
            Coming soon: one simple goal engine for anything you&apos;re working
            toward — weight, reading, savings, or something entirely your own.
          </div>
          <div className="mt-auto flex justify-between pt-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex min-h-11 items-center rounded-full border border-hairline-strong px-6 text-sm font-semibold text-ink transition hover:bg-surface-hover"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-on-primary shadow-rest-xs transition hover:bg-primary-hover"
            >
              Skip for now
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section aria-labelledby="onb-h3" className="flex flex-1 flex-col">
          <div className="mt-12 text-center">
            <div aria-hidden className="text-6xl">
              🎉
            </div>
            <h1 id="onb-h3" className="mt-4 text-3xl font-bold tracking-tight text-ink">
              You&apos;re all set
            </h1>
            <p className="mt-2 text-sm text-ink-secondary">
              We&apos;ll pre-check your first habit for today — your first win,
              already done.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-card bg-elevated ring-1 ring-border px-4 py-3 text-left shadow-rest">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-primary" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">{picked[0]}</div>
                <div className="text-xs text-ink-muted">Your first habit</div>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-on-success">
                <CheckIcon size={16} />
              </span>
            </div>
          </div>
          {error ? (
            <p role="alert" className="mt-4 text-center text-sm font-medium text-danger">
              {error}
            </p>
          ) : null}
          <div className="mt-auto pt-8">
            <button
              type="button"
              disabled={pending}
              onClick={finish}
              className="flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-on-primary shadow-rest-xs transition hover:bg-primary-hover disabled:opacity-45"
            >
              {pending ? "Setting things up…" : "Go to your Daily page"}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
