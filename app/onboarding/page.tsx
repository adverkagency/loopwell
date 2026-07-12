import Link from "next/link";

export const metadata = { title: "Welcome — Loopwell" };

/**
 * First-run Setup Wizard shell (route-guarded by proxy). The real
 * tap-only habit picker ships in M1 alongside the habit engine.
 */
export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col px-4 py-8">
      <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-field bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-rest-xs"
        >
          L
        </span>
        Loopwell
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Welcome to Loopwell
        </h1>
        <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-ink-secondary">
          The 60-second setup wizard (pick 3–5 starter habits, optional goal,
          first win) ships with the habit engine in M1.
        </p>
        <Link
          href="/app/daily"
          className="mt-8 flex min-h-11 items-center justify-center rounded-full bg-teal-500 px-6 text-sm font-semibold text-white shadow-rest-xs transition hover:bg-teal-600"
        >
          Continue to Daily
        </Link>
      </div>
    </main>
  );
}
