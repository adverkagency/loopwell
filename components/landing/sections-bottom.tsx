import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Accordion } from "./accordion";
import { CtaBand, SectionHead } from "./ui";
import { HOME_FAQ } from "@/lib/marketing/content";

const TESTIMONIALS = [
  {
    quote: "I've tried everything. Loopwell is the first tracker that made me feel calmer, not guiltier.",
    initial: "A",
    name: "Ava Mikaelson",
    role: "Product designer",
  },
  {
    quote: "The weekly report on Sundays genuinely changed how I plan my week. It's the tiny thing I look forward to.",
    initial: "D",
    name: "Daniel Reyes",
    role: "Founder, Northwind",
  },
  {
    quote: "Finally, one app for habits, weight, sleep — and it doesn't try to be a social network.",
    initial: "M",
    name: "Maya Odell",
    role: "PhD candidate",
  },
  {
    quote: "The design is what got me. The consistency it built in me is what kept me.",
    initial: "J",
    name: "Jules Whittaker",
    role: "Illustrator",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-lp-muted">Loved by quietly ambitious people</div>
        <h2 className="mt-3 font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">
          The feeling is
          <br />
          <em className="italic text-lp-primary">hard to fake.</em>
        </h2>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="flex flex-col justify-between rounded-3xl border border-lp-hairline bg-lp-surface p-8">
            <blockquote className="font-display text-2xl leading-snug text-lp-ink md:text-3xl">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-lp-primary/10 font-semibold text-lp-primary">
                {t.initial}
              </div>
              <div>
                <div className="text-sm font-semibold text-lp-ink">{t.name}</div>
                <div className="text-xs text-lp-muted">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const FREE_FEATURES = [
  "Unlimited habits & goals",
  "Water, weight, mood tracking",
  "Daily dashboard & streaks",
  "Weekly reports",
  "Web now — iOS & Android coming soon",
];

const PREMIUM_FEATURES = [
  "Everything in Free",
  "Advanced analytics & correlations",
  "Nutrition & barcode scanning",
  "AI weekly reflection",
  "Challenges with friends",
  "Priority sync & cloud backup",
];

export function Pricing() {
  return (
    <section id="pricing" className="border-y border-lp-hairline bg-lp-subtle/40">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-widest text-lp-muted">Pricing</div>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">
            Free to start.
            <br />
            <em className="italic text-lp-primary">Fair when you grow.</em>
          </h2>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-lp-hairline bg-lp-surface p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-lp-ink">Free</div>
                <div className="text-xs text-lp-muted">For getting started</div>
              </div>
              <div className="font-display text-4xl text-lp-ink">$0</div>
            </div>
            <ul className="mt-8 space-y-3 text-sm">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-lp-ink">
                  <Check className="h-4 w-4 text-lp-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-lp-hairline bg-lp-bg px-4 py-2.5 text-sm font-medium text-lp-ink transition-colors hover:bg-lp-subtle"
            >
              Start free
            </Link>
          </div>
          <div className="relative rounded-3xl border border-lp-ink bg-lp-ink p-8 text-lp-bg shadow-elev">
            <div className="absolute -top-3 left-8 rounded-full bg-lp-accent px-3 py-1 text-xs font-medium text-lp-ink">
              Free during beta
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Pro</div>
                <div className="text-xs text-lp-bg/60">For the ones who love the details</div>
              </div>
              <div className="text-right">
                <div className="font-display text-4xl">
                  $6<span className="text-base font-normal text-lp-bg/60">/mo</span>
                </div>
                <div className="mt-1 text-xs text-lp-accent">Unlocked free for now</div>
              </div>
            </div>
            <ul className="mt-8 space-y-3 text-sm">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-lp-accent" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lp-bg px-4 py-2.5 text-sm font-medium text-lp-ink transition-colors hover:bg-lp-bg/90"
            >
              Get Pro free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-lp-muted">
          No card required — we don&apos;t take payments yet. Every Pro feature is unlocked for
          everyone during beta.{" "}
          <Link href="/pricing" className="underline underline-offset-4 hover:text-lp-ink">
            Full plan comparison
          </Link>
        </p>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-28">
      <SectionHead
        eyebrow="Questions"
        title={
          <>
            Answers,
            <br />
            <em className="italic text-lp-primary">without the fluff.</em>
          </>
        }
      />
      <div className="mt-12">
        <Accordion items={HOME_FAQ} />
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <CtaBand
      title={
        <>
          The next version of you
          <br />
          <em className="italic text-lp-accent">starts on a Tuesday.</em>
        </>
      }
      intro="Not on Monday. Not on January 1st. Today, in five minutes, with the smallest possible step. We'll take it from there."
      secondary={{ href: "/pricing", label: "See pricing" }}
    />
  );
}

