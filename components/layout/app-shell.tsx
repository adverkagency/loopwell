"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChartColumn,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  SquareCheckBig,
  Target,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { logout } from "@/app/(auth)/actions";

/** Locked IA: Daily, Progress, Goals, Settings. Habits management sits under
 *  Settings but earns a top-level entry here — it's the core loop's home. */
const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/settings/habits", label: "Habits", icon: SquareCheckBig },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const FOCUS_LINE = "Consistency is the quietest form of self-respect.";

export function AppShell({
  greeting,
  dateLabel,
  initials,
  email,
  children,
}: {
  greeting: string;
  dateLabel: string;
  initials: string;
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Drawer state is keyed by route, so navigating away closes it without an effect
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (next: boolean) => setOpenAt(next ? pathname : null);

  // Escape closes the drawer
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function isActive(href: string) {
    return href === "/dashboard/settings"
      ? pathname === href
      : pathname.startsWith(href);
  }

  const nav = (
    <>
      <div className="mb-9 flex items-center gap-3 px-3">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent"
        >
          <span className="size-3 rounded-full border-[2.5px] border-accent-foreground" />
        </span>
        <span className="text-[17px] font-semibold tracking-tight">Loopwell</span>
      </div>
      <nav aria-label="Primary" className="flex-1 overflow-y-auto">
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-colors duration-200 ${
                    active
                      ? "bg-accent-soft font-semibold text-accent"
                      : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon
                    aria-hidden
                    strokeWidth={active ? 2 : 1.75}
                    className="size-[18px] shrink-0"
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-6 rounded-2xl bg-accent-soft p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Daily focus
        </p>
        <p className="mt-2 text-[13px] italic leading-relaxed text-accent">
          {FOCUS_LINE}
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-dvh bg-canvas text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-accent-foreground"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-border bg-surface/60 px-4 py-7 lg:flex">
        {nav}
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="scrim-in absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="drawer-in absolute inset-y-0 left-0 flex w-[264px] max-w-[85vw] flex-col border-r border-border bg-surface px-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[max(1.75rem,env(safe-area-inset-top))] shadow-[var(--shadow-e3)]"
          >
            <button
              type="button"
              autoFocus
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X aria-hidden className="size-[18px]" />
            </button>
            {nav}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[264px]">
        <header className="glass-header sticky top-0 z-20 border-b border-border pt-[env(safe-area-inset-top)]">
          <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-10">
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="-ml-1 grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            >
              <Menu aria-hidden className="size-[18px]" strokeWidth={1.75} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                {dateLabel}
              </p>
              <h1 className="truncate text-[15px] font-semibold tracking-tight sm:text-base">
                {greeting}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Link
                href="/dashboard/progress"
                aria-label="Progress and achievements"
                className="relative hidden size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:grid"
              >
                <ChartColumn aria-hidden className="size-[18px]" strokeWidth={1.75} />
              </Link>
              <Link
                href="/dashboard/settings"
                aria-label="Reminders and settings"
                className="relative grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Bell aria-hidden className="size-[18px]" strokeWidth={1.75} />
              </Link>
              <ThemeToggle />
              <div
                aria-hidden
                className="mx-1 hidden h-7 w-px bg-border sm:block"
              />
              <span
                title={email}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-semibold tracking-wide text-secondary-foreground ring-1 ring-border"
              >
                {initials}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  aria-label="Log out"
                  title="Log out"
                  className="grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <LogOut aria-hidden className="size-[18px]" strokeWidth={1.75} />
                </button>
              </form>
              <Link
                href="/dashboard#log-today"
                className="ml-1 hidden h-10 items-center gap-2 rounded-full bg-accent px-4 text-[13px] font-medium text-accent-foreground shadow-[var(--shadow-e1)] transition-all duration-200 hover:brightness-110 active:scale-[0.97] sm:inline-flex"
              >
                <Plus aria-hidden className="size-4" strokeWidth={2.25} />
                Quick add
              </Link>
            </div>
          </div>
        </header>

        <main
          id="main"
          className="mx-auto max-w-[1280px] space-y-8 px-4 pb-[max(6rem,calc(env(safe-area-inset-bottom)+5rem))] pt-6 sm:px-6 md:space-y-10 md:pb-16 md:pt-8 lg:px-10"
        >
          {children}
        </main>
      </div>

      <Link
        href="/dashboard#log-today"
        className="fixed bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] right-5 z-30 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 text-[14px] font-medium text-accent-foreground shadow-[var(--shadow-e3)] transition-transform duration-200 active:scale-95 sm:hidden"
      >
        <Plus aria-hidden className="size-4" strokeWidth={2.25} />
        Quick add
      </Link>
    </div>
  );
}
