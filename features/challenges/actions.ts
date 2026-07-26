"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { joinChallengeSchema, challengeIdSchema } from "@/lib/validation/challenges";
import { safeTimezone, todayInTz } from "@/lib/dates";

export type ActionState = { error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function joinChallenge(input: {
  challenge_id: string;
}): Promise<ActionState> {
  const parsed = joinChallengeSchema.safeParse(input);
  if (!parsed.success) return { error: "Unknown challenge." };

  const { supabase, user } = await requireUser();

  // The window opens on the user's today, never the server's — same rule as
  // every other date in the app.
  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();
  const joinedOn = todayInTz(safeTimezone(profile?.timezone as string | undefined));

  const { error } = await supabase.from("user_challenges").insert({
    user_id: user.id,
    challenge_id: parsed.data.challenge_id,
    joined_on: joinedOn,
  });
  if (error) {
    return {
      error:
        error.code === "23505"
          ? "You're already in that challenge."
          : "Couldn't join — try again.",
    };
  }

  revalidatePath("/dashboard/challenges");
  revalidatePath("/dashboard");
  return {};
}

/** Leaving deletes the row, so rejoining later starts a clean window. */
export async function leaveChallenge(input: {
  challenge_id: string;
}): Promise<ActionState> {
  const parsed = challengeIdSchema.safeParse(input.challenge_id);
  if (!parsed.success) return { error: "Unknown challenge." };

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("user_challenges")
    .delete()
    .eq("user_id", user.id)
    .eq("challenge_id", parsed.data);
  if (error) return { error: "Couldn't leave — try again." };

  revalidatePath("/dashboard/challenges");
  revalidatePath("/dashboard");
  return {};
}

/** Stamps completed_at once the target is hit — idempotent, safe to re-run. */
export async function markChallengeComplete(
  challengeId: string
): Promise<ActionState> {
  const parsed = challengeIdSchema.safeParse(challengeId);
  if (!parsed.success) return { error: "Unknown challenge." };

  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("user_challenges")
    .update({ completed_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("challenge_id", parsed.data)
    .is("completed_at", null);
  if (error) return { error: "Couldn't update — try again." };
  return {};
}
