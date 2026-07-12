"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { addWater, setMood, setSleep, setWeight } from "./actions";
import {
  bmi,
  bmiCategory,
  formatDuration,
  kgToLbs,
  lbsToKg,
  sleepDurationMinutes,
} from "@/lib/health";

/* ---------------- Water ---------------- */

export function WaterCard({
  today,
  totalMl,
  goalMl,
}: {
  today: string;
  totalMl: number;
  goalMl: number;
}) {
  const [, startTransition] = useTransition();
  const [optimisticTotal, addOptimistic] = useOptimistic(
    totalMl,
    (total, amount: number) => total + amount
  );

  function log(amount: number) {
    startTransition(async () => {
      addOptimistic(amount);
      await addWater({ date: today, amount_ml: amount });
    });
  }

  const pct = Math.max(0, Math.min(1, optimisticTotal / goalMl));
  const r = 36;
  const c = 2 * Math.PI * r;

  return (
    <section
      aria-label="Water"
      className="rounded-card border border-hairline bg-elevated p-5 shadow-rest"
    >
      <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">Water</h2>
      <div className="flex items-center gap-4">
        <div className="relative inline-flex flex-none items-center justify-center">
          <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90" role="img"
            aria-label={`Water: ${(optimisticTotal / 1000).toFixed(2)} of ${(goalMl / 1000).toFixed(1)} litres`}>
            <circle cx="44" cy="44" r={r} fill="none" strokeWidth="8" className="stroke-[var(--lw-bg-sunken)]" />
            <circle
              cx="44" cy="44" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
              className="stroke-[var(--lw-teal-500)] transition-[stroke-dashoffset] duration-300"
              strokeDasharray={c.toFixed(2)}
              strokeDashoffset={(c * (1 - pct)).toFixed(2)}
            />
          </svg>
          <span className="tabular absolute text-sm font-bold text-ink">
            {(optimisticTotal / 1000).toFixed(2)}L
          </span>
        </div>
        <div className="flex flex-1 flex-wrap gap-2">
          {[250, 500, 750, 1000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => log(amt)}
              className="flex min-h-9 items-center rounded-full border border-hairline-strong px-4 text-xs font-semibold text-ink transition hover:bg-surface-hover active:scale-[0.96]"
            >
              +{amt === 1000 ? "1L" : `${amt}ml`}
            </button>
          ))}
          <p className="tabular w-full text-xs text-ink-muted">
            Goal {(goalMl / 1000).toFixed(1)}L
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Weight ---------------- */

export function WeightCard({
  today,
  weightKg,
  heightCm,
  unitSystem,
}: {
  today: string;
  weightKg: number | null;
  heightCm: number | null;
  unitSystem: "metric" | "imperial";
}) {
  const [, startTransition] = useTransition();
  const [saved, setSaved] = useState<number | null>(weightKg);
  const [error, setError] = useState<string | null>(null);
  const imperial = unitSystem === "imperial";

  function save(raw: string) {
    const value = Number(raw);
    if (!raw || Number.isNaN(value) || value <= 0) {
      if (raw) setError("Enter a value greater than 0");
      return;
    }
    const kg = imperial ? lbsToKg(value) : value;
    setError(null);
    setSaved(kg);
    startTransition(async () => {
      const res = await setWeight({ date: today, weight_kg: kg });
      if (res.error) setError(res.error);
    });
  }

  const display = saved === null ? "" : imperial ? kgToLbs(saved) : saved;
  const bmiValue = saved !== null && heightCm ? bmi(saved, heightCm) : null;

  return (
    <section
      aria-label="Weight"
      className="rounded-card border border-hairline bg-elevated p-5 shadow-rest"
    >
      <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">Weight</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="weight-input" className="text-sm font-medium text-ink-secondary">
          Today&apos;s weight ({imperial ? "lbs" : "kg"})
        </label>
        {/* Tier 2 logging: single inline input, saves on blur — no Save button */}
        <input
          id="weight-input"
          type="number"
          inputMode="decimal"
          step="0.1"
          min="1"
          defaultValue={display}
          onBlur={(e) => save(e.currentTarget.value)}
          placeholder={imperial ? "e.g. 176" : "e.g. 79.8"}
          className="tabular min-h-11 rounded-field border-[1.5px] border-hairline-strong bg-elevated px-3 text-base text-ink placeholder:text-ink-muted transition focus:border-teal-500 focus:shadow-focus-ring focus:outline-none"
        />
        {error ? (
          <p role="alert" className="text-sm font-medium text-danger">{error}</p>
        ) : null}
        {bmiValue !== null ? (
          <p className="tabular text-xs text-ink-muted">
            BMI {bmiValue} · {bmiCategory(bmiValue)}
          </p>
        ) : saved !== null && !heightCm ? (
          <p className="text-xs text-ink-muted">Add your height in Settings to see BMI.</p>
        ) : null}
      </div>
    </section>
  );
}

/* ---------------- Sleep ---------------- */

const QUALITIES = [
  { value: "poor" as const, emoji: "😴", label: "Poor" },
  { value: "okay" as const, emoji: "🙂", label: "Okay" },
  { value: "great" as const, emoji: "😁", label: "Great" },
];

export function SleepCard({
  today,
  initial,
}: {
  today: string;
  initial: { bed_time: string; wake_time: string; quality: "poor" | "okay" | "great" | null } | null;
}) {
  const [, startTransition] = useTransition();
  const [bed, setBed] = useState(initial?.bed_time ?? "");
  const [wake, setWake] = useState(initial?.wake_time ?? "");
  const [quality, setQuality] = useState(initial?.quality ?? null);
  const [error, setError] = useState<string | null>(null);

  function persist(b: string, w: string, q: typeof quality) {
    if (!b || !w) return; // both times required before anything saves
    setError(null);
    startTransition(async () => {
      const res = await setSleep({ date: today, bed_time: b, wake_time: w, quality: q });
      if (res.error) setError(res.error);
    });
  }

  const duration =
    bed && wake ? formatDuration(sleepDurationMinutes(bed, wake)) : "—";

  return (
    <section
      aria-label="Sleep"
      className="rounded-card border border-hairline bg-elevated p-5 shadow-rest"
    >
      <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">Sleep</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="bed-time" className="text-sm font-medium text-ink-secondary">
            Bed time
          </label>
          <input
            id="bed-time"
            type="time"
            value={bed}
            onChange={(e) => {
              setBed(e.target.value);
              persist(e.target.value, wake, quality);
            }}
            className="tabular min-h-11 rounded-field border-[1.5px] border-hairline-strong bg-elevated px-3 text-base text-ink transition focus:border-teal-500 focus:shadow-focus-ring focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="wake-time" className="text-sm font-medium text-ink-secondary">
            Wake time
          </label>
          <input
            id="wake-time"
            type="time"
            value={wake}
            onChange={(e) => {
              setWake(e.target.value);
              persist(bed, e.target.value, quality);
            }}
            className="tabular min-h-11 rounded-field border-[1.5px] border-hairline-strong bg-elevated px-3 text-base text-ink transition focus:border-teal-500 focus:shadow-focus-ring focus:outline-none"
          />
        </div>
      </div>
      <p className="tabular mt-3 text-sm text-ink-secondary">
        Duration: <strong className="text-ink">{duration}</strong>
      </p>
      <div role="group" aria-label="Sleep quality" className="mt-3 flex gap-2">
        {QUALITIES.map((q) => (
          <button
            key={q.value}
            type="button"
            aria-pressed={quality === q.value}
            onClick={() => {
              const next = quality === q.value ? null : q.value;
              setQuality(next);
              persist(bed, wake, next);
            }}
            className={`flex min-h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition active:scale-[0.96] ${
              quality === q.value
                ? "border-teal-400 bg-teal-50 text-teal-700"
                : "border-hairline-strong text-ink transition hover:bg-surface-hover"
            }`}
          >
            <span aria-hidden>{q.emoji}</span> {q.label}
          </button>
        ))}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-danger">{error}</p>
      ) : null}
    </section>
  );
}

/* ---------------- Mood ---------------- */

const MOODS = [
  { value: 5, emoji: "😄", label: "Great mood" },
  { value: 4, emoji: "🙂", label: "Good mood" },
  { value: 3, emoji: "😐", label: "Okay mood" },
  { value: 2, emoji: "😕", label: "Low mood" },
  { value: 1, emoji: "😣", label: "Rough mood" },
];

export function MoodCard({
  today,
  initial,
}: {
  today: string;
  initial: { mood: number; note: string | null } | null;
}) {
  const [, startTransition] = useTransition();
  const [mood, setMoodState] = useState<number | null>(initial?.mood ?? null);
  const [error, setError] = useState<string | null>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  function persist(m: number | null, note?: string) {
    if (m === null) return;
    setError(null);
    startTransition(async () => {
      const res = await setMood({
        date: today,
        mood: m,
        note: note ?? noteRef.current?.value ?? undefined,
      });
      if (res.error) setError(res.error);
    });
  }

  return (
    <section
      aria-label="Mood"
      className="rounded-card border border-hairline bg-elevated p-5 shadow-rest"
    >
      <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">Mood</h2>
      <div role="group" aria-label="Select today's mood" className="flex flex-wrap gap-2">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            aria-label={m.label}
            aria-pressed={mood === m.value}
            onClick={() => {
              setMoodState(m.value);
              persist(m.value);
            }}
            className={`flex h-11 w-11 items-center justify-center rounded-full border text-xl transition active:scale-90 ${
              mood === m.value
                ? "border-teal-400 bg-teal-50"
                : "border-hairline-strong hover:bg-surface-hover"
            }`}
          >
            <span aria-hidden>{m.emoji}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="mood-note" className="text-sm font-medium text-ink-secondary">
          Note (optional)
        </label>
        <input
          id="mood-note"
          ref={noteRef}
          type="text"
          maxLength={140}
          defaultValue={initial?.note ?? ""}
          onBlur={() => persist(mood)}
          placeholder="What's driving today's mood?"
          className="min-h-11 rounded-field border-[1.5px] border-hairline-strong bg-elevated px-3 text-base text-ink placeholder:text-ink-muted transition focus:border-teal-500 focus:shadow-focus-ring focus:outline-none"
        />
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-danger">{error}</p>
      ) : null}
    </section>
  );
}
