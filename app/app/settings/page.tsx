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
        Habits, weight tracking, notifications, and your data. More sections coming soon.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Link
          href="/app/settings/habits"
          className="flex items-center justify-between rounded-card bg-elevated ring-1 ring-border px-5 py-4 text-sm font-semibold text-ink shadow-rest transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          Habits
          <span className="text-ink-muted" aria-hidden>
            →
          </span>
        </Link>
        <WeightToggle enabled={profile?.weight_module_enabled !== false} />

        <div className="rounded-card bg-elevated ring-1 ring-border px-5 py-4 shadow-rest">
          <h2 className="text-sm font-semibold text-ink">Your data</h2>
          <p className="mt-1 text-xs text-ink-muted">
            Everything you&apos;ve logged, in one CSV — yours to keep. This is
            also your data-export right under GDPR/CCPA.
          </p>
          <a
            href="/api/export/csv"
            download
            className="mt-3 inline-flex min-h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-rest-xs transition hover:bg-primary-hover"
          >
            Download CSV export
          </a>
        </div>

        <div className="rounded-card bg-elevated ring-1 ring-border px-5 py-4 shadow-rest opacity-80">
          <h2 className="text-sm font-semibold text-ink">Notifications</h2>
          <p className="mt-1 text-xs text-ink-muted">
            Push and email reminders arrive once the Firebase (FCM) and Resend
            accounts are connected — reminder preferences will live here.
          </p>
        </div>
      </div>
    </>
  );
}
