"use client";

import { useActionState, useState, useTransition } from "react";
import {
  createGoal,
  deleteGoal,
  setGoalCompleted,
  updateGoal,
  updateGoalProgress,
  type ActionState,
} from "./actions";
import { goalProgressPct } from "./progress";
import { PlusIcon, CheckIcon } from "@/components/ui/icons";

export type Goal = {
  id: string;
  label: string;
  target_value: number;
  current_value: number;
  start_value: number | null;
  unit: string | null;
  deadline: string | null;
  completed_at: string | null;
};

export function GoalBoard({ goals }: { goals: Goal[] }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const active = goals.filter((g) => !g.completed_at);
  const done = goals.filter((g) => g.completed_at);

  function complete(g: Goal) {
    setCelebrating(g.label);
    startTransition(() => void setGoalCompleted(g.id, true));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Goal-completion celebration — the one deliberately big moment (UX §1.19) */}
      {celebrating ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Goal completed"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper/95 px-6 text-center backdrop-blur-sm"
        >
          <div aria-hidden className="text-7xl">🎉</div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink">
            {celebrating} — done!
          </h2>
          <p className="mt-2 max-w-[40ch] text-sm text-ink-secondary">
            Goals like this are rare. Take a second — you earned it.
          </p>
          <button
            type="button"
            autoFocus
            onClick={() => setCelebrating(null)}
            className="mt-8 flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-on-primary shadow-rest transition hover:bg-primary-hover"
          >
            Keep going
          </button>
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-secondary">
          {active.length === 0
            ? "Nothing in flight."
            : `${active.length} in flight`}
        </p>
        <button
          type="button"
          onClick={() => {
            setAdding((v) => !v);
            setEditing(null);
          }}
          className="flex min-h-10 items-center gap-1.5 rounded-full bg-coral-500 px-4 text-xs font-semibold text-[#2a1a08] shadow-rest-xs transition hover:bg-coral-600"
        >
          <PlusIcon size={14} /> New goal
        </button>
      </div>

      {adding ? (
        <div className="rounded-card border border-hairline bg-elevated p-5 shadow-rest">
          <GoalForm action={createGoal} onDone={() => setAdding(false)} />
        </div>
      ) : null}

      {active.length === 0 && !adding ? (
        <div className="flex flex-col items-center gap-3 rounded-card border border-hairline bg-elevated p-8 text-center shadow-rest">
          <p className="text-sm text-ink-secondary">
            Set your first goal — anything you&apos;re working toward.
          </p>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-rest-xs transition hover:bg-primary-hover"
          >
            Set your first goal
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
        {active.map((g) => {
          const pct = goalProgressPct(g);
          return (
            <section
              key={g.id}
              aria-label={g.label}
              className="flex flex-col gap-3 rounded-card border border-hairline bg-elevated p-5 shadow-rest"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold tracking-tight text-ink">{g.label}</h2>
                <span className="tabular text-sm text-ink-muted">{pct}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${g.label} progress`}
                className="h-2.5 overflow-hidden rounded-full bg-sunken"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-[width] duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="tabular flex justify-between text-sm text-ink-muted">
                <span>
                  {g.current_value} / {g.target_value}
                  {g.unit ? ` ${g.unit}` : ""}
                </span>
                {g.deadline ? <span>Due {formatDeadline(g.deadline)}</span> : null}
              </div>
              <ProgressEditor goal={g} />
              <div className="mt-1 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => complete(g)}
                  className="flex min-h-9 items-center gap-1.5 rounded-full bg-success px-4 text-xs font-semibold text-on-success transition hover:opacity-90"
                >
                  <CheckIcon size={13} /> Mark complete
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(editing === g.id ? null : g.id)}
                  className="flex min-h-9 items-center rounded-full border border-hairline-strong px-4 text-xs font-semibold text-ink transition hover:bg-surface-hover"
                >
                  {editing === g.id ? "Close" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete "${g.label}"? This can't be undone.`)) {
                      startTransition(() => void deleteGoal(g.id));
                    }
                  }}
                  className="flex min-h-9 items-center rounded-full px-3 text-xs font-semibold text-ink-muted transition hover:bg-surface-hover hover:text-danger"
                >
                  Delete
                </button>
              </div>
              {editing === g.id ? (
                <div className="border-t border-hairline pt-4">
                  <GoalForm
                    goal={g}
                    action={updateGoal.bind(null, g.id)}
                    onDone={() => setEditing(null)}
                  />
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      {done.length > 0 ? (
        <section aria-label="Completed goals">
          <h2 className="mb-3 text-base font-semibold tracking-tight text-ink">
            Completed <span className="tabular text-sm font-normal text-ink-muted">{done.length}</span>
          </h2>
          <ul className="flex flex-col gap-2">
            {done.map((g) => (
              <li
                key={g.id}
                className="flex items-center gap-3 rounded-control border border-hairline bg-elevated px-4 py-3 opacity-75"
              >
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-success text-on-success">
                  <CheckIcon size={12} />
                </span>
                <span className="flex-1 text-sm font-medium text-ink-secondary">{g.label}</span>
                <button
                  type="button"
                  onClick={() => startTransition(() => void setGoalCompleted(g.id, false))}
                  className="text-xs font-semibold text-ink-muted hover:text-ink"
                >
                  Reopen
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function formatDeadline(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function ProgressEditor({ goal }: { goal: Goal }) {
  const [, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={`gp-${goal.id}`} className="text-xs font-medium text-ink-secondary">
        Update progress
      </label>
      <input
        id={`gp-${goal.id}`}
        type="number"
        step="any"
        defaultValue={goal.current_value}
        onBlur={(e) => {
          const v = Number(e.currentTarget.value);
          if (!Number.isNaN(v) && v !== goal.current_value) {
            startTransition(
              () => void updateGoalProgress({ id: goal.id, current_value: v })
            );
          }
        }}
        className="tabular min-h-9 w-28 rounded-field border-[1.5px] border-hairline-strong bg-elevated px-2 text-sm text-ink transition focus:border-teal-500 focus:shadow-focus-ring focus:outline-none"
      />
    </div>
  );
}

function GoalForm({
  goal,
  action,
  onDone,
}: {
  goal?: Goal;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (prev, fd) => {
      const res = await action(prev, fd);
      if (!res.error) onDone();
      return res;
    },
    {}
  );

  const input =
    "min-h-11 rounded-field border-[1.5px] border-hairline-strong bg-elevated px-3 text-base text-ink placeholder:text-ink-muted transition focus:border-teal-500 focus:shadow-focus-ring focus:outline-none";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="g-label" className="text-sm font-medium text-ink-secondary">Label</label>
        <input id="g-label" name="label" defaultValue={goal?.label} required maxLength={120} placeholder="e.g. Run a 10K" className={input} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="g-target" className="text-sm font-medium text-ink-secondary">Target value</label>
          <input id="g-target" name="target_value" type="number" step="any" required defaultValue={goal?.target_value} placeholder="10" className={`tabular ${input}`} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="g-current" className="text-sm font-medium text-ink-secondary">Current value</label>
          <input id="g-current" name="current_value" type="number" step="any" defaultValue={goal?.current_value ?? 0} className={`tabular ${input}`} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="g-unit" className="text-sm font-medium text-ink-secondary">Unit (optional)</label>
          <input id="g-unit" name="unit" defaultValue={goal?.unit ?? ""} maxLength={20} placeholder="books, lbs, $" className={input} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="g-deadline" className="text-sm font-medium text-ink-secondary">Deadline (optional)</label>
          <input id="g-deadline" name="deadline" type="date" defaultValue={goal?.deadline ?? ""} className={`tabular ${input}`} />
        </div>
      </div>
      {goal ? <input type="hidden" name="start_value" value={goal.start_value ?? ""} /> : null}
      {state.error ? (
        <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>
      ) : null}
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-rest-xs transition hover:bg-primary-hover disabled:opacity-45">
          {pending ? "Saving…" : goal ? "Save changes" : "Save goal"}
        </button>
        <button type="button" onClick={onDone} className="flex min-h-11 items-center rounded-full border border-hairline-strong px-5 text-sm font-semibold text-ink transition hover:bg-surface-hover">
          Cancel
        </button>
      </div>
    </form>
  );
}
