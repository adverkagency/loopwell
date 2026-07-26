import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { safeTimezone, todayInTz } from "@/lib/dates";
import { dailyCompletion, type LogEntry } from "@/features/progress/compute";
import { MonthGrid } from "@/features/progress/charts";
import { CARD_BASE, PageHeader, buttonClass } from "@/components/ui/kit";
import type { HabitState } from "@/features/habits/streak";

export const metadata = { title: "Calendar — Loopwell" };

export default async function CalendarPage() {
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
  const [year, month] = today.split("-").map(Number);

  const monthStart = `${today.slice(0, 7)}-01`;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const monthEnd = `${today.slice(0, 7)}-${String(lastDay).padStart(2, "0")}`;

  const [{ count: habitCount }, { data: logs }, { data: habits }] = await Promise.all([
    supabase
      .from("habits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .is("archived_at", null),
    supabase
      .from("habit_logs")
      .select("habit_id, date, state")
      .eq("user_id", user!.id)
      .gte("date", monthStart)
      .lte("date", monthEnd)
      .returns<LogEntry[]>(),
    supabase
      .from("habits")
      .select("id, name")
      .eq("user_id", user!.id)
      .is("archived_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  const habitsCount = habitCount ?? 0;
  const completion = dailyCompletion(logs ?? [], habitsCount, monthStart, monthEnd);

  // dailyCompletion returns nothing when there are no habits — still draw the
  // month, just with every day at zero.
  const ratioByDate = new Map(completion.map((d) => [d.date, d.ratio]));
  const days = Array.from({ length: lastDay }, (_, i) => {
    const date = `${today.slice(0, 7)}-${String(i + 1).padStart(2, "0")}`;
    return { date, ratio: date > today ? null : (ratioByDate.get(date) ?? 0) };
  });

  const loggedDays = days.filter((d) => (d.ratio ?? 0) > 0).length;
  const perfectDays = days.filter((d) => d.ratio === 1).length;
  const elapsed = days.filter((d) => d.ratio !== null).length;

  const loggedToday = new Set(
    (logs ?? []).filter((l) => l.date === today).map((l) => l.habit_id)
  );
  const remaining = (habits ?? []).filter((h) => !loggedToday.has(h.id as string));

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "long",
    year: "numeric",
  }).format(new Date());

  const states = new Map<string, HabitState>(
    (logs ?? [])
      .filter((l) => l.date === today)
      .map((l) => [l.habit_id, l.state as HabitState])
  );

  return (
    <>
      <PageHeader
        eyebrow={monthLabel}
        title="Calendar"
        subtitle="A month of consistency, one soft square at a time."
      />

      <div className="grid items-start gap-6 lg:grid-cols-12 [&>*]:min-w-0">
        <section
          aria-label={`${monthLabel} habit completion`}
          className={`${CARD_BASE} p-6 sm:p-7 lg:col-span-7`}
        >
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[15px] font-semibold tracking-tight">This month</h2>
            <p className="tabular text-[12px] text-muted-foreground">
              {loggedDays} of {elapsed} days logged
              {perfectDays > 0 ? ` · ${perfectDays} perfect` : ""}
            </p>
          </div>
          <MonthGrid days={days} monthLabel={monthLabel} />
        </section>

        <section
          aria-label="Rest of today"
          className={`${CARD_BASE} p-6 sm:p-7 lg:col-span-5`}
        >
          <h2 className="text-[15px] font-semibold tracking-tight">Rest of today</h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Habits still waiting on a tap.
          </p>

          {habitsCount === 0 ? (
            <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
              No habits yet — the calendar fills in once you have at least one.
            </p>
          ) : remaining.length === 0 ? (
            <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
              Every habit is accounted for today. That&apos;s the whole loop
              closed — nothing left to do here.
            </p>
          ) : (
            <ul className="mt-5 flex flex-col divide-y divide-border">
              {remaining.map((h) => (
                <li
                  key={h.id as string}
                  className="flex items-center gap-3 py-2.5 text-[14px]"
                >
                  <span
                    aria-hidden
                    className="size-2 shrink-0 rounded-full bg-accent-line"
                  />
                  <span className="min-w-0 flex-1 truncate">{h.name as string}</span>
                </li>
              ))}
            </ul>
          )}

          {states.size > 0 ? (
            <p className="tabular mt-5 text-[12px] text-muted-foreground">
              {[...states.values()].filter((s) => s === "complete").length} complete
              {" · "}
              {[...states.values()].filter((s) => s === "partial").length} partial
              {" · "}
              {[...states.values()].filter((s) => s === "skip").length} skipped
            </p>
          ) : null}

          <Link href="/dashboard" className={`${buttonClass("primary", "sm")} mt-6`}>
            Go to today
          </Link>
        </section>
      </div>
    </>
  );
}
