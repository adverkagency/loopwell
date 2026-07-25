import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addDays, safeTimezone, todayInTz } from "@/lib/dates";
import { HabitList, type DailyHabit } from "@/features/habits/habit-list";
import {
  MoodCard,
  SleepCard,
  WaterCard,
  WeightCard,
} from "@/features/health/health-cards";
import {
  JournalCard,
  NutritionCard,
  WorkoutCard,
  type NutritionEntry,
  type WorkoutEntry,
} from "@/features/modules/module-cards";
import { HeroCard } from "@/features/dashboard/hero";
import {
  ActiveGoals,
  HealthOverview,
  InsightCard,
  LogSection,
  StreakCard,
  WeeklyProgress,
} from "@/features/dashboard/panels";
import { lifeScore } from "@/features/life-score/score";
import { dailyCompletion, buildInsights } from "@/features/progress/compute";
import { currentStreak, longestStreak } from "@/features/habits/streak";
import { goalProgressPct } from "@/features/goals/progress";
import { detectUnlocks } from "@/features/achievements/detect";
import type { HabitLogRow, HabitRow } from "@/lib/api-types/db";
import type { HabitState } from "@/features/habits/streak";

export const metadata = { title: "Dashboard — Loopwell" };

const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function weekdayOf(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAY[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

export default async function DailyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "display_name, timezone, height_cm, unit_system, weight_module_enabled, water_goal_ml"
    )
    .eq("id", user!.id)
    .single();

  const tz = safeTimezone(profile?.timezone);
  const today = todayInTz(tz);

  const [
    { data: habits },
    { data: logs },
    { data: waterRows },
    { data: sleepRow },
    { data: moodRow },
    { data: weightRow },
  ] = await Promise.all([
    supabase
      .from("habits")
      .select("id, name, icon, color, in_quick_log")
      .eq("user_id", user!.id)
      .is("archived_at", null)
      .order("sort_order", { ascending: true })
      .returns<Pick<HabitRow, "id" | "name" | "icon" | "color" | "in_quick_log">[]>(),
    supabase
      .from("habit_logs")
      .select("habit_id, date, state, created_at")
      .eq("user_id", user!.id)
      .returns<Pick<HabitLogRow, "habit_id" | "date" | "state" | "created_at">[]>(),
    supabase
      .from("water_logs")
      .select("amount_ml")
      .eq("user_id", user!.id)
      .eq("date", today),
    supabase
      .from("sleep_logs")
      .select("bed_time, wake_time, quality, duration_minutes")
      .eq("user_id", user!.id)
      .eq("date", today)
      .maybeSingle(),
    supabase
      .from("mood_logs")
      .select("mood, note")
      .eq("user_id", user!.id)
      .eq("date", today)
      .maybeSingle(),
    supabase
      .from("weight_logs")
      .select("weight_kg")
      .eq("user_id", user!.id)
      .eq("date", today)
      .maybeSingle(),
  ]);

  const [
    { data: nutritionRows },
    { data: workoutRows },
    { data: journalRow },
    { data: sleepWeekRows },
    { data: goalRows },
  ] = await Promise.all([
    supabase
      .from("nutrition_logs")
      .select("id, food_name, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g")
      .eq("user_id", user!.id)
      .eq("date", today)
      .order("created_at", { ascending: true })
      .returns<NutritionEntry[]>(),
    supabase
      .from("workout_logs")
      .select("id, kind, name, sets, reps, weight_kg, distance_km, duration_minutes")
      .eq("user_id", user!.id)
      .eq("date", today)
      .order("created_at", { ascending: true })
      .returns<WorkoutEntry[]>(),
    supabase
      .from("journal_entries")
      .select("body")
      .eq("user_id", user!.id)
      .eq("date", today)
      .maybeSingle(),
    supabase
      .from("sleep_logs")
      .select("date, duration_minutes")
      .eq("user_id", user!.id)
      .gte("date", addDays(today, -6))
      .lte("date", today),
    supabase
      .from("goals")
      .select("id, label, target_value, current_value, start_value, unit, deadline, completed_at")
      .eq("user_id", user!.id)
      .is("completed_at", null)
      .order("created_at", { ascending: true }),
  ]);

  const waterTotal = (waterRows ?? []).reduce(
    (sum, r) => sum + (r.amount_ml as number),
    0
  );
  // Postgres `time` comes back as HH:MM:SS — the time inputs want HH:MM
  const sleepInitial = sleepRow
    ? {
        bed_time: String(sleepRow.bed_time).slice(0, 5),
        wake_time: String(sleepRow.wake_time).slice(0, 5),
        quality: sleepRow.quality as "poor" | "okay" | "great" | null,
      }
    : null;

  const byHabit = new Map<string, [string, HabitLogRow["state"]][]>();
  for (const log of logs ?? []) {
    const arr = byHabit.get(log.habit_id) ?? [];
    arr.push([log.date, log.state]);
    byHabit.set(log.habit_id, arr);
  }

  const daily: DailyHabit[] = (habits ?? []).map((h) => {
    const hLogs = byHabit.get(h.id) ?? [];
    return {
      ...h,
      logs: hLogs,
      todayState: hLogs.find(([d]) => d === today)?.[1] ?? null,
    };
  });

  // ---- Life Score (Beta) ----
  const todayStates = daily.map((h) => h.todayState);
  const habitsComplete = todayStates.filter((s) => s === "complete").length;
  const { score, components } = lifeScore({
    habitCount: daily.length,
    habitsComplete,
    habitsPartial: todayStates.filter((s) => s === "partial").length,
    sleepMinutes: sleepRow?.duration_minutes ?? null,
    waterMl: waterTotal,
    waterGoalMl: profile?.water_goal_ml ?? 2000,
    nutritionLogged: (nutritionRows ?? []).length > 0,
    workoutLogged: (workoutRows ?? []).length > 0,
    mood: (moodRow?.mood as number | undefined) ?? null,
  });

  // ---- Achievement unlock detection (permanent inserts, fire-and-check) ----
  const [{ data: waterAll }, { count: workoutCount }, { count: goalsDone }, { data: alreadyUnlocked }] =
    await Promise.all([
      supabase.from("water_logs").select("amount_ml").eq("user_id", user!.id),
      supabase
        .from("workout_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id),
      supabase
        .from("goals")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .not("completed_at", "is", null),
      supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", user!.id),
    ]);

  const earned = detectUnlocks({
    today,
    timezone: tz,
    habitLogs: (logs ?? []).map((l) => ({
      habit_id: l.habit_id,
      date: l.date,
      state: l.state as HabitState,
      created_at: l.created_at,
    })),
    habitCount: daily.length,
    totalWaterMl: (waterAll ?? []).reduce((s, r) => s + (r.amount_ml as number), 0),
    workoutCount: workoutCount ?? 0,
    completedGoals: goalsDone ?? 0,
  });
  const unlockedIds = new Set((alreadyUnlocked ?? []).map((u) => u.achievement_id));
  const fresh = earned.filter((id) => !unlockedIds.has(id));
  if (fresh.length > 0) {
    await supabase
      .from("user_achievements")
      .upsert(
        fresh.map((achievement_id) => ({ user_id: user!.id, achievement_id })),
        { onConflict: "user_id,achievement_id", ignoreDuplicates: true }
      );
  }

  // ---- Dashboard aggregates ----
  const logEntries = (logs ?? []).map((l) => ({
    habit_id: l.habit_id,
    date: l.date,
    state: l.state as HabitState,
  }));

  const last14 = dailyCompletion(logEntries, daily.length, addDays(today, -13), today);
  const week = last14.slice(-7);
  const prevWeek = dailyCompletion(
    logEntries,
    daily.length,
    addDays(today, -13),
    addDays(today, -7)
  );

  const avgPct = week.length
    ? Math.round((week.reduce((s, d) => s + d.ratio, 0) / week.length) * 100)
    : 0;
  const prevAvgPct = prevWeek.length
    ? Math.round((prevWeek.reduce((s, d) => s + d.ratio, 0) / prevWeek.length) * 100)
    : null;

  const weekDays = week.map((d) => ({
    key: d.date,
    label: weekdayOf(d.date),
    pct: Math.round(d.ratio * 100),
    isToday: d.date === today,
  }));

  // Overall streak = the strongest habit's current run (Complete only extends)
  const streaks = daily.map((h) => currentStreak(new Map(h.logs), today));
  const bests = daily.map((h) => longestStreak(new Map(h.logs)));
  const streakNow = streaks.length ? Math.max(...streaks) : 0;
  const streakBest = bests.length ? Math.max(...bests, streakNow) : 0;

  const insight =
    buildInsights({
      logs: logEntries,
      habitCount: daily.length,
      today,
      sleepThisMonthAvg: null,
      sleepLastMonthAvg: null,
    })[0] ??
    (daily.length === 0
      ? "Add a habit and Loopwell starts spotting your patterns."
      : "Log a few days and Loopwell will start spotting your patterns.");

  const calories = (nutritionRows ?? []).reduce(
    (s, n) => s + (Number(n.calories) || 0),
    0
  );

  const sleepByDate = new Map(
    (sleepWeekRows ?? []).map((r) => [
      r.date as string,
      r.duration_minutes as number | null,
    ])
  );
  const sleepWeek = Array.from({ length: 7 }, (_, i) =>
    sleepByDate.get(addDays(today, i - 6)) ?? null
  );

  const goals = (goalRows ?? []).slice(0, 3).map((g) => ({
    id: g.id as string,
    label: g.label as string,
    current: Number(g.current_value),
    target: Number(g.target_value),
    unit: (g.unit as string | null) ?? null,
    pct: goalProgressPct({
      target_value: Number(g.target_value),
      current_value: Number(g.current_value),
      start_value: g.start_value === null ? null : Number(g.start_value),
    }),
  }));

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "short",
  })
    .format(new Date())
    .toUpperCase();

  const headline =
    daily.length === 0
      ? "Pick a habit and the loop starts today."
      : habitsComplete === daily.length
        ? "Every habit done — that's the whole loop closed."
        : habitsComplete > 0
          ? `${habitsComplete} down, ${daily.length - habitsComplete} to go today.`
          : "A quiet start — one habit is enough to begin.";

  const subline =
    avgPct > 0
      ? `Your habits are running at ${avgPct}% completion over the last 7 days${
          prevAvgPct !== null && prevAvgPct !== avgPct
            ? `, ${avgPct > prevAvgPct ? "up" : "down"} ${Math.abs(avgPct - prevAvgPct)}% on the week before`
            : ""
        }.`
      : "Log today's habits, water, and sleep — the picture builds from here.";

  return (
    <>
      <HeroCard
        headline={headline}
        sub={subline}
        score={score}
        components={components}
        habitsComplete={habitsComplete}
        habitCount={daily.length}
      />

      <div className="grid gap-8 md:gap-10 lg:grid-cols-12 [&>*]:min-w-0">
        {daily.length === 0 ? (
          <section className="space-y-4 lg:col-span-7">
            <h2 className="text-[17px] font-semibold tracking-tight">
              Today&apos;s habits
            </h2>
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-surface p-8 text-center shadow-[var(--shadow-e1)] ring-1 ring-border">
              <p className="text-[14px] text-muted-foreground">
                No habits yet — add your first to start the loop.
              </p>
              <Link
                href="/app/settings/habits"
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-[14px] font-medium text-accent-foreground transition-all hover:brightness-110 active:scale-[0.97]"
              >
                Add your first habit
              </Link>
            </div>
          </section>
        ) : (
          <HabitList habits={daily} today={today} />
        )}

        <HealthOverview
          sleepMinutes={(sleepRow?.duration_minutes as number | null) ?? null}
          sleepWeek={sleepWeek}
          waterMl={waterTotal}
          waterGoalMl={profile?.water_goal_ml ?? 2000}
          mood={(moodRow?.mood as number | undefined) ?? null}
          calories={calories}
          nutritionCount={(nutritionRows ?? []).length}
        />
      </div>

      <div className="grid gap-8 md:gap-10 lg:grid-cols-12 [&>*]:min-w-0">
        <WeeklyProgress days={weekDays} avgPct={avgPct} deltaPct={
          prevAvgPct === null ? null : avgPct - prevAvgPct
        } />
        <div className="space-y-2.5 lg:col-span-4">
          <InsightCard text={insight} />
          <ActiveGoals goals={goals} monthLabel={monthLabel} />
        </div>
      </div>

      <div className="grid gap-8 md:gap-10 lg:grid-cols-12 [&>*]:min-w-0">
        <StreakCard
          current={streakNow}
          best={streakBest}
          days={last14.map((d) => d.ratio)}
        />
        <section className="lg:col-span-8">
          <LogSection
            title="Log today"
            description="Everything that makes up your day"
          >
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
              <WaterCard
                today={today}
                totalMl={waterTotal}
                goalMl={profile?.water_goal_ml ?? 2000}
              />
              {profile?.weight_module_enabled !== false ? (
                <WeightCard
                  today={today}
                  weightKg={weightRow ? Number(weightRow.weight_kg) : null}
                  heightCm={profile?.height_cm ? Number(profile.height_cm) : null}
                  unitSystem={
                    (profile?.unit_system as "metric" | "imperial") ?? "metric"
                  }
                />
              ) : null}
              <SleepCard today={today} initial={sleepInitial} />
              <MoodCard
                today={today}
                initial={
                  moodRow
                    ? { mood: moodRow.mood as number, note: moodRow.note as string | null }
                    : null
                }
              />
              <NutritionCard today={today} entries={nutritionRows ?? []} />
              <WorkoutCard today={today} entries={workoutRows ?? []} />
            </div>
            <JournalCard today={today} initialBody={(journalRow?.body as string) ?? ""} />
          </LogSection>
        </section>
      </div>
    </>
  );
}
