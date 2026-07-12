export const metadata = { title: "Settings — Loopwell" };

/** Settings sub-pages (profile/preferences/appearance/…) fill in across M1–M5. */
export default function SettingsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Profile, preferences, appearance, notifications, habits, data, account.
      </p>
    </>
  );
}
