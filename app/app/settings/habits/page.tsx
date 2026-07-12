import { createClient } from "@/lib/supabase/server";
import { HabitManager } from "@/features/habits/habit-manager";
import type { HabitRow } from "@/lib/api-types/db";

export const metadata = { title: "Habits — Settings — Loopwell" };

export default async function HabitsSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: habits } = await supabase
    .from("habits")
    .select(
      "id, name, icon, color, frequency_count, frequency_period, in_quick_log, archived_at"
    )
    .eq("user_id", user!.id)
    .order("sort_order", { ascending: true })
    .returns<
      Pick<
        HabitRow,
        "id" | "name" | "icon" | "color" | "frequency_count" | "frequency_period" | "in_quick_log" | "archived_at"
      >[]
    >();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Habits</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Add, edit, reorder, and archive — the Quick Log bar holds up to 6.
      </p>
      <div className="mt-6">
        <HabitManager habits={habits ?? []} />
      </div>
    </>
  );
}
