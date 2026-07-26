import { createClient } from "@/lib/supabase/server";
import { addDays, safeTimezone, todayInTz } from "@/lib/dates";
import { NutritionCard, type NutritionEntry } from "@/features/modules/module-cards";
import { CARD_BASE, PageHeader } from "@/components/ui/kit";

export const metadata = { title: "Nutrition — Loopwell" };

const WINDOW_DAYS = 14;

type Row = NutritionEntry & { date: string };

export default async function NutritionPage() {
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
  const from = addDays(today, -(WINDOW_DAYS - 1));

  const { data: rows } = await supabase
    .from("nutrition_logs")
    .select(
      "id, date, food_name, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g"
    )
    .eq("user_id", user!.id)
    .gte("date", from)
    .order("created_at", { ascending: true })
    .returns<Row[]>();

  const all = rows ?? [];
  const todayEntries = all.filter((r) => r.date === today);

  const totals = todayEntries.reduce(
    (t, e) => ({
      cal: t.cal + Number(e.calories ?? 0),
      protein: t.protein + Number(e.protein_g ?? 0),
      carbs: t.carbs + Number(e.carbs_g ?? 0),
      fat: t.fat + Number(e.fat_g ?? 0),
    }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Macro split by calories, not grams — 4/4/9 kcal per gram.
  const macroKcal = {
    protein: totals.protein * 4,
    carbs: totals.carbs * 4,
    fat: totals.fat * 9,
  };
  const macroTotal =
    macroKcal.protein + macroKcal.carbs + macroKcal.fat || 1;

  const byDate = new Map<string, number>();
  for (const r of all) {
    byDate.set(r.date, (byDate.get(r.date) ?? 0) + (Number(r.calories) || 0));
  }
  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => {
    const date = addDays(from, i);
    return { date, calories: byDate.get(date) ?? 0 };
  });
  const loggedDays = days.filter((d) => d.calories > 0);
  const avg = loggedDays.length
    ? Math.round(
        loggedDays.reduce((s, d) => s + d.calories, 0) / loggedDays.length
      )
    : 0;
  const peak = Math.max(1, ...days.map((d) => d.calories));

  return (
    <>
      <PageHeader
        eyebrow="Today"
        title="Nutrition"
        subtitle="Eat well, log lightly. Nothing here needs to be perfect — a rough number beats no number."
      />

      <div className="grid items-start gap-6 lg:grid-cols-12 [&>*]:min-w-0">
        <div className="lg:col-span-7">
          <NutritionCard today={today} entries={todayEntries} defaultOpen />
        </div>

        <section
          aria-label="Today's macros"
          className={`${CARD_BASE} p-6 sm:p-7 lg:col-span-5`}
        >
          <h2 className="text-[15px] font-semibold tracking-tight">Today</h2>
          <p className="tabular mt-4 text-[28px] font-medium leading-none tracking-tight">
            {Math.round(totals.cal).toLocaleString()}
            <span className="ml-1 text-[14px] text-muted-foreground">kcal</span>
          </p>

          {totals.cal > 0 ? (
            <>
              <div
                role="img"
                aria-label={`Macro split: protein ${Math.round((macroKcal.protein / macroTotal) * 100)}%, carbs ${Math.round((macroKcal.carbs / macroTotal) * 100)}%, fat ${Math.round((macroKcal.fat / macroTotal) * 100)}%`}
                className="mt-5 flex h-2 overflow-hidden rounded-full bg-secondary"
              >
                <span
                  className="bg-accent"
                  style={{ width: `${(macroKcal.protein / macroTotal) * 100}%` }}
                />
                <span
                  className="bg-accent/60"
                  style={{ width: `${(macroKcal.carbs / macroTotal) * 100}%` }}
                />
                <span
                  className="bg-accent/30"
                  style={{ width: `${(macroKcal.fat / macroTotal) * 100}%` }}
                />
              </div>
              <ul className="tabular mt-5 grid grid-cols-3 gap-3 text-center">
                {(
                  [
                    ["Protein", totals.protein],
                    ["Carbs", totals.carbs],
                    ["Fat", totals.fat],
                  ] as const
                ).map(([label, grams]) => (
                  <li key={label}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 text-[16px] font-medium">
                      {Math.round(grams)}g
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              Nothing logged today. Add a meal and Loopwell quietly learns your
              rhythm — no calorie shaming, ever.
            </p>
          )}
        </section>
      </div>

      <section aria-label="Calorie history" className={`${CARD_BASE} p-6 sm:p-7`}>
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[15px] font-semibold tracking-tight">
            Last {WINDOW_DAYS} days
          </h2>
          <p className="tabular text-[12px] text-muted-foreground">
            {loggedDays.length === 0
              ? "No days logged yet"
              : `${avg.toLocaleString()} kcal average across ${loggedDays.length} logged day${loggedDays.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <div
          role="img"
          aria-label={`Daily calories, last ${WINDOW_DAYS} days: ${days.map((d) => `${d.date.slice(5)} ${Math.round(d.calories)}`).join(", ")}`}
          className="flex h-32 items-end gap-1.5"
        >
          {days.map((d, i) => (
            <div
              key={d.date}
              title={`${d.date}: ${Math.round(d.calories).toLocaleString()} kcal`}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
            >
              <div
                style={{
                  height: `${Math.max(2, (d.calories / peak) * 100)}%`,
                  animationDelay: `${i * 40}ms`,
                }}
                className={`grow-bar w-full rounded-lg ${
                  d.date === today ? "bg-accent" : "bg-accent-line"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="tabular mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>{days[0].date.slice(5)}</span>
          <span>Today</span>
        </div>
      </section>
    </>
  );
}
