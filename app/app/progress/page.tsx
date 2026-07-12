import { createClient } from "@/lib/supabase/server";
import { addDays, safeTimezone, todayInTz } from "@/lib/dates";
import {
  buildInsights,
  dailyCompletion,
  type LogEntry,
} from "@/features/progress/compute";
import { Heatmap, TrendLine, WeekBars } from "@/features/progress/charts";
import { AwardIcon, LockIcon } from "@/components/ui/icons";
import { kgToLbs } from "@/lib/health";

export const metadata = { title: "Progress — Loopwell" };

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, unit_system")
    .eq("id", user!.id)
    .single();

  const tz = safeTimezone(profile?.timezone);
  const today = todayInTz(tz);
  const monthAgo = addDays(today, -29);
  const twoMonthsAgo = addDays(today, -59);
  const heatmapStart = addDays(today, -181);

  const [
    { count: habitCount },
    { data: logs },
    { data: weights },
    { data: sleepRecent },
    { data: sleepPrev },
    { data: achievements },
    { data: unlocked },
  ] = await Promise.all([
    supabase
      .from("habits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .is("archived_at", null),
    supabase
      .from("habit_logs")
      .select("habit_id, date, state")
      .eq("user_id", user!.id)
      .gte("date", heatmapStart)
      .returns<LogEntry[]>(),
    supabase
      .from("weight_logs")
      .select("date, weight_kg")
      .eq("user_id", user!.id)
      .order("date", { ascending: true })
      .limit(90),
    supabase
      .from("sleep_logs")
      .select("duration_minutes")
      .eq("user_id", user!.id)
      .gte("date", monthAgo),
    supabase
      .from("sleep_logs")
      .select("duration_minutes")
      .eq("user_id", user!.id)
      .gte("date", twoMonthsAgo)
      .lt("date", monthAgo),
    supabase
      .from("achievements")
      .select("id, title, description, sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user!.id),
  ]);

  const count = habitCount ?? 0;
  const allLogs = logs ?? [];

  const avg = (rows: { duration_minutes: number }[] | null) =>
    rows && rows.length > 0
      ? rows.reduce((s, r) => s + r.duration_minutes, 0) / rows.length
      : null;

  const insights = buildInsights({
    logs: allLogs,
    habitCount: count,
    today,
    sleepThisMonthAvg: avg(sleepRecent),
    sleepLastMonthAvg: avg(sleepPrev),
  });

  const week = dailyCompletion(allLogs, count, addDays(today, -6), today);
  const heat = dailyCompletion(allLogs, count, heatmapStart, today);
  const hasAnyLog = allLogs.length > 0;

  const imperial = profile?.unit_system === "imperial";
  const weightPoints = (weights ?? []).map((w) =>
    imperial ? kgToLbs(Number(w.weight_kg)) : Number(w.weight_kg)
  );
  const unlockedSet = new Set((unlocked ?? []).map((u) => u.achievement_id));

  const card =
    "rounded-card border border-hairline bg-elevated p-5 shadow-rest";

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Progress</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Your trends across habits, health, and consistency.
      </p>

      {!hasAnyLog ? (
        <div className={`mt-6 ${card} p-8 text-center`}>
          <p className="text-sm text-ink-secondary">
            Check back after a few days of logging — trends need a little
            history.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {insights.length > 0 ? (
            <section aria-label="Insights" className={card}>
              <h2 className="mb-3 text-base font-semibold tracking-tight text-ink">Insights</h2>
              <ul className="flex flex-col divide-y divide-[var(--lw-border)]">
                {insights.map((line) => (
                  <li key={line} className="py-2.5 text-sm text-ink">
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
            <section aria-label="Habit completion, last 7 days" className={card}>
              <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">This Week</h2>
              <WeekBars days={week} />
            </section>

            {weightPoints.length >= 2 ? (
              <section aria-label="Weight trend" className={card}>
                <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">Weight Trend</h2>
                <TrendLine
                  points={weightPoints}
                  ariaLabel={`Weight from ${weightPoints[0]} to ${weightPoints[weightPoints.length - 1]} ${imperial ? "lbs" : "kg"} over ${weightPoints.length} entries`}
                />
                <p className="tabular mt-2 text-sm text-ink-muted">
                  {weightPoints[0]} → {weightPoints[weightPoints.length - 1]}{" "}
                  {imperial ? "lbs" : "kg"}
                </p>
              </section>
            ) : null}
          </div>

          <section aria-label="Consistency heatmap" className={card}>
            <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">
              Consistency Heatmap
            </h2>
            <Heatmap days={heat} />
          </section>

          <section aria-label="Achievements" className={card}>
            <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">Achievements</h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
              {(achievements ?? []).map((a) => {
                const isUnlocked = unlockedSet.has(a.id);
                return (
                  <li
                    key={a.id}
                    title={a.description}
                    className={`flex flex-col items-center gap-1.5 text-center ${isUnlocked ? "" : "opacity-45 grayscale"}`}
                  >
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${
                        isUnlocked
                          ? "border-teal-200 bg-teal-50 text-teal-600"
                          : "border-hairline bg-sunken text-ink-muted"
                      }`}
                      aria-hidden
                    >
                      {isUnlocked ? <AwardIcon size={26} /> : <LockIcon size={22} />}
                    </span>
                    <span className="text-xs text-ink-secondary">{a.title}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}
    </>
  );
}
