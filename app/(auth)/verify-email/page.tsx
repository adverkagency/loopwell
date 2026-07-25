import Link from "next/link";
import { ArrowRight, MailCheck } from "lucide-react";

export const metadata = { title: "Verify your email — Loopwell" };

/**
 * Info page only — the actual verification happens when the user clicks
 * the emailed link, handled by /auth/confirm. Verification is non-blocking:
 * the app is fully usable before verifying (IA §16).
 */
export default function VerifyEmailPage() {
  return (
    <div>
      <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-lp-hairline bg-lp-surface/60 px-3 py-1 text-xs text-lp-muted">
        <MailCheck className="h-3 w-3" />
        One last thing
      </div>
      <h1 className="font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">
        Check your <em className="italic text-lp-primary">inbox</em>.
      </h1>
      <p className="mt-3 leading-relaxed text-lp-muted">
        We sent you a confirmation link. Verifying enables reminders and password
        recovery — but you don&apos;t have to wait: you can start using Loopwell right
        now.
      </p>
      <Link
        href="/app/daily"
        className="group mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-lp-ink px-5 text-sm font-medium text-lp-bg transition-all hover:bg-lp-ink/90"
      >
        Go to your Daily page
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
