"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeTimezone } from "@/lib/dates";
import { sleepDurationMinutes } from "@/lib/health";
import {
  addWaterSchema,
  setMoodSchema,
  setSleepSchema,
  setWeightSchema,
} from "@/lib/validation/health";

export type ActionState = { error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function addWater(input: {
  date: string;
  amount_ml: number;
}): Promise<ActionState> {
  const parsed = addWaterSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid amount" };

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("water_logs")
    .insert({ user_id: user.id, ...parsed.data });
  if (error) return { error: "Couldn't log water — try again." };

  revalidatePath("/dashboard");
  return {};
}

export async function setSleep(input: {
  date: string;
  bed_time: string;
  wake_time: string;
  quality: "poor" | "okay" | "great" | null;
}): Promise<ActionState> {
  const parsed = setSleepSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid sleep entry" };

  let duration: number;
  try {
    duration = sleepDurationMinutes(parsed.data.bed_time, parsed.data.wake_time);
  } catch {
    return { error: "Invalid sleep times" };
  }

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("sleep_logs").upsert(
    {
      user_id: user.id,
      date: parsed.data.date,
      bed_time: parsed.data.bed_time,
      wake_time: parsed.data.wake_time,
      duration_minutes: duration,
      quality: parsed.data.quality,
    },
    { onConflict: "user_id,date" }
  );
  if (error) return { error: "Couldn't save sleep — try again." };

  revalidatePath("/dashboard");
  return {};
}

export async function setMood(input: {
  date: string;
  mood: number;
  note?: string;
}): Promise<ActionState> {
  const parsed = setMoodSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid mood entry" };

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("mood_logs").upsert(
    {
      user_id: user.id,
      date: parsed.data.date,
      mood: parsed.data.mood,
      note: parsed.data.note || null,
    },
    { onConflict: "user_id,date" }
  );
  if (error) return { error: "Couldn't save mood — try again." };

  revalidatePath("/dashboard");
  return {};
}

export async function setWeight(input: {
  date: string;
  weight_kg: number;
}): Promise<ActionState> {
  const parsed = setWeightSchema.safeParse(input);
  if (!parsed.success) return { error: "Enter a value greater than 0" };

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("weight_logs").upsert(
    { user_id: user.id, ...parsed.data },
    { onConflict: "user_id,date" }
  );
  if (error) return { error: "Couldn't save weight — try again." };

  revalidatePath("/dashboard");
  return {};
}

/** Settings toggle — hiding Weight removes the module entirely, not visually. */
export async function setWeightModuleEnabled(
  enabled: boolean
): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("profiles")
    .update({ weight_module_enabled: enabled })
    .eq("id", user.id);
  if (error) return { error: "Couldn't update — try again." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return {};
}

/**
 * Self-service timezone change — onboarding only captures this once, and
 * without a way to fix it later a wrong OS clock at signup (or a move)
 * permanently skews every "today" boundary: streaks, goals, challenges.
 */
export async function setTimezone(timezone: string): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  const tz = safeTimezone(timezone);
  if (tz !== timezone) return { error: "Unrecognized timezone." };

  const { error } = await supabase
    .from("profiles")
    .update({ timezone: tz })
    .eq("id", user.id);
  if (error) return { error: "Couldn't update — try again." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard/challenges");
  revalidatePath("/dashboard/health");
  return {};
}
