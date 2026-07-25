import { Fraunces, Inter } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/landing/chrome";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/**
 * Marketing shell — the public site has its own editorial identity (Fraunces +
 * deep green/amber, light only) scoped under `.lp`, separate from the in-app
 * teal design system in globals.css.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`lp flex min-h-dvh flex-col ${fraunces.variable} ${inter.variable}`}>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
