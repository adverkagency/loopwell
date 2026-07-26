import { createClient } from "@/lib/supabase/server";
import { addDays, safeTimezone, todayInTz } from "@/lib/dates";
import {
  MoodCard,
  SleepCard,
  WaterCard,
  WeightCard,
} from "@/features/health/health-cards";
import { HealthOverview } from "@/features/dashboard/panels";
import { AreaTrend } from "@/features/progress/charts";
import { lifeScore } from "@/features/life-score/score";
import { CARD_BASE, PageHeader } from "@/components/ui/kit";
import { kgToLbs } from "@/lib/health";
import type { HabitState } from "@/features/habits/streak";

export const metadata = { title: "Health — Loopwell" };

const WINDOW_DAYS = 30;

export default async function HealthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, height_cm, unit_system, weight_module_enabled, water_goal_ml")
    .eq("id", user!.id)
    .single();

  const tz = safeTimezone(profile?.timezone as string | undefined);
  const today = todayInTz(tz);
  const from = addDays(today, -(WINDOW_DAYS - 1));
  const waterGoalMl = (profile?.water_goal_ml as number | null) ?? 2000;
  const imperial = profile?.unit_system === "imperial";

  const [
    { count: habitCount },
    { data: habitLogs },
    { data: waterRows },
    { data: sleepRows },
    { data: moodRows },
    { data: weightRows },
    { data: nutritionRows },
    { data: workoutRows },
  ] = await Promise.all([
    supabase
      .from("habits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .is("archived_at", null),
    supabase
      .from("habit_logs")
      .select("date, state")
      .eq("user_id", user!.id)
      .gte("date", from),
    supabase
      .from("water_logs")
      .select("date, amount_ml")
      .eq("user_id", user!.id)
      .gte("date", from),
    supabase
      .from("sleep_logs")
      .select("date, bed_time, wake_time, quality, duration_minutes")
      .eq("user_id", user!.id)
      .gte("date", from),
    supabase
      .from("mood_logs")
      .select("date, mood, note")
      .eq("user_id", user!.id)
      .gte("date", from),
    supabase
      .from("weight_logs")
      .select("date, weight_kg")
      .eq("user_id", user!.id)
      .gte("date", from),
    supabase
      .from("nutrition_logs")
      .select("date, calories")
      .eq("user_id", user!.id)
      .gte("date", from),
    supabase
      .from("workout_logs")
      .select("date")
      .eq("user_id", user!.id)
      .gte("date", from),
  ]);

  const habits = habitCount ?? 0;

  // ---- per-day rollups, keyed by user-timezone date ----
  const habitsByDate = new Map<string, { complete: number; partial: number }>();
  for (const l of habitLogs ?? []) {
    const day = habitsByDate.get(l.date as string) ?? { complete: 0, partial: 0 };
    const state = l.state as HabitState;
    if (state === "complete") day.complete += 1;
    if (state === "partial") day.partial += 1;
    habitsByDate.set(l.date as string, day);
  }

  const waterByDate = sumByDate(waterRows, "amount_ml");
  const caloriesByDate = sumByDate(nutritionRows, "calories");
  const sleepByDate = new Map(
    (sleepRows ?? []).map((r) => [
      r.date as string,
      r.duration_minutes as number | null,
    ])
  );
  const moodByDate = new Map(
    (moodRows ?? []).map((r) => [r.date as string, r.mood as number])
  );
  const workoutDates = new Set((workoutRows ?? []).map((r) => r.date as string));

  // ---- 30-day Life Score trend ----
  const trend = Array.from({ length: WINDOW_DAYS }, (_, i) => {
    const date = addDays(from, i);
    const future = date > today;
    const h = habitsByDate.get(date) ?? { complete: 0, partial: 0 };
    const touched =
      habitsByDate.has(date) ||
      waterByDate.has(date) ||
      sleepByDate.has(date) ||
      moodByDate.has(date) ||
      caloriesByDate.has(date) ||
      workoutDates.has(date);

    return {
      label: date.slice(5).replace("-", "/"),
      value:
        future || !touched
          ? null
          : lifeScore({
              habitCount: habits,
              habitsComplete: h.complete,
              habitsPartial: h.partial,
              sleepMinutes: sleepByDate.get(date) ?? null,
              waterMl: waterByDate.get(date) ?? 0,
              waterGoalMl,
              nutritionLogged: caloriesByDate.has(date),
              workoutLogged: workoutDates.has(date),
              mood: moodByDate.get(date) ?? null,
            }).score,
    };
  });

  // ---- today ----
  const sleepToday = (sleepRows ?? []).find((r) => r.date === today);
  const moodToday = (moodRows ?? []).find((r) => r.date === today);
  const weightToday = (weightRows ?? []).find((r) => r.date === today);
  const waterToday = waterByDate.get(today) ?? 0;
  const caloriesToday = caloriesByDate.get(today) ?? 0;
  const nutritionCountToday = (nutritionRows ?? []).filter(
    (r) => r.date === today
  ).length;

  const sleepWeek = Array.from({ length: 7 }, (_, i) =>
    sleepByDate.get(addDays(today, i - 6)) ?? null
  );

  const weights = [...(weightRows ?? [])].sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );
  const latestWeight = weights.length
    ? Number(weights[weights.length - 1].weight_kg)
    : null;
  const weekAgoWeight = weights.find(
    (w) => String(w.date) >= addDays(today, -7)
  );
  const weightDelta =
    latestWeight !== null && weekAgoWeight
      ? latestWeight - Number(weekAgoWeight.weight_kg)
      : null;

  const showWeight = profile?.weight_module_enabled !== false;
  const sleepInitial = sleepToday
    ? {
        bed_time: String(sleepToday.bed_time).slice(0, 5),
        wake_time: String(sleepToday.wake_time).slice(0, 5),
        quality: sleepToday.quality as "poor" | "okay" | "great" | null,
      }
    : null;

  return (
    <>
      <PageHeader
        eyebrow="Today and the last 30 days"
        title="Health"
        subtitle="A quiet snapshot of how your body is doing. No dashboards to decode — just the signals you log."
      />

      <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-12 [&>*]:min-w-0">
        <div className="lg:col-span-7">
          <HealthOverview
            sleepMinutes={(sleepToday?.duration_minutes as number | null) ?? null}
            sleepWeek={sleepWeek}
            waterMl={waterToday}
            waterGoalMl={waterGoalMl}
            mood={(moodToday?.mood as number | undefined) ?? null}
            calories={caloriesToday}
            nutritionCount={nutritionCountToday}
          />
        </div>

        <section className={`${CARD_BASE} p-6 sm:p-7 lg:col-span-5`}>
          <h2 className="text-[15px] font-semibold tracking-tight">
            Weight{showWeight ? "" : " — off"}
          </h2>
          {showWeight ? (
            <>
              <p className="tabular mt-4 text-[28px] font-medium leading-none tracking-tight">
                {latestWeight === null
                  ? "—"
                  : `${imperial ? kgToLbs(latestWeight) : latestWeight.toFixed(1)}`}
                <span className="ml-1 text-[14px] text-muted-foreground">
                  {imperial ? "lbs" : "kg"}
                </span>
              </p>
              <p className="tabular mt-2 text-[13px] text-muted-foreground">
                {weightDelta === null
                  ? "Log twice and the weekly change shows here."
                  : `${weightDelta > 0 ? "+" : ""}${(imperial ? kgToLbs(weightDelta) : Number(weightDelta.toFixed(1)))} ${imperial ? "lbs" : "kg"} this week`}
              </p>
            </>
          ) : (
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Weight tracking is switched off in Settings. Turn it back on
              whenever it&apos;s useful — nothing you logged before was deleted.
            </p>
          )}
        </section>
      </div>

      <section aria-label="Wellbeing trend" className={`${CARD_BASE} p-6 sm:p-7`}>
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[15px] font-semibold tracking-tight">
            Wellbeing trend
            <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Beta
            </span>
          </h2>
          <p className="text-[12px] text-muted-foreground">
            Life Score across the last {WINDOW_DAYS} days
          </p>
        </div>
        <AreaTrend
          points={trend}
          max={100}
          suffix=""
          ariaLabel={`Life Score over the last ${WINDOW_DAYS} days`}
        />
      </section>

      <section aria-label="Log today" className="space-y-4">
        <h2 className="text-[17px] font-semibold tracking-tight">Log today</h2>
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
          <WaterCard today={today} totalMl={waterToday} goalMl={waterGoalMl} />
          {showWeight ? (
            <WeightCard
              today={today}
              weightKg={weightToday ? Number(weightToday.weight_kg) : null}
              heightCm={profile?.height_cm ? Number(profile.height_cm) : null}
              unitSystem={(profile?.unit_system as "metric" | "imperial") ?? "metric"}
            />
          ) : null}
          <SleepCard today={today} initial={sleepInitial} />
          <MoodCard
            today={today}
            initial={
              moodToday
                ? {
                    mood: moodToday.mood as number,
                    note: moodToday.note as string | null,
                  }
                : null
            }
          />
        </div>
      </section>
    </>
  );
}

function sumByDate(
  rows: Record<string, unknown>[] | null,
  field: string
): Map<string, number> {
  const out = new Map<string, number>();
  for (const r of rows ?? []) {
    const date = r.date as string;
    out.set(date, (out.get(date) ?? 0) + (Number(r[field]) || 0));
  }
  return out;
}
