import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { RoadmapBoard, type RoadmapColumn } from "@/components/landing/roadmap-board";
import { CtaBand, PageHero, SectionHead, Timeline } from "@/components/landing/ui";

export const metadata: Metadata = {
  title: "Roadmap — Loopwell",
  description:
    "We build in the open. Vote on what matters most, and help shape where Loopwell goes next.",
};

const COLUMNS: RoadmapColumn[] = [
  {
    status: "Now",
    items: [
      {
        title: "Scheduled reminders",
        desc: "Push and email nudges at the times you choose — the last unbuilt piece of the daily loop.",
        tag: "Notifications",
        votes: 428,
      },
      {
        title: "Custom habit cadences",
        desc: "Twice a week, every other day, weekend-only — your rule, not ours.",
        tag: "Habits",
        votes: 312,
      },
      {
        title: "Product analytics",
        desc: "So we can tell which changes actually help you stay consistent.",
        tag: "Platform",
        votes: 264,
      },
    ],
  },
  {
    status: "Next",
    items: [
      {
        title: "Native iOS & Android apps",
        desc: "Same account, same data, built on the backend that already powers the web app.",
        tag: "Apps",
        votes: 512,
      },
      {
        title: "Advanced correlations",
        desc: "Discover how sleep affects your mood across months, not days.",
        tag: "Analytics",
        votes: 389,
      },
      {
        title: "Progress photos & measurements",
        desc: "Trends and side-by-side comparisons, without the shame.",
        tag: "Health",
        votes: 297,
      },
    ],
  },
  {
    status: "Future",
    items: [
      {
        title: "AI weekly reflections",
        desc: "A weekly review written from your data — grounded, private, opt-in per week.",
        tag: "AI",
        votes: 201,
      },
      {
        title: "Challenges",
        desc: "Solo, opt-in 30-day resets and monthly missions that make showing up fun.",
        tag: "Community",
        votes: 184,
      },
      {
        title: "Apple Health & Google Fit sync",
        desc: "Two-way sync for activity, sleep, heart rate and weight.",
        tag: "Sync",
        votes: 143,
      },
    ],
  },
];

const SHIPPED = [
  {
    tag: "Milestone 5",
    title: "Life Score, achievements & export",
    desc: "A 0–100 composite of your day, ten unlockable achievements, and CSV export that doubles as your GDPR data export.",
  },
  {
    tag: "Milestone 4",
    title: "Nutrition, workout & journal",
    desc: "Food search across USDA and Open Food Facts, with graceful degradation when a source is down.",
  },
  {
    tag: "Milestone 3",
    title: "Progress & goals",
    desc: "Insights, charts, a year heatmap, and one generic goal engine with a completion celebration.",
  },
  {
    tag: "Milestone 2",
    title: "Water, sleep, mood & weight",
    desc: "The low-friction daily touches that make the check-in worth opening.",
  },
];

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Sparkles className="h-3 w-3" /> Public roadmap
          </>
        }
        title={
          <>
            What&apos;s <em className="italic text-lp-primary">shipping soon</em>.
          </>
        }
        intro="We build in the open. Vote on what matters most, and help shape where Loopwell goes next."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <RoadmapBoard columns={COLUMNS} />
        <p className="mt-8 text-center text-xs text-lp-muted">
          Votes are indicative and reset on reload — persistent voting lands with the
          next release.
        </p>
      </section>

      <section className="border-y border-lp-hairline bg-lp-subtle/40">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <SectionHead
            eyebrow="Recent"
            title={
              <>
                What we&apos;ve <em className="italic text-lp-primary">already shipped</em>.
              </>
            }
          />
          <Timeline items={SHIPPED} titleSize="text-xl" />
        </div>
      </section>

      <div className="pt-28">
        <CtaBand
          title={
            <>
              Have an <em className="italic text-lp-accent">idea</em>?
            </>
          }
          intro="Send us the smallest, most specific thing that would improve your day. We read everything."
          primary={{ href: "/contact", label: "Request a feature" }}
          secondary={{ href: "/changelog", label: "See changelog" }}
        />
      </div>
    </>
  );
}
