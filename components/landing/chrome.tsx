"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Infinity as InfinityIcon, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/changelog", label: "Changelog" },
  { href: "/about", label: "About" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-lp-ink text-lp-bg">
        <InfinityIcon className="h-4 w-4" />
      </div>
      <span className="font-display text-xl text-lp-ink">Loopwell</span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
          <Link href="/login" className="hidden text-sm text-lp-muted transition-colors hover:text-lp-ink md:inline">
            Sign in
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-1.5 rounded-full bg-lp-ink px-4 py-2 text-sm font-medium text-lp-bg transition-all hover:bg-lp-ink/90"
          >
            Start free
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-full border border-lp-hairline text-lp-ink transition-colors hover:bg-lp-subtle md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-lp-hairline bg-lp-bg px-6 py-4 md:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {[...NAV, { href: "/login", label: "Sign in" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-sm text-lp-muted transition-colors hover:bg-lp-subtle hover:text-lp-ink"
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
            <div className="mt-6 flex gap-2">
              {["X", "IG", "IN", "GH"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={`Loopwell on ${s}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-lp-hairline text-xs text-lp-muted transition-colors hover:bg-lp-subtle hover:text-lp-ink"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-widest text-lp-ink">{col.title}</div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-lp-muted transition-colors hover:text-lp-ink">
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
