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
import { CARD_BASE, LoopIllustration, buttonClass } from "@/components/ui/kit";
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
      <section className={`${CARD_BASE} p-5 sm:p-6`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight">
            Active habits{" "}
            <span className="tabular text-[13px] font-normal text-muted-foreground">
              {active.length}
            </span>
          </h2>
          <button
            type="button"
            onClick={() => {
              setAdding((v) => !v);
              setEditing(null);
            }}
            className={buttonClass("primary", "sm")}
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
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <LoopIllustration className="h-24" />
            <div className="max-w-[38ch] space-y-1.5">
              <p className="text-[15px] font-semibold tracking-tight">
                No habits yet
              </p>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                One habit is enough to start the loop — you can add more once it
                sticks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className={buttonClass("primary")}
            >
              Create your first habit
            </button>
          </div>
        ) : null}

        <ul className="flex flex-col gap-2">
          {active.map((h, i) => (
            <li key={h.id} className="rounded-2xl ring-1 ring-border transition-colors duration-200 hover:ring-border-strong/40">
              <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 flex-none rounded-full"
                  style={{ background: h.color ?? "var(--lw-teal-500)" }}
                />
                <HabitIcon name={h.icon} size={18} className="flex-none text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold">{h.name}</div>
                  <div className="text-[12px] text-muted-foreground">
                    {h.frequency_count}×/{h.frequency_period}
                    {h.in_quick_log ? " · Quick Log" : ""}
                  </div>
                </div>
                <div className="flex w-full items-center justify-end gap-1 sm:w-auto sm:flex-none">
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
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary px-3.5 text-[13px] font-medium text-secondary-foreground transition-all duration-200 hover:bg-accent-soft hover:text-accent active:scale-[0.97]"
                  >
                    {editing === h.id ? "Close" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => startTransition(() => void setHabitArchived(h.id, true))}
                    className={buttonClass("quiet", "sm")}
                  >
                    Archive
                  </button>
                </div>
              </div>
              {editing === h.id ? (
                <div className="rise border-t border-border px-4 py-4">
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
        <section className={`${CARD_BASE} p-5 sm:p-6`}>
          <button
            type="button"
            onClick={() => setShowArchived((v) => !v)}
            aria-expanded={showArchived}
            className="flex w-full items-center justify-between text-[15px] font-semibold tracking-tight"
          >
            Archived{" "}
            <span className="tabular text-[13px] font-normal text-muted-foreground">
              {archived.length}
            </span>
          </button>
          {showArchived ? (
            <ul className="mt-4 flex flex-col gap-2">
              {archived.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 ring-border opacity-75 transition-opacity duration-200 hover:opacity-100"
                >
                  <HabitIcon name={h.icon} size={18} className="flex-none text-muted-foreground" />
                  <span className="flex-1 text-[13px] font-medium text-muted-foreground">
                    {h.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => startTransition(() => void setHabitArchived(h.id, false))}
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary px-3.5 text-[13px] font-medium text-secondary-foreground transition-all duration-200 hover:bg-accent-soft hover:text-accent active:scale-[0.97]"
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
      className="grid size-9 place-items-center rounded-full text-[13px] text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
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
        <label htmlFor="hb-name" className="text-[13px] font-medium text-muted-foreground">
          Name
        </label>
        <input
          id="hb-name"
          name="name"
          defaultValue={habit?.name}
          required
          maxLength={80}
          placeholder="e.g. Morning walk"
          className="h-11 w-full rounded-xl bg-secondary px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="hb-count" className="text-[13px] font-medium text-muted-foreground">
            How often
          </label>
          <input
            id="hb-count"
            name="frequency_count"
            type="number"
            min={1}
            max={31}
            defaultValue={habit?.frequency_count ?? 7}
            className="h-11 w-full rounded-xl bg-secondary px-3.5 text-[14px] text-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hb-period" className="text-[13px] font-medium text-muted-foreground">
            Per
          </label>
          <select
            id="hb-period"
            name="frequency_period"
            defaultValue={habit?.frequency_period ?? "week"}
            className="h-11 w-full rounded-xl bg-secondary px-3.5 text-[14px] text-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <input
          type="checkbox"
          name="in_quick_log"
          defaultChecked={habit?.in_quick_log}
          disabled={quickLogFull}
          className="size-4 accent-[var(--accent)]"
        />
        Show in Quick Log bar{quickLogFull ? " (bar is full — max 6)" : ""}
      </label>
      {state.error ? (
        <p role="alert" className="text-[13px] font-medium text-danger">
          {state.error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className={buttonClass("primary")}
        >
          {pending ? "Saving…" : habit ? "Save changes" : "Add habit"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className={buttonClass("ghost")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
