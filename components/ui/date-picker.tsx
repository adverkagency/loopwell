"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, todayInTz } from "@/lib/dates";
import { useEdgeClamp } from "./use-edge-clamp";

/**
 * The app's date field. Replaces `<input type="date">`, whose popup is drawn
 * by the browser and ignores every token in the design system.
 *
 * Renders a hidden input so it drops into an existing `<form action={…}>`
 * unchanged — the server still receives a `YYYY-MM-DD` string under `name`.
 * Monday-first, matching MonthGrid and the profile default.
 */

const WEEKDAY_HEADS = ["M", "T", "W", "T", "F", "S", "S"];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** 0 = Monday. Computed in UTC so it never shifts with the viewer's zone. */
function weekdayIndex(isoDate: string) {
  const { y, m, d } = parts(isoDate);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

function daysInMonth(y: number, m: number) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function format(isoDate: string, opts: Intl.DateTimeFormatOptions) {
  const { y, m, d } = parts(isoDate);
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...opts }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}

export function DatePicker({
  name,
  id,
  defaultValue = "",
  today,
  placeholder = "Pick a date",
  clearable = true,
}: {
  name: string;
  id?: string;
  defaultValue?: string;
  /** User-timezone today, so "Today" is the user's day, not the server's. */
  today?: string;
  placeholder?: string;
  clearable?: boolean;
}) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const gridId = `${fieldId}-grid`;
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Fallback only fires when the caller doesn't pass a server-computed
  // `today` — use the browser's own timezone, not UTC, so "Today" can't land
  // on tomorrow's date for anyone west of UTC in the evening.
  const now =
    today ?? todayInTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const panelRef = useEdgeClamp(open);
  // The day the arrow keys are sitting on — not necessarily the selected one.
  const [cursor, setCursor] = useState(defaultValue || now);

  const view = parts(cursor);

  const cells = useMemo(() => {
    const first = iso(view.y, view.m, 1);
    const lead = weekdayIndex(first);
    const total = daysInMonth(view.y, view.m);
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: total }, (_, i) => iso(view.y, view.m, i + 1)),
    ];
  }, [view.y, view.m]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the focused cell under the keyboard as the cursor moves
  useEffect(() => {
    if (!open) return;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-date="${cursor}"]`)
      ?.focus();
  }, [open, cursor]);

  function commit(date: string) {
    setValue(date);
    setCursor(date);
    setOpen(false);
  }

  function onGridKey(e: React.KeyboardEvent) {
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (e.key in moves) {
      e.preventDefault();
      setCursor((c) => addDays(c, moves[e.key]));
      return;
    }
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const delta = e.key === "PageUp" ? -1 : 1;
      const m = view.m + delta;
      const y = view.y + (m === 0 ? -1 : m === 13 ? 1 : 0);
      const mm = m === 0 ? 12 : m === 13 ? 1 : m;
      setCursor(iso(y, mm, Math.min(view.d, daysInMonth(y, mm))));
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(cursor);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  function shiftMonth(delta: number) {
    const m = view.m + delta;
    const y = view.y + (m === 0 ? -1 : m === 13 ? 1 : 0);
    const mm = m === 0 ? 12 : m === 13 ? 1 : m;
    setCursor(iso(y, mm, Math.min(view.d, daysInMonth(y, mm))));
  }

  // before:-inset-1 pads the 36px button to a 44px hit area (iOS HIG minimum)
  // without changing its visual size or the header layout.
  const navBtn =
    "relative grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors before:absolute before:-inset-1 before:content-[''] hover:bg-secondary hover:text-foreground";

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        id={fieldId}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex h-11 w-full items-center gap-2.5 rounded-xl bg-secondary px-3.5 text-left text-[14px] ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45 ${
          value ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        <CalendarDays
          aria-hidden
          strokeWidth={1.75}
          className="size-4 shrink-0 text-accent"
        />
        <span className="tabular truncate">
          {value
            ? format(value, { month: "short", day: "numeric", year: "numeric" })
            : placeholder}
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Choose a date"
          ref={panelRef}
          className="drawer-in absolute left-0 z-40 mt-2 w-[288px] max-w-[calc(100vw-1rem)] rounded-2xl bg-surface p-4 shadow-[var(--shadow-e3)] ring-1 ring-border"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className={navBtn}
            >
              <ChevronLeft aria-hidden className="size-4" />
            </button>
            <span aria-live="polite" className="text-[14px] font-semibold tracking-tight">
              {format(iso(view.y, view.m, 1), { month: "long", year: "numeric" })}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className={navBtn}
            >
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </div>

          <div
            aria-hidden
            className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
          >
            {WEEKDAY_HEADS.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          <div
            ref={gridRef}
            id={gridId}
            role="group"
            aria-label="Days"
            onKeyDown={onGridKey}
            className="mt-1.5 grid grid-cols-7 gap-1"
          >
            {cells.map((date, i) =>
              date === null ? (
                <span key={`pad-${i}`} aria-hidden />
              ) : (
                <button
                  key={date}
                  type="button"
                  data-date={date}
                  aria-label={format(date, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  aria-pressed={date === value}
                  aria-current={date === now ? "date" : undefined}
                  tabIndex={date === cursor ? 0 : -1}
                  onClick={() => commit(date)}
                  /* before:-inset-1.5 pads the ~33px cell toward a 44px hit
                     area (iOS HIG minimum) without upsetting the 7-col grid. */
                  className={`tabular relative grid aspect-square place-items-center rounded-xl text-[13px] transition-colors before:absolute before:-inset-1.5 before:content-[''] ${
                    date === value
                      ? "bg-accent font-semibold text-accent-foreground"
                      : date === now
                        ? "bg-accent-soft font-semibold text-accent hover:bg-accent-line"
                        : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {parts(date).d}
                </button>
              )
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => commit(now)}
              className="rounded-lg px-1 py-0.5 text-[13px] font-medium text-accent transition-opacity hover:opacity-70"
            >
              Today
            </button>
            {clearable ? (
              <button
                type="button"
                onClick={() => {
                  setValue("");
                  setOpen(false);
                }}
                className="rounded-lg px-1 py-0.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
