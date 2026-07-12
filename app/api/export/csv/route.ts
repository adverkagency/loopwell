import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Full-account CSV export — doubles as the GDPR/CCPA data-export mechanism
 * (open item #3 in the pre-build review). Sections stacked in one file,
 * each with its own header row. On-demand, never stored.
 */

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function section(title: string, rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return `# ${title}\n(no data)\n\n`;
  const cols = Object.keys(rows[0]);
  const lines = [
    `# ${title}`,
    cols.join(","),
    ...rows.map((r) => cols.map((c) => csvEscape(r[c])).join(",")),
    "",
    "",
  ];
  return lines.join("\n");
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const uid = user.id;
  const pick = <T extends Record<string, unknown>>(d: T[] | null) => d ?? [];

  const [habits, habitLogs, water, sleep, weight, mood, nutrition, workouts, journal, goals] =
    await Promise.all([
      supabase.from("habits").select("name, frequency_count, frequency_period, archived_at, created_at").eq("user_id", uid),
      supabase.from("habit_logs").select("habit_id, date, state").eq("user_id", uid).order("date"),
      supabase.from("water_logs").select("date, amount_ml").eq("user_id", uid).order("date"),
      supabase.from("sleep_logs").select("date, bed_time, wake_time, duration_minutes, quality").eq("user_id", uid).order("date"),
      supabase.from("weight_logs").select("date, weight_kg, body_fat_pct, muscle_pct").eq("user_id", uid).order("date"),
      supabase.from("mood_logs").select("date, mood, note").eq("user_id", uid).order("date"),
      supabase.from("nutrition_logs").select("date, food_name, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g").eq("user_id", uid).order("date"),
      supabase.from("workout_logs").select("date, kind, name, sets, reps, weight_kg, distance_km, duration_minutes").eq("user_id", uid).order("date"),
      supabase.from("journal_entries").select("date, body").eq("user_id", uid).order("date"),
      supabase.from("goals").select("label, target_value, current_value, start_value, unit, deadline, completed_at").eq("user_id", uid),
    ]);

  const csv = [
    `# Loopwell data export — ${new Date().toISOString()}`,
    "",
    section("Habits", pick(habits.data)),
    section("Habit logs", pick(habitLogs.data)),
    section("Water", pick(water.data)),
    section("Sleep", pick(sleep.data)),
    section("Weight", pick(weight.data)),
    section("Mood", pick(mood.data)),
    section("Nutrition", pick(nutrition.data)),
    section("Workouts", pick(workouts.data)),
    section("Journal", pick(journal.data)),
    section("Goals", pick(goals.data)),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="loopwell-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
