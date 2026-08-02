import Link from "next/link";
import { Bell, ChevronRight, Download, ListChecks } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { WeightToggle } from "@/features/health/weight-toggle";
import { TimezoneSetting } from "@/features/health/timezone-setting";
import { safeTimezone } from "@/lib/dates";
import { CARD_BASE, PageHeader, buttonClass } from "@/components/ui/kit";

export const metadata = { title: "Settings — Loopwell" };

/** Settings sub-pages (profile/appearance/notifications/…) fill in across M2–M5. */
export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("weight_module_enabled, timezone")
    .eq("id", user!.id)
    .single();

  return (
    <>
      <PageHeader
        eyebrow="Your setup"
        title="Settings"
        subtitle="Habits, weight tracking, notifications, and your data."
      />

      <div className="flex flex-col gap-2.5">
        <Link
          href="/dashboard/settings/habits"
          className={`${CARD_BASE} lift group flex items-center gap-4 px-5 py-4`}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
            <ListChecks aria-hidden className="size-[18px]" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold">Habits</span>
            <span className="block text-[12px] text-muted-foreground">
              Add, edit, reorder, archive — and pick your Quick Log six.
            </span>
          </span>
          <ChevronRight
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>

        <WeightToggle enabled={profile?.weight_module_enabled !== false} />

        <TimezoneSetting current={safeTimezone(profile?.timezone)} />

        <div className={`${CARD_BASE} px-5 py-5`}>
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
              <Download aria-hidden className="size-[18px]" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold">Your data</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                Everything you&apos;ve logged, in one CSV — yours to keep. This
                is also your data-export right under GDPR/CCPA.
              </p>
              <a
                href="/api/export/csv"
                download
                className={`${buttonClass("primary", "sm")} mt-3`}
              >
                Download CSV export
              </a>
            </div>
          </div>
        </div>

        <div className={`${CARD_BASE} px-5 py-5`}>
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <Bell aria-hidden className="size-[18px]" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <h2 className="flex flex-wrap items-center gap-2 text-[14px] font-semibold">
                Notifications
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Coming soon
                </span>
              </h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                Push and email reminders arrive once the Firebase (FCM) and
                Resend accounts are connected — reminder preferences will live
                here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
