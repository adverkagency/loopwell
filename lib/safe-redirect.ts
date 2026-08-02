/**
 * Guards against open redirects: only allows same-origin, path-absolute
 * targets. Rejects protocol-relative (`//evil.com`) and backslash variants
 * (`/\evil.com`), which browsers normalize to a scheme-relative URL.
 */
export function safeRedirectTarget(next: unknown, fallback: string): string {
  if (
    typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\")
  ) {
    return next;
  }
  return fallback;
}
