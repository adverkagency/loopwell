"use client";

import { useState } from "react";
import type { ScoreComponent } from "./score";
import { ChevronDownIcon } from "@/components/ui/icons";

/**
 * Life Score card with the breakdown UI — resolves the open item flagged in
 * every planning doc: the score must answer "why is my score X", not just
 * display a number.
 */
export function LifeScoreCard({
  score,
  components,
}: {
  score: number;
  components: ScoreComponent[];
}) {
  const [open, setOpen] = useState(false);
  const r = 30;
  const c = 2 * Math.PI * r;

  return (
    <section
      aria-label="Life score"
      className="rounded-card border border-teal-200 bg-elevated bg-[radial-gradient(120%_140%_at_0%_0%,var(--lw-teal-50),transparent_60%)] shadow-rest"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-5 p-5 text-left"
      >
        <div className="relative inline-flex flex-none items-center justify-center">
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            className="-rotate-90"
            role="img"
            aria-label={`Life score ${score} out of 100`}
          >
            <circle cx="36" cy="36" r={r} fill="none" strokeWidth="7" className="stroke-[var(--lw-bg-sunken)]" />
            <circle
              cx="36" cy="36" r={r} fill="none" strokeWidth="7" strokeLinecap="round"
              className="stroke-[var(--lw-teal-500)] transition-[stroke-dashoffset] duration-300"
              strokeDasharray={c.toFixed(1)}
              strokeDashoffset={(c * (1 - score / 100)).toFixed(1)}
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-2 text-sm text-ink-muted">
            Life Score
            <span className="rounded-full bg-coral-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#2a1a08]">
              Beta
            </span>
          </h2>
          <span className="tabular text-4xl font-bold leading-none tracking-tight text-teal-700">
            {score}
          </span>
          <p className="mt-1 text-xs text-ink-muted">
            {open ? "Hide breakdown" : "Tap to see why"}
          </p>
        </div>
        <ChevronDownIcon
          size={18}
          className={`flex-none text-ink-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="border-t border-hairline px-5 py-4">
          <ul className="flex flex-col gap-3">
            {components.map((comp) => (
              <li key={comp.key} className="flex items-center gap-3">
                <span className="w-20 flex-none text-sm font-medium text-ink">
                  {comp.label}
                </span>
                <span
                  role="progressbar"
                  aria-valuenow={Math.round(comp.ratio * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${comp.label}: ${comp.points} of ${comp.weight} points`}
                  className="h-2 flex-1 overflow-hidden rounded-full bg-sunken"
                >
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${comp.ratio * 100}%` }}
                  />
                </span>
                <span className="tabular w-16 flex-none text-right text-xs text-ink-muted">
                  {comp.points}/{comp.weight}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            Weighting is a Beta heuristic (Habits 30% · Sleep 15% · Water 15% ·
            Nutrition 15% · Workout 15% · Mood 10%) — it&apos;ll be tuned with
            real usage.
          </p>
        </div>
      ) : null}
    </section>
  );
}
