import type { ChallengeMetric } from "./progress";

/**
 * Turns raw logs into "which dates satisfied this metric". Kept pure and
 * separate from the page so the rules are testable and so adding a metric
 * is one branch here plus one seed row in the challenges table — never a
 * new table or a new page.
 */

/** A night counts toward a sleep challenge at seven hours or more. */
export const SLEEP_QUALIFY_MINUTES = 7 * 60;

export type MetricSource = {
  habitLogs: { date: string; state: string }[];
  waterLogs: { date: string; amount_ml: number }[];
  waterGoalMl: number;
  workoutLogs: { date: string }[];
  sleepLogs: { date: string; duration_minutes: number | null }[];
  moodLogs: { date: string }[];
  journalEntries: { date: string; body: string | null }[];
};

export function qualifyingDates(
  metric: ChallengeMetric,
  src: MetricSource
): Set<string> {
  switch (metric) {
    case "habit_complete":
      // Partial and Skip are transparent for streaks; a challenge day needs
      // an actual Complete, matching the locked habit rule.
      return dates(src.habitLogs.filter((l) => l.state === "complete"));

    case "water_goal": {
      const totals = new Map<string, number>();
      for (const w of src.waterLogs) {
        totals.set(w.date, (totals.get(w.date) ?? 0) + Number(w.amount_ml ?? 0));
      }
      const hit = new Set<string>();
      for (const [date, total] of totals) {
        if (total >= src.waterGoalMl) hit.add(date);
      }
      return hit;
    }

    case "workout":
      return dates(src.workoutLogs);

    case "sleep":
      return dates(
        src.sleepLogs.filter(
          (s) => (s.duration_minutes ?? 0) >= SLEEP_QUALIFY_MINUTES
        )
      );

    case "mood":
      return dates(src.moodLogs);

    case "journal":
      return dates(src.journalEntries.filter((j) => (j.body ?? "").trim() !== ""));
  }
}

function dates(rows: { date: string }[]): Set<string> {
  return new Set(rows.map((r) => r.date));
}
