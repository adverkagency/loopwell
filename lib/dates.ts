/**
 * Timezone-correct date helpers. "What counts as today" is the classic
 * habit-app bug source (blueprint M1 risk): a user logging at 11:58pm in
 * Karachi must land on the Karachi date, not the server's UTC date.
 * All dates cross the wire as `YYYY-MM-DD` strings in the USER's timezone.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's date string in the given IANA timezone (e.g. "Asia/Karachi"). */
export function todayInTz(timezone: string, now: Date = new Date()): string {
  // en-CA locale formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** date string + n days (n may be negative). Pure calendar math — timezone-free by design. */
export function addDays(date: string, n: number): string {
  assertIsoDate(date);
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

/** Whole days from a to b (positive when b is later). */
export function daysBetween(a: string, b: string): number {
  assertIsoDate(a);
  assertIsoDate(b);
  const toUtc = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
}

export function assertIsoDate(s: string): void {
  if (!ISO_DATE.test(s)) throw new Error(`Invalid date string: ${s}`);
}

/** Validate an IANA timezone; fall back to UTC on garbage input. */
export function safeTimezone(tz: string | null | undefined): string {
  if (!tz) return "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return "UTC";
  }
}
