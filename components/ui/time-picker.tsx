"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { useEdgeClamp } from "./use-edge-clamp";

/**
 * The app's time field. Replaces `<input type="time">`, whose popup is drawn
 * by the browser and ignores every token in the design system.
 *
 * Controlled: `value` and `onChange` speak 24-hour `HH:MM` (what the server
 * and `sleepDurationMinutes()` expect), while the UI shows 12-hour with a
 * period toggle. Pass `name` to also emit a hidden input for plain forms.
 */

const MINUTE_STEP = 5;
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 / MINUTE_STEP }, (_, i) => i * MINUTE_STEP);

type Period = "AM" | "PM";

function split(value: string, base: string) {
  const [h, m] = (value || base).split(":").map(Number);
  return {
    hour12: h % 12 === 0 ? 12 : h % 12,
    minute: m,
    period: (h >= 12 ? "PM" : "AM") as Period,
  };
}

function join(hour12: number, minute: number, period: Period) {
  const h = period === "PM" ? (hour12 % 12) + 12 : hour12 % 12;
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatTime(value: string) {
  if (!value) return "";
  const { hour12, minute, period } = split(value, "00:00");
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function TimePicker({
  value,
  onChange,
  id,
  name,
  /** Where the columns start when nothing is set yet. */
  base = "07:00",
  placeholder = "Set a time",
}: {
  value: string;
  onChange: (next: string) => void;
  id?: string;
  name?: string;
  base?: string;
  placeholder?: string;
}) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const panelRef = useEdgeClamp(open);

  const { hour12, minute, period } = split(value, base);
  // Minutes off the step (e.g. an older 07:23 log) still need a row to sit on
  const minuteOptions = MINUTES.includes(minute)
    ? MINUTES
    : [...MINUTES, minute].sort((a, b) => a - b);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // before:-inset-y-2 pads the ~29px-tall row toward a 44px hit area (iOS
  // HIG minimum); width is already full-column, so only height needs help.
  const cell = (selected: boolean) =>
    `tabular relative w-full rounded-lg px-2 py-1.5 text-center text-[13px] transition-colors before:absolute before:-inset-y-2 before:inset-x-0 before:content-[''] ${
      selected
        ? "bg-accent font-semibold text-accent-foreground"
        : "text-foreground hover:bg-secondary"
    }`;

  return (
    <div ref={rootRef} className="relative">
      {name ? <input type="hidden" name={name} value={value} /> : null}

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
        <Clock aria-hidden strokeWidth={1.75} className="size-4 shrink-0 text-accent" />
        <span className="tabular truncate">
          {value ? formatTime(value) : placeholder}
        </span>
      </button>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Choose a time"
          className="drawer-in absolute left-0 z-40 mt-2 w-[236px] max-w-[calc(100vw-1rem)] rounded-2xl bg-surface p-3 shadow-[var(--shadow-e3)] ring-1 ring-border"
        >
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <Column label="Hour">
              {HOURS.map((h) => (
                <li key={h}>
                  <button
                    type="button"
                    aria-pressed={h === hour12 && !!value}
                    onClick={() => onChange(join(h, minute, period))}
                    className={cell(h === hour12 && !!value)}
                  >
                    {h}
                  </button>
                </li>
              ))}
            </Column>

            <Column label="Min">
              {minuteOptions.map((m) => (
                <li key={m}>
                  <button
                    type="button"
                    aria-pressed={m === minute && !!value}
                    onClick={() => onChange(join(hour12, m, period))}
                    className={cell(m === minute && !!value)}
                  >
                    {String(m).padStart(2, "0")}
                  </button>
                </li>
              ))}
            </Column>

            <div>
              <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                &nbsp;
              </p>
              <div className="flex flex-col gap-1">
                {(["AM", "PM"] as Period[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={p === period && !!value}
                    onClick={() => onChange(join(hour12, minute, p))}
                    className={`${cell(p === period && !!value)} px-2.5`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex justify-end border-t border-border pt-2.5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-1 py-0.5 text-[13px] font-medium text-accent transition-opacity hover:opacity-70"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Column({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <ul className="no-scrollbar max-h-[168px] space-y-1 overflow-y-auto">
        {children}
      </ul>
    </div>
  );
}
