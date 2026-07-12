import Link from "next/link";

export const metadata = { title: "Verify your email — Loopwell" };

/**
 * Info page only — the actual verification happens when the user clicks
 * the emailed link, handled by /auth/confirm. Verification is non-blocking:
 * the app is fully usable before verifying (IA §16).
 */
export default function VerifyEmailPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Check your inbox</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
        We sent you a confirmation link. Verifying enables reminders and
        password recovery — but you don&apos;t have to wait: you can start
        using Loopwell right now.
      </p>
      <Link
        href="/app/daily"
        className="mt-6 flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-rest-xs transition hover:bg-primary-hover"
      >
        Go to your Daily page
      </Link>
    </div>
  );
}
