"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { addWater, setMood, setSleep, setWeight } from "./actions";
import { useHydrated } from "@/lib/use-hydrated";
import { useSavedFlash } from "@/lib/use-saved-flash";
import { CARD_BASE, SavedFlash, buttonClass } from "@/components/ui/kit";
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
  const hydrated = useHydrated();
  const [, startTransition] = useTransition();
  const { saved, flash } = useSavedFlash();
  const [optimisticTotal, addOptimistic] = useOptimistic(
    totalMl,
    (total, amount: number) => total + amount
  );

  function log(amount: number) {
    startTransition(async () => {
      addOptimistic(amount);
      await addWater({ date: today, amount_ml: amount });
      flash();
    });
  }

  const pct = Math.max(0, Math.min(1, optimisticTotal / goalMl));
  const r = 36;
  const c = 2 * Math.PI * r;

  return (
    <section
      aria-label="Water"
      className={`${CARD_BASE} p-5 sm:p-6`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold tracking-tight">Water</h2>
        {saved ? <SavedFlash label="Logged" /> : null}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative inline-flex flex-none items-center justify-center">
          <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90" role="img"
            aria-label={`Water: ${(optimisticTotal / 1000).toFixed(2)} of ${(goalMl / 1000).toFixed(1)} litres`}>
            <circle cx="44" cy="44" r={r} fill="none" strokeWidth="8" stroke="var(--accent-soft)" />
            <circle
              cx="44" cy="44" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
              stroke="var(--accent)"
              className="transition-[stroke-dashoffset] duration-700 ease-[var(--ease-calm)]"
              strokeDasharray={c.toFixed(2)}
              strokeDashoffset={(c * (1 - pct)).toFixed(2)}
            />
          </svg>
          <span className="tabular absolute text-[14px] font-semibold">
            {(optimisticTotal / 1000).toFixed(2)}L
          </span>
        </div>
        <div className="flex flex-1 flex-wrap gap-2">
          {[250, 500, 750, 1000].map((amt) => (
            <button
              key={amt}
              type="button"
              disabled={!hydrated}
              onClick={() => log(amt)}
              className={buttonClass("ghost", "sm")}
            >
              +{amt === 1000 ? "1L" : `${amt}ml`}
            </button>
          ))}
          <p className="tabular w-full text-[12px] text-muted-foreground">
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
  const { saved: flashed, flash } = useSavedFlash();
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
      else flash();
    });
  }

  const display = saved === null ? "" : imperial ? kgToLbs(saved) : saved;
  const bmiValue = saved !== null && heightCm ? bmi(saved, heightCm) : null;

  return (
    <section
      aria-label="Weight"
      className={`${CARD_BASE} p-5 sm:p-6`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold tracking-tight">Weight</h2>
        {flashed ? <SavedFlash /> : null}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="weight-input" className="text-[13px] font-medium text-muted-foreground">
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
          className="tabular h-11 w-full rounded-xl bg-secondary px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45"
        />
        {error ? (
          <p role="alert" className="text-[13px] font-medium text-danger">{error}</p>
        ) : null}
        {bmiValue !== null ? (
          <p className="tabular text-[12px] text-muted-foreground">
            BMI {bmiValue} · {bmiCategory(bmiValue)}
          </p>
        ) : saved !== null && !heightCm ? (
          <p className="text-[12px] text-muted-foreground">Add your height in Settings to see BMI.</p>
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
  const { saved, flash } = useSavedFlash();

  function persist(b: string, w: string, q: typeof quality) {
    if (!b || !w) return; // both times required before anything saves
    setError(null);
    startTransition(async () => {
      const res = await setSleep({ date: today, bed_time: b, wake_time: w, quality: q });
      if (res.error) setError(res.error);
      else flash();
    });
  }

  const duration =
    bed && wake ? formatDuration(sleepDurationMinutes(bed, wake)) : "—";

  return (
    <section
      aria-label="Sleep"
      className={`${CARD_BASE} p-5 sm:p-6`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold tracking-tight">Sleep</h2>
        {saved ? <SavedFlash /> : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="bed-time" className="text-[13px] font-medium text-muted-foreground">
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
            className="tabular h-11 w-full rounded-xl bg-secondary px-3.5 text-[14px] text-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="wake-time" className="text-[13px] font-medium text-muted-foreground">
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
            className="tabular h-11 w-full rounded-xl bg-secondary px-3.5 text-[14px] text-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45"
          />
        </div>
      </div>
      <p className="tabular mt-3 text-[13px] text-muted-foreground">
        Duration: <strong className="text-foreground">{duration}</strong>
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
            className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-all duration-200 active:scale-[0.96] ${
              quality === q.value
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent-soft hover:text-accent"
            }`}
          >
            <span aria-hidden>{q.emoji}</span> {q.label}
          </button>
        ))}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[13px] font-medium text-danger">{error}</p>
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
  const { saved, flash } = useSavedFlash();
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
      else flash();
    });
  }

  return (
    <section
      aria-label="Mood"
      className={`${CARD_BASE} p-5 sm:p-6`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold tracking-tight">Mood</h2>
        {saved ? <SavedFlash /> : null}
      </div>
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
            className={`grid size-11 place-items-center rounded-full text-xl transition-all duration-200 active:scale-90 ${
              mood === m.value
                ? "bg-accent-soft ring-2 ring-accent"
                : "bg-secondary hover:bg-accent-soft"
            }`}
          >
            <span aria-hidden>{m.emoji}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="mood-note" className="text-[13px] font-medium text-muted-foreground">
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
          className="h-11 w-full rounded-xl bg-secondary px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45"
        />
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[13px] font-medium text-danger">{error}</p>
      ) : null}
    </section>
  );
}
