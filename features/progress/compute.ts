import { addDays, daysBetween } from "@/lib/dates";
import type { HabitState } from "@/features/habits/streak";

export type LogEntry = { habit_id: string; date: string; state: HabitState };

/** Per-day completion ratio across all habits: complete+partial hits / habit count. */
export function dailyCompletion(
  logs: LogEntry[],
  habitCount: number,
  from: string,
  to: string
): { date: string; ratio: number }[] {
  if (habitCount === 0) return [];
  const hits = new Map<string, number>();
  for (const l of logs) {
    if (l.state === "complete" || l.state === "partial") {
      hits.set(l.date, (hits.get(l.date) ?? 0) + 1);
    }
  }
  const out: { date: string; ratio: number }[] = [];
  for (let d = from; daysBetween(d, to) >= 0; d = addDays(d, 1)) {
    out.push({ date: d, ratio: Math.min(1, (hits.get(d) ?? 0) / habitCount) });
  }
  return out;
}

/** Natural-language insights — template strings over aggregates (MVP-critical, deliberately few). */
export function buildInsights(input: {
  logs: LogEntry[];
  habitCount: number;
  today: string;
  sleepThisMonthAvg: number | null;
  sleepLastMonthAvg: number | null;
}): string[] {
  const { logs, habitCount, today } = input;
  const insights: string[] = [];

  // 30-day completion %
  if (habitCount > 0) {
    const from = addDays(today, -29);
    const days = dailyCompletion(logs, habitCount, from, today);
    const logged = days.filter((d) => d.ratio > 0);
    if (logged.length >= 3) {
      const pct = Math.round(
        (days.reduce((s, d) => s + d.ratio, 0) / days.length) * 100
      );
      insights.push(
        `You completed ${pct}% of your habits over the last 30 days.`
      );
    }
  }

  // Most productive weekday (by complete logs)
  const byWeekday = new Map<number, number>();
  for (const l of logs) {
    if (l.state !== "complete") continue;
    const [y, m, d] = l.date.split("-").map(Number);
    const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    byWeekday.set(wd, (byWeekday.get(wd) ?? 0) + 1);
  }
  if (byWeekday.size >= 2) {
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const best = [...byWeekday.entries()].sort((a, b) => b[1] - a[1])[0];
    insights.push(`${names[best[0]]} is your most productive day.`);
  }

  // Sleep delta month-over-month
  if (
    input.sleepThisMonthAvg !== null &&
    input.sleepLastMonthAvg !== null &&
    input.sleepLastMonthAvg > 0
  ) {
    const delta = Math.round(input.sleepThisMonthAvg - input.sleepLastMonthAvg);
    if (Math.abs(delta) >= 10) {
      insights.push(
        delta > 0
          ? `Your average sleep increased by ${delta} minutes this month.`
          : `Your average sleep dropped by ${Math.abs(delta)} minutes this month.`
      );
    }
  }

  return insights;
}
