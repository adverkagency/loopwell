import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Accordion } from "@/components/landing/accordion";
import { Badge, CtaBand, PageHero, SectionHead } from "@/components/landing/ui";
import { PRICING_FAQ } from "@/lib/marketing/content";

export const metadata: Metadata = {
  title: "Pricing — Loopwell",
  description:
    "One elegant free plan, free forever. Pro is $6/month when it launches — and unlocked for everyone while Loopwell is in beta.",
};

type Plan = {
  name: string;
  price: string;
  period?: string;
  note: string;
  desc: string;
  badge?: { label: string; tone: "accent" | "neutral" };
  featured?: boolean;
  included: string[];
  excluded?: string[];
  cta: { href: string; label: string };
};

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    note: "No card, no trial, no expiry.",
    desc: "Everything most people need — for as long as they need it.",
    included: [
      "Unlimited habits & goals",
      "Full health & nutrition tracking",
      "Weekly reviews",
      "Life Score & achievements",
      "CSV data export",
      "Private by default",
    ],
    excluded: ["AI weekly reflections", "Advanced correlations", "Priority support"],
    cta: { href: "/register", label: "Start free" },
  },
  {
    name: "Pro",
    price: "$6",
    period: "/month",
    note: "Not billable yet — free for everyone during beta.",
    desc: "For the ones who love the details.",
    badge: { label: "Free during beta", tone: "accent" },
    featured: true,
    included: [
      "Everything in Free",
      "AI weekly reflections",
      "Advanced correlations",
      "Custom dashboards",
      "Unlimited history",
      "Priority support",
    ],
    cta: { href: "/register", label: "Get Pro free" },
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "An idea we're exploring — tell us what you'd need.",
    desc: "Wellness programs, done properly.",
    badge: { label: "Exploring", tone: "neutral" },
    included: [
      "Team dashboards",
      "SSO & SCIM",
      "Custom integrations",
      "Dedicated success",
      "Compliance review",
      "White-glove onboarding",
    ],
    cta: { href: "/contact", label: "Talk to us" },
  },
];

const COMPARE: { feature: string; free: string; pro: string; ent: string }[] = [
  { feature: "Habits & goals", free: "Unlimited", pro: "Unlimited", ent: "Unlimited" },
  { feature: "Health & nutrition", free: "Full", pro: "Full", ent: "Full" },
  { feature: "Weekly reviews", free: "Yes", pro: "Yes", ent: "Yes" },
  { feature: "History window", free: "1 year", pro: "Unlimited", ent: "Unlimited" },
  { feature: "AI reflections", free: "—", pro: "Yes", ent: "Yes" },
  { feature: "Correlations", free: "Basic", pro: "Advanced", ent: "Advanced" },
  { feature: "Custom dashboards", free: "—", pro: "Yes", ent: "Yes" },
  { feature: "SSO / SCIM", free: "—", pro: "—", ent: "Yes" },
  { feature: "Support", free: "Community", pro: "Priority", ent: "Dedicated" },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Free for real. <em className="italic text-lp-primary">Pro when you want it.</em>
          </>
        }
        intro="No ads. No selling your data. No dark patterns. One elegant free plan, and thoughtful upgrades when you're ready."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                plan.featured
                  ? "border-lp-ink bg-lp-ink text-lp-bg shadow-elev"
                  : "border-lp-hairline bg-lp-surface text-lp-ink"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-display text-2xl">{plan.name}</div>
                {plan.badge && <Badge tone={plan.badge.tone}>{plan.badge.label}</Badge>}
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-6xl leading-none">{plan.price}</span>
                {plan.period && (
                  <span className={plan.featured ? "text-lp-bg/60" : "text-lp-muted"}>{plan.period}</span>
                )}
              </div>
              <p className={`mt-3 text-sm ${plan.featured ? "text-lp-bg/70" : "text-lp-muted"}`}>
                {plan.desc}
              </p>
              <p className={`mt-1 text-xs ${plan.featured ? "text-lp-accent" : "text-lp-muted"}`}>
                {plan.note}
              </p>
              <ul className="mt-8 space-y-3">
                {plan.included.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                        plan.featured ? "bg-lp-accent text-lp-ink" : "bg-lp-primary text-lp-primary-fg"
                      }`}
                    >
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
                {plan.excluded?.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-lp-muted/70">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-current">
                      <Minus className="h-2.5 w-2.5" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={`mt-10 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors ${
                  plan.featured
                    ? "bg-lp-bg text-lp-ink hover:bg-lp-bg/90"
                    : "border border-lp-hairline bg-lp-bg hover:bg-lp-subtle"
                }`}
              >
                {plan.cta.label}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-lp-muted">
          There is no billing integration in Loopwell today — nothing can charge you. Pro
          pricing is published so you know where things are heading.
        </p>
      </section>

      <section className="border-y border-lp-hairline bg-lp-subtle/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHead
            eyebrow="Compare"
            title={
              <>
                All plans, <em className="italic text-lp-primary">side by side</em>.
              </>
            }
          />
          <div className="mt-14 overflow-x-auto rounded-3xl border border-lp-hairline bg-lp-surface">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-lp-subtle/60 text-lp-ink">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Feature</th>
                  <th className="px-6 py-4 text-left font-medium">Free</th>
                  <th className="px-6 py-4 text-left font-medium">Pro</th>
                  <th className="px-6 py-4 text-left font-medium text-lp-muted">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lp-hairline">
                {COMPARE.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-6 py-4 text-lp-ink">{row.feature}</td>
                    <td className="px-6 py-4 text-lp-muted">{row.free}</td>
                    <td className="px-6 py-4 text-lp-ink">{row.pro}</td>
                    <td className="px-6 py-4 text-lp-muted">{row.ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24">
        <SectionHead
          eyebrow="Questions"
          title={
            <>
              Pricing, <em className="italic text-lp-primary">answered</em>.
            </>
          }
        />
        <div className="mt-12">
          <Accordion items={PRICING_FAQ} />
        </div>
      </section>

      <CtaBand
        title={
          <>
            The next version of you
            <br />
            <em className="italic text-lp-accent">starts on a Tuesday.</em>
          </>
        }
        intro="Not on Monday. Not on January 1st. Today, in five minutes, with the smallest possible step."
        secondary={{ href: "/features", label: "See features" }}
      />
    </>
  );
}
