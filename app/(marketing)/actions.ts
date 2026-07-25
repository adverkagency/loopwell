"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema, deletionSchema } from "@/lib/validation/marketing";

export type FormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

/** Flatten a Zod error into the per-field shape the forms render. */
function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export async function submitContact(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    topic: String(formData.get("topic") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues), values: raw };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { error } = await supabase.from("contact_messages").insert({
    ...parsed.data,
    user_id: auth.user?.id ?? null,
  });

  if (error) {
    return { error: "Something went wrong sending that. Try again in a moment.", values: raw };
  }

  return { ok: true };
}

export async function submitDeletionRequest(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    reason: String(formData.get("reason") ?? ""),
    confirm: String(formData.get("confirm") ?? ""),
  };

  const parsed = deletionSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues), values: raw };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { error } = await supabase.from("deletion_requests").insert({
    email: parsed.data.email,
    reason: parsed.data.reason || null,
    user_id: auth.user?.id ?? null,
  });

  if (error) {
    return { error: "Something went wrong sending that. Try again in a moment.", values: raw };
  }

  return { ok: true };
}
