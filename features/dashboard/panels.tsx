import Link from "next/link";
import {
  ArrowUpRight,
  Droplets,
  Flame,
  Moon,
  Smile,
  Sparkles,
  Utensils,
} from "lucide-react";

import { CARD_BASE as CARD, SectionHeading } from "@/components/ui/kit";

function TileHead({
  icon: Icon,
  label,
}: {
  icon: typeof Moon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon aria-hidden className="size-3.5 shrink-0 text-accent" />
      <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
  children,
}: {
  icon: typeof Moon;
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${CARD} lift p-4 sm:p-5`}>
      <TileHead icon={icon} label={label} />
      <p className="tabular mt-2 text-[20px] font-medium leading-tight tracking-tight">
        {value}
      </p>
      {children}
    </div>
  );
}

/* ---------------- Health overview ---------------- */

const MOOD_LABELS = ["", "Rough", "Low", "Okay", "Good", "Great"];

export function HealthOverview({
  sleepMinutes,
  sleepWeek,
  waterMl,
  waterGoalMl,
  mood,
  calories,
  nutritionCount,
}: {
  sleepMinutes: number | null;
  /** last 7 nights of sleep duration in minutes, oldest → newest */
  sleepWeek: (number | null)[];
  waterMl: number;
  waterGoalMl: number;
  mood: number | null;
  calories: number;
  nutritionCount: number;
}) {
  const peak = Math.max(1, ...sleepWeek.map((m) => m ?? 0));
  const waterPct = Math.max(0, Math.min(1, waterMl / waterGoalMl));
  const r = 15;
  const c = 2 * Math.PI * r;

  return (
    <section className="space-y-4 lg:col-span-5">
      <SectionHeading title="Health overview" />
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <Tile
          icon={Moon}
          label="Sleep"
          value={
            sleepMinutes
              ? `${Math.floor(sleepMinutes / 60)}h ${sleepMinutes % 60}m`
              : "—"
          }
        >
          <div className="mt-4 flex h-9 items-end gap-1">
            {sleepWeek.map((m, i) => (
              <div
                key={i}
                style={{
                  height: `${Math.max(6, ((m ?? 0) / peak) * 100)}%`,
                  animationDelay: `${i * 45}ms`,
                }}
                className={`grow-bar min-w-0 flex-1 rounded-full ${
                  i === sleepWeek.length - 1 && m ? "bg-accent" : "bg-accent-line"
                }`}
              />
            ))}
          </div>
        </Tile>

        <Tile icon={Droplets} label="Water" value={`${(waterMl / 1000).toFixed(2)}L`}>
          <div className="mt-4 flex items-end gap-2.5">
            <svg viewBox="0 0 36 36" className="size-10 -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r={r} fill="none" strokeWidth="4" stroke="var(--accent-soft)" />
              <circle
                cx="18"
                cy="18"
                r={r}
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="var(--accent)"
                strokeDasharray={c.toFixed(2)}
                strokeDashoffset={(c * (1 - waterPct)).toFixed(2)}
              />
            </svg>
            <span className="tabular pb-0.5 text-[11px] leading-tight text-muted-foreground">
              {Math.round(waterPct * 100)}% of
              <br />
              {(waterGoalMl / 1000).toFixed(1)}L goal
            </span>
          </div>
        </Tile>

        <Tile
          icon={Smile}
          label="Mood"
          value={mood ? MOOD_LABELS[mood] : "—"}
        >
          <p className="mt-4 inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-1 text-[11px] font-medium text-accent">
            {mood ? (
              <>
                <ArrowUpRight aria-hidden className="size-3" />
                Logged today
              </>
            ) : (
              "Not logged yet"
            )}
          </p>
        </Tile>

        <Tile icon={Utensils} label="Calories" value={calories.toLocaleString()}>
          <p className="mt-4 text-[11px] text-muted-foreground">
            {nutritionCount === 0
              ? "Nothing logged yet"
              : `${nutritionCount} item${nutritionCount === 1 ? "" : "s"} logged`}
          </p>
        </Tile>
      </div>
    </section>
  );
}

/* ---------------- Weekly progress ---------------- */

export function WeeklyProgress({
  days,
  avgPct,
  deltaPct,
}: {
  days: { key: string; label: string; pct: number; isToday: boolean }[];
  avgPct: number;
  deltaPct: number | null;
}) {
  return (
    <section className={`${CARD} flex flex-col p-6 sm:p-8 lg:col-span-8`}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight">Weekly progress</h2>
          <p className="tabular mt-1 text-[13px] text-muted-foreground">
            Average completion {avgPct}%
            {deltaPct === null
              ? ""
              : deltaPct === 0
                ? " · level with last week"
                : ` · ${deltaPct > 0 ? "up" : "down"} ${Math.abs(deltaPct)}% week over week`}
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Last 7 days
        </span>
      </div>
      <div className="relative min-h-[200px] flex-1">
        <div aria-hidden className="absolute inset-x-0 bottom-7 top-6 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-border/70" />
          ))}
        </div>
        <div className="flex h-full items-end justify-between gap-2 pb-7 sm:gap-4">
          {days.map((d, i) => (
            <div
              key={d.key}
              className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3"
            >
              <span
                className={`tabular text-[11px] font-medium ${
                  d.isToday ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {d.pct}%
              </span>
              <div
                title={`${d.label}: ${d.pct}% complete`}
                style={{ height: `${Math.max(2, d.pct)}%`, animationDelay: `${i * 60}ms` }}
                className={`grow-bar w-full max-w-12 rounded-xl transition-colors ${
                  d.isToday ? "bg-accent" : "bg-accent-line hover:bg-accent/55"
                }`}
              />
              <span
                className={`absolute bottom-0 text-[12px] ${
                  d.isToday ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {d.label[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Insight ---------------- */

export function InsightCard({ text }: { text: string }) {
  return (
    <section className="rounded-3xl bg-accent p-6 text-accent-foreground shadow-[var(--shadow-e2)] sm:p-7">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent-foreground/80">
        <Sparkles aria-hidden className="size-3.5" />
        Insight
      </p>
      <p className="mt-4 text-pretty text-[17px] font-medium leading-snug">{text}</p>
      <Link
        href="/dashboard/progress"
        className="group mt-6 flex w-full items-center justify-between gap-3 border-t border-accent-foreground/20 pt-5 text-left text-[14px] font-medium"
      >
        See the full picture
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-foreground/15 transition-transform duration-200 group-hover:translate-x-0.5">
          <ArrowUpRight aria-hidden className="size-3.5" />
        </span>
      </Link>
    </section>
  );
}

/* ---------------- Active goals ---------------- */

export function ActiveGoals({
  goals,
  monthLabel,
}: {
  goals: { id: string; label: string; current: number; target: number; unit: string | null; pct: number }[];
  monthLabel: string;
}) {
  return (
    <section className={`${CARD} p-6 sm:p-7`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold tracking-tight">Active goals</h2>
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {monthLabel}
        </span>
      </div>
      {goals.length === 0 ? (
        <p className="mt-5 text-[13px] text-muted-foreground">
          No active goals —{" "}
          <Link href="/dashboard/goals" className="font-medium text-accent hover:opacity-70">
            set one
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {goals.map((g) => (
            <li key={g.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-[13px] font-medium">{g.label}</p>
                <span className="tabular shrink-0 text-[12px] text-muted-foreground">
                  {g.current} of {g.target}
                  {g.unit ? ` ${g.unit}` : ""}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-700"
                  style={{ width: `${g.pct}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------------- Streak ---------------- */

export function StreakCard({
  current,
  best,
  days,
}: {
  current: number;
  best: number;
  /** last 14 days of overall completion ratio, oldest → newest */
  days: number[];
}) {
  return (
    <section className={`${CARD} p-6 sm:p-7 lg:col-span-4`}>
      <div className="flex items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
          <Flame aria-hidden className="size-[18px]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="tabular text-[15px] font-semibold tracking-tight">
            {current} day streak
          </p>
          <p className="tabular text-[12px] text-muted-foreground">
            Personal best {best} day{best === 1 ? "" : "s"}
          </p>
        </div>
      </div>
      <div className="mt-6 flex h-24 items-end gap-1">
        {days.map((ratio, i) => (
          <div
            key={i}
            style={{
              height: `${Math.max(6, ratio * 100)}%`,
              animationDelay: `${i * 35}ms`,
            }}
            className={`grow-bar min-w-0 flex-1 rounded-full ${
              i === days.length - 1 ? "bg-accent" : "bg-accent-line"
            }`}
          />
        ))}
      </div>
      <p className="mt-4 text-[12px] text-muted-foreground">
        Last 14 days of habit completion
      </p>
    </section>
  );
}

/* ---------------- Log-today section wrapper ---------------- */

export function LogSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id="log-today" className="scroll-mt-24 space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-[13px] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
