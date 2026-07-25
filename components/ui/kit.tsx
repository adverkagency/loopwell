/**
 * Shared app UI primitives. Every in-app surface, heading, button, empty state
 * and skeleton comes from here — pages should not hand-roll these class
 * strings, so a token change lands everywhere at once.
 */

/* ---------------- surfaces ---------------- */

export const CARD_BASE =
  "rounded-3xl bg-surface shadow-[var(--shadow-e1)] ring-1 ring-border";

export function Card({
  as: Tag = "section",
  interactive = false,
  className = "",
  children,
  ...rest
}: {
  as?: "section" | "div" | "article" | "li";
  /** Adds the hover lift — only for cards that are themselves a target. */
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={`${CARD_BASE} ${interactive ? "lift" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------------- headings ---------------- */

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1.5 text-[26px] font-medium leading-[1.15] tracking-[-0.015em] sm:text-[30px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function SectionHeading({
  title,
  aside,
  as: Tag = "h2",
}: {
  title: string;
  aside?: React.ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <Tag className="text-[17px] font-semibold tracking-tight">{title}</Tag>
      {aside}
    </div>
  );
}

/* ---------------- buttons ---------------- */

type Variant = "primary" | "secondary" | "ghost" | "quiet";
type Size = "sm" | "md";

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-[14px]",
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground shadow-[var(--shadow-e1)] hover:brightness-110",
  secondary: "bg-accent-soft text-accent hover:bg-accent-line/50",
  ghost:
    "bg-secondary text-secondary-foreground hover:bg-accent-soft hover:text-accent",
  quiet:
    "text-muted-foreground hover:bg-secondary hover:text-foreground",
};

/** Shared button/link styling — same shape whether it renders as <button> or <a>. */
export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  extra = ""
) {
  return `inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55 ${SIZES[size]} ${VARIANTS[variant]} ${extra}`;
}

/* ---------------- forms ---------------- */

/** Single input shape for the whole app — quiet fill, ring on focus. */
export const INPUT =
  "h-11 w-full rounded-xl bg-secondary px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground ring-1 ring-border transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45";

export const LABEL = "text-[13px] font-medium text-muted-foreground";

/* ---------------- feedback ---------------- */

/** Transient success confirmation — pair with useSavedFlash(). */
export function SavedFlash({ label = "Saved" }: { label?: string }) {
  return (
    <span
      role="status"
      className="flash-in inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {label}
    </span>
  );
}

/* ---------------- skeletons ---------------- */

export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div aria-hidden style={style} className={`skeleton rounded-full ${className}`} />
  );
}

export function SkeletonCard({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`${CARD_BASE} p-6 sm:p-7 ${className}`}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-6 w-2/3 rounded-2xl" />
      <div className="mt-5 space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3" style={{ width: `${90 - i * 12}%` }} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- empty state ---------------- */

export function EmptyState({
  illustration,
  title,
  body,
  action,
  className = "",
}: {
  illustration?: React.ReactNode;
  title: string;
  body: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${CARD_BASE} flex flex-col items-center gap-5 px-6 py-10 text-center sm:py-12 ${className}`}
    >
      {illustration}
      <div className="max-w-[42ch] space-y-2">
        <h3 className="text-[17px] font-semibold tracking-tight">{title}</h3>
        <p className="text-[14px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
      {action}
    </div>
  );
}

/** Calm line-art mark for empty states — three loops closing into one. */
export function LoopIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      aria-hidden
      className={`h-28 w-auto ${className}`}
      fill="none"
    >
      <ellipse cx="100" cy="103" rx="58" ry="7" fill="var(--accent-soft)" />
      <circle
        cx="100"
        cy="58"
        r="34"
        stroke="var(--accent-line)"
        strokeWidth="2"
        strokeDasharray="4 7"
        strokeLinecap="round"
      />
      <path
        d="M66 58a34 34 0 0 1 58-24"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="124" cy="34" r="4.5" fill="var(--accent)" />
      <path
        d="m88 59 9 9 18-20"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="34"
        y="42"
        width="20"
        height="6"
        rx="3"
        fill="var(--accent-line)"
      />
      <rect
        x="146"
        y="66"
        width="20"
        height="6"
        rx="3"
        fill="var(--accent-line)"
      />
    </svg>
  );
}
