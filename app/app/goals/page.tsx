import { createClient } from "@/lib/supabase/server";
import { GoalBoard, type Goal } from "@/features/goals/goal-board";

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
      <h1 className="text-3xl font-bold tracking-tight text-ink">Goals</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Longer-term targets, separate from your daily habits.
      </p>
      <div className="mt-6">
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
