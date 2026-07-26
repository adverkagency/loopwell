import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Global search across the user's own rows only — RLS is the real boundary,
 * the explicit `user_id` filters are defence in depth.
 *
 * Each table is queried with its own `.ilike()` rather than a single `.or()`
 * string: PostgREST's `or=` syntax is comma-delimited, so folding user input
 * into it would let a comma or parenthesis rewrite the filter.
 */

export type SearchHit = {
  type: "habit" | "goal" | "food" | "workout" | "journal" | "mood";
  title: string;
  subtitle: string;
  href: string;
};

const PER_TABLE = 5;
const MAX_RESULTS = 12;

/** Escape LIKE wildcards so a query of "100%" doesn't match everything. */
function likePattern(q: string): string {
  return `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const pattern = likePattern(q.slice(0, 100));

  const [habits, goals, foods, workouts, journals, moods] = await Promise.all([
    supabase
      .from("habits")
      .select("id, name, archived_at")
      .eq("user_id", user.id)
      .ilike("name", pattern)
      .limit(PER_TABLE),
    supabase
      .from("goals")
      .select("id, label, current_value, target_value, unit, completed_at")
      .eq("user_id", user.id)
      .ilike("label", pattern)
      .limit(PER_TABLE),
    supabase
      .from("nutrition_logs")
      .select("id, food_name, calories, date")
      .eq("user_id", user.id)
      .ilike("food_name", pattern)
      .order("date", { ascending: false })
      .limit(PER_TABLE),
    supabase
      .from("workout_logs")
      .select("id, name, kind, date")
      .eq("user_id", user.id)
      .ilike("name", pattern)
      .order("date", { ascending: false })
      .limit(PER_TABLE),
    supabase
      .from("journal_entries")
      .select("id, body, date")
      .eq("user_id", user.id)
      .ilike("body", pattern)
      .order("date", { ascending: false })
      .limit(PER_TABLE),
    supabase
      .from("mood_logs")
      .select("id, note, mood, date")
      .eq("user_id", user.id)
      .ilike("note", pattern)
      .order("date", { ascending: false })
      .limit(PER_TABLE),
  ]);

  const results: SearchHit[] = [
    ...(habits.data ?? []).map((h) => ({
      type: "habit" as const,
      title: h.name as string,
      subtitle: h.archived_at ? "Habit · archived" : "Habit",
      href: h.archived_at ? "/dashboard/settings/habits" : "/dashboard/habits",
    })),
    ...(goals.data ?? []).map((g) => ({
      type: "goal" as const,
      title: g.label as string,
      subtitle: g.completed_at
        ? "Goal · complete"
        : `Goal · ${g.current_value} of ${g.target_value}${g.unit ? ` ${g.unit}` : ""}`,
      href: "/dashboard/goals",
    })),
    ...(foods.data ?? []).map((f) => ({
      type: "food" as const,
      title: f.food_name as string,
      subtitle: `Food · ${Math.round(Number(f.calories))} kcal · ${f.date}`,
      href: "/dashboard/nutrition",
    })),
    ...(workouts.data ?? []).map((w) => ({
      type: "workout" as const,
      title: w.name as string,
      subtitle: `Workout · ${w.kind} · ${w.date}`,
      href: "/dashboard",
    })),
    ...(journals.data ?? []).map((j) => ({
      type: "journal" as const,
      title: snippet(j.body as string, q),
      subtitle: `Journal · ${j.date}`,
      href: "/dashboard",
    })),
    ...(moods.data ?? []).map((m) => ({
      type: "mood" as const,
      title: (m.note as string) ?? "Mood note",
      subtitle: `Mood · ${m.mood} of 5 · ${m.date}`,
      href: "/dashboard/health",
    })),
  ].slice(0, MAX_RESULTS);

  return NextResponse.json({ results });
}

/** A window of journal text around the match, so the hit is recognisable. */
function snippet(body: string, q: string): string {
  const text = body.replace(/\s+/g, " ").trim();
  const at = text.toLowerCase().indexOf(q.toLowerCase());
  if (at < 0) return text.slice(0, 70);
  const start = Math.max(0, at - 25);
  const out = text.slice(start, start + 70);
  return `${start > 0 ? "…" : ""}${out}${start + 70 < text.length ? "…" : ""}`;
}
