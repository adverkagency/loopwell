"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/changelog", label: "Changelog" },
  { href: "/about", label: "About" },
];

/** Brand mark — same ring-in-a-square used by the app shell, so the logo
 *  reads identically across the marketing site, auth, and the dashboard. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-xl bg-lp-primary"
      >
        <span className="size-2.5 rounded-full border-[2.5px] border-lp-primary-fg" />
      </span>
      <span className="font-display text-xl text-lp-ink">Loopwell</span>
    </Link>
  );
}

/**
 * Signed-in state, resolved in the browser so the marketing pages stay static.
 * `null` while unknown — the CTA renders its signed-out form until it resolves.
 */
function useSignedIn() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    createClient()
      .auth.getSession()
      .then(({ data }) => active && setSignedIn(Boolean(data.session)))
      .catch(() => active && setSignedIn(false));
    return () => {
      active = false;
    };
  }, []);
  return signedIn;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const signedIn = useSignedIn();

  return (
    <header className="sticky top-0 z-40 border-b border-lp-hairline/70 bg-lp-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Wordmark />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-colors hover:text-lp-ink ${
                  active ? "text-lp-ink" : "text-lp-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {signedIn ? null : (
            <Link href="/login" className="hidden text-sm text-lp-muted transition-colors hover:text-lp-ink md:inline">
              Sign in
            </Link>
          )}
          <Link
            href={signedIn ? "/dashboard" : "/register"}
            className="group inline-flex min-h-11 items-center gap-1.5 rounded-full bg-lp-ink px-4 py-2 text-sm font-medium text-lp-bg transition-all hover:bg-lp-ink/90 active:scale-[0.97]"
          >
            {signedIn ? "Go to dashboard" : "Start free"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-11 place-items-center rounded-full border border-lp-hairline text-lp-ink transition-colors hover:bg-lp-subtle md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-lp-hairline bg-lp-bg px-6 py-4 md:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {[...NAV, signedIn ? { href: "/dashboard", label: "Go to dashboard" } : { href: "/login", label: "Sign in" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-2 text-sm text-lp-muted transition-colors hover:bg-lp-subtle hover:text-lp-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

const FOOTER_COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/help", label: "Help centre" },
      { href: "/faq", label: "FAQ" },
      { href: "/data-deletion", label: "Data deletion" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-lp-hairline bg-lp-bg">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm text-lp-muted">
              A quieter way to track habits, health, and personal growth — built for
              the long game.
            </p>
            {/* No social placeholders — dead "#" links read as broken. Real
                accounts get added here when they exist. */}
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-lp-muted transition-colors hover:text-lp-ink"
            >
              Talk to us
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-widest text-lp-ink">{col.title}</div>
              <ul className="mt-3 space-y-1">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {/* -my-1.5/py-1.5: 44px touch target without changing the visual rhythm */}
                    <Link
                      href={l.href}
                      className="-my-1.5 inline-flex min-h-11 items-center py-1.5 text-sm text-lp-muted transition-colors hover:text-lp-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-lp-hairline pt-6 text-xs text-lp-muted md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Loopwell. All rights reserved.</div>
          <div>Made with care · Private by default</div>
        </div>
      </div>
    </footer>
  );
}
