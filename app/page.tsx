import Link from "next/link";

/**
 * Landing placeholder (M0) — the full editorial landing is designed in the
 * web/ prototype and gets ported in a later pass. Content can be placeholder
 * per the M0 checklist; the route structure is what matters here.
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <span
        aria-hidden
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-control bg-gradient-to-br from-teal-400 to-teal-600 text-xl font-bold text-white shadow-rest"
      >
        L
      </span>
      <h1 className="max-w-[16ch] text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        Everything that makes up your day, in one calm place.
      </h1>
      <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-secondary">
        Habits, water, sleep, weight, nutrition, mood, and goals — one quiet
        daily check-in. Free while in beta.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/register"
          className="flex min-h-11 items-center justify-center rounded-full bg-teal-500 px-6 text-sm font-semibold text-white shadow-rest-xs transition hover:bg-teal-600 hover:shadow-lift"
        >
          Get started — it&apos;s free
        </Link>
        <Link
          href="/login"
          className="flex min-h-11 items-center justify-center rounded-full border border-hairline-strong px-6 text-sm font-semibold text-ink transition hover:bg-surface-hover"
        >
          Log in
        </Link>
      </div>
    </main>
  );
}
