"use client";

import { useActionState, useState, useTransition } from "react";
import {
  createHabit,
  moveHabit,
  setHabitArchived,
  updateHabit,
  type ActionState,
} from "./actions";
import { HabitIcon, PlusIcon } from "@/components/ui/icons";
import type { HabitRow } from "@/lib/api-types/db";

type ManagedHabit = Pick<
  HabitRow,
  "id" | "name" | "icon" | "color" | "frequency_count" | "frequency_period" | "in_quick_log" | "archived_at"
>;

export function HabitManager({ habits }: { habits: ManagedHabit[] }) {
  const active = habits.filter((h) => !h.archived_at);
  const archived = habits.filter((h) => h.archived_at);
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [, startTransition] = useTransition();

  const quickLogCount = active.filter((h) => h.in_quick_log).length;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-card border border-hairline bg-elevated p-5 shadow-rest">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            Active habits{" "}
            <span className="tabular text-sm font-normal text-ink-muted">
              {active.length}
            </span>
          </h2>
          <button
            type="button"
            onClick={() => {
              setAdding((v) => !v);
              setEditing(null);
            }}
            className="flex min-h-9 items-center gap-1.5 rounded-full bg-coral-500 px-4 text-xs font-semibold text-[#2a1a08] transition hover:bg-coral-600"
          >
            <PlusIcon size={14} /> New habit
          </button>
        </div>

        {adding ? (
          <HabitForm
            key="new"
            action={createHabit}
            onDone={() => setAdding(false)}
            quickLogFull={quickLogCount >= 6}
          />
        ) : null}

        {active.length === 0 && !adding ? (
          <p className="py-6 text-center text-sm text-ink-secondary">
            No habits yet — add your first to start the loop.
          </p>
        ) : null}

        <ul className="flex flex-col gap-2">
          {active.map((h, i) => (
            <li key={h.id} className="rounded-control border border-hairline">
              <div className="flex items-center gap-3 px-4 py-3">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 flex-none rounded-full"
                  style={{ background: h.color ?? "var(--lw-teal-500)" }}
                />
                <HabitIcon name={h.icon} size={18} className="flex-none text-ink-muted" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink">{h.name}</div>
                  <div className="text-xs text-ink-muted">
                    {h.frequency_count}×/{h.frequency_period}
                    {h.in_quick_log ? " · Quick Log" : ""}
                  </div>
                </div>
                <div className="flex flex-none items-center gap-1">
                  <IconBtn
                    label={`Move ${h.name} up`}
                    disabled={i === 0}
                    onClick={() => startTransition(() => void moveHabit(h.id, "up"))}
                  >
                    ↑
                  </IconBtn>
                  <IconBtn
                    label={`Move ${h.name} down`}
                    disabled={i === active.length - 1}
                    onClick={() => startTransition(() => void moveHabit(h.id, "down"))}
                  >
                    ↓
                  </IconBtn>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(editing === h.id ? null : h.id);
                      setAdding(false);
                    }}
                    className="flex min-h-9 items-center rounded-full border border-hairline-strong px-3 text-xs font-semibold text-ink transition hover:bg-surface-hover"
                  >
                    {editing === h.id ? "Close" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => startTransition(() => void setHabitArchived(h.id, true))}
                    className="flex min-h-9 items-center rounded-full px-3 text-xs font-semibold text-ink-muted transition hover:bg-surface-hover hover:text-ink"
                  >
                    Archive
                  </button>
                </div>
              </div>
              {editing === h.id ? (
                <div className="border-t border-hairline px-4 py-4">
                  <HabitForm
                    key={h.id}
                    habit={h}
                    action={updateHabit.bind(null, h.id)}
                    onDone={() => setEditing(null)}
                    quickLogFull={quickLogCount >= 6 && !h.in_quick_log}
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {archived.length > 0 ? (
        <section className="rounded-card border border-hairline bg-elevated p-5 shadow-rest">
          <button
            type="button"
            onClick={() => setShowArchived((v) => !v)}
            aria-expanded={showArchived}
            className="flex w-full items-center justify-between text-base font-semibold tracking-tight text-ink"
          >
            Archived{" "}
            <span className="tabular text-sm font-normal text-ink-muted">
              {archived.length}
            </span>
          </button>
          {showArchived ? (
            <ul className="mt-4 flex flex-col gap-2">
              {archived.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center gap-3 rounded-control border border-hairline px-4 py-3 opacity-70"
                >
                  <HabitIcon name={h.icon} size={18} className="flex-none text-ink-muted" />
                  <span className="flex-1 text-sm font-medium text-ink-secondary">
                    {h.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => startTransition(() => void setHabitArchived(h.id, false))}
                    className="flex min-h-9 items-center rounded-full border border-hairline-strong px-3 text-xs font-semibold text-ink transition hover:bg-surface-hover"
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function IconBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong text-sm text-ink-secondary transition hover:bg-surface-hover disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function HabitForm({
  habit,
  action,
  onDone,
  quickLogFull,
}: {
  habit?: ManagedHabit;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  onDone: () => void;
  quickLogFull: boolean;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (prev, fd) => {
      const res = await action(prev, fd);
      if (!res.error) onDone();
      return res;
    },
    {}
  );

  return (
    <form action={formAction} className="mb-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="hb-name" className="text-sm font-medium text-ink-secondary">
          Name
        </label>
        <input
          id="hb-name"
          name="name"
          defaultValue={habit?.name}
          required
          maxLength={80}
          placeholder="e.g. Morning walk"
          className="min-h-11 rounded-field border-[1.5px] border-hairline-strong bg-elevated px-3 text-base text-ink placeholder:text-ink-muted transition focus:border-teal-500 focus:shadow-focus-ring focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="hb-count" className="text-sm font-medium text-ink-secondary">
            How often
          </label>
          <input
            id="hb-count"
            name="frequency_count"
            type="number"
            min={1}
            max={31}
            defaultValue={habit?.frequency_count ?? 7}
            className="min-h-11 rounded-field border-[1.5px] border-hairline-strong bg-elevated px-3 text-base text-ink transition focus:border-teal-500 focus:shadow-focus-ring focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hb-period" className="text-sm font-medium text-ink-secondary">
            Per
          </label>
          <select
            id="hb-period"
            name="frequency_period"
            defaultValue={habit?.frequency_period ?? "week"}
            className="min-h-11 rounded-field border-[1.5px] border-hairline-strong bg-elevated px-3 text-base text-ink transition focus:border-teal-500 focus:shadow-focus-ring focus:outline-none"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-secondary">
        <input
          type="checkbox"
          name="in_quick_log"
          defaultChecked={habit?.in_quick_log}
          disabled={quickLogFull}
          className="h-4 w-4 accent-[var(--lw-teal-500)]"
        />
        Show in Quick Log bar{quickLogFull ? " (bar is full — max 6)" : ""}
      </label>
      {state.error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {state.error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-11 items-center rounded-full bg-teal-500 px-5 text-sm font-semibold text-white shadow-rest-xs transition hover:bg-teal-600 disabled:opacity-45"
        >
          {pending ? "Saving…" : habit ? "Save changes" : "Add habit"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex min-h-11 items-center rounded-full border border-hairline-strong px-5 text-sm font-semibold text-ink transition hover:bg-surface-hover"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
