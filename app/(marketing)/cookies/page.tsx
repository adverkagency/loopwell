import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/landing/ui";

export const metadata: Metadata = {
  title: "Cookie Policy — Loopwell",
  description:
    "What Loopwell stores in your browser, why, and how to control it. Never for advertising.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "what",
    heading: "What are cookies?",
    body: [
      "Small files stored by your browser. We treat similar technologies — localStorage and session storage — the same way in this policy.",
    ],
  },
  {
    id: "how",
    heading: "How we use them",
    body: [
      "Strictly necessary — signing you in and keeping you signed in. These are set by our authentication provider and cannot be disabled without breaking the product.",
      "Preferences — your theme choice (system, light or dark) is stored locally in your browser so the page doesn't flash the wrong colours before it loads.",
      "Advertising — none. Ever. We set no advertising or cross-site tracking cookies.",
    ],
  },
  {
    id: "third-parties",
    heading: "Third parties",
    body: [
      "Our hosting and database providers may set strictly-necessary cookies to route and secure requests. We do not embed third-party advertising or social tracking scripts.",
    ],
  },
  {
    id: "manage",
    heading: "Managing cookies",
    body: [
      "You can clear cookies and local storage via your browser at any time. Doing so signs you out and resets your theme preference to follow your system setting.",
    ],
  },
  {
    id: "changes",
    heading: "Changes",
    body: [
      "If we ever add optional analytics cookies, we will ask for your consent first and update this page at least 30 days in advance.",
    ],
  },
  {
    id: "contact",
    heading: "Contact",
    body: ["Questions? privacy@loopwell.app, or through the contact form."],
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="July 25, 2026"
      intro="We use cookies sparingly, and never for advertising. Here's what we set, why, and how to control it."
      sections={SECTIONS}
    />
  );
}
