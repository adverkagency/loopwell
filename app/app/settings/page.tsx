import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { WeightToggle } from "@/features/health/weight-toggle";

export const metadata = { title: "Settings — Loopwell" };

/** Settings sub-pages (profile/appearance/notifications/…) fill in across M2–M5. */
export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("weight_module_enabled")
    .eq("id", user!.id)
    .single();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Profile, preferences, appearance, notifications, habits, data, account.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Link
          href="/app/settings/habits"
          className="flex items-center justify-between rounded-card border border-hairline bg-elevated px-5 py-4 text-sm font-semibold text-ink shadow-rest transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          Habits
          <span className="text-ink-muted" aria-hidden>
            →
          </span>
        </Link>
        <WeightToggle enabled={profile?.weight_module_enabled !== false} />
      </div>
    </>
  );
}
