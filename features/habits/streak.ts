import { addDays, daysBetween } from "@/lib/dates";

/**
 * Streak + stats engine — the locked product rules, in one pure module:
 *
 * - Only COMPLETE extends a streak.
 * - PARTIAL and SKIP are "transparent": they neither extend nor break —
 *   the streak carries through them unchanged. (CLAUDE.md: "Partial counts
 *   toward completion % but does NOT extend or break a streak"; a Skip is an
 *   acknowledged day, not a failure, so it gets the same transparency.)
 * - A MISSED day (no log at all) breaks the streak.
 * - Today not being logged yet does NOT break the current streak — the day
 *   isn't over. Yesterday's run survives until a full day passes unlogged.
 */

export type HabitState = "complete" | "partial" | "skip";
export type LogsByDate = ReadonlyMap<string, HabitState>;

/** Current streak as of `today` (user-timezone date string). */
export function currentStreak(logs: LogsByDate, today: string): number {
  let streak = 0;
  let date = today;

  // Today may be unlogged (day in progress) — start from yesterday then.
  if (!logs.has(date)) date = addDays(date, -1);

  for (;;) {
    const state = logs.get(date);
    if (state === undefined) break; // missed day → run ends
    if (state === "complete") streak += 1;
    // partial/skip: transparent — keep walking back
    date = addDays(date, -1);
  }
  return streak;
}

/** Longest complete-streak anywhere in history (same transparency rules). */
export function longestStreak(logs: LogsByDate): number {
  if (logs.size === 0) return 0;
  const dates = [...logs.keys()].sort();

  let longest = 0;
  let run = 0;
  let prev: string | null = null;

  for (const date of dates) {
    const gap = prev === null ? 1 : daysBetween(prev, date);
    if (gap > 1) run = 0; // missed day(s) in between → run resets
    if (logs.get(date) === "complete") {
      run += 1;
      if (run > longest) longest = run;
    }
    // partial/skip: transparent — run neither grows nor resets
    prev = date;
  }
  return longest;
}

/**
 * Success rate over a rolling window (default 30 days ending today).
 * Complete and Partial both count toward the numerator (locked rule);
 * denominator = days in window since the first-ever log (no penalty for
 * days before the habit existed). Always display alongside the raw count.
 */
export function successRate(
  logs: LogsByDate,
  today: string,
  windowDays = 30
): { pct: number; hits: number; days: number } {
  if (logs.size === 0) return { pct: 0, hits: 0, days: 0 };

  const firstLog = [...logs.keys()].sort()[0];
  const windowStart = addDays(today, -(windowDays - 1));
  const start = daysBetween(windowStart, firstLog) > 0 ? firstLog : windowStart;
  const days = daysBetween(start, today) + 1;

  let hits = 0;
  for (let d = start; daysBetween(d, today) >= 0; d = addDays(d, 1)) {
    const state = logs.get(d);
    if (state === "complete" || state === "partial") hits += 1;
  }
  return { pct: days > 0 ? Math.round((hits / days) * 100) : 0, hits, days };
}
