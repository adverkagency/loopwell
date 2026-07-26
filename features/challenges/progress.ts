import { addDays, daysBetween } from "@/lib/dates";

/**
 * Challenge engine — ONE generic engine, same rule as habits and goals.
 * A challenge is (metric, duration_days, target_days); progress is
 * "how many days inside the window satisfied the metric". The metric
 * itself is resolved elsewhere (metrics.ts) into a set of dates, so this
 * module stays pure calendar math — the part worth testing.
 *
 * Today is always treated as still winnable: an unqualified today counts
 * toward what's still achievable, so a challenge is never declared missed
 * while the user could still log their way out of it.
 */

export type ChallengeMetric =
  | "habit_complete"
  | "water_goal"
  | "workout"
  | "sleep"
  | "mood"
  | "journal";

/** active = still winnable; complete = target hit; missed = can no longer be reached. */
export type ChallengeStatus = "active" | "complete" | "missed";

export type ChallengeProgress = {
  daysDone: number;
  /** Window days that have already started, today included. Capped at duration. */
  daysElapsed: number;
  /** Days still playable, today included. 0 once the window has closed. */
  daysLeft: number;
  pct: number;
  status: ChallengeStatus;
  endsOn: string;
};

export function challengeProgress(input: {
  /** User-timezone date the window opened. */
  joinedOn: string;
  durationDays: number;
  targetDays: number;
  /** User-timezone "today". */
  today: string;
  /** Dates on which the metric was satisfied — any range, filtered here. */
  qualifyingDates: Iterable<string>;
}): ChallengeProgress {
  const { joinedOn, durationDays, targetDays, today } = input;
  const endsOn = addDays(joinedOn, durationDays - 1);
  const closed = daysBetween(today, endsOn) < 0;

  // The window can't count days that haven't happened yet.
  const lastCounted = closed ? endsOn : today;
  const daysElapsed = Math.max(
    0,
    Math.min(durationDays, daysBetween(joinedOn, lastCounted) + 1)
  );

  let daysDone = 0;
  let todayQualified = false;
  for (const date of input.qualifyingDates) {
    if (daysBetween(joinedOn, date) < 0 || daysBetween(date, lastCounted) < 0) {
      continue;
    }
    daysDone += 1;
    if (date === today) todayQualified = true;
  }
  daysDone = Math.min(daysDone, durationDays);

  // Days that haven't started at all — today is handled separately below.
  const daysUpcoming = durationDays - daysElapsed;
  const daysLeft = closed ? 0 : daysUpcoming + 1;
  const bestPossible =
    daysDone + daysUpcoming + (closed || todayQualified ? 0 : 1);

  const pct = Math.min(100, Math.round((daysDone / targetDays) * 100));
  const status: ChallengeStatus =
    daysDone >= targetDays
      ? "complete"
      : bestPossible < targetDays
        ? "missed"
        : "active";

  return { daysDone, daysElapsed, daysLeft, pct, status, endsOn };
}

/** One line under the progress bar. */
export function challengeTimingLabel(p: ChallengeProgress): string {
  if (p.status === "complete") return "Complete";
  if (p.daysLeft === 0) return "Window closed";
  if (p.daysLeft === 1) return "Last day";
  return `${p.daysLeft} days to go`;
}
