import type { Metadata } from "next";
import { Building2, Clock, LifeBuoy, Mail, MapPin, type LucideIcon } from "lucide-react";
import { Accordion } from "@/components/landing/accordion";
import { ContactForm } from "@/components/landing/forms";
import { CtaBand, PageHero, SectionHead } from "@/components/landing/ui";
import { CONTACT_FAQ } from "@/lib/marketing/content";

export const metadata: Metadata = {
  title: "Contact — Loopwell",
  description:
    "Support, feedback, partnerships, or just a good idea — we read every message and usually reply within a day.",
};

const CHANNELS: { icon: LucideIcon; label: string; value: string; desc: string }[] = [
  {
    icon: LifeBuoy,
    label: "Support",
    value: "help@loopwell.app",
    desc: "For questions about your account or the product.",
  },
  {
    icon: Building2,
    label: "Partnerships",
    value: "hello@loopwell.app",
    desc: "Teams, wellness programs, integrations.",
  },
  {
    icon: Mail,
    label: "Press",
    value: "press@loopwell.app",
    desc: "Media enquiries, brand kits, interviews.",
  },
  {
    icon: MapPin,
    label: "Team",
    value: "Small & remote",
    desc: "A tiny team building this in the open.",
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Usually within a day",
    desc: "Weekends we're outside, hopefully walking.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Say <em className="italic text-lp-primary">hello</em>.
          </>
        }
        intro="Support, feedback, partnerships, or just a good idea — we read every message and usually reply within a day."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-lp-hairline bg-lp-surface p-8 shadow-soft">
              <div className="max-w-xl">
                <h2 className="font-display text-4xl leading-[1.05] text-lp-ink md:text-5xl">
                  Send us a note.
                </h2>
                <p className="mt-5 text-lp-muted">
                  We&apos;ll get back to you at the email you provide. No auto-responder — a real human.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
          <div className="space-y-4 lg:col-span-2">
            {CHANNELS.map((c) => (
              <div key={c.label} className="rounded-2xl border border-lp-hairline bg-lp-surface p-5">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lp-subtle text-lp-primary">
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-lp-muted">{c.label}</div>
                    <div className="mt-0.5 font-medium text-lp-ink">{c.value}</div>
                    <p className="mt-1 text-sm text-lp-muted">{c.desc}</p>
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
            eyebrow="Before you write"
            title={
              <>
                Common <em className="italic text-lp-primary">questions</em>.
              </>
            }
          />
          <div className="mt-12">
            <Accordion items={CONTACT_FAQ} />
          </div>
        </div>
      </section>

      <div className="pt-28">
        <CtaBand
          title={
            <>
              The next version of you
              <br />
              <em className="italic text-lp-accent">starts on a Tuesday.</em>
            </>
          }
          intro="Not on Monday. Not on January 1st. Today, in five minutes, with the smallest possible step."
          secondary={{ href: "/help", label: "Help centre" }}
        />
      </div>
    </>
  );
}
