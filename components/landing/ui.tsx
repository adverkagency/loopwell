import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Small pill used for eyebrows, tags, version numbers and status chips. */
export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "accent";
  className?: string;
}) {
  const tones = {
    neutral: "border-lp-hairline bg-lp-surface text-lp-muted",
    primary: "border-lp-primary/20 bg-lp-primary/10 text-lp-primary",
    accent: "border-lp-accent/30 bg-lp-accent/15 text-lp-ink",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Shared page hero: warm glow, grid lines, eyebrow pill, serif headline. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-lp-hairline">
      <div className="pointer-events-none absolute inset-0 warm-glow" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28 animate-rise">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-lp-hairline bg-lp-surface/60 px-3 py-1 text-xs text-lp-muted backdrop-blur">
          {eyebrow}
        </div>
        <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight text-lp-ink md:text-7xl">
          {title}
        </h1>
        {intro && (
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-lp-muted">{intro}</p>
        )}
        {children}
      </div>
    </section>
  );
}

/** Centered eyebrow + serif headline used above most sections. */
export function SectionHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs uppercase tracking-widest text-lp-muted">{eyebrow}</div>
      <h2 className="mt-3 font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">{title}</h2>
      {intro && <p className="mt-5 text-lp-muted">{intro}</p>}
    </div>
  );
}

/** Dark closing band with two CTAs — repeated at the foot of most pages. */
export function CtaBand({
  title,
  intro,
  primary = { href: "/register", label: "Start free — no card required" },
  secondary,
}: {
  title: React.ReactNode;
  intro: React.ReactNode;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <div className="relative overflow-hidden rounded-3xl border border-lp-hairline bg-lp-ink p-10 text-center text-lp-bg md:p-14">
        <div className="pointer-events-none absolute inset-0 opacity-20 grid-lines" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl leading-[1.05] md:text-6xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-md text-lp-bg/70">{intro}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primary.href}
              className="group inline-flex items-center gap-2 rounded-full bg-lp-bg px-5 py-3 text-sm font-medium text-lp-ink transition-all hover:bg-lp-bg/90"
            >
              {primary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {secondary && (
              <Link
                href={secondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-lp-bg/20 px-5 py-3 text-sm font-medium text-lp-bg transition-colors hover:bg-lp-bg/5"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Vertical rail timeline used by About (journey) and Roadmap (recently shipped). */
export function Timeline({
  items,
  titleSize = "text-2xl",
}: {
  items: { tag: string; title: string; desc: string }[];
  titleSize?: string;
}) {
  return (
    <ol className="mt-14 space-y-8 border-l border-lp-hairline pl-8">
      {items.map((it) => (
        <li key={it.title} className="relative">
          <span className="absolute -left-[41px] top-1.5 grid h-4 w-4 place-items-center rounded-full border border-lp-hairline bg-lp-bg">
            <span className="h-1.5 w-1.5 rounded-full bg-lp-primary" />
          </span>
          <Badge>{it.tag}</Badge>
          <div className={`mt-2 font-display ${titleSize} text-lp-ink`}>{it.title}</div>
          <p className="mt-1 text-sm text-lp-muted">{it.desc}</p>
        </li>
      ))}
    </ol>
  );
}

export type LegalSection = { id: string; heading: string; body: React.ReactNode[] };

/** Shared legal document layout: sticky table of contents + anchored sections. */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="mb-12 border-b border-lp-hairline pb-10">
        <div className="text-xs uppercase tracking-widest text-lp-muted">Legal</div>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] text-lp-ink md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-lp-muted">Last updated · {updated}</p>
        <div className="mt-6 max-w-2xl text-lp-muted">
          <p>{intro}</p>
        </div>
      </header>
      <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="text-xs font-semibold uppercase tracking-widest text-lp-ink">On this page</div>
          <nav aria-label="Table of contents" className="mt-4 space-y-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-sm text-lp-muted transition-colors hover:text-lp-ink"
              >
                {s.heading}
              </a>
            ))}
          </nav>
        </aside>
        <article className="space-y-14">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-display text-2xl text-lp-ink md:text-3xl">{s.heading}</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-lp-muted">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
