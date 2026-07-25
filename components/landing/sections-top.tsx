import Link from "next/link";
import {
  Apple,
  ArrowRight,
  ArrowUpRight,
  ChartColumn,
  Check,
  Droplets,
  Flame,
  Heart,
  Moon,
  Scale,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { WaterCard } from "./interactive";

const HABITS_DONE = [
  { name: "Morning walk", meta: "30 min" },
  { name: "Read 20 pages", meta: "Deep Work" },
  { name: "Meditate", meta: "10 min" },
  { name: "Strength training", meta: "Push day" },
];

const CONSISTENCY_BARS = [
  40, 55, 42, 60, 72, 48, 65, 70, 58, 66, 78, 62, 74, 80, 68, 72, 85, 76, 82,
  90, 74, 88, 92, 80, 84, 96, 88, 78, 92, 100,
];

function FloatingCard({
  icon,
  label,
  value,
  sub,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  className: string;
}) {
  return (
    <div className={`absolute z-10 rounded-2xl border border-lp-hairline bg-lp-surface/95 p-3 shadow-elev backdrop-blur hidden md:block ${className}`}>
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-lp-subtle">{icon}</div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-lp-muted">{label}</div>
          <div className="text-sm font-semibold text-lp-ink">
            {value} {sub && <span className="font-normal text-lp-muted">{sub}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 warm-glow" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-3xl text-center animate-rise">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-lp-hairline bg-lp-surface/60 px-3 py-1 text-xs text-lp-muted backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lp-success" />
            New — Weekly reflection &amp; AI insights
          </div>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight text-lp-ink md:text-7xl">
            The quiet place to
            <br />
            <em className="italic text-lp-primary">become</em>{" who you're"}
            <br />
            working toward.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-lp-muted">
            Loopwell brings your habits, health, nutrition, and goals into one calm,
            focused space — so consistency stops feeling like a chore and starts
            feeling like you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-lp-ink px-5 py-3 text-sm font-medium text-lp-bg shadow-elev transition-all hover:bg-lp-ink/90"
            >
              Start free — no card required
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#product"
              className="inline-flex items-center gap-2 rounded-full border border-lp-hairline bg-lp-surface px-5 py-3 text-sm font-medium text-lp-ink transition-all hover:bg-lp-subtle"
            >
              Watch the 90-second tour
            </a>
          </div>
          <p className="mt-4 text-xs text-lp-muted">Free forever · Web now, iOS &amp; Android coming soon · Private by default</p>
        </div>

        {/* Browser-frame dashboard mockup */}
        <div className="relative mx-auto mt-16 max-w-6xl">
          <div className="rounded-3xl border border-lp-hairline bg-lp-surface shadow-elev">
            <div className="flex items-center gap-2 border-b border-lp-hairline px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-lp-hairline" />
              <span className="h-2.5 w-2.5 rounded-full bg-lp-hairline" />
              <span className="h-2.5 w-2.5 rounded-full bg-lp-hairline" />
              <div className="ml-4 flex items-center gap-2 rounded-md bg-lp-subtle px-3 py-1 text-xs text-lp-muted">
                loopwell.app/today
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 p-5">
              <aside className="col-span-2 hidden flex-col gap-1 md:flex">
                {[
                  { icon: <Sparkles className="h-4 w-4" />, label: "Today", active: true },
                  { icon: <Target className="h-4 w-4" />, label: "Goals" },
                  { icon: <ChartColumn className="h-4 w-4" />, label: "Analytics" },
                  { icon: <Heart className="h-4 w-4" />, label: "Health" },
                  { icon: <Apple className="h-4 w-4" />, label: "Nutrition" },
                  { icon: <Trophy className="h-4 w-4" />, label: "Streaks" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${
                      item.active ? "bg-lp-subtle text-lp-ink" : "text-lp-muted"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </div>
                ))}
              </aside>
              <div className="col-span-12 md:col-span-7">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-lp-muted">Tuesday · Nov 12</div>
                    <h3 className="font-display text-2xl text-lp-ink">Good morning, Ava.</h3>
                  </div>
                  <div className="hidden items-center gap-2 rounded-full border border-lp-hairline px-3 py-1.5 text-xs md:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-lp-success" />
                    Daily score <span className="font-semibold text-lp-ink">86</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-lp-hairline bg-lp-bg/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-lp-muted">Today&apos;s habits</span>
                    <span className="text-xs text-lp-muted">4 of 6</span>
                  </div>
                  <div className="space-y-2">
                    {HABITS_DONE.map((h) => (
                      <div key={h.name} className="flex items-center justify-between rounded-lg bg-lp-surface px-3 py-2.5 hairline">
                        <div className="flex items-center gap-3">
                          <span className="grid h-5 w-5 place-items-center rounded-md border border-lp-primary bg-lp-primary text-lp-primary-fg">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm text-lp-muted line-through">{h.name}</span>
                        </div>
                        <span className="text-xs text-lp-muted">{h.meta}</span>
                      </div>
                    ))}
                    {["No sugar", "Journal"].map((h) => (
                      <div key={h} className="flex items-center justify-between rounded-lg bg-lp-surface px-3 py-2.5 hairline">
                        <div className="flex items-center gap-3">
                          <span className="grid h-5 w-5 place-items-center rounded-md border border-lp-hairline bg-lp-bg" />
                          <span className="text-sm text-lp-ink">{h}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-lp-hairline bg-lp-bg/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-lp-muted">Consistency · last 30 days</span>
                    <span className="text-xs font-semibold text-lp-success">+12%</span>
                  </div>
                  <div className="flex h-24 items-end gap-1">
                    {CONSISTENCY_BARS.map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm ${i === CONSISTENCY_BARS.length - 1 ? "bg-lp-primary" : "bg-lp-primary/20"}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-12 space-y-4 md:col-span-3">
                <div className="rounded-xl border border-lp-hairline bg-lp-surface p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 place-items-center rounded-md bg-lp-subtle">
                      <Droplets className="h-4 w-4 text-lp-primary" />
                    </div>
                    <span className="text-xs text-lp-muted">Water</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold text-lp-ink">1.8 / 2.5L</div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-lp-subtle">
                    <div className="h-full rounded-full bg-lp-primary" style={{ width: "72%" }} />
                  </div>
                </div>
                <div className="rounded-xl border border-lp-hairline bg-lp-surface p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="grid h-6 w-6 place-items-center rounded-md bg-lp-subtle">
                        <Scale className="h-4 w-4 text-lp-primary" />
                      </div>
                      <span className="text-xs text-lp-muted">Weight</span>
                    </div>
                    <TrendingUp className="h-3.5 w-3.5 rotate-180 text-lp-success" />
                  </div>
                  <div className="mt-2 text-lg font-semibold text-lp-ink">74.2 kg</div>
                  <div className="text-xs text-lp-muted">-1.4 kg this month</div>
                </div>
                <div className="rounded-xl border border-lp-hairline bg-lp-surface p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 place-items-center rounded-md bg-lp-subtle">
                      <Moon className="h-4 w-4 text-lp-primary" />
                    </div>
                    <span className="text-xs text-lp-muted">Sleep</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold text-lp-ink">7h 42m</div>
                  <div className="text-xs text-lp-muted">Deep 1h 58m</div>
                </div>
                <div className="rounded-xl border border-lp-hairline bg-lp-surface p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 place-items-center rounded-md bg-lp-subtle">
                      <Apple className="h-4 w-4 text-lp-primary" />
                    </div>
                    <span className="text-xs text-lp-muted">Calories</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold text-lp-ink">1,842</div>
                  <div className="text-xs text-lp-muted">of 2,100</div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-lp-subtle">
                    <div className="h-full rounded-full bg-lp-primary" style={{ width: "87%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FloatingCard
            icon={<Flame className="h-4 w-4 text-lp-accent" />}
            label="Current streak"
            value="47 days"
            className="-left-4 top-24"
          />
          <FloatingCard
            icon={<TrendingUp className="h-4 w-4 text-lp-success" />}
            label="This month"
            value="+18%"
            sub="vs last month"
            className="-right-6 top-16"
          />
          <FloatingCard
            icon={<Trophy className="h-4 w-4 text-lp-primary" />}
            label="Goals hit"
            value="12 / 14"
            className="-right-2 bottom-16"
          />
        </div>
      </div>
    </section>
  );
}

const TRUST_CLAIMS = [
  "Private by default",
  "No ads, ever",
  "Free forever tier",
  "Export anytime",
  "Open roadmap",
];

export function TrustStrip() {
  return (
    <section className="border-y border-lp-hairline bg-lp-subtle/40">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="mb-4 text-center text-xs uppercase tracking-widest text-lp-muted">
          Trusted by 1,000+ people building better days
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST_CLAIMS.map((n) => (
            <span key={n} className="font-display text-lg text-lp-ink/50">{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const MODULES = [
  { icon: Check, name: "Habits", desc: "Daily rituals, weekly cadences, flexible schedules." },
  { icon: Heart, name: "Health", desc: "Heart rate, activity, mood, and recovery — in view." },
  { icon: Apple, name: "Nutrition", desc: "Log meals in seconds. Macros without the math." },
  { icon: Target, name: "Goals", desc: "Big ambitions broken into weekly, doable steps." },
  { icon: Droplets, name: "Water", desc: "One tap. Smart reminders that respect your day." },
  { icon: Scale, name: "Weight", desc: "Trend lines, not scale anxiety. See the real story." },
  { icon: Moon, name: "Sleep", desc: "Bedtime windows, wind-down, and restfulness scores." },
  { icon: ChartColumn, name: "Progress", desc: "Weekly reports that actually mean something." },
];

export function ModulesGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-lp-muted">Everything in one place</div>
        <h2 className="mt-3 font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">
          Ten apps.
          <br />
          <em className="italic text-lp-primary">One quiet</em> home.
        </h2>
        <p className="mt-5 text-lp-muted">
          Stop juggling trackers. Loopwell connects the parts of your life that
          actually shape how you feel — and shows you the story only they can tell
          together.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-lp-hairline bg-lp-hairline sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map((m) => (
          <div key={m.name} className="group relative bg-lp-surface p-6 transition-colors hover:bg-lp-subtle/60">
            <div className="mb-6 grid h-10 w-10 place-items-center rounded-xl bg-lp-subtle text-lp-primary">
              <m.icon className="h-5 w-5" />
            </div>
            <div className="font-display text-2xl text-lp-ink">{m.name}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-lp-muted">{m.desc}</p>
            <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-lp-muted opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

const DASHBOARD_POINTS = [
  { title: "Today's habits — with smart order", desc: "Focus on the ones you'll actually miss." },
  { title: "Daily score", desc: "A single, honest number for the whole day." },
  { title: "Trends that read like a sentence", desc: '"You\'ve slept better every week for a month."' },
  { title: "Quick actions", desc: "Log water, meals, weight, mood — one tap, done." },
];

const SLEEP_BARS = [55, 68, 72, 60, 78, 84, 88];

export function DailyDashboard() {
  return (
    <section id="product" className="border-y border-lp-hairline bg-lp-subtle/40">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="max-w-xl">
              <div className="text-xs uppercase tracking-widest text-lp-muted">Your daily dashboard</div>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">
                A morning that
                <br />
                <em className="italic text-lp-primary">already knows</em>
                <br />
                what matters.
              </h2>
              <p className="mt-5 text-lp-muted">
                Open Loopwell and see today at a glance: what to do, how you&apos;re
                trending, and the two or three things that will move the needle.
              </p>
            </div>
            <ul className="mt-8 space-y-4">
              {DASHBOARD_POINTS.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <div className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lp-primary text-lp-primary-fg">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-lp-ink">{p.title}</div>
                    <div className="text-sm text-lp-muted">{p.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-lp-hairline bg-lp-surface p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-lp-muted">Quick actions</div>
                  <div className="font-display text-xl text-lp-ink">Log in seconds</div>
                </div>
                <span className="rounded-full bg-lp-subtle px-2.5 py-1 text-xs text-lp-muted">⌘ K</span>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <WaterCard />
                <div className="rounded-2xl border border-lp-hairline bg-lp-bg p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-lp-primary" />
                      <span className="text-sm font-medium text-lp-ink">Weight trend</span>
                    </div>
                    <span className="text-xs font-semibold text-lp-success">-1.4 kg</span>
                  </div>
                  <svg viewBox="0 0 200 80" className="mt-3 h-20 w-full">
                    <defs>
                      <linearGradient id="lp-trend" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--lp-primary)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--lp-primary)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,40 C20,42 30,32 50,34 C70,36 80,50 100,48 C120,46 130,30 150,26 C170,22 185,30 200,20 L200,80 L0,80 Z"
                      fill="url(#lp-trend)"
                    />
                    <path
                      d="M0,40 C20,42 30,32 50,34 C70,36 80,50 100,48 C120,46 130,30 150,26 C170,22 185,30 200,20"
                      fill="none"
                      stroke="var(--lp-primary)"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                    <circle cx="200" cy="20" r="3" fill="var(--lp-primary)" />
                  </svg>
                </div>
                <div className="rounded-2xl border border-lp-hairline bg-lp-bg p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Apple className="h-4 w-4 text-lp-primary" />
                      <span className="text-sm font-medium text-lp-ink">Calories</span>
                    </div>
                    <span className="text-xs text-lp-muted">1,842 / 2,100</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "Protein", value: "128g", pct: 0.78 },
                      { label: "Carbs", value: "210g", pct: 0.62 },
                      { label: "Fat", value: "58g", pct: 0.44 },
                    ].map((m) => {
                      const c = 2 * Math.PI * 24;
                      return (
                        <div key={m.label}>
                          <div className="mx-auto h-14 w-14">
                            <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
                              <circle cx="30" cy="30" r="24" stroke="var(--lp-subtle)" strokeWidth="6" fill="none" />
                              <circle
                                cx="30" cy="30" r="24"
                                stroke="var(--lp-primary)" strokeWidth="6" fill="none" strokeLinecap="round"
                                strokeDasharray={c}
                                strokeDashoffset={c * (1 - m.pct)}
                              />
                            </svg>
                          </div>
                          <div className="mt-2 text-[11px] uppercase tracking-wider text-lp-muted">{m.label}</div>
                          <div className="text-sm font-semibold text-lp-ink">{m.value}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-2xl border border-lp-hairline bg-lp-bg p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-lp-primary" />
                      <span className="text-sm font-medium text-lp-ink">Sleep</span>
                    </div>
                    <span className="text-xs text-lp-muted">7h 42m</span>
                  </div>
                  <div className="mt-4 flex h-14 items-end gap-1">
                    {SLEEP_BARS.map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-md bg-lp-primary/20" style={{ height: `${h}%` }}>
                        <div className="h-1/3 w-full rounded-t-md bg-lp-primary" style={{ opacity: 0.9 }} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-lp-muted">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
