"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { ScoreComponent } from "@/features/life-score/score";

/**
 * Dashboard hero — the Life Score ring plus the day's headline.
 * The ring doubles as the Life Score breakdown trigger, so the score still
 * answers "why is it that number" (the open item flagged in the planning docs).
 */
export function HeroCard({
  headline,
  sub,
  score,
  components,
  habitsComplete,
  habitCount,
}: {
  headline: string;
  sub: string;
  score: number;
  components: ScoreComponent[];
  habitsComplete: number;
  habitCount: number;
}) {
  const [open, setOpen] = useState(false);
  const r = 44;
  const c = 2 * Math.PI * r;

  return (
    <section className="rise rounded-3xl bg-surface p-6 shadow-[var(--shadow-e1)] ring-1 ring-border sm:p-8 md:p-10">
      <div className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Today
          </p>
          <p className="mt-3 text-balance text-[26px] font-medium leading-[1.2] tracking-[-0.015em] sm:text-[32px]">
            {headline}
          </p>
          <p className="mt-3 max-w-[46ch] text-pretty text-[15px] leading-relaxed text-muted-foreground">
            {sub}
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link
              href="#log-today"
              className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[14px] font-medium text-background transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              Log today
            </Link>
            <Link
              href="/dashboard/progress"
              className="inline-flex h-11 items-center rounded-full bg-accent-soft px-5 text-[14px] font-medium text-accent transition-colors duration-200 hover:bg-accent-line/50 active:scale-[0.97]"
            >
              View progress
            </Link>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative mx-auto size-40 shrink-0 rounded-full transition-transform duration-200 active:scale-[0.98] sm:size-44"
        >
          <svg
            viewBox="0 0 100 100"
            className="size-full -rotate-90"
            role="img"
            aria-label={`Life score ${score} out of 100`}
          >
            <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" stroke="var(--accent-soft)" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="var(--accent)"
              strokeDasharray={c.toFixed(2)}
              strokeDashoffset={(c * (1 - score / 100)).toFixed(2)}
              style={{ transition: "stroke-dashoffset 1.1s var(--ease-calm)" }}
            />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="tabular text-[34px] font-medium leading-none tracking-tight">
              {score}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
              Life Score
              <span className="rounded-full bg-accent-soft px-1.5 py-px text-[9px] font-bold text-accent">
                Beta
              </span>
            </span>
            <span className="tabular mt-1 flex items-center gap-1 text-[12px] text-muted-foreground">
              {habitsComplete} of {habitCount} habits
              <ChevronDown
                aria-hidden
                className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </span>
          </span>
        </button>
      </div>

      {open ? (
        <div className="mt-8 border-t border-border pt-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {components.map((comp) => (
              <li key={comp.key} className="flex items-center gap-3">
                <span className="w-20 flex-none text-[13px] font-medium">
                  {comp.label}
                </span>
                <span
                  role="progressbar"
                  aria-valuenow={Math.round(comp.ratio * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${comp.label}: ${comp.points} of ${comp.weight} points`}
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"
                >
                  <span
                    className="block h-full rounded-full bg-accent"
                    style={{ width: `${comp.ratio * 100}%` }}
                  />
                </span>
                <span className="tabular w-14 flex-none text-right text-[11px] text-muted-foreground">
                  {comp.points}/{comp.weight}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
            Weighting is a Beta heuristic (Habits 30% · Sleep 15% · Water 15% ·
            Nutrition 15% · Workout 15% · Mood 10%) — it&apos;ll be tuned with
            real usage.
          </p>
        </div>
      ) : null}
    </section>
  );
}
