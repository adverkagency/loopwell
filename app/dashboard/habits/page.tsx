import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addDays, safeTimezone, todayInTz } from "@/lib/dates";
import { HabitList, type DailyHabit } from "@/features/habits/habit-list";
import {
  currentStreak,
  longestStreak,
  successRate,
  type HabitState,
} from "@/features/habits/streak";
import { dailyCompletion } from "@/features/progress/compute";
import { WeekBars } from "@/features/progress/charts";
import {
  CARD_BASE,
  EmptyState,
  LoopIllustration,
  PageHeader,
  buttonClass,
} from "@/components/ui/kit";
import type { HabitLogRow, HabitRow } from "@/lib/api-types/db";

export const metadata = { title: "Habits — Loopwell" };

export default async function HabitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user!.id)
    .single();

  const tz = safeTimezone(profile?.timezone as string | undefined);
  const today = todayInTz(tz);

  const [{ data: habits }, { data: logs }] = await Promise.all([
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
  ]);

  const byHabit = new Map<string, [string, HabitState][]>();
  for (const log of logs ?? []) {
    const arr = byHabit.get(log.habit_id) ?? [];
    arr.push([log.date, log.state as HabitState]);
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

  const stats = daily.map((h) => {
    const map = new Map(h.logs);
    const rate = successRate(map, today);
    return {
      id: h.id,
      name: h.name,
      current: currentStreak(map, today),
      best: longestStreak(map),
      pct: rate.pct,
      hits: rate.hits,
      days: rate.days,
    };
  });

  const week = dailyCompletion(
    (logs ?? []).map((l) => ({
      habit_id: l.habit_id,
      date: l.date,
      state: l.state as HabitState,
    })),
    daily.length,
    addDays(today, -6),
    today
  );

  const manage = (
    <Link href="/dashboard/settings/habits" className={buttonClass("ghost", "sm")}>
      Manage habits
    </Link>
  );

  if (daily.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow="The core loop"
          title="Habits"
          subtitle="The small repeatable things that quietly compound. Keep the list short and the streaks alive."
        />
        <EmptyState
          illustration={<LoopIllustration />}
          title="Start with one habit"
          body="One habit, ticked once a day, is enough to make every other page in Loopwell mean something. Add it now and today already counts."
          action={
            <Link href="/dashboard/settings/habits" className={buttonClass("primary")}>
              Create your first habit
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="The core loop"
        title="Habits"
        subtitle="The small repeatable things that quietly compound. Keep the list short and the streaks alive."
        action={manage}
      />

      <HabitList habits={daily} today={today} />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section aria-label="Habit completion, last 7 days" className={`${CARD_BASE} p-6 sm:p-7`}>
          <h2 className="mb-4 text-[15px] font-semibold tracking-tight">This week</h2>
          <WeekBars days={week} />
        </section>

        <section aria-label="Per-habit stats" className={`${CARD_BASE} p-6 sm:p-7`}>
          <h2 className="text-[15px] font-semibold tracking-tight">Each habit</h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Streaks count Complete only. Partial and Skip hold the streak without
            extending it.
          </p>
          <ul className="mt-5 flex flex-col divide-y divide-border">
            {stats.map((s) => (
              <li key={s.id} className="flex items-center gap-4 py-3">
                <span className="min-w-0 flex-1 truncate text-[14px] font-medium">
                  {s.name}
                </span>
                <span className="tabular shrink-0 text-[12px] text-muted-foreground">
                  {s.days === 0
                    ? "No history yet"
                    : `${s.pct}% of ${s.days} day${s.days === 1 ? "" : "s"}`}
                </span>
                <span className="tabular w-20 shrink-0 text-right text-[12px] text-muted-foreground">
                  {s.current}d now · {s.best}d best
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
