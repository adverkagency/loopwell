import Link from "next/link";
import { Fraunces, Inter } from "next/font/google";
import { Infinity as InfinityIcon, Quote } from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const STATS = [
  { value: "1K+", label: "People building better days" },
  { value: "9", label: "Modules, one check-in" },
  { value: "0", label: "Ads. Forever." },
];

/**
 * Split-screen auth shell matching the marketing site: form on the left, dark
 * editorial panel on the right (desktop only). Scoped under `.lp` so it uses the
 * marketing palette rather than the in-app teal system.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`lp min-h-dvh ${fraunces.variable} ${inter.variable}`}>
      <div className="grid min-h-dvh lg:grid-cols-2">
        <div className="relative flex flex-col px-6 py-8 md:px-12 md:py-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-lp-ink text-lp-bg">
              <InfinityIcon className="h-4 w-4" />
            </div>
            <span className="font-display text-xl text-lp-ink">Loopwell</span>
          </Link>

          <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-16">
            {children}
          </main>

          <div className="text-xs text-lp-muted">
            © {new Date().getFullYear()} Loopwell ·{" "}
            <Link href="/privacy" className="hover:text-lp-ink">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="hover:text-lp-ink">
              Terms
            </Link>
          </div>
        </div>

        <aside className="relative hidden overflow-hidden bg-lp-ink text-lp-bg lg:block">
          <div className="pointer-events-none absolute inset-0 opacity-30 grid-lines" />
          <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-lp-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 bottom-0 h-[500px] w-[500px] rounded-full bg-lp-accent/20 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between p-14">
            <div className="flex items-center gap-2 text-sm text-lp-bg/70">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lp-accent" />
              Free while in beta
            </div>
            <div className="max-w-lg">
              <Quote className="h-8 w-8 text-lp-accent" />
              <p className="mt-4 font-display text-3xl leading-tight md:text-4xl">
                &ldquo;Loopwell is the first tracker that doesn&apos;t shout at me. It&apos;s how I
                finally kept a habit for more than a month.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-lp-bg/10 font-semibold">
                  A
                </div>
                <div>
                  <div className="font-medium">Ava Chen</div>
                  <div className="text-sm text-lp-bg/60">Product designer</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 border-t border-lp-bg/10 pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl">{s.value}</div>
                  <div className="mt-1 text-xs text-lp-bg/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
