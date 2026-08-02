"use client";

import { useOptimistic, useRef, useTransition, useState } from "react";
import Link from "next/link";
import { Check, CircleDashed, Flame, SkipForward } from "lucide-react";
import { setHabitState } from "./actions";
import { useHydrated } from "@/lib/use-hydrated";
import { currentStreak, type HabitState } from "./streak";
import { HabitIcon } from "@/components/ui/icons";

export type DailyHabit = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  in_quick_log: boolean;
  todayState: HabitState | null;
  /** date → state, full history for streak display */
  logs: [string, HabitState][];
};

type Optimistic = Record<string, HabitState | null>;

const META: Record<HabitState, string> = {
  complete: "Complete",
  partial: "Partial — counts, streak holds",
  skip: "Skipped — streak holds",
};

/**
 * The core loop: Quick Log chips + tri-state checklist, optimistic per the
 * UX spec (~100ms local feedback; failed sync rolls back with a message).
 * Complete is the one-tap circle; Partial and Skip stay available but quiet.
 */
export function HabitList({
  habits,
  today,
}: {
  habits: DailyHabit[];
  today: string;
}) {
  const hydrated = useHydrated();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pulse, setPulse] = useState<string | null>(null);
  const [optimistic, applyOptimistic] = useOptimistic<
    Optimistic,
    { id: string; state: HabitState | null }
  >({}, (prev, { id, state }) => ({ ...prev, [id]: state }));
  // Per-habit write queue: rapid tap-tap-tap must land in the DB in click
  // order, or the last *response* (not the last click) would silently win.
  const chains = useRef<Record<string, Promise<unknown>>>({});

  function stateOf(h: DailyHabit): HabitState | null {
    return h.id in optimistic ? optimistic[h.id] : h.todayState;
  }

  function toggle(h: DailyHabit, next: HabitState) {
    const target = stateOf(h) === next ? null : next;
    setError(null);
    if (target === "complete") setPulse(h.id); // completion is the moment worth animating
    startTransition(() => {
      applyOptimistic({ id: h.id, state: target });
    });
    const prior = chains.current[h.id] ?? Promise.resolve();
    const call = prior.then(() =>
      setHabitState({ habit_id: h.id, date: today, state: target })
    );
    chains.current[h.id] = call;
    call.then((res) => {
      // Only surface an error if this is still the most recent tap —
      // an older, since-superseded response shouldn't override newer state.
      if (chains.current[h.id] === call && res.error) setError(res.error);
    });
  }

  const quickLog = habits.filter((h) => h.in_quick_log).slice(0, 6);
  const done = habits.filter((h) => stateOf(h) === "complete").length;

  return (
    <section aria-label="Today's habits" className="space-y-4 lg:col-span-7">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[17px] font-semibold tracking-tight">
          Today&apos;s habits
        </h2>
        <span className="tabular text-[13px] text-muted-foreground">
          {done} of {habits.length} done ·{" "}
          <Link
            href="/dashboard/settings/habits"
            className="-my-2 inline-flex min-h-11 items-center py-2 font-medium text-accent transition-opacity hover:opacity-70"
          >
            Manage
          </Link>
        </span>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-2xl bg-danger/10 px-4 py-2.5 text-[13px] font-medium text-danger"
        >
          {error}
        </p>
      ) : null}

      {quickLog.length > 0 ? (
        <div
          role="group"
          aria-label="Quick log"
          className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          {quickLog.map((h) => {
            const pressed = stateOf(h) === "complete";
            return (
              <button
                key={h.id}
                type="button"
                aria-pressed={pressed}
                disabled={!hydrated}
                onClick={() => toggle(h, "complete")}
                className={`inline-flex h-10 flex-none items-center gap-2 rounded-full px-3.5 text-[13px] font-medium transition-all duration-200 active:scale-[0.97] disabled:cursor-wait disabled:opacity-60 ${
                  pressed
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent-soft hover:text-accent"
                }`}
              >
                <HabitIcon name={h.icon} size={16} />
                {h.name}
              </button>
            );
          })}
        </div>
      ) : null}

      <ul className="space-y-2.5">
        {habits.map((h) => {
          const logs = new Map(h.logs);
          const state = stateOf(h);
          if (state === null) logs.delete(today);
          else logs.set(today, state);
          const streak = currentStreak(logs, today);
          const complete = state === "complete";

          return (
            <li key={h.id}>
              <div
                className={`lift group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl p-4 ring-1 sm:p-5 ${
                  complete
                    ? "bg-accent-soft/60 ring-accent-line/60"
                    : "bg-surface shadow-[var(--shadow-e1)] ring-border"
                }`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={complete}
                    aria-label={`${h.name} — mark complete`}
                    disabled={!hydrated}
                    onClick={() => toggle(h, "complete")}
                    onAnimationEnd={() => setPulse((p) => (p === h.id ? null : p))}
                    /* before:-inset-2.5 gives the 24px circle a 44px hit area
                       without changing the layout (iOS HIG minimum) */
                    className={`relative grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-200 before:absolute before:-inset-2.5 before:content-[''] active:scale-90 disabled:cursor-wait ${
                      pulse === h.id ? "check-pop" : ""
                    } ${
                      complete
                        ? "border-accent bg-accent"
                        : "border-border-strong group-hover:border-accent"
                    }`}
                  >
                    <Check
                      aria-hidden
                      strokeWidth={2.75}
                      className={`size-3.5 text-accent-foreground transition-opacity duration-200 ${
                        complete ? "opacity-100" : "opacity-0"
                      } ${pulse === h.id && complete ? "check-draw" : ""}`}
                    />
                  </button>
                  <div className="min-w-0">
                    <p
                      className={`truncate text-[14px] font-medium transition-colors ${
                        complete ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {h.name}
                    </p>
                    <p className="truncate text-[12px] text-muted-foreground">
                      {state ? META[state] : "Not logged yet"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <StateButton
                    label={`${h.name} — mark partial`}
                    active={state === "partial"}
                    disabled={!hydrated}
                    onClick={() => toggle(h, "partial")}
                  >
                    <CircleDashed aria-hidden className="size-4" />
                  </StateButton>
                  <StateButton
                    label={`${h.name} — mark skipped`}
                    active={state === "skip"}
                    disabled={!hydrated}
                    onClick={() => toggle(h, "skip")}
                  >
                    <SkipForward aria-hidden className="size-4" />
                  </StateButton>
                  {streak > 0 ? (
                    <span className="tabular ml-1 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[12px] font-medium text-secondary-foreground">
                      <Flame aria-hidden className="size-3.5 text-accent" />
                      {streak}d
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StateButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`relative grid size-9 place-items-center rounded-full transition-all duration-200 before:absolute before:-inset-1 before:content-[''] active:scale-90 disabled:cursor-wait disabled:opacity-60 ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
