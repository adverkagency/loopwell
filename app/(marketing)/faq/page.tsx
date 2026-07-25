import type { Metadata } from "next";
import { FaqBrowser } from "@/components/landing/faq-browser";
import { CtaBand, PageHero } from "@/components/landing/ui";

export const metadata: Metadata = {
  title: "FAQ — Loopwell",
  description:
    "Answers about habits, health, pricing, your account and security — without the fluff.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Frequently asked"
        title={
          <>
            Answers, <em className="italic text-lp-primary">without the fluff</em>.
          </>
        }
        intro="If it's not here, write to us. We read every message."
      />

      <FaqBrowser />

      <CtaBand
        title={
          <>
            Still <em className="italic text-lp-accent">curious</em>?
          </>
        }
        intro="We reply to every real question, usually within a day."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/help", label: "Help centre" }}
      />
    </>
  );
}
