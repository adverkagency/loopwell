"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/app/daily", label: "Daily" },
  { href: "/app/progress", label: "Progress" },
  { href: "/app/goals", label: "Goals" },
  { href: "/app/settings", label: "Settings" },
] as const;

/** Bottom tab bar <900px, left sidebar ≥900px — four destinations, per the locked IA. */
export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-hairline bg-elevated/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md md:sticky md:top-0 md:h-dvh md:w-[232px] md:flex-col md:justify-start md:gap-0.5 md:border-r md:border-t-0 md:bg-paper md:px-4 md:py-6 md:backdrop-blur-none"
    >
      <div className="hidden items-center gap-2 px-3 pb-6 text-lg font-bold tracking-tight text-ink md:flex">
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-field bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-rest-xs"
        >
          L
        </span>
        Loopwell
      </div>
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-control px-3 py-1 text-xs transition md:flex-row md:justify-start md:gap-3 md:px-4 md:py-3 md:text-sm ${
              active
                ? "font-semibold text-teal-600 md:bg-teal-50 md:text-teal-700 md:before:absolute md:before:bottom-[20%] md:before:left-0 md:before:top-[20%] md:before:w-[3px] md:before:rounded-full md:before:bg-primary"
                : "text-ink-muted hover:text-teal-500 md:hover:bg-surface-hover"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
