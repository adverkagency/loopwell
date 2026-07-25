"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { goalInputSchema, goalProgressSchema } from "@/lib/validation/goals";

export type ActionState = { error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

function parseGoalForm(formData: FormData) {
  return goalInputSchema.safeParse({
    label: formData.get("label"),
    target_value: formData.get("target_value"),
    current_value: formData.get("current_value") || 0,
    start_value: formData.get("start_value") || undefined,
    unit: formData.get("unit") || undefined,
    deadline: formData.get("deadline") || "",
  });
}

export async function createGoal(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseGoalForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { supabase, user } = await requireUser();
  const { deadline, ...rest } = parsed.data;
  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    ...rest,
    start_value: rest.start_value ?? rest.current_value,
    deadline: deadline || null,
  });
  if (error) return { error: "Couldn't create the goal — try again." };

  revalidatePath("/dashboard/goals");
  return {};
}

export async function updateGoal(
  goalId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseGoalForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { supabase, user } = await requireUser();
  const { deadline, ...rest } = parsed.data;
  const { error } = await supabase
    .from("goals")
    .update({ ...rest, deadline: deadline || null })
    .eq("id", goalId)
    .eq("user_id", user.id);
  if (error) return { error: "Couldn't save changes — try again." };

  revalidatePath("/dashboard/goals");
  return {};
}

export async function updateGoalProgress(input: {
  id: string;
  current_value: number;
}): Promise<ActionState> {
  const parsed = goalProgressSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid value" };

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("goals")
    .update({ current_value: parsed.data.current_value })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);
  if (error) return { error: "Couldn't save — try again." };

  revalidatePath("/dashboard/goals");
  return {};
}

export async function setGoalCompleted(
  goalId: string,
  completed: boolean
): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("goals")
    .update({ completed_at: completed ? new Date().toISOString() : null })
    .eq("id", goalId)
    .eq("user_id", user.id);
  if (error) return { error: "Couldn't update — try again." };

  revalidatePath("/dashboard/goals");
  return {};
}

export async function deleteGoal(goalId: string): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", user.id);
  if (error) return { error: "Couldn't delete — try again." };

  revalidatePath("/dashboard/goals");
  return {};
}
