import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

// Dashboard typeface — one webfont, variable, self-hosted by next/font.
const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Loopwell — Everything that makes up your day, in one calm place",
  description:
    "Loopwell brings your habits, water, sleep, weight, nutrition, mood, and goals into one calm daily check-in. Free while in beta.",
};

// One variable webfont for the whole app; system stack stays the fallback.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased ${instrument.variable}`}
    >
      <head>
        {/* Apply saved theme before paint — prevents light/dark flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("lw-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
