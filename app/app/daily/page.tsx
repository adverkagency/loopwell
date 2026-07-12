export const metadata = { title: "Daily — Loopwell" };

/** M1 builds the real Daily page (habit engine). M0 ships the secure shell. */
export default function DailyPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Daily</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Your habits land here in M1 — the core loop is next.
      </p>
      <div className="mt-6 rounded-card border border-hairline bg-elevated p-8 text-center shadow-rest">
        <p className="text-sm text-ink-secondary">
          Foundation milestone (M0): auth, schema, and shell are live.
        </p>
      </div>
    </>
  );
}
