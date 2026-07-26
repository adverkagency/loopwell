import Link from "next/link";
import { Lock, ShieldCheck, Trophy, Users } from "lucide-react";
import { CARD_BASE, PageHeader, buttonClass } from "@/components/ui/kit";

export const metadata = { title: "Friends — Loopwell" };

/**
 * Deliberately unbuilt. A friends layer means a social graph, a privacy model
 * for health data, and a moderation surface — Phase 3 in the product spec.
 * This page says so plainly rather than showing invented people, and points at
 * Challenges, which delivers the same "not doing this alone" feeling solo.
 */
const REASONS = [
  {
    icon: ShieldCheck,
    title: "Health data is the hard case",
    body: "Sleep, weight, and mood are the most sensitive things Loopwell holds. Sharing them needs a per-field privacy model that's right the first time, not one bolted on after launch.",
  },
  {
    icon: Lock,
    title: "Nothing is shared today",
    body: "There is no friend graph, no shared feed, and no way for another account to see anything you log. That stays true until this page actually ships.",
  },
  {
    icon: Trophy,
    title: "Challenges cover the middle ground",
    body: "Solo, opt-in challenges give you the streak-alongside-others feeling with none of the privacy surface. They're live now and scored from what you already log.",
  },
];

export default function FriendsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Phase 3"
        title="Friends"
        subtitle="A small circle, quietly showing up alongside you — not built yet, and honestly said so."
      />

      <section className={`${CARD_BASE} flex flex-col items-center gap-5 px-6 py-12 text-center`}>
        <span className="grid size-14 place-items-center rounded-3xl bg-accent-soft text-accent">
          <Users aria-hidden className="size-6" strokeWidth={1.5} />
        </span>
        <div className="max-w-[46ch] space-y-2">
          <h2 className="text-[17px] font-semibold tracking-tight">
            No friends layer yet — by choice
          </h2>
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            Loopwell would rather ship nothing here than ship a half-thought-out
            way to share health data. When it lands, it will be opt-in per field
            and off by default.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/dashboard/challenges" className={buttonClass("primary")}>
            Try a challenge instead
          </Link>
          <Link href="/contact" className={buttonClass("ghost")}>
            Tell us what you&apos;d want
          </Link>
        </div>
      </section>

      <ul className="grid items-start gap-4 md:grid-cols-3">
        {REASONS.map(({ icon: Icon, title, body }) => (
          <li key={title} className={`${CARD_BASE} h-full p-6`}>
            <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <Icon aria-hidden className="size-[18px]" strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 text-[14px] font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {body}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
