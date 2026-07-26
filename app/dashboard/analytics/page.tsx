import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addDays, safeTimezone, todayInTz } from "@/lib/dates";
import { dailyCompletion, type LogEntry } from "@/features/progress/compute";
import { AreaTrend, WeekBars } from "@/features/progress/charts";
import {
  CARD_BASE,
  EmptyState,
  LoopIllustration,
  PageHeader,
  buttonClass,
} from "@/components/ui/kit";

export const metadata = { title: "Analytics — Loopwell" };

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function AnalyticsPage() {
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
  const monthAgo = addDays(today, -29);

  const [
    { count: habitCount },
    { data: logs },
    { data: water },
    { data: sleep },
    { data: mood },
    { data: nutrition },
    { data: workouts },
    { data: journal },
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
      .gte("date", monthAgo)
      .returns<LogEntry[]>(),
    supabase.from("water_logs").select("date").eq("user_id", user!.id).gte("date", monthAgo),
    supabase.from("sleep_logs").select("date").eq("user_id", user!.id).gte("date", monthAgo),
    supabase.from("mood_logs").select("date").eq("user_id", user!.id).gte("date", monthAgo),
    supabase.from("nutrition_logs").select("date").eq("user_id", user!.id).gte("date", monthAgo),
    supabase.from("workout_logs").select("date").eq("user_id", user!.id).gte("date", monthAgo),
    supabase.from("journal_entries").select("date").eq("user_id", user!.id).gte("date", monthAgo),
  ]);

  const habits = habitCount ?? 0;
  const allLogs = logs ?? [];

  const week = dailyCompletion(allLogs, habits, addDays(today, -6), today);
  const month = dailyCompletion(allLogs, habits, monthAgo, today);

  const weekAvg = week.length
    ? Math.round((week.reduce((s, d) => s + d.ratio, 0) / week.length) * 100)
    : 0;
  const monthAvg = month.length
    ? Math.round((month.reduce((s, d) => s + d.ratio, 0) / month.length) * 100)
    : 0;

  // Weekday averages over the 30-day window — "the shape of your weeks".
  const byWeekday = new Map<number, { sum: number; n: number }>();
  for (const d of month) {
    const idx = (weekdayIndex(d.date) + 6) % 7; // Monday-first
    const cell = byWeekday.get(idx) ?? { sum: 0, n: 0 };
    cell.sum += d.ratio;
    cell.n += 1;
    byWeekday.set(idx, cell);
  }
  const weekdayAvgs = WEEKDAYS.map((label, i) => {
    const cell = byWeekday.get(i);
    return {
      label,
      pct: cell && cell.n ? Math.round((cell.sum / cell.n) * 100) : 0,
    };
  });
  const strongest = [...weekdayAvgs].sort((a, b) => b.pct - a.pct)[0];
  const weakest = [...weekdayAvgs].sort((a, b) => a.pct - b.pct)[0];

  const modules = [
    { label: "Habits", days: uniqueDays(allLogs) },
    { label: "Water", days: uniqueDays(water) },
    { label: "Sleep", days: uniqueDays(sleep) },
    { label: "Mood", days: uniqueDays(mood) },
    { label: "Nutrition", days: uniqueDays(nutrition) },
    { label: "Workout", days: uniqueDays(workouts) },
    { label: "Journal", days: uniqueDays(journal) },
  ].sort((a, b) => b.days - a.days);

  const hasAnything = allLogs.length > 0 || modules.some((m) => m.days > 0);

  if (!hasAnything) {
    return (
      <>
        <PageHeader
          eyebrow="Last 30 days"
          title="Analytics"
          subtitle="Patterns instead of numbers. Look for the shape of your weeks, not the score of your days."
        />
        <EmptyState
          illustration={<LoopIllustration />}
          title="Patterns need a few days"
          body="There's nothing to find a pattern in yet. Log today, come back at the end of the week, and this page starts showing which days you're strongest on."
          action={
            <Link href="/dashboard" className={buttonClass("primary")}>
              Log today
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Last 30 days"
        title="Analytics"
        subtitle="Patterns instead of numbers. Look for the shape of your weeks, not the score of your days."
      />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section aria-label="This week" className={`${CARD_BASE} p-6 sm:p-7`}>
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <h2 className="text-[15px] font-semibold tracking-tight">This week</h2>
            <p className="tabular text-[12px] text-muted-foreground">
              {weekAvg}% average completion
            </p>
          </div>
          <WeekBars days={week} />
        </section>

        <section aria-label="Weekday shape" className={`${CARD_BASE} p-6 sm:p-7`}>
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <h2 className="text-[15px] font-semibold tracking-tight">
              By weekday
            </h2>
            <p className="text-[12px] text-muted-foreground">30-day average</p>
          </div>
          <ul className="space-y-2.5">
            {weekdayAvgs.map((d) => (
              <li key={d.label} className="flex items-center gap-3">
                <span className="w-9 shrink-0 text-[12px] text-muted-foreground">
                  {d.label.slice(0, 3)}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full rounded-full bg-accent transition-[width] duration-700"
                    style={{ width: `${d.pct}%` }}
                  />
                </span>
                <span className="tabular w-9 shrink-0 text-right text-[12px] text-muted-foreground">
                  {d.pct}%
                </span>
              </li>
            ))}
          </ul>
          {strongest.pct > 0 && strongest.pct !== weakest.pct ? (
            <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
              {strongest.label}s are your strongest day at {strongest.pct}%.{" "}
              {weakest.label}s are the one to protect, at {weakest.pct}%.
            </p>
          ) : null}
        </section>
      </div>

      <section aria-label="Monthly completion" className={`${CARD_BASE} p-6 sm:p-7`}>
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[15px] font-semibold tracking-tight">
            Monthly completion
          </h2>
          <p className="tabular text-[12px] text-muted-foreground">
            {monthAvg}% average across 30 days
          </p>
        </div>
        <AreaTrend
          points={month.map((d) => ({
            label: d.date.slice(5).replace("-", "/"),
            value: Math.round(d.ratio * 100),
          }))}
          ariaLabel="Habit completion percentage over the last 30 days"
        />
      </section>

      <section aria-label="What you actually log" className={`${CARD_BASE} p-6 sm:p-7`}>
        <h2 className="text-[15px] font-semibold tracking-tight">
          What you actually log
        </h2>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Days touched out of the last 30 — useful for spotting a module that
          isn&apos;t earning its place on your Daily page.
        </p>
        <ul className="mt-5 space-y-2.5">
          {modules.map((m) => (
            <li key={m.label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-[13px]">{m.label}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <span
                  className="block h-full rounded-full bg-accent transition-[width] duration-700"
                  style={{ width: `${(m.days / 30) * 100}%` }}
                />
              </span>
              <span className="tabular w-14 shrink-0 text-right text-[12px] text-muted-foreground">
                {m.days} / 30
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function uniqueDays(rows: { date: string }[] | null): number {
  return new Set((rows ?? []).map((r) => r.date)).size;
}

function weekdayIndex(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}
