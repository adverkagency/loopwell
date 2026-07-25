import { createClient } from "@/lib/supabase/server";
import { HabitManager } from "@/features/habits/habit-manager";
import { PageHeader } from "@/components/ui/kit";
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
      <PageHeader
        eyebrow="Settings"
        title="Habits"
        subtitle="Add, edit, reorder, and archive — the Quick Log bar holds up to 6."
      />
      <div>
        <HabitManager habits={habits ?? []} />
      </div>
    </>
  );
}
