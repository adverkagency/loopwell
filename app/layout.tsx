import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loopwell — Everything that makes up your day, in one calm place",
  description:
    "Loopwell brings your habits, water, sleep, weight, nutrition, mood, and goals into one calm daily check-in. Free while in beta.",
};

// System-font-first (UI spec §2.5) — no webfont loading cost in the app.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
