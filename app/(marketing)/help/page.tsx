import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CreditCard,
  LifeBuoy,
  Search,
  SquareCheckBig,
  Target,
  User,
  type LucideIcon,
} from "lucide-react";
import { Badge, CtaBand, PageHero, SectionHead } from "@/components/landing/ui";

export const metadata: Metadata = {
  title: "Help centre — Loopwell",
  description:
    "Guides, quick answers and the how-tos that make Loopwell click.",
};

const CATEGORIES: { icon: LucideIcon; title: string; count: number; href: string }[] = [
  { icon: BookOpen, title: "Getting started", count: 8, href: "/faq" },
  { icon: User, title: "Account", count: 6, href: "/faq" },
  { icon: SquareCheckBig, title: "Habits", count: 12, href: "/faq" },
  { icon: Target, title: "Goals", count: 5, href: "/faq" },
  { icon: Activity, title: "Tracking", count: 14, href: "/faq" },
  { icon: CreditCard, title: "Billing", count: 4, href: "/pricing" },
  { icon: LifeBuoy, title: "Troubleshooting", count: 9, href: "/contact" },
];

const POPULAR: { title: string; category: string; read: string; href: string }[] = [
  { title: "How to create your first habit", category: "Getting started", read: "3 min read", href: "/faq" },
  { title: "Complete, partial and skip — what each one does", category: "Habits", read: "4 min read", href: "/faq" },
  { title: "Understanding your Life Score", category: "Tracking", read: "2 min read", href: "/faq" },
  { title: "Reading your weekly review", category: "Tracking", read: "5 min read", href: "/faq" },
  { title: "Exporting your data as CSV", category: "Account", read: "2 min read", href: "/faq" },
  { title: "What Pro includes while it's free", category: "Billing", read: "1 min read", href: "/pricing" },
];

export default function HelpPage() {
  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title={
          <>
            How can we <em className="italic text-lp-primary">help</em>?
          </>
        }
        intro="Guides, quick answers and the how-tos that make Loopwell click."
      >
        <div className="mt-8">
          <Link
            href="/faq"
            className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-lp-hairline bg-lp-surface px-4 py-3 text-left shadow-soft transition-colors hover:bg-lp-subtle/60"
          >
            <Search className="h-4 w-4 shrink-0 text-lp-muted" />
            <span className="text-sm text-lp-muted">Search articles, guides, troubleshooting…</span>
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead
          eyebrow="Browse"
          title={
            <>
              Every answer, <em className="italic text-lp-primary">organised</em>.
            </>
          }
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-lp-hairline bg-lp-hairline sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative bg-lp-surface p-6 transition-colors hover:bg-lp-subtle/60"
            >
              <div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-lp-subtle text-lp-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-xl text-lp-ink">{c.title}</div>
              <div className="mt-1 text-xs text-lp-muted">{c.count} articles</div>
              <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-lp-muted opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-lp-hairline bg-lp-subtle/40">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <SectionHead
            eyebrow="Popular"
            title={
              <>
                Most read this <em className="italic text-lp-primary">week</em>.
              </>
            }
          />
          <ul className="mt-12 divide-y divide-lp-hairline overflow-hidden rounded-3xl border border-lp-hairline bg-lp-surface">
            {POPULAR.map((p) => (
              <li key={p.title}>
                <Link
                  href={p.href}
                  className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-lp-subtle/60"
                >
                  <div className="min-w-0">
                    <div className="font-display text-lg text-lp-ink">{p.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-lp-muted">
                      <Badge>{p.category}</Badge>
                      <span>{p.read}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-lp-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lp-ink" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-28">
        <CtaBand
          title={
            <>
              Can&apos;t find what you <em className="italic text-lp-accent">need</em>?
            </>
          }
          intro="Our humans (real ones) reply within a day."
          primary={{ href: "/contact", label: "Contact support" }}
          secondary={{ href: "/faq", label: "Read the FAQ" }}
        />
      </div>
    </>
  );
}
