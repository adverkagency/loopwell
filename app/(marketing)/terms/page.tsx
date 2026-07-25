import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/landing/ui";

export const metadata: Metadata = {
  title: "Terms of Service — Loopwell",
  description: "The terms covering your use of Loopwell, in plain language.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Acceptance",
    body: [
      "By creating an account or using Loopwell, you agree to these terms and our Privacy Policy.",
    ],
  },
  {
    id: "beta",
    heading: "Beta status",
    body: [
      "Loopwell is in active beta. Features may change, and while we take care with your data, you should not rely on Loopwell as your only record of anything important. Export regularly if it matters to you.",
    ],
  },
  {
    id: "eligibility",
    heading: "Eligibility",
    body: [
      "You must be at least 13 years old (or 16 in the EEA) to use Loopwell. By using the service, you confirm that you meet this requirement.",
    ],
  },
  {
    id: "your-account",
    heading: "Your account",
    body: [
      "You're responsible for maintaining the security of your account credentials. Tell us right away if you suspect unauthorised access.",
    ],
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    body: [
      "Don't misuse the service — no attempts to disrupt it, reverse-engineer it, or use Loopwell to harm others. Don't upload unlawful content.",
    ],
  },
  {
    id: "content",
    heading: "Your content",
    body: [
      "You own everything you put into Loopwell. You grant us a limited licence to store, process and display it back to you as part of providing the service. We claim no ownership.",
    ],
  },
  {
    id: "payments",
    heading: "Payments",
    body: [
      "Loopwell does not currently take payments — there is no billing integration in the product, and nothing can charge you. Pro pricing is published so you know where things are heading.",
      "If paid plans launch, they will auto-renew until cancelled, you'll be able to cancel at any time with access continuing until the end of your billing period, and we will tell you well before anything changes.",
    ],
  },
  {
    id: "termination",
    heading: "Termination",
    body: [
      "You can delete your account at any time. We may suspend accounts that violate these terms. On termination, we remove personal data per the Privacy Policy.",
    ],
  },
  {
    id: "warranty",
    heading: "Warranty & disclaimers",
    body: [
      'Loopwell is provided "as is". It is not medical advice, and nothing in the app — including the Life Score — is a clinical measure. Consult a qualified professional for health decisions.',
    ],
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, our liability is limited to the amount you paid us in the 12 months preceding the claim.",
    ],
  },
  {
    id: "changes",
    heading: "Changes",
    body: ["We'll notify you of material changes at least 30 days in advance."],
  },
  {
    id: "contact",
    heading: "Contact",
    body: ["Questions about these terms? Reach us through the contact form."],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 25, 2026"
      intro="These terms cover your use of Loopwell. We've kept the language plain — if anything is unclear, please ask."
      sections={SECTIONS}
    />
  );
}
