export const metadata = { title: "Settings — Loopwell" };

import Link from "next/link";

/** Settings sub-pages (profile/preferences/appearance/…) fill in across M1–M5. */
export default function SettingsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Profile, preferences, appearance, notifications, habits, data, account.
      </p>
      <ul className="mt-6 flex flex-col gap-2">
        <li>
          <Link
            href="/app/settings/habits"
            className="flex items-center justify-between rounded-card border border-hairline bg-elevated px-5 py-4 text-sm font-semibold text-ink shadow-rest transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            Habits
            <span className="text-ink-muted" aria-hidden>
              →
            </span>
          </Link>
        </li>
      </ul>
    </>
  );
}
