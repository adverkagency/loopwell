import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/landing/ui";

export const metadata: Metadata = {
  title: "Privacy Policy — Loopwell",
  description:
    "What Loopwell collects, why, and what you control. Plainly stated — no billboards.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "overview",
    heading: "Overview",
    body: [
      "Loopwell is a personal growth platform. Your data belongs to you. We never sell it, we don't show ads, and we minimise what we collect.",
    ],
  },
  {
    id: "info-we-collect",
    heading: "Information we collect",
    body: [
      "Account information you provide (email address and a password hash — we never store your password itself). Product data you log: habits, water, sleep, weight, mood, nutrition, journal entries and goals. Minimal diagnostic information needed to keep the app running.",
      "We do not collect precise location, your contacts, or content from other apps.",
    ],
  },
  {
    id: "how-we-use",
    heading: "How we use information",
    body: [
      "To provide the service, keep your data available across devices, generate the analytics you asked for, and improve reliability. That's it.",
      "We do not use your health or habit data to train advertising models, and we do not share it with data brokers.",
    ],
  },
  {
    id: "sharing",
    heading: "Sharing",
    body: [
      "We do not sell your data. We share only with the minimum service providers required to operate — hosting and database infrastructure, and food-database lookups when you search for a food — each bound by their own terms.",
      "Food searches are proxied through our servers so third-party food databases never see who you are.",
    ],
  },
  {
    id: "security",
    heading: "Security",
    body: [
      "Data is encrypted in transit (TLS) and at rest. Every table enforces row-level security, so one account can never read another account's rows — this is verified by testing, not just configuration.",
      "We are a small team and have not completed a formal SOC 2 audit. We'd rather tell you that plainly than imply otherwise.",
    ],
  },
  {
    id: "retention",
    heading: "Retention",
    body: [
      "We keep your data for as long as your account is active. If you delete your account, we remove personal data within 30 days — a real purge, not a soft delete — except where retention is legally required.",
    ],
  },
  {
    id: "your-rights",
    heading: "Your rights",
    body: [
      "You can access, export, correct or delete your data at any time. A full CSV export is available from Settings and covers every module. Account deletion can be requested from the Data deletion page.",
      "Depending on where you live you may have additional rights under GDPR or CCPA — including the right to object to processing and to lodge a complaint with a supervisory authority.",
    ],
  },
  {
    id: "children",
    heading: "Children",
    body: [
      "Loopwell is not directed at children under 13 (or under 16 in the EEA). We do not knowingly collect their data. If you believe a child has created an account, contact us and we will remove it.",
    ],
  },
  {
    id: "changes",
    heading: "Changes",
    body: [
      "We'll notify you in-app and by email at least 30 days before material changes. Continued use after the effective date constitutes acceptance.",
    ],
  },
  {
    id: "contact",
    heading: "Contact",
    body: ["Questions? Reach us at privacy@loopwell.app, or through the contact form."],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 25, 2026"
      intro="We built Loopwell because we were tired of apps that felt like billboards. This policy tells you — plainly — what we collect, why, and what you control."
      sections={SECTIONS}
    />
  );
}
