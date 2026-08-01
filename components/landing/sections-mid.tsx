import {
  Apple,
  Bell,
  Check,
  Droplets,
  Dumbbell,
  Flame,
  Lock,
  Moon,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

const ACHIEVEMENTS = [
  { icon: Flame, top: "30-day", bottom: "Streak" },
  { icon: Trophy, top: "First", bottom: "5K run" },
  { icon: Dumbbell, top: "10,000", bottom: "Push-ups" },
  { icon: Moon, top: "Sleep", bottom: "Master" },
  { icon: Droplets, top: "Hydration", bottom: "Hero" },
  { icon: Target, top: "Goal", bottom: "Crusher" },
];

const MEALS = [
  { name: "Overnight oats", kcal: "412 kcal" },
  { name: "Grilled salmon bowl", kcal: "628 kcal" },
  { name: "Greek yogurt · berries", kcal: "212 kcal" },
];

const GOALS = [
  { name: "Run a half marathon", pct: 68 },
  { name: "Sleep 7h+ nightly", pct: 84 },
  { name: "Read 24 books this year", pct: 41 },
];

/* 5-week habit mini-heatmap — rising intensity with rest days. */
const HABIT_CELLS = Array.from({ length: 35 }, (_, i) => ({
  rest: [2, 5, 7, 10, 14, 16, 19, 21, 25, 28, 30].includes(i),
  opacity: 0.4 + (i * 0.6) / 35,
}));

const WEIGHT_PATH =
  "M0,62 L10,60 L20,58 L30,61 L40,55 L50,52 L60,54 L70,48 L80,50 L90,44 L100,42 L110,38 L120,40 L130,32 L140,30 L150,28 L160,34 L170,26 L180,22 L190,20 L200,18";
const WEIGHT_DOTS = [
  [0, 62],
  [40, 55],
  [80, 50],
  [120, 40],
  [160, 34],
  [200, 18],
];

export function TrackingBento() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-lp-muted">Track every part of your progress</div>
        <h2 className="mt-3 font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">
          The details compound.
          <br />
          <em className="italic text-lp-primary">We help you see it.</em>
        </h2>
        <p className="mt-5 text-lp-muted">
          From a single push-up to a year of consistent sleep — Loopwell captures
          what matters and leaves the noise out.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-12 gap-4">
        <div className="col-span-12 rounded-3xl border border-lp-hairline bg-lp-surface p-8 shadow-soft lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-lp-muted">Body &amp; weight</div>
              <div className="mt-1 font-display text-3xl text-lp-ink">A gentler scale.</div>
              <p className="mt-2 max-w-sm text-sm text-lp-muted">
                Trend-first weight tracking with body measurements, progress photos
                and BMI — without the shame.
              </p>
            </div>
            <div className="hidden text-right md:block">
              <div className="text-xs text-lp-muted">6-month change</div>
              <div className="font-display text-2xl text-lp-success">-6.8 kg</div>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-lp-hairline bg-lp-bg p-4">
            <svg viewBox="0 0 200 80" className="h-40 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lp-w-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--lp-primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--lp-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 20, 40, 60, 80].map((y) => (
                <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="var(--lp-hairline)" strokeWidth="0.4" />
              ))}
              <path d={`${WEIGHT_PATH} L200,80 L0,80 Z`} fill="url(#lp-w-area)" />
              <path d={WEIGHT_PATH} fill="none" stroke="var(--lp-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              {WEIGHT_DOTS.map(([x, y]) => (
                <circle key={x} cx={x} cy={y} r="1.6" fill="var(--lp-surface)" stroke="var(--lp-primary)" strokeWidth="1.2" />
              ))}
            </svg>
          </div>
        </div>
        <div className="col-span-12 rounded-3xl border border-lp-hairline bg-lp-ink p-8 text-lp-bg lg:col-span-5">
          <div className="text-xs uppercase tracking-widest text-lp-bg/60">Achievements</div>
          <div className="mt-1 font-display text-3xl">Small wins, worth celebrating.</div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.bottom} className="flex flex-col items-center rounded-2xl bg-lp-bg/5 p-4 text-center backdrop-blur">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-lp-bg/10 text-lp-accent">
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="mt-2 text-sm font-semibold">{a.top}</div>
                <div className="text-xs text-lp-bg/60">{a.bottom}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 rounded-3xl border border-lp-hairline bg-lp-surface p-8 lg:col-span-4">
          <Apple className="h-5 w-5 text-lp-primary" />
          <div className="mt-4 font-display text-2xl text-lp-ink">Nutrition, not spreadsheets</div>
          <p className="mt-2 text-sm text-lp-muted">
            Barcode scan, natural language, or one-tap favorites. Macros land where they belong.
          </p>
          <div className="mt-5 space-y-2">
            {MEALS.map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-lg border border-lp-hairline bg-lp-bg px-3 py-2 text-sm">
                <span className="text-lp-ink">{m.name}</span>
                <span className="text-lp-muted">{m.kcal}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 rounded-3xl border border-lp-hairline bg-lp-surface p-8 lg:col-span-4">
          <Check className="h-5 w-5 text-lp-primary" />
          <div className="mt-4 font-display text-2xl text-lp-ink">Habits that flex with you</div>
          <p className="mt-2 text-sm text-lp-muted">
            Daily, weekly, X times a week, or seasonal. Loopwell adapts to your life,
            not the other way around.
          </p>
          <div className="mt-5 grid grid-cols-7 gap-1.5">
            {HABIT_CELLS.map((c, i) => (
              <div
                key={i}
                className={`aspect-square rounded-md ${c.rest ? "bg-lp-subtle" : "bg-lp-primary"}`}
                style={c.rest ? undefined : { opacity: c.opacity }}
              />
            ))}
          </div>
        </div>
        <div className="col-span-12 rounded-3xl border border-lp-hairline bg-lp-surface p-8 lg:col-span-4">
          <Target className="h-5 w-5 text-lp-primary" />
          <div className="mt-4 font-display text-2xl text-lp-ink">Goals that break themselves down</div>
          <p className="mt-2 text-sm text-lp-muted">
            Set the mountain. Loopwell writes the trail — weekly steps, checkpoints,
            quiet nudges.
          </p>
          <div className="mt-5 space-y-3">
            {GOALS.map((g) => (
              <div key={g.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-lp-ink">{g.name}</span>
                  <span className="text-lp-muted">{g.pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-lp-subtle">
                  <div className="h-full rounded-full bg-lp-primary" style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const ANALYTICS_POINTS = [
  { title: "Weekly reflection", desc: "A gentle Sunday recap in your inbox." },
  { title: "Correlations", desc: "See what actually moves your mood, energy and weight." },
  { title: "Streak heatmaps", desc: "A year of consistency in one glance." },
];

const WEEKLY_SUMMARY = [
  { label: "Habits completed", value: "42 / 48" },
  { label: "Avg. sleep", value: "7h 38m" },
  { label: "Workouts", value: "5 sessions" },
  { label: "Water average", value: "2.4 L / day" },
];

/* Year heatmap: 30 columns × 7 rows stepping through intensity blocks. */
const HEAT_STEPS = [0.1, 0.35, 0.7, 1];
const heatOpacity = (col: number, row: number) =>
  HEAT_STEPS[Math.floor((col * 7 + row) / 6) % 4];

export function AnalyticsSection() {
  return (
    <section id="analytics" className="border-y border-lp-hairline bg-lp-ink text-lp-bg">
      <div className="mx-auto max-w-7xl px-6 py-28">
        {/* min-w-0: grid items default to min-width:auto, so the 30-column
            heatmap below would widen the track past the viewport and its own
            overflow-x-auto would never get a chance to scroll. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 [&>*]:min-w-0">
          <div className="lg:col-span-4">
            <div className="text-xs uppercase tracking-widest text-lp-bg/60">Powerful analytics</div>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              The patterns you feel,
              <br />
              <em className="italic text-lp-accent">finally on paper.</em>
            </h2>
            <p className="mt-5 max-w-sm text-lp-bg/70">
              Heatmaps, weekly reports, correlations between sleep and mood, water
              and workouts — Loopwell shows you the story your data has been trying
              to tell.
            </p>
            <div className="mt-8 space-y-4">
              {ANALYTICS_POINTS.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-lp-accent" />
                  <div>
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="text-sm text-lp-bg/60">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 lg:col-span-8">
            <div className="rounded-3xl border border-lp-bg/10 bg-lp-bg/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-lp-bg/60">Consistency heatmap</div>
                  <div className="font-display text-2xl">A year of showing up</div>
                </div>
                <div className="hidden gap-1 md:flex">
                  {[0.15, 0.3, 0.5, 0.75, 1].map((o) => (
                    <div key={o} className="h-3 w-3 rounded-sm bg-lp-accent" style={{ opacity: o }} />
                  ))}
                </div>
              </div>
              <div className="mt-5 overflow-x-auto">
                <div className="flex gap-1">
                  {Array.from({ length: 30 }, (_, col) => (
                    <div key={col} className="flex flex-col gap-1">
                      {Array.from({ length: 7 }, (_, row) => (
                        <div
                          key={row}
                          className="h-3 w-3 rounded-sm bg-lp-accent"
                          style={{ opacity: heatOpacity(col, row) }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-lp-bg/10 bg-lp-bg/5 p-6">
                <div className="text-xs uppercase tracking-widest text-lp-bg/60">Sleep vs. mood</div>
                <div className="mt-1 font-display text-xl">Strong positive correlation</div>
                <svg viewBox="0 0 200 90" className="mt-4 h-28 w-full">
                  <path
                    d="M0,60 C25,55 40,58 60,45 C80,32 100,40 120,28 C140,18 165,25 200,15"
                    fill="none"
                    stroke="var(--lp-accent)"
                    strokeWidth="1.75"
                  />
                  <path
                    d="M0,70 C25,68 40,62 60,55 C80,48 100,52 120,42 C140,32 165,38 200,28"
                    fill="none"
                    stroke="oklch(98.5% 0.006 90 / 0.5)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                </svg>
              </div>
              <div className="rounded-3xl border border-lp-bg/10 bg-lp-bg/5 p-6">
                <div className="text-xs uppercase tracking-widest text-lp-bg/60">Weekly summary</div>
                <div className="mt-1 font-display text-xl">You had a great week.</div>
                <ul className="mt-4 space-y-2 text-sm">
                  {WEEKLY_SUMMARY.map((s) => (
                    <li key={s.label} className="flex justify-between border-b border-lp-bg/10 pb-2">
                      <span className="text-lp-bg/70">{s.label}</span>
                      <span className="font-semibold">{s.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const REMINDERS = [
  { text: "Time to hydrate", time: "8:32 AM" },
  { text: "Evening walk?", time: "6:14 PM" },
  { text: "Wind down in 30 min", time: "10:00 PM" },
];

const CHALLENGE_AVATARS = ["A", "M", "J", "S", "R"];

export function ConsistencySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-lp-muted">Built for consistency</div>
        <h2 className="mt-3 font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">
          Motivation is a moment.
          <br />
          <em className="italic text-lp-primary">Consistency is a system.</em>
        </h2>
        <p className="mt-5 text-lp-muted">
          Streaks, rituals, and gentle nudges — the quiet architecture that keeps
          you moving on the days you don&apos;t feel like it.
        </p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-lp-hairline bg-lp-surface p-6">
          <div className="mb-6 grid h-10 w-10 place-items-center rounded-xl bg-lp-subtle text-lp-primary">
            <Flame className="h-5 w-5" />
          </div>
          <div className="font-display text-2xl text-lp-ink">Streaks that forgive</div>
          <p className="mt-2 text-sm leading-relaxed text-lp-muted">
            Life happens. Freeze days protect your momentum without breaking your progress.
          </p>
          <div className="mt-6 rounded-2xl bg-lp-bg p-4 hairline">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-lp-muted">Current streak</div>
                <div className="font-display text-4xl text-lp-ink">
                  47<span className="text-lg text-lp-muted"> days</span>
                </div>
              </div>
              <Flame className="h-6 w-6 text-lp-accent" />
            </div>
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 21 }, (_, i) => (
                <div key={i} className="h-6 flex-1 rounded-sm bg-lp-primary" style={{ opacity: 0.2 + i * 0.038 }} />
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-lp-hairline bg-lp-surface p-6">
          <div className="mb-6 grid h-10 w-10 place-items-center rounded-xl bg-lp-subtle text-lp-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div className="font-display text-2xl text-lp-ink">Reminders with taste</div>
          <p className="mt-2 text-sm leading-relaxed text-lp-muted">
            Thoughtful, contextual nudges — never spammy pings that make you dread your phone.
          </p>
          <div className="mt-6 space-y-2">
            {REMINDERS.map((r) => (
              <div key={r.text} className="flex items-center justify-between rounded-xl border border-lp-hairline bg-lp-bg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="grid h-6 w-6 place-items-center rounded-md bg-lp-subtle">
                    <Bell className="h-3 w-3 text-lp-primary" />
                  </div>
                  <span className="text-sm text-lp-ink">{r.text}</span>
                </div>
                <span className="text-xs text-lp-muted">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-lp-hairline bg-lp-surface p-6">
          <div className="mb-6 grid h-10 w-10 place-items-center rounded-xl bg-lp-subtle text-lp-primary">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="font-display text-2xl text-lp-ink">Challenges with friends</div>
          <p className="mt-2 text-sm leading-relaxed text-lp-muted">
            30-day resets, monthly missions, and private circles that make showing up fun.
          </p>
          <div className="mt-6 rounded-2xl bg-lp-bg p-4 hairline">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-lp-ink">30-day no sugar</span>
              <span className="text-xs text-lp-muted">Day 18 / 30</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-lp-subtle">
              <div className="h-full rounded-full bg-lp-primary" style={{ width: "60%" }} />
            </div>
            <div className="mt-4 flex -space-x-2">
              {CHALLENGE_AVATARS.map((a, i) => (
                <div
                  key={a}
                  className="grid h-7 w-7 place-items-center rounded-full border-2 border-lp-surface text-[10px] font-semibold text-lp-primary-fg"
                  style={{ background: `oklch(${0.4 + i * 0.1} 0.09 ${140 + i * 20})` }}
                >
                  {a}
                </div>
              ))}
              <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-lp-surface bg-lp-subtle text-[10px] font-semibold text-lp-muted">
                +8
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TRUST_CARDS = [
  { icon: Lock, title: "End-to-end encryption", desc: "Your entries stay yours." },
  { icon: Shield, title: "SOC 2 & GDPR ready", desc: "Reviewed, audited, documented." },
  { icon: Zap, title: "Fast on any device", desc: "Under 200ms across the app." },
  { icon: Sparkles, title: "Export anytime", desc: "CSV, JSON, or a full archive." },
];

export function PrivacySection() {
  return (
    <section className="border-y border-lp-hairline bg-lp-subtle/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-lp-muted">Privacy &amp; trust</div>
            <h2 className="mt-3 font-display text-4xl leading-tight text-lp-ink md:text-5xl">
              Your progress.
              <br />
              <em className="italic text-lp-primary">Your data. Full stop.</em>
            </h2>
            <p className="mt-5 max-w-md text-lp-muted">
              Loopwell is private by default. No selling, no ads, no dark patterns —
              just a quiet tool that respects the person using it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {TRUST_CARDS.map((c) => (
              <div key={c.title} className="rounded-2xl border border-lp-hairline bg-lp-surface p-5">
                <c.icon className="h-5 w-5 text-lp-primary" />
                <div className="mt-3 text-sm font-semibold text-lp-ink">{c.title}</div>
                <div className="mt-1 text-xs text-lp-muted">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
