import type { Metadata } from "next";
import { ShieldCheck, Sparkles, Wrench, Zap } from "lucide-react";
import { Badge, CtaBand, PageHero } from "@/components/landing/ui";

export const metadata: Metadata = {
  title: "Changelog — Loopwell",
  description: "Every release, every improvement — in the open.",
};

type ChangeKind = "New" | "Improved" | "Fixed" | "Security";

const KIND_META: Record<ChangeKind, { icon: typeof Sparkles; tone: "primary" | "accent" | "neutral" }> = {
  New: { icon: Sparkles, tone: "primary" },
  Improved: { icon: Zap, tone: "accent" },
  Fixed: { icon: Wrench, tone: "neutral" },
  Security: { icon: ShieldCheck, tone: "neutral" },
};

type Release = {
  version: string;
  date: string;
  title: string;
  summary: string;
  changes: { kind: ChangeKind; text: string }[];
};

const RELEASES: Release[] = [
  {
    version: "0.5.0",
    date: "Milestone 5",
    title: "Life Score, achievements & export",
    summary:
      "The delight layer lands — a single honest number for your day, ten unlockable achievements, and a full data export.",
    changes: [
      { kind: "New", text: "Life Score (Beta) with a breakdown UI explaining every weighting." },
      { kind: "New", text: "Ten achievements with automatic unlock detection." },
      { kind: "New", text: "CSV export at /api/export/csv — doubles as your GDPR data export." },
      { kind: "Improved", text: "Theme toggle now cycles system → light → dark and persists." },
    ],
  },
  {
    version: "0.4.0",
    date: "Milestone 4",
    title: "Nutrition, workout & journal",
    summary:
      "The higher-friction modules arrive, collapsed by default so the Daily page stays calm.",
    changes: [
      { kind: "New", text: "Food search proxy across USDA and Open Food Facts." },
      { kind: "New", text: "Workout and journal modules on the Daily page." },
      { kind: "Improved", text: "Food search degrades gracefully when one source is unavailable." },
    ],
  },
  {
    version: "0.3.0",
    date: "Milestone 3",
    title: "Progress & goals",
    summary:
      "Reflection surfaces: a Progress tab that reads like a sentence, and one generic goal engine.",
    changes: [
      { kind: "New", text: "Progress tab with insights, charts, year heatmap and achievements." },
      { kind: "New", text: "Goal engine — target, current, deadline and label, with a completion celebration." },
      { kind: "Improved", text: "Streak maths covered by unit tests, including timezone edges." },
    ],
  },
  {
    version: "0.2.0",
    date: "Milestone 2",
    title: "Water, sleep, mood & weight",
    summary: "The low-friction daily touches that make the check-in worth opening.",
    changes: [
      { kind: "New", text: "Water quick-log with a visible daily ring and configurable goal." },
      { kind: "New", text: "Sleep, mood and weight logging on the Daily page." },
      { kind: "Improved", text: "Weight module can be toggled off entirely in Settings." },
    ],
  },
  {
    version: "0.1.0",
    date: "Milestone 1",
    title: "The core loop",
    summary:
      "Habits, the Daily page and onboarding — the smallest version worth putting in front of real people.",
    changes: [
      { kind: "New", text: "Habit engine with complete, partial and skip states." },
      { kind: "New", text: "Tap-only onboarding wizard that ends on a first win." },
      { kind: "Security", text: "Row-level security on every table, penetration-tested across accounts." },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title={
          <>
            Small things, <em className="italic text-lp-primary">shipped often</em>.
          </>
        }
        intro="Every release, every improvement — in the open."
      />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <ol className="space-y-8 border-l border-lp-hairline pl-8">
          {RELEASES.map((r) => (
            <li key={r.version} className="relative">
              <span className="absolute -left-[41px] top-2 grid h-4 w-4 place-items-center rounded-full border border-lp-hairline bg-lp-bg">
                <span className="h-1.5 w-1.5 rounded-full bg-lp-primary" />
              </span>
              <div className="rounded-3xl border border-lp-hairline bg-lp-surface p-6 shadow-soft">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="primary">v{r.version}</Badge>
                  <span className="text-xs text-lp-muted">{r.date}</span>
                </div>
                <h2 className="mt-3 font-display text-2xl text-lp-ink md:text-3xl">{r.title}</h2>
                <p className="mt-2 text-lp-muted">{r.summary}</p>
                <ul className="mt-6 space-y-2">
                  {r.changes.map((c) => {
                    const meta = KIND_META[c.kind];
                    const Icon = meta.icon;
                    return (
                      <li key={c.text} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 shrink-0">
                          <Badge tone={meta.tone}>
                            <Icon className="h-3 w-3" /> {c.kind}
                          </Badge>
                        </span>
                        <span className="text-lp-muted">{c.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand
        title={
          <>
            Never miss a <em className="italic text-lp-accent">release</em>.
          </>
        }
        intro="A short, tasteful note every time we ship something meaningful."
        primary={{ href: "/contact", label: "Get updates" }}
        secondary={{ href: "/roadmap", label: "See roadmap" }}
      />
    </>
  );
}
