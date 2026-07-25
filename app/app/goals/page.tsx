import { createClient } from "@/lib/supabase/server";
import { GoalBoard, type Goal } from "@/features/goals/goal-board";
import { PageHeader } from "@/components/ui/kit";

export const metadata = { title: "Goals — Loopwell" };

export default async function GoalsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: goals } = await supabase
    .from("goals")
    .select(
      "id, label, target_value, current_value, start_value, unit, deadline, completed_at"
    )
    .eq("user_id", user!.id)
    .order("deadline", { ascending: true, nullsFirst: false })
    .returns<Goal[]>();

  return (
    <>
      <PageHeader
        eyebrow="Long game"
        title="Goals"
        subtitle="Longer-term targets, separate from your daily habits."
      />
      <div>
        <GoalBoard
          goals={(goals ?? []).map((g) => ({
            ...g,
            target_value: Number(g.target_value),
            current_value: Number(g.current_value),
            start_value: g.start_value === null ? null : Number(g.start_value),
          }))}
        />
      </div>
    </>
  );
}
