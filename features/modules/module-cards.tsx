"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  addNutrition,
  addWorkout,
  deleteNutrition,
  deleteWorkout,
  saveJournal,
} from "./actions";
import type { FoodResult } from "@/app/api/food-search/route";
import { ChevronDownIcon, PlusIcon, XIcon } from "@/components/ui/icons";
import { INPUT } from "@/components/ui/kit";
import { useSavedFlash } from "@/lib/use-saved-flash";

/* ---------- Shared collapsed-module shell (depth is opt-in) ---------- */

function ModuleCard({
  title,
  summary,
  defaultOpen = false,
  children,
}: {
  title: string;
  summary: string;
  /** Collapsed on the Daily page (retention order); open on its own page. */
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-e1)] ring-1 ring-border transition-shadow duration-200 open:shadow-[var(--shadow-e2)]"
    >
      <summary className="flex min-h-11 cursor-pointer select-none items-center gap-3 p-5 transition-colors duration-200 hover:bg-secondary/60 [&::-webkit-details-marker]:hidden">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        <span className="tabular flex-1 text-right text-[13px] text-muted-foreground group-open:invisible">
          {summary}
        </span>
        <ChevronDownIcon
          size={18}
          className="text-muted-foreground transition-transform duration-300 ease-[var(--ease-calm)] group-open:rotate-180"
        />
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}

const inputCls = INPUT;

/* ---------- Nutrition ---------- */

export type NutritionEntry = {
  id: string;
  food_name: string;
  calories: number;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
};

export function NutritionCard({
  today,
  entries,
  defaultOpen = false,
}: {
  today: string;
  entries: NutritionEntry[];
  defaultOpen?: boolean;
}) {
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<"idle" | "searching" | "done">("idle");
  const [searchDown, setSearchDown] = useState(false);
  const [manual, setManual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justLogged, setJustLogged] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loggedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    const q = query.trim();
    debounce.current = setTimeout(
      async () => {
        if (q.length < 2) {
          setResults([]);
          setSearchStatus("idle");
          return;
        }
        setSearchStatus("searching");
        try {
          const res = await fetch(`/api/food-search?q=${encodeURIComponent(q)}`);
          const data = (await res.json()) as { results: FoodResult[]; degraded?: boolean };
          setResults(data.results ?? []);
          setSearchDown(Boolean(data.degraded));
        } catch {
          setResults([]);
          setSearchDown(true);
        }
        setSearchStatus("done");
      },
      q.length < 2 ? 0 : 350
    );
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  function logFood(f: FoodResult) {
    setError(null);
    setQuery("");
    setResults([]);
    setSearchStatus("idle");
    setJustLogged(f.name);
    if (loggedTimer.current) clearTimeout(loggedTimer.current);
    loggedTimer.current = setTimeout(() => setJustLogged(null), 2500);
    startTransition(async () => {
      const res = await addNutrition({ date: today, ...f, food_name: f.name });
      if (res.error) {
        setError(res.error);
        setJustLogged(null);
      }
    });
  }

  const totals = entries.reduce(
    (t, e) => ({
      cal: t.cal + Number(e.calories ?? 0),
      protein: t.protein + Number(e.protein_g ?? 0),
      carbs: t.carbs + Number(e.carbs_g ?? 0),
      fat: t.fat + Number(e.fat_g ?? 0),
      fiber: t.fiber + Number(e.fiber_g ?? 0),
      sugar: t.sugar + Number(e.sugar_g ?? 0),
    }),
    { cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  );

  return (
    <ModuleCard
      title="Nutrition"
      defaultOpen={defaultOpen}
      summary={
        entries.length === 0
          ? "Nothing yet — tap to log food"
          : `${Math.round(totals.cal).toLocaleString()} cal logged`
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="food-q" className="text-[13px] font-medium text-muted-foreground">
            Log food
          </label>
          <input
            id="food-q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods…"
            className={inputCls}
          />
          {searchDown ? (
            <p className="text-[12px] text-muted-foreground">
              Search is unavailable right now — log manually below instead.
            </p>
          ) : null}
          <p aria-live="polite" className={`text-xs ${justLogged ? "font-medium text-accent" : "text-muted-foreground"} ${searchStatus === "searching" || justLogged ? "" : "sr-only"}`}>
            {justLogged ? `Added ${justLogged}.` : searchStatus === "searching" ? "Searching…" : ""}
          </p>
        </div>

        {results.length > 0 ? (
          <ul className="flex flex-col divide-y divide-border rounded-2xl ring-1 ring-border">
            {results.map((f) => (
              <li key={`${f.source}-${f.source_ref}-${f.name}`}>
                <button
                  type="button"
                  onClick={() => logFood(f)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-secondary"
                >
                  <span className="min-w-0 flex-1 truncate text-[14px] font-medium">
                    {f.name}
                  </span>
                  <span className="tabular flex-none text-[12px] text-muted-foreground">
                    {f.calories} cal
                  </span>
                  <PlusIcon size={14} className="flex-none text-accent" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {query.trim().length >= 2 && searchStatus === "done" && results.length === 0 && !searchDown ? (
          <p className="text-[12px] text-muted-foreground">
            No matches — log it manually below.
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => setManual((v) => !v)}
          aria-expanded={manual}
          className="self-start rounded-lg px-1 py-0.5 text-[13px] font-medium text-accent transition-opacity hover:opacity-70"
        >
          {manual ? "Hide manual entry" : "Log manually instead"}
        </button>
        {manual ? <ManualFood today={today} onDone={() => setManual(false)} /> : null}

        {entries.length > 0 ? (
          <>
            <ul className="flex flex-col divide-y divide-border">
              {entries.map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-[14px]">
                    {e.food_name}
                  </span>
                  <span className="tabular flex-none text-[12px] text-muted-foreground">
                    {Math.round(Number(e.calories))} cal
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${e.food_name}`}
                    onClick={() =>
                      startTransition(() => void deleteNutrition(e.id))
                    }
                    className="grid size-9 flex-none place-items-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-danger/10 hover:text-danger active:scale-90"
                  >
                    <XIcon size={13} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="tabular grid grid-cols-4 gap-2 rounded-control bg-secondary p-3 text-center">
              {(
                [
                  ["Cal", Math.round(totals.cal).toLocaleString()],
                  ["Protein", `${Math.round(totals.protein)}g`],
                  ["Carbs", `${Math.round(totals.carbs)}g`],
                  ["Fat", `${Math.round(totals.fat)}g`],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <div className="text-[12px] text-muted-foreground">{label}</div>
                  <strong className="text-[14px]">{value}</strong>
                </div>
              ))}
            </div>
            <details>
              <summary className="cursor-pointer text-[13px] text-muted-foreground">
                Advanced (fiber, sugar)
              </summary>
              <div className="tabular mt-2 grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-[12px] text-muted-foreground">Fiber</div>
                  <strong className="text-[14px]">{Math.round(totals.fiber)}g</strong>
                </div>
                <div>
                  <div className="text-[12px] text-muted-foreground">Sugar</div>
                  <strong className="text-[14px]">{Math.round(totals.sugar)}g</strong>
                </div>
              </div>
            </details>
          </>
        ) : null}

        {error ? (
          <p role="alert" className="text-sm font-medium text-danger">{error}</p>
        ) : null}
      </div>
    </ModuleCard>
  );
}

function ManualFood({ today, onDone }: { today: string; onDone: () => void }) {
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    setError(null);
    startTransition(async () => {
      const res = await addNutrition({
        date: today,
        food_name: fd.get("food_name"),
        calories: fd.get("calories") || 0,
        protein_g: fd.get("protein_g") || 0,
        carbs_g: fd.get("carbs_g") || 0,
        fat_g: fd.get("fat_g") || 0,
        source: "manual",
      });
      if (res.error) setError(res.error);
      else {
        formRef.current?.reset();
        onDone();
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={submit} className="flex flex-col gap-3 rounded-2xl ring-1 ring-border p-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="mf-name" className="text-[13px] font-medium text-muted-foreground">Food</label>
        <input id="mf-name" name="food_name" required maxLength={200} placeholder="e.g. Chicken rice bowl" className={inputCls} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {(
          [
            ["calories", "Cal"],
            ["protein_g", "Protein"],
            ["carbs_g", "Carbs"],
            ["fat_g", "Fat"],
          ] as const
        ).map(([name, label]) => (
          <div key={name} className="flex flex-col gap-1">
            <label htmlFor={`mf-${name}`} className="text-[12px] font-medium text-muted-foreground">{label}</label>
            <input id={`mf-${name}`} name={name} type="number" min="0" step="any" placeholder="0" className={`tabular ${inputCls} min-h-10 px-2 text-sm`} />
          </div>
        ))}
      </div>
      {error ? <p role="alert" className="text-sm font-medium text-danger">{error}</p> : null}
      <button type="submit" className="flex min-h-10 items-center self-start rounded-full bg-primary px-5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover">
        Add food
      </button>
    </form>
  );
}

/* ---------- Workout ---------- */

export type WorkoutEntry = {
  id: string;
  kind: "strength" | "cardio";
  name: string;
  sets: number | null;
  reps: number | null;
  weight_kg: number | null;
  distance_km: number | null;
  duration_minutes: number | null;
};

export function WorkoutCard({
  today,
  entries,
}: {
  today: string;
  entries: WorkoutEntry[];
}) {
  const [, startTransition] = useTransition();
  const [kind, setKind] = useState<"strength" | "cardio">("strength");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    setError(null);
    startTransition(async () => {
      const res = await addWorkout({
        date: today,
        kind,
        name: fd.get("name"),
        sets: fd.get("sets") || undefined,
        reps: fd.get("reps") || undefined,
        weight_kg: fd.get("weight_kg") || undefined,
        distance_km: fd.get("distance_km") || undefined,
        duration_minutes: fd.get("duration_minutes") || undefined,
      });
      if (res.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <ModuleCard
      title="Workout"
      summary={
        entries.length === 0
          ? "None yet — tap to log a workout"
          : `${entries.length} exercise${entries.length > 1 ? "s" : ""} logged`
      }
    >
      <div className="flex flex-col gap-4">
        {entries.length > 0 ? (
          <ul className="flex flex-col divide-y divide-border">
            {entries.map((w) => (
              <li key={w.id} className="flex items-center gap-3 py-2">
                <span className="min-w-0 flex-1 truncate text-[14px]">{w.name}</span>
                <span className="tabular flex-none text-[12px] text-muted-foreground">
                  {w.kind === "strength"
                    ? [w.sets && `${w.sets}×${w.reps ?? "?"}`, w.weight_kg && `${w.weight_kg}kg`]
                        .filter(Boolean)
                        .join(" · ")
                    : [w.distance_km && `${w.distance_km}km`, w.duration_minutes && `${w.duration_minutes}min`]
                        .filter(Boolean)
                        .join(" · ")}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${w.name}`}
                  onClick={() => startTransition(() => void deleteWorkout(w.id))}
                  className="grid size-9 flex-none place-items-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-danger/10 hover:text-danger active:scale-90"
                >
                  <XIcon size={13} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div role="group" aria-label="Workout type" className="flex gap-2">
          {(["strength", "cardio"] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={`flex min-h-9 items-center rounded-full border px-4 text-xs font-semibold capitalize transition ${
                kind === k
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent-soft hover:text-accent"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <form ref={formRef} onSubmit={submit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="wk-name" className="text-[13px] font-medium text-muted-foreground">Exercise</label>
            <input id="wk-name" name="name" required maxLength={120} placeholder={kind === "strength" ? "e.g. Bench press" : "e.g. Evening run"} className={inputCls} />
          </div>
          {kind === "strength" ? (
            <div className="grid grid-cols-3 gap-2">
              <NumField name="sets" label="Sets" />
              <NumField name="reps" label="Reps" />
              <NumField name="weight_kg" label="Weight (kg)" step="any" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <NumField name="distance_km" label="Distance (km)" step="any" />
              <NumField name="duration_minutes" label="Duration (min)" />
            </div>
          )}
          {error ? <p role="alert" className="text-sm font-medium text-danger">{error}</p> : null}
          <button type="submit" className="flex min-h-10 items-center gap-1.5 self-start rounded-full bg-coral-500 px-5 text-sm font-semibold text-[#2a1a08] transition hover:bg-coral-600">
            <PlusIcon size={14} /> Log {kind}
          </button>
        </form>
      </div>
    </ModuleCard>
  );
}

function NumField({ name, label, step }: { name: string; label: string; step?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={`wk-${name}`} className="text-[12px] font-medium text-muted-foreground">{label}</label>
      <input id={`wk-${name}`} name={name} type="number" min="0" step={step ?? "1"} className={`tabular ${inputCls} min-h-10 px-2 text-sm`} />
    </div>
  );
}

/* ---------- Journal ---------- */

export function JournalCard({
  today,
  initialBody,
}: {
  today: string;
  initialBody: string;
}) {
  const [, startTransition] = useTransition();
  const { saved, flash } = useSavedFlash(2000);
  const [error, setError] = useState<string | null>(null);

  function persist(body: string) {
    setError(null);
    startTransition(async () => {
      const res = await saveJournal({ date: today, body });
      if (res.error) setError(res.error);
      else flash();
    });
  }

  return (
    <ModuleCard title="Journal" summary={initialBody ? "Entry saved" : "No entry yet — tap to write"}>
      <div className="flex flex-col gap-3">
        <label htmlFor="journal-body" className="text-[13px] font-medium text-muted-foreground">
          Today&apos;s thoughts
        </label>
        <textarea
          id="journal-body"
          defaultValue={initialBody}
          onBlur={(e) => {
            if (e.currentTarget.value !== initialBody) persist(e.currentTarget.value);
          }}
          placeholder="Win of the day, gratitude, lesson learned — whatever's on your mind. All optional."
          className="min-h-28 resize-y rounded-2xl bg-secondary p-3.5 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45"
        />
        <p aria-live="polite" className="text-[12px] text-muted-foreground">
          {saved ? "Saved." : "Saves when you click away."}
        </p>
        {error ? <p role="alert" className="text-sm font-medium text-danger">{error}</p> : null}
      </div>
    </ModuleCard>
  );
}
