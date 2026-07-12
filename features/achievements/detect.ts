import { currentStreak, type HabitState } from "@/features/habits/streak";
import { addDays, daysBetween } from "@/lib/dates";

/**
 * Achievement unlock detection — pure evaluation over the user's data.
 * Runs on Daily load; newly-earned ids get inserted (unlocks are permanent).
 * Early Bird needs log timestamps in the user's tz; approximated with the
 * log's created_at hour resolved in the profile timezone.
 */

export type DetectInput = {
  today: string;
  timezone: string;
  habitLogs: { habit_id: string; date: string; state: HabitState; created_at: string }[];
  habitCount: number;
  totalWaterMl: number;
  workoutCount: number;
  completedGoals: number;
};

export function detectUnlocks(input: DetectInput): string[] {
  const earned: string[] = [];
  const { habitLogs, today } = input;

  if (habitLogs.length > 0) earned.push("first-habit");

  // streaks per habit
  const byHabit = new Map<string, Map<string, HabitState>>();
  for (const l of habitLogs) {
    const m = byHabit.get(l.habit_id) ?? new Map<string, HabitState>();
    m.set(l.date, l.state);
    byHabit.set(l.habit_id, m);
  }
  let best = 0;
  for (const logs of byHabit.values()) {
    best = Math.max(best, currentStreak(logs, today));
  }
  if (best >= 7) earned.push("7-day-streak");
  if (best >= 30) earned.push("30-day-streak");

  if (input.totalWaterMl >= 100_000) earned.push("100l-water");
  if (input.workoutCount >= 100) earned.push("100-workouts");
  if (input.completedGoals >= 1) earned.push("first-goal-hit");

  // Perfect week: every habit complete on each of the last 7 days
  if (input.habitCount > 0 && habitLogs.length > 0) {
    let perfect = true;
    for (let i = 0; i < 7 && perfect; i++) {
      const d = addDays(today, -i);
      let completeCount = 0;
      for (const logs of byHabit.values()) {
        if (logs.get(d) === "complete") completeCount++;
      }
      if (completeCount < input.habitCount) perfect = false;
    }
    if (perfect && byHabit.size >= input.habitCount) earned.push("perfect-week");
  }

  // 30-day user: first log at least 30 days back
  const dates = habitLogs.map((l) => l.date).sort();
  if (dates.length > 0 && daysBetween(dates[0], today) >= 30) {
    earned.push("30-day-user");
  }

  // Early bird: any log created before 7am (user tz)
  const earlyBird = habitLogs.some((l) => {
    const hour = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: input.timezone,
        hour: "numeric",
        hour12: false,
      }).format(new Date(l.created_at))
    );
    return hour < 7;
  });
  if (earlyBird) earned.push("early-bird");

  // Comeback: a 7+ day gap between two logged dates, with a log after it
  const uniqueDates = [...new Set(dates)];
  for (let i = 1; i < uniqueDates.length; i++) {
    if (daysBetween(uniqueDates[i - 1], uniqueDates[i]) >= 7) {
      earned.push("comeback");
      break;
    }
  }

  return earned;
}
