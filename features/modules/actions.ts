"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  journalEntrySchema,
  nutritionEntrySchema,
  workoutEntrySchema,
} from "@/lib/validation/modules";

export type ActionState = { error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

/* ---------- Nutrition ---------- */

export async function addNutrition(
  input: Record<string, unknown>
): Promise<ActionState> {
  const parsed = nutritionEntrySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("nutrition_logs")
    .insert({ user_id: user.id, ...parsed.data });
  if (error) return { error: "Couldn't log that — try again." };

  revalidatePath("/app/daily");
  return {};
}

export async function deleteNutrition(id: string): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("nutrition_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: "Couldn't remove — try again." };

  revalidatePath("/app/daily");
  return {};
}

/* ---------- Workout ---------- */

export async function addWorkout(
  input: Record<string, unknown>
): Promise<ActionState> {
  const parsed = workoutEntrySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("workout_logs")
    .insert({ user_id: user.id, ...parsed.data });
  if (error) return { error: "Couldn't log the workout — try again." };

  revalidatePath("/app/daily");
  return {};
}

export async function deleteWorkout(id: string): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("workout_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: "Couldn't remove — try again." };

  revalidatePath("/app/daily");
  return {};
}

/* ---------- Journal (one entry per day) ---------- */

export async function saveJournal(input: {
  date: string;
  body: string;
}): Promise<ActionState> {
  const parsed = journalEntrySchema.safeParse(input);
  if (!parsed.success) return { error: "Entry is too long" };

  const { supabase, user } = await requireUser();

  if (parsed.data.body.trim() === "") {
    await supabase
      .from("journal_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("date", parsed.data.date);
  } else {
    const { error } = await supabase.from("journal_entries").upsert(
      {
        user_id: user.id,
        date: parsed.data.date,
        body: parsed.data.body,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,date" }
    );
    if (error) return { error: "Couldn't save the entry — try again." };
  }

  revalidatePath("/app/daily");
  return {};
}
