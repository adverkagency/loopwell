import type { Metadata } from "next";
import { Clock, Info, ShieldCheck, type LucideIcon } from "lucide-react";
import { Accordion } from "@/components/landing/accordion";
import { DeletionForm } from "@/components/landing/forms";
import { CtaBand, PageHero, SectionHead } from "@/components/landing/ui";
import { DELETION_FAQ } from "@/lib/marketing/content";

export const metadata: Metadata = {
  title: "Data deletion — Loopwell",
  description:
    "Request permanent deletion of your Loopwell account and everything in it. We remove it all within 30 days.",
};

const NOTES: { icon: LucideIcon; label: string; value: string; desc: string }[] = [
  {
    icon: Clock,
    label: "Timeline",
    value: "Within 30 days",
    desc: "We remove all personal data within 30 days of confirmation.",
  },
  {
    icon: ShieldCheck,
    label: "What we keep",
    value: "Only what law requires",
    desc: "Nothing that identifies you — aggregated records only.",
  },
  {
    icon: Info,
    label: "Before you go",
    value: "Export first?",
    desc: "You can download your full history as CSV from Settings any time.",
  },
];

export default function DataDeletionPage() {
  return (
    <>
      <PageHero
        eyebrow="Data deletion"
        title={
          <>
            Your data. <em className="italic text-lp-primary">Your call.</em>
          </>
        }
        intro="Request permanent deletion of your account and everything in it. This is a real purge, not a soft delete — we remove it all within 30 days."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-lp-hairline bg-lp-surface p-8 shadow-soft">
              <div className="max-w-xl">
                <h2 className="font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">
                  Request deletion.
                </h2>
                <p className="mt-5 text-lp-muted">
                  Fill out the form and confirm from the email we send. Deletion is
                  permanent and cannot be undone.
                </p>
              </div>
              <DeletionForm />
            </div>
          </div>
          <div className="space-y-4 lg:col-span-2">
            {NOTES.map((n) => (
              <div key={n.label} className="rounded-2xl border border-lp-hairline bg-lp-surface p-5">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lp-subtle text-lp-primary">
                    <n.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-lp-muted">{n.label}</div>
                    <div className="mt-0.5 font-medium text-lp-ink">{n.value}</div>
                    <p className="mt-1 text-sm text-lp-muted">{n.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-lp-hairline bg-lp-subtle/40">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <SectionHead
            eyebrow="Questions"
            title={
              <>
                What <em className="italic text-lp-primary">happens next</em>.
              </>
            }
          />
          <div className="mt-12">
            <Accordion items={DELETION_FAQ} />
          </div>
        </div>
      </section>

      <div className="pt-28">
        <CtaBand
          title={
            <>
              Or, <em className="italic text-lp-accent">stay a while</em>.
            </>
          }
          intro="If something's not working, tell us. We'd rather fix it than lose you."
          primary={{ href: "/contact", label: "Contact support" }}
          secondary={{ href: "/faq", label: "Read the FAQ" }}
        />
      </div>
    </>
  );
}
