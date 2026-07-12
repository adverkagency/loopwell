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

  if (profile?.onboarding_completed_at) redirect("/app/daily");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col px-4 py-8">
      <div className="mb-8 flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-field bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-rest-xs"
        >
          L
        </span>
        Loopwell
      </div>
      <OnboardingWizard />
    </main>
  );
}
