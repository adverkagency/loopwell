import type { Metadata } from "next";
import { Feather, Heart, Shield, Sparkles, Users } from "lucide-react";
import { CtaBand, PageHero, SectionHead, Timeline } from "@/components/landing/ui";

export const metadata: Metadata = {
  title: "About — Loopwell",
  description:
    "Loopwell exists because we were tired of trackers that felt like billboards. A quiet home for the small daily loops that shape a life.",
};

const VALUES = [
  { icon: Heart, title: "Care", desc: "We design like it matters — because it does." },
  { icon: Shield, title: "Privacy", desc: "Your data belongs to you. Always. No exceptions." },
  { icon: Feather, title: "Craft", desc: "Every pixel earns its place, or it doesn't ship." },
  { icon: Users, title: "Honesty", desc: "We tell you what works, even when it's less sticky." },
];

const WHY = [
  {
    n: "01",
    title: "The problem",
    desc: "Ten apps, ten dashboards, ten notifications. Nothing that adds up to a life.",
  },
  {
    n: "02",
    title: "The insight",
    desc: "Progress is a story told across systems — habits, sleep, food, mood, weight. Isolated, they lie.",
  },
  {
    n: "03",
    title: "The solution",
    desc: "One quiet place where the whole story shows up. Beautiful defaults. Zero clutter. Real signal.",
  },
];

const JOURNEY = [
  {
    tag: "The spark",
    title: "A spreadsheet on TikTok",
    desc: "A habit-tracking spreadsheet doing the rounds online. Simple, oddly motivating — and clearly wanting to be a real product.",
  },
  {
    tag: "Planning",
    title: "Designed before built",
    desc: "Product spec, information architecture, design system and a critical pre-build review — written down before a line of code.",
  },
  {
    tag: "Now",
    title: "Public beta",
    desc: "Habits, water, sleep, weight, mood, nutrition, journal, goals and progress — live on the web, free for everyone.",
  },
  {
    tag: "Next",
    title: "Native apps & AI reflections",
    desc: "iOS and Android on the same account, and weekly reviews that write themselves — grounded in your data, not the internet.",
  },
];

const STATS = [
  { value: "1K+", label: "People building better days" },
  { value: "9", label: "Modules, one daily check-in" },
  { value: "100%", label: "Free while in beta" },
  { value: "0", label: "Ads. Forever." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Sparkles className="h-3 w-3" /> Our story
          </>
        }
        title={
          <>
            Built for the <em className="italic text-lp-primary">long game</em>.
          </>
        }
        intro="Loopwell exists because we were tired of trackers that felt like billboards. We wanted a quiet home for the small daily loops that actually shape a life."
      />

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="max-w-xl">
              <div className="text-xs uppercase tracking-widest text-lp-muted">Our mission</div>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">
                Help people <em className="italic text-lp-primary">become</em> who they&apos;re becoming.
              </h2>
              <p className="mt-5 text-lp-muted">
                Not through streaks that shame you. Not through metrics that flatten
                you. Through a calm interface that respects your attention, and shows
                you the person you already are on your best days.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-2xl border border-lp-hairline bg-lp-surface p-6">
                  <v.icon className="h-5 w-5 text-lp-primary" />
                  <div className="mt-4 font-display text-xl text-lp-ink">{v.title}</div>
                  <p className="mt-1 text-sm text-lp-muted">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-lp-hairline bg-lp-subtle/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHead
            eyebrow="Why Loopwell"
            title={
              <>
                The best trackers are the ones you{" "}
                <em className="italic text-lp-primary">don&apos;t notice</em>.
              </>
            }
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.n} className="rounded-2xl border border-lp-hairline bg-lp-surface p-6">
                <div className="text-xs uppercase tracking-widest text-lp-muted">{w.n}</div>
                <div className="mt-3 font-display text-2xl text-lp-ink">{w.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-lp-muted">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24">
        <SectionHead
          eyebrow="Journey"
          title={
            <>
              From <em className="italic text-lp-primary">Tuesday</em> to today.
            </>
          }
        />
        <Timeline items={JOURNEY} />
      </section>

      <section className="border-t border-lp-hairline bg-lp-ink text-lp-bg">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-20 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl md:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-lp-bg/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-28">
        <CtaBand
          title={
            <>
              Join us for the <em className="italic text-lp-accent">long game</em>.
            </>
          }
          intro="Free while in beta, private by default. The next chapter starts on an unremarkable Tuesday."
          secondary={{ href: "/features", label: "See features" }}
        />
      </div>
    </>
  );
}
