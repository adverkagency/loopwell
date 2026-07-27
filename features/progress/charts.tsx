/**
 * Lightweight server-rendered charts — plain SVG + CSS grid, no chart
 * library. Deliberate deviation from the architecture doc's Recharts pick:
 * M3's three shapes (bars, one line, a heatmap) don't justify the bundle
 * cost; swap to Recharts if chart variety grows. Every chart carries a
 * text equivalent (UX §1.9).
 */

export function WeekBars({
  days,
}: {
  days: { date: string; ratio: number }[];
}) {
  const label = days
    .map((d) => `${d.date.slice(5)}: ${Math.round(d.ratio * 100)}%`)
    .join(", ");
  const empty = days.every((d) => d.ratio <= 0);
  return (
    <div>
      <div
        role="img"
        aria-label={`Daily habit completion, last ${days.length} days: ${label}`}
        className="flex h-36 items-end gap-2"
      >
        {days.map((d) => (
          <div key={d.date} className="flex h-full flex-1 flex-col items-center gap-1">
            {/* Full-height sunken track so a 0% day still reads as "a day", not a blank */}
            <div className="relative w-full flex-1 overflow-hidden rounded-md bg-secondary">
              <div
                className="absolute inset-x-0 bottom-0 rounded-t-md bg-accent"
                style={{ height: `${Math.min(100, Math.max(d.ratio > 0 ? 4 : 0, d.ratio * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {weekdayLetter(d.date)}
            </span>
          </div>
        ))}
      </div>
      {empty ? (
        <p className="mt-3 text-[13px] text-muted-foreground">
          No habits completed this week yet — today&apos;s a fine place to start.
        </p>
      ) : null}
    </div>
  );
}

export function TrendLine({
  points,
  ariaLabel,
}: {
  points: number[];
  ariaLabel: string;
}) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const W = 300;
  const H = 110;
  const pad = 8;
  const path = points
    .map((v, i) => {
      const x = pad + (i / (points.length - 1)) * (W - pad * 2);
      const y = pad + (1 - (v - min) / range) * (H - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-[110px] w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <polyline
        points={path}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-[var(--accent)]"
      />
    </svg>
  );
}

/**
 * Filled area + line over a longer window (30–90 days) — the Analytics and
 * Health pages' "shape of the month" chart. Gaps (null) break the line rather
 * than drawing a false zero.
 */
export function AreaTrend({
  points,
  ariaLabel,
  max = 100,
  suffix = "%",
}: {
  points: { label: string; value: number | null }[];
  ariaLabel: string;
  max?: number;
  suffix?: string;
}) {
  const W = 600;
  const H = 180;
  const pad = 10;
  const known = points.filter((p) => p.value !== null);
  if (known.length < 2) {
    return (
      <p className="text-[13px] text-muted-foreground">
        Two days of data and this chart fills in — keep logging.
      </p>
    );
  }

  const x = (i: number) => pad + (i / (points.length - 1)) * (W - pad * 2);
  const y = (v: number) => pad + (1 - Math.min(1, v / max)) * (H - pad * 2);

  // Split on gaps so a missing day is a break, not a dip to zero. The fill is
  // split the same way — otherwise it bridges straight across unlogged days
  // while the line correctly breaks, implying data that isn't there.
  const segments: { line: string; from: number; to: number }[] = [];
  let run: string[] = [];
  let from = 0;
  points.forEach((p, i) => {
    if (p.value === null) {
      if (run.length > 1) segments.push({ line: run.join(" "), from, to: i - 1 });
      run = [];
      return;
    }
    if (run.length === 0) from = i;
    run.push(`${x(i).toFixed(1)},${y(p.value).toFixed(1)}`);
  });
  if (run.length > 1) {
    segments.push({ line: run.join(" "), from, to: points.length - 1 });
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[180px] w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={pad}
            x2={W - pad}
            y1={y(max * f)}
            y2={y(max * f)}
            stroke="var(--lw-border)"
            strokeWidth="1"
          />
        ))}
        {segments.map((seg, i) => (
          <polygon
            key={`fill-${i}`}
            points={`${x(seg.from).toFixed(1)},${H - pad} ${seg.line} ${x(seg.to).toFixed(1)},${H - pad}`}
            fill="var(--accent-soft)"
          />
        ))}
        {segments.map((seg, i) => (
          <polyline
            key={`line-${i}`}
            points={seg.line}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="var(--accent)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="tabular mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>{points[0]?.label}</span>
        <span>
          Latest {known[known.length - 1].value}
          {suffix}
        </span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/** Month grid of habit completion — one soft dot per day, weeks as rows. */
export function MonthGrid({
  days,
  monthLabel,
}: {
  days: { date: string; ratio: number | null }[];
  monthLabel: string;
}) {
  // Pad so the 1st lands under its weekday (Monday-first, matching the app default)
  const first = days[0]?.date;
  const lead = first ? (weekdayIndex(first) + 6) % 7 : 0;

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div
        role="img"
        aria-label={`${monthLabel} habit completion — ${days.filter((d) => (d.ratio ?? 0) > 0).length} of ${days.length} days logged`}
        className="mt-2 grid grid-cols-7 gap-1.5"
      >
        {Array.from({ length: lead }).map((_, i) => (
          <span key={`pad-${i}`} aria-hidden />
        ))}
        {days.map((d) => (
          <span
            key={d.date}
            title={
              d.ratio === null
                ? `${d.date}: still to come`
                : `${d.date}: ${Math.round(d.ratio * 100)}%`
            }
            className={`grid aspect-square place-items-center rounded-xl text-[12px] tabular ${
              d.ratio === null
                ? "border border-dashed border-border text-muted-foreground/50"
                : d.ratio === 0
                  ? "bg-secondary text-muted-foreground"
                  : d.ratio < 0.5
                    ? "bg-accent-soft text-accent"
                    : d.ratio < 1
                      ? "bg-accent-line text-accent"
                      : "bg-accent font-semibold text-accent-foreground"
            }`}
          >
            {Number(d.date.slice(8))}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-muted-foreground">
        Deeper green means more of that day&apos;s habits were completed. Dashed
        days haven&apos;t happened yet.
      </p>
    </div>
  );
}

function weekdayIndex(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function Heatmap({
  days,
}: {
  days: { date: string; ratio: number }[];
}) {
  return (
    <div>
      <div
        role="img"
        aria-label={`Daily activity heatmap, last ${days.length} days — denser teal means higher completion`}
        className="grid grid-cols-[repeat(26,1fr)] gap-[3px] max-sm:grid-cols-[repeat(14,1fr)]"
      >
        {days.map((d) => (
          <div
            key={d.date}
            title={`${d.date}: ${Math.round(d.ratio * 100)}%`}
            className="aspect-square rounded-[3px]"
            style={{ background: heatColor(d.ratio) }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[12px] text-muted-foreground">
        <span>Last {days.length} days</span>
        <span aria-hidden className="flex items-center gap-1.5">
          Less
          {[0, 0.3, 0.55, 0.8, 1].map((r) => (
            <span
              key={r}
              className="inline-block h-3 w-3 rounded-[3px] border border-ink/10"
              style={{ background: heatColor(r) }}
            />
          ))}
          More
        </span>
      </div>
      <p className="mt-2 text-[12px] text-muted-foreground">
        Each square is a day — deeper teal means more habits completed. Hover a
        square for the exact date and percentage.
      </p>
    </div>
  );
}

function heatColor(ratio: number): string {
  if (ratio <= 0) return "var(--lw-bg-sunken)";
  if (ratio < 0.35) return "var(--lw-teal-100)";
  if (ratio < 0.6) return "var(--lw-teal-300)";
  if (ratio < 0.85) return "var(--lw-teal-500)";
  return "var(--lw-teal-700)";
}

function weekdayLetter(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return "SMTWTFS"[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}
