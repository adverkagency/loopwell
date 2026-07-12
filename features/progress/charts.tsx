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
            <div className="relative w-full flex-1 overflow-hidden rounded-md bg-sunken">
              <div
                className="absolute inset-x-0 bottom-0 rounded-t-md bg-gradient-to-b from-teal-400 to-teal-600"
                style={{ height: `${Math.min(100, Math.max(d.ratio > 0 ? 4 : 0, d.ratio * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-ink-muted">
              {weekdayLetter(d.date)}
            </span>
          </div>
        ))}
      </div>
      {empty ? (
        <p className="mt-3 text-sm text-ink-secondary">
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
        className="stroke-[var(--lw-teal-500)]"
      />
    </svg>
  );
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
      <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
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
