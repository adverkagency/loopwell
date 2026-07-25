/**
 * Shared marketing copy. Kept in one place so the same answers can appear on the
 * homepage, the FAQ page and the contact page without drifting apart.
 */

export type QA = { q: string; a: string };

/** Condensed FAQ shown at the foot of the homepage. */
export const HOME_FAQ: QA[] = [
  {
    q: "Is Loopwell free?",
    a: "Yes. The Free plan includes unlimited habits, goals, daily dashboard, streaks and weekly reports — for as long as you want. Pro adds advanced analytics, AI reflection and challenges, and while Loopwell is in beta every Pro feature is unlocked for everyone at no cost.",
  },
  {
    q: "Which devices does it support?",
    a: "Loopwell is a web app today — it works in any browser and installs to your home screen on phones and desktops alike. Native iOS and Android apps are coming, built on the same account and the same data.",
  },
  {
    q: "How is my data handled?",
    a: "Private by default. Encrypted in transit and at rest, never sold, never used for ads. You can export everything as CSV or permanently delete your account at any time.",
  },
  {
    q: "Can I import from other trackers?",
    a: "CSV import is on the roadmap and you can vote for it. For now you can start fresh in under a minute — onboarding picks your first habits for you.",
  },
  {
    q: "What if I miss a day?",
    a: "Nothing bad. A partial day still counts toward your completion rate, skips are recorded honestly rather than punished, and one missed day never erases the story your consistency has been telling.",
  },
];

/** FAQ page — same answers, grouped into filterable categories. */
export const FAQ_CATEGORIES = [
  "General",
  "Habits",
  "Health",
  "Pricing",
  "Account",
  "Security",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const FAQ_ITEMS: (QA & { category: FaqCategory })[] = [
  {
    category: "General",
    q: "What is Loopwell?",
    a: "A calm, all-in-one place to track habits, health, nutrition, mood and goals — designed for the long game.",
  },
  {
    category: "General",
    q: "Which platforms are supported?",
    a: "The web app today, in any browser, installable to your home screen. Native iOS and Android are coming soon on the same account.",
  },
  {
    category: "General",
    q: "Is Loopwell free?",
    a: "Yes. The Free plan is free forever, no card required. Pro is optional and coming soon — and it's unlocked for everyone during beta.",
  },
  {
    category: "Habits",
    q: "Can I create custom cadences?",
    a: "Daily habits work today. Twice a week, every other day and weekend-only rules are on the roadmap — vote for them if you want them sooner.",
  },
  {
    category: "Habits",
    q: "What happens if I miss a day?",
    a: "Nothing bad. Habits have three states — complete, partial and skip. Partial counts toward your completion rate, and gentle nudges help you re-enter without shame.",
  },
  {
    category: "Habits",
    q: "Can habits be linked to goals?",
    a: "Goals track their own target and progress today. Auto-linking habits to goals is planned so you can see contribution and forecast completion.",
  },
  {
    category: "Health",
    q: "Does Loopwell sync with Apple Health or Google Fit?",
    a: "Not yet — it's on the roadmap alongside the native apps. Everything can be logged manually in a couple of taps in the meantime.",
  },
  {
    category: "Health",
    q: "Can I log mood?",
    a: "Yes, with quick daily check-ins. Over time we surface how mood moves with your sleep, activity and habits.",
  },
  {
    category: "Pricing",
    q: "Is Free forever?",
    a: "Yes. It's not a trial. You'll never lose access to the core product.",
  },
  {
    category: "Pricing",
    q: "When is Pro available?",
    a: "Pro is priced at $6/month but isn't billable yet — every Pro feature is free for everyone during the beta. Join the waitlist from Contact and we'll tell you before anything changes.",
  },
  {
    category: "Pricing",
    q: "Do you offer discounts?",
    a: "Students, non-profits and healthcare workers will get 50% off Pro when billing launches.",
  },
  {
    category: "Account",
    q: "How do I reset my password?",
    a: "From the sign-in screen, tap Forgot password. The reset link arrives within a minute.",
  },
  {
    category: "Account",
    q: "How do I delete my account?",
    a: "Visit Data deletion or contact support. We remove everything within 30 days — it's a real purge, not a soft delete.",
  },
  {
    category: "Account",
    q: "Can I export my data?",
    a: "Yes — a full CSV export from Settings, any time, covering every module.",
  },
  {
    category: "Security",
    q: "How is my data protected?",
    a: "Encrypted in transit and at rest, row-level security so no account can ever read another's rows, and no third-party ad trackers. Ever.",
  },
  {
    category: "Security",
    q: "Where is data stored?",
    a: "On managed Postgres infrastructure with row-level security enforced on every table.",
  },
  {
    category: "Security",
    q: "Is Loopwell SOC 2 compliant?",
    a: "Not yet. We're a small team and haven't started a formal SOC 2 audit — we'd rather say so plainly than imply otherwise.",
  },
];

/** Short pre-flight FAQ on the contact page. */
export const CONTACT_FAQ: QA[] = [
  {
    q: "How do I reset my password?",
    a: "From the sign-in page, tap Forgot password. We'll send a reset link within a minute.",
  },
  {
    q: "Can I import from another app?",
    a: "CSV import is on the roadmap — vote for it there. Setting up fresh takes under a minute in the meantime.",
  },
  {
    q: "Where can I request a feature?",
    a: "Send us a note here, or vote on the public roadmap. We read everything.",
  },
  {
    q: "Do you offer team plans?",
    a: "Not yet — Enterprise is an idea we're exploring. Get in touch and tell us what you'd need.",
  },
];

/** Pricing page FAQ. */
export const PRICING_FAQ: QA[] = [
  {
    q: "Is Free really free forever?",
    a: "Yes. No card required, no trial, no expiry. We plan to fund the product through Pro once it launches.",
  },
  {
    q: "When does Pro launch?",
    a: "No firm date yet. Until it does, every Pro feature is unlocked for everyone at no cost. Join the waitlist from Contact and we'll tell you well before anything changes.",
  },
  {
    q: "Can I switch or cancel any time?",
    a: "Any time, no questions asked. Your data stays yours whichever plan you're on.",
  },
  {
    q: "Do you offer discounts?",
    a: "Yes — students, non-profits and healthcare workers get 50% off Pro when it launches.",
  },
  {
    q: "How do you handle payments?",
    a: "We don't take payments yet — there's no billing integration in the product today. When Pro launches we'll use a established payment processor, and card details will never touch our servers.",
  },
];

/** Data deletion page FAQ. */
export const DELETION_FAQ: QA[] = [
  {
    q: "Can I recover my data after deletion?",
    a: "No. Deletion is permanent and cannot be reversed. Export first if you want a copy.",
  },
  {
    q: "What about my subscription?",
    a: "There's nothing to cancel — Loopwell is free during beta and we don't take payments yet.",
  },
  {
    q: "Will my analytics data survive?",
    a: "No — all personal analytics, streaks and correlations are deleted with the account.",
  },
  {
    q: "Do you keep anything?",
    a: "Only what law requires, held in an aggregated, non-personal form. Nothing that identifies you.",
  },
];
