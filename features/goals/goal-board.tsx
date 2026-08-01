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
import {
  CARD_BASE,
  EmptyState,
  LoopIllustration,
  buttonClass,
} from "@/components/ui/kit";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DatePicker } from "@/components/ui/date-picker";

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
  const [deleting, setDeleting] = useState<Goal | null>(null);
  const [, startTransition] = useTransition();

  const active = goals.filter((g) => !g.completed_at);
  const done = goals.filter((g) => g.completed_at);

  function complete(g: Goal) {
    setCelebrating(g.label);
    startTransition(() => void setGoalCompleted(g.id, true));
  }

  return (
    <div className="flex flex-col gap-6">
      <ConfirmDialog
        open={deleting !== null}
        title={`Delete "${deleting?.label ?? ""}"?`}
        body="This removes the goal and its progress. It can't be undone."
        confirmLabel="Delete goal"
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          const id = deleting!.id;
          setDeleting(null);
          startTransition(() => void deleteGoal(id));
        }}
      />

      {/* Goal-completion celebration — the one deliberately big moment (UX §1.19) */}
      {celebrating ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Goal completed"
          className="scrim-in fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas/95 px-6 text-center backdrop-blur-sm"
        >
          <div aria-hidden className="check-pop text-7xl">
            🎉
          </div>
          <h2 className="rise mt-5 text-[28px] font-medium leading-tight tracking-[-0.015em] sm:text-[32px]">
            {celebrating} — done!
          </h2>
          <p className="rise mt-3 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
            Goals like this are rare. Take a second — you earned it.
          </p>
          <button
            type="button"
            autoFocus
            onClick={() => setCelebrating(null)}
            className={`${buttonClass("primary")} mt-8`}
          >
            Keep going
          </button>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <p className="tabular text-[13px] text-muted-foreground">
          {active.length === 0
            ? "Nothing in flight."
            : `${active.length} in flight`}
        </p>
        <button
          type="button"
          aria-expanded={adding}
          onClick={() => {
            setAdding((v) => !v);
            setEditing(null);
          }}
          className={buttonClass("primary", "sm")}
        >
          <PlusIcon size={14} /> New goal
        </button>
      </div>

      {adding ? (
        <div className={`${CARD_BASE} rise p-5 sm:p-6`}>
          <GoalForm action={createGoal} onDone={() => setAdding(false)} />
        </div>
      ) : null}

      {active.length === 0 && !adding ? (
        <EmptyState
          illustration={<LoopIllustration />}
          title="Set your first goal"
          body="Goals are the bigger arcs behind your daily habits — a distance to run, a book count, a weight to reach. Give one a target and Loopwell tracks the gap for you."
          action={
            <button
              type="button"
              onClick={() => setAdding(true)}
              className={buttonClass("primary")}
            >
              Create your first goal
            </button>
          }
        />
      ) : null}

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
        {active.map((g) => {
          const pct = goalProgressPct(g);
          return (
            <section
              key={g.id}
              aria-label={g.label}
              className={`${CARD_BASE} lift flex flex-col gap-3 p-5 sm:p-6`}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[15px] font-semibold tracking-tight">{g.label}</h2>
                <span className="tabular text-[13px] text-muted-foreground">{pct}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${g.label} progress`}
                className="h-2 overflow-hidden rounded-full bg-secondary"
              >
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-700 ease-[var(--ease-calm)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="tabular flex justify-between text-[13px] text-muted-foreground">
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
                  className={buttonClass("primary", "sm")}
                >
                  <CheckIcon size={13} /> Mark complete
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(editing === g.id ? null : g.id)}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary px-3.5 text-[13px] font-medium text-secondary-foreground transition-all duration-200 hover:bg-accent-soft hover:text-accent active:scale-[0.97]"
                >
                  {editing === g.id ? "Close" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(g)}
                  className={buttonClass("quiet", "sm", "hover:!text-danger")}
                >
                  Delete
                </button>
              </div>
              {editing === g.id ? (
                <div className="rise border-t border-border pt-4">
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
          <h2 className="mb-3 text-[15px] font-semibold tracking-tight">
            Completed <span className="tabular text-[13px] font-normal text-muted-foreground">{done.length}</span>
          </h2>
          <ul className="flex flex-col gap-2">
            {done.map((g) => (
              <li
                key={g.id}
                className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 ring-1 ring-border transition-opacity duration-200 hover:opacity-100 opacity-80"
              >
                <span className="grid size-6 flex-none place-items-center rounded-full bg-accent text-accent-foreground">
                  <CheckIcon size={12} />
                </span>
                <span className="flex-1 text-[13px] font-medium text-muted-foreground">{g.label}</span>
                <button
                  type="button"
                  onClick={() => startTransition(() => void setGoalCompleted(g.id, false))}
                  className="rounded-full px-2 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
      <label htmlFor={`gp-${goal.id}`} className="text-[12px] font-medium text-muted-foreground">
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
        className="tabular h-10 w-28 rounded-xl bg-secondary px-3 text-[13px] text-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45"
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
    "h-11 w-full rounded-xl bg-secondary px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="g-label" className="text-[13px] font-medium text-muted-foreground">Label</label>
        <input id="g-label" name="label" defaultValue={goal?.label} required maxLength={120} placeholder="e.g. Run a 10K" className={input} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="g-target" className="text-[13px] font-medium text-muted-foreground">Target value</label>
          <input id="g-target" name="target_value" type="number" step="any" required defaultValue={goal?.target_value} placeholder="10" className={`tabular ${input}`} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="g-current" className="text-[13px] font-medium text-muted-foreground">Current value</label>
          <input id="g-current" name="current_value" type="number" step="any" defaultValue={goal?.current_value ?? 0} className={`tabular ${input}`} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="g-unit" className="text-[13px] font-medium text-muted-foreground">Unit (optional)</label>
          <input id="g-unit" name="unit" defaultValue={goal?.unit ?? ""} maxLength={20} placeholder="books, lbs, $" className={input} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="g-deadline" className="text-[13px] font-medium text-muted-foreground">Deadline (optional)</label>
          <DatePicker id="g-deadline" name="deadline" defaultValue={goal?.deadline ?? ""} placeholder="No deadline" />
        </div>
      </div>
      {goal ? <input type="hidden" name="start_value" value={goal.start_value ?? ""} /> : null}
      {state.error ? (
        <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>
      ) : null}
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-[var(--shadow-e1)] transition hover:bg-primary-hover disabled:opacity-45">
          {pending ? "Saving…" : goal ? "Save changes" : "Save goal"}
        </button>
        <button type="button" onClick={onDone} className={buttonClass("ghost")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
