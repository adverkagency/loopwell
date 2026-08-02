import type { Metadata } from "next";
import {
  Activity,
  Apple,
  ChartColumn,
  Check,
  Heart,
  Minus,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Badge, CtaBand, PageHero, SectionHead } from "@/components/landing/ui";

export const metadata: Metadata = {
  title: "Features — Loopwell",
  description:
    "Habits, goals, health, food, mood, weight, sleep, water, analytics and streaks — ten trackers designed to feel like one.",
};

const FEATURES: { icon: LucideIcon; title: string; desc: string; soon?: boolean }[] = [
  {
    icon: Check,
    title: "Habit tracking",
    desc: "Daily rituals with three honest states — complete, partial, skip. Partial still counts toward your rate.",
  },
  {
    icon: Target,
    title: "Goal tracking",
    desc: "Big ambitions broken into a target, a deadline and visible progress. Milestones you can actually feel.",
  },
  {
    icon: Heart,
    title: "Health tracking",
    desc: "Sleep, mood, weight and workouts — quietly present in one daily check-in, never noisy.",
  },
  {
    icon: Apple,
    title: "Nutrition tracking",
    desc: "Log meals in seconds against a real food database. Macros without the math.",
  },
  {
    icon: ChartColumn,
    title: "Analytics",
    desc: "Weekly and monthly reviews that actually mean something. Trends, not scale anxiety.",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    desc: "Heatmaps, streaks and achievements — the story only your data can tell.",
  },
  {
    icon: Sparkles,
    title: "AI insights",
    desc: "Weekly reflections written from your data — grounded, private, and quietly useful.",
    soon: true,
  },
  {
    icon: Smartphone,
    title: "Native apps",
    desc: "iOS and Android on the same account and the same data. The web app works everywhere today.",
    soon: true,
  },
];

const DEEP_DIVE: {
  n: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  bullets: string[];
  preview: React.ReactNode;
}[] = [
  {
    n: "01",
    icon: Check,
    title: "Habit tracking",
    desc: "Daily rituals with a tri-state that tells the truth. Partial counts toward completion; only a full complete extends the streak.",
    bullets: [
      "Complete, partial and skip — no binary guilt",
      "Streaks that only break on a genuine miss",
      "Timezone-correct day boundaries",
      "Reminders that respect your day",
    ],
    preview: <HabitPreview />,
  },
  {
    n: "02",
    icon: Target,
    title: "Goal tracking",
    desc: "One generic goal engine — a target, a current value, a deadline and a label. No separate goal types to learn.",
    bullets: [
      "Any unit: kilograms, books, kilometres, hours",
      "Progress rings and forecast completion",
      "A quiet celebration when you land one",
      "Archive without losing the history",
    ],
    preview: <GoalPreview />,
  },
  {
    n: "03",
    icon: Activity,
    title: "Health tracking",
    desc: "Water, sleep, weight and mood — the low-friction touches that make the daily check-in worth opening.",
    bullets: [
      "One-tap water logging with a visible ring",
      "Sleep duration from bed and wake times",
      "Weight as a trend line, not a verdict",
      "Daily mood check-in in a single tap",
    ],
    preview: <HealthPreview />,
  },
  {
    n: "04",
    icon: Apple,
    title: "Nutrition tracking",
    desc: "A real food database behind a search box, with macros landing where they belong. Degrades gracefully when a source is down.",
    bullets: [
      "Search across USDA and Open Food Facts",
      "Macro rings for protein, carbs and fat",
      "Calorie targets without the lecture",
      "Barcode scanning on the roadmap",
    ],
    preview: <NutritionPreview />,
  },
];

function PreviewShell({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-lp-hairline bg-lp-surface p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-lp-subtle text-lp-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="text-xs uppercase tracking-widest text-lp-muted">{label}</div>
      </div>
      {children}
    </div>
  );
}

function HabitPreview() {
  const rows = [
    { name: "Morning walk", meta: "30 min", state: "done" },
    { name: "Read 20 pages", meta: "Deep Work", state: "done" },
    { name: "Meditate", meta: "10 min", state: "partial" },
    { name: "Journal", meta: "5 min", state: "todo" },
  ];
  return (
    <PreviewShell icon={Check} label="Habit tracking">
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.name}
            className="flex items-center justify-between rounded-lg border border-lp-hairline bg-lp-bg/60 px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid h-5 w-5 place-items-center rounded-md border ${
                  r.state === "done"
                    ? "border-lp-primary bg-lp-primary text-lp-primary-fg"
                    : r.state === "partial"
                      ? "border-lp-accent bg-lp-accent/30 text-lp-ink"
                      : "border-lp-hairline"
                }`}
              >
                {r.state === "done" && <Check className="h-3 w-3" />}
                {r.state === "partial" && <Minus className="h-3 w-3" />}
              </span>
              <span className={`text-sm ${r.state === "done" ? "text-lp-muted line-through" : "text-lp-ink"}`}>
                {r.name}
              </span>
            </div>
            <span className="text-xs text-lp-muted">{r.meta}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-16 items-end gap-1">
        {[40, 55, 60, 72, 68, 78, 82, 74, 88, 92, 84, 96].map((h, i, arr) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${i === arr.length - 1 ? "bg-lp-primary" : "bg-lp-primary/20"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </PreviewShell>
  );
}

function GoalPreview() {
  const goals = [
    { name: "Run a half marathon", pct: 68 },
    { name: "Sleep 7h+ nightly", pct: 84 },
    { name: "Read 24 books this year", pct: 41 },
  ];
  return (
    <PreviewShell icon={Target} label="Goal tracking">
      <div className="space-y-4">
        {goals.map((g) => (
          <div key={g.name}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-lp-ink">{g.name}</span>
              <span className="text-lp-muted">{g.pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-lp-subtle">
              <div className="h-full rounded-full bg-lp-primary" style={{ width: `${g.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-lp-hairline bg-lp-bg/60 p-4">
        <div className="text-[10px] uppercase tracking-widest text-lp-muted">On track to finish</div>
        <div className="font-display text-2xl text-lp-ink">3 of 3 goals</div>
      </div>
    </PreviewShell>
  );
}

function HealthPreview() {
  return (
    <PreviewShell icon={Activity} label="Health tracking">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Water", value: "1.8 / 2.5L", pct: 72 },
          { label: "Sleep", value: "7h 42m", pct: 88 },
          { label: "Weight", value: "74.2 kg", pct: 60 },
          { label: "Mood", value: "Good", pct: 75 },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-lp-hairline bg-lp-bg/60 p-3.5">
            <div className="text-xs text-lp-muted">{m.label}</div>
            <div className="mt-1 text-lg font-semibold text-lp-ink">{m.value}</div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-lp-subtle">
              <div className="h-full rounded-full bg-lp-primary" style={{ width: `${m.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </PreviewShell>
  );
}

function NutritionPreview() {
  const macros = [
    { label: "Protein", value: "128g", pct: 0.78 },
    { label: "Carbs", value: "210g", pct: 0.62 },
    { label: "Fat", value: "58g", pct: 0.44 },
  ];
  const c = 2 * Math.PI * 24;
  return (
    <PreviewShell icon={Apple} label="Nutrition tracking">
      <div className="grid grid-cols-3 gap-2 text-center">
        {macros.map((m) => (
          <div key={m.label}>
            <div className="mx-auto h-14 w-14">
              <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
                <circle cx="30" cy="30" r="24" stroke="var(--lp-subtle)" strokeWidth="6" fill="none" />
                <circle
                  cx="30" cy="30" r="24"
                  stroke="var(--lp-primary)" strokeWidth="6" fill="none" strokeLinecap="round"
                  strokeDasharray={c} strokeDashoffset={c * (1 - m.pct)}
                />
              </svg>
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-wider text-lp-muted">{m.label}</div>
            <div className="text-sm font-semibold text-lp-ink">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-2">
        {[
          { name: "Overnight oats", kcal: "412 kcal" },
          { name: "Grilled salmon bowl", kcal: "628 kcal" },
          { name: "Greek yogurt · berries", kcal: "212 kcal" },
        ].map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between rounded-lg border border-lp-hairline bg-lp-bg/60 px-3 py-2 text-sm"
          >
            <span className="text-lp-ink">{m.name}</span>
            <span className="text-lp-muted">{m.kcal}</span>
          </div>
        ))}
      </div>
    </PreviewShell>
  );
}

const COMPARISON: { capability: string; loopwell: string; typical: string }[] = [
  { capability: "All-in-one habit + health + nutrition", loopwell: "Yes", typical: "No" },
  { capability: "Private by default (no ads, no selling)", loopwell: "Yes", typical: "No" },
  { capability: "Partial days that don't punish you", loopwell: "Yes", typical: "No" },
  { capability: "Works on any device via the web", loopwell: "Yes", typical: "Partial" },
  { capability: "Weekly & monthly reviews", loopwell: "Yes", typical: "No" },
  { capability: "Export your data any time", loopwell: "Yes", typical: "Sometimes" },
  { capability: "Free forever tier", loopwell: "Yes", typical: "No" },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title={
          <>
            Every loop of your life, <em className="italic text-lp-primary">quietly connected</em>.
          </>
        }
        intro="Ten trackers you'd otherwise juggle — habits, goals, health, food, mood, weight, sleep, water, analytics and streaks — designed to feel like one."
      />

      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="sr-only">All features</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-lp-hairline bg-lp-surface p-6 transition-all hover:shadow-soft"
            >
              <div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-lp-subtle text-lp-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl text-lp-ink">{f.title}</h3>
                {f.soon && <Badge tone="accent">Coming soon</Badge>}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-lp-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-lp-hairline bg-lp-subtle/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHead
            eyebrow="Deep dive"
            title={
              <>
                Designed for the <em className="italic text-lp-primary">details</em>.
              </>
            }
          />
          <div className="mt-16 space-y-24">
            {DEEP_DIVE.map((d, i) => {
              const reversed = i % 2 === 1;
              return (
                <div key={d.n} className="grid items-center gap-12 lg:grid-cols-2">
                  <div className={reversed ? "lg:order-2" : undefined}>
                    <div className="mb-4 flex items-center gap-2">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-lp-subtle text-lp-primary">
                        <d.icon className="h-5 w-5" />
                      </div>
                      <Badge>{d.n}</Badge>
                    </div>
                    <h3 className="font-display text-3xl text-lp-ink md:text-4xl">{d.title}</h3>
                    <p className="mt-3 text-lp-muted">{d.desc}</p>
                    <ul className="mt-6 space-y-2.5">
                      {d.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-lp-ink">
                          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lp-primary text-lp-primary-fg">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={reversed ? "lg:order-1" : undefined}>{d.preview}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHead
          eyebrow="Comparison"
          title={
            <>
              Loopwell vs. <em className="italic text-lp-primary">the usual</em>.
            </>
          }
        />
        <div className="mt-14 overflow-x-auto rounded-3xl border border-lp-hairline bg-lp-surface">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-lp-subtle/60 text-lp-ink">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Capability</th>
                <th className="px-6 py-4 text-left font-medium">Loopwell</th>
                <th className="px-6 py-4 text-left font-medium text-lp-muted">Typical tracker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lp-hairline">
              {COMPARISON.map((row) => (
                <tr key={row.capability}>
                  <td className="px-6 py-4 text-lp-ink">{row.capability}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-lp-primary">
                      <Check className="h-4 w-4" /> {row.loopwell}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-lp-muted">{row.typical}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </>
  );
}
