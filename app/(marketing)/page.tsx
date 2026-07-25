import type { Metadata } from "next";
import {
  DailyDashboard,
  Hero,
  ModulesGrid,
  TrustStrip,
} from "@/components/landing/sections-top";
import {
  AnalyticsSection,
  ConsistencySection,
  PrivacySection,
  TrackingBento,
} from "@/components/landing/sections-mid";
import {
  Faq,
  FinalCta,
  Pricing,
  Testimonials,
} from "@/components/landing/sections-bottom";

export const metadata: Metadata = {
  title: "Loopwell — Track habits, health, and personal growth",
  description:
    "Loopwell brings your habits, health, nutrition, and goals into one calm, focused space — so consistency stops feeling like a chore and starts feeling like you.",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ModulesGrid />
      <DailyDashboard />
      <TrackingBento />
      <AnalyticsSection />
      <ConsistencySection />
      <PrivacySection />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
