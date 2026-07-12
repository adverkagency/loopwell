"use client";

import { useOptimistic, useTransition, useState } from "react";
import { setHabitState } from "./actions";
import { currentStreak, type HabitState } from "./streak";
import {
  CheckIcon,
  FlameIcon,
  HalfIcon,
  HabitIcon,
  XIcon,
} from "@/components/ui/icons";

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

/**
 * The core loop: Quick Log chips + tri-state checklist, optimistic per the
 * UX spec (~100ms local feedback; failed sync rolls back with a message).
 */
export function HabitList({
  habits,
  today,
}: {
  habits: DailyHabit[];
  today: string;
}) {
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [optimistic, applyOptimistic] = useOptimistic<
    Optimistic,
    { id: string; state: HabitState | null }
  >({}, (prev, { id, state }) => ({ ...prev, [id]: state }));

  function stateOf(h: DailyHabit): HabitState | null {
    return h.id in optimistic ? optimistic[h.id] : h.todayState;
  }

  function toggle(h: DailyHabit, next: HabitState) {
    const target = stateOf(h) === next ? null : next;
    setError(null);
    startTransition(async () => {
      applyOptimistic({ id: h.id, state: target });
      const res = await setHabitState({
        habit_id: h.id,
        date: today,
        state: target,
      });
      if (res.error) setError(res.error); // revalidate restores server truth
    });
  }

  const quickLog = habits.filter((h) => h.in_quick_log).slice(0, 6);
  const done = habits.filter((h) => stateOf(h) !== null).length;

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <p role="alert" className="rounded-field bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      {quickLog.length > 0 ? (
        <section
          aria-label="Quick log"
          className="rounded-card border border-hairline bg-elevated p-5 shadow-rest"
        >
          <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">Quick Log</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickLog.map((h) => {
              const pressed = stateOf(h) === "complete";
              return (
                <button
                  key={h.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => toggle(h, "complete")}
                  className={`flex min-h-11 min-w-[84px] flex-none flex-col items-center gap-2 rounded-control border-[1.5px] px-4 py-3 text-xs font-medium transition active:scale-[0.96] ${
                    pressed
                      ? "border-teal-400 bg-teal-50 text-teal-700"
                      : "border-hairline bg-elevated text-ink-secondary hover:border-teal-400"
                  }`}
                >
                  <HabitIcon name={h.icon} size={24} className={pressed ? "text-teal-600" : "text-ink-muted"} />
                  {h.name}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section
        aria-label="Today's habits"
        className="rounded-card border border-hairline bg-elevated p-5 shadow-rest"
      >
        <h2 className="mb-4 flex items-center justify-between text-base font-semibold tracking-tight text-ink">
          Today&apos;s Habits
          <span className="tabular text-sm font-normal text-ink-muted">
            {done}/{habits.length}
          </span>
        </h2>
        <ul className="flex flex-col gap-2">
          {habits.map((h) => {
            const logs = new Map(h.logs);
            const opt = stateOf(h);
            if (opt === null) logs.delete(today);
            else if (opt) logs.set(today, opt);
            const streak = currentStreak(logs, today);
            const state = stateOf(h);

            return (
              <li
                key={h.id}
                className="flex items-center gap-3 rounded-control border border-hairline bg-elevated px-4 py-3 transition hover:border-hairline-strong hover:bg-surface-hover"
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 flex-none rounded-full"
                  style={{ background: h.color ?? "var(--lw-teal-500)" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink">{h.name}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                    {streak > 0 ? (
                      <>
                        <FlameIcon size={13} className="text-coral-600" />
                        <span className="tabular">{streak}-day streak</span>
                      </>
                    ) : (
                      "No streak yet"
                    )}
                  </div>
                </div>
                <div
                  role="group"
                  aria-label={`${h.name} status`}
                  className="flex flex-none gap-2"
                >
                  <StateButton
                    label="Mark complete"
                    active={state === "complete"}
                    activeCls="bg-success border-success text-white"
                    onClick={() => toggle(h, "complete")}
                  >
                    <CheckIcon size={16} />
                  </StateButton>
                  <StateButton
                    label="Mark partial"
                    active={state === "partial"}
                    activeCls="bg-partial border-partial text-[#3a2c05]"
                    onClick={() => toggle(h, "partial")}
                  >
                    <HalfIcon size={16} />
                  </StateButton>
                  <StateButton
                    label="Mark skipped"
                    active={state === "skip"}
                    activeCls="bg-skip border-skip text-[#3b382e]"
                    onClick={() => toggle(h, "skip")}
                  >
                    <XIcon size={16} />
                  </StateButton>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function StateButton({
  label,
  active,
  activeCls,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  activeCls: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] transition active:scale-90 ${
        active
          ? activeCls
          : "border-hairline-strong bg-elevated text-ink-muted hover:border-ink-muted hover:text-ink-secondary"
      }`}
    >
      {children}
    </button>
  );
}
