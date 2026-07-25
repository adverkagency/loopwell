import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/features/onboarding/wizard";

export const metadata = { title: "Welcome — Loopwell" };

/** First-run only: completed users are bounced straight to Daily. */
export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed_at) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent"
        >
          <span className="size-3 rounded-full border-[2.5px] border-accent-foreground" />
        </span>
        <span className="text-[17px] font-semibold tracking-tight">Loopwell</span>
      </div>
      <OnboardingWizard />
    </main>
  );
}
