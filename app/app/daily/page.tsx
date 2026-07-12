import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { safeTimezone, todayInTz } from "@/lib/dates";
import { HabitList, type DailyHabit } from "@/features/habits/habit-list";
import {
  MoodCard,
  SleepCard,
  WaterCard,
  WeightCard,
} from "@/features/health/health-cards";
import type { HabitLogRow, HabitRow } from "@/lib/api-types/db";

export const metadata = { title: "Daily — Loopwell" };

function greeting(tz: string) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      hour12: false,
    }).format(new Date())
  );
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
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
      .select("habit_id, date, state")
      .eq("user_id", user!.id)
      .returns<Pick<HabitLogRow, "habit_id" | "date" | "state">[]>(),
    supabase
      .from("water_logs")
      .select("amount_ml")
      .eq("user_id", user!.id)
      .eq("date", today),
    supabase
      .from("sleep_logs")
      .select("bed_time, wake_time, quality")
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

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        {greeting(tz)}
        {profile?.display_name ? `, ${profile.display_name}` : ""} 👋
      </h1>
      <p className="mt-1 text-sm text-ink-secondary">
        {dateLabel} — let&apos;s keep the loop going.
      </p>

      <div className="mt-6 flex flex-col gap-6">
        {daily.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-card border border-hairline bg-elevated p-8 text-center shadow-rest">
            <p className="text-sm text-ink-secondary">
              No habits yet — add your first to start the loop.
            </p>
            <Link
              href="/app/settings/habits"
              className="flex min-h-11 items-center rounded-full bg-teal-500 px-5 text-sm font-semibold text-white shadow-rest-xs transition hover:bg-teal-600"
            >
              Add your first habit
            </Link>
          </div>
        ) : (
          <HabitList habits={daily} today={today} />
        )}

        {/* Retention-priority order: Water > Weight > Sleep > Mood */}
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
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
        </div>
      </div>
    </>
  );
}
