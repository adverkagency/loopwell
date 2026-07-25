"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeTimezone, todayInTz } from "@/lib/dates";
import {
  habitInputSchema,
  onboardingSchema,
  setStateSchema,
} from "@/lib/validation/habits";
import { HABIT_TEMPLATES } from "./templates";

export type ActionState = { error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

/** Tri-state toggle for one habit on one date. `state: null` clears the log. */
export async function setHabitState(input: {
  habit_id: string;
  date: string;
  state: "complete" | "partial" | "skip" | null;
}): Promise<ActionState> {
  const parsed = setStateSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid log" };

  const { supabase, user } = await requireUser();
  const { habit_id, date, state } = parsed.data;

  if (state === null) {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habit_id)
      .eq("user_id", user.id)
      .eq("date", date);
    if (error) return { error: "Couldn't clear that — try again." };
  } else {
    const { error } = await supabase
      .from("habit_logs")
      .upsert(
        { user_id: user.id, habit_id, date, state },
        { onConflict: "habit_id,date" }
      );
    if (error) return { error: "Couldn't save that — try again." };
  }

  revalidatePath("/dashboard");
  return {};
}

export async function createHabit(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = habitInputSchema.safeParse({
    name: formData.get("name"),
    frequency_count: formData.get("frequency_count") ?? 7,
    frequency_period: formData.get("frequency_period") ?? "week",
    in_quick_log: formData.get("in_quick_log") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { supabase, user } = await requireUser();

  const { count } = await supabase
    .from("habits")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    ...parsed.data,
    sort_order: (count ?? 0) + 1,
  });
  if (error) return { error: "Couldn't create the habit — try again." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings/habits");
  return {};
}

export async function updateHabit(
  habitId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = habitInputSchema.safeParse({
    name: formData.get("name"),
    frequency_count: formData.get("frequency_count") ?? 7,
    frequency_period: formData.get("frequency_period") ?? "week",
    in_quick_log: formData.get("in_quick_log") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("habits")
    .update(parsed.data)
    .eq("id", habitId)
    .eq("user_id", user.id);
  if (error) return { error: "Couldn't save changes — try again." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings/habits");
  return {};
}

export async function setHabitArchived(
  habitId: string,
  archived: boolean
): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("habits")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", habitId)
    .eq("user_id", user.id);
  if (error) return { error: "Couldn't update — try again." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings/habits");
  return {};
}

export async function moveHabit(
  habitId: string,
  direction: "up" | "down"
): Promise<ActionState> {
  const { supabase, user } = await requireUser();

  const { data: habits } = await supabase
    .from("habits")
    .select("id, sort_order")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .order("sort_order", { ascending: true });

  if (!habits) return { error: "Couldn't reorder." };
  const idx = habits.findIndex((h) => h.id === habitId);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= habits.length) return {};

  const a = habits[idx];
  const b = habits[swap];
  await supabase
    .from("habits")
    .update({ sort_order: b.sort_order })
    .eq("id", a.id)
    .eq("user_id", user.id);
  await supabase
    .from("habits")
    .update({ sort_order: a.sort_order })
    .eq("id", b.id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings/habits");
  return {};
}

/**
 * Onboarding completion: create the picked template habits, pre-complete the
 * first one for today ("first win"), stamp the profile, land on Daily.
 */
export async function completeOnboarding(input: {
  habit_names: string[];
  timezone: string;
}): Promise<ActionState> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) return { error: "Pick 3–5 habits to continue." };

  const { supabase, user } = await requireUser();
  const tz = safeTimezone(parsed.data.timezone);

  const rows = parsed.data.habit_names.map((name, i) => {
    const template = HABIT_TEMPLATES.find((t) => t.name === name);
    return {
      user_id: user.id,
      name,
      icon: template?.icon ?? null,
      color: template?.color ?? null,
      sort_order: i + 1,
      in_quick_log: i < 5, // starter habits all fit the ≤6 Quick Log cap
    };
  });

  const { data: created, error } = await supabase
    .from("habits")
    .insert(rows)
    .select("id, sort_order");
  if (error || !created?.length) {
    return { error: "Couldn't save your habits — try again." };
  }

  // First win — pre-complete the first habit for today (user's timezone)
  const first = created.reduce((a, b) => (a.sort_order <= b.sort_order ? a : b));
  await supabase.from("habit_logs").upsert(
    {
      user_id: user.id,
      habit_id: first.id,
      date: todayInTz(tz),
      state: "complete",
    },
    { onConflict: "habit_id,date" }
  );

  await supabase
    .from("profiles")
    .update({ timezone: tz, onboarding_completed_at: new Date().toISOString() })
    .eq("id", user.id);

  redirect("/dashboard");
}
