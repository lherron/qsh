import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SkipLink } from "@/components/site/skip-link";
import "./globals.css";

/**
 * Bricolage Grotesque, latin, all three axes (opsz 12–96, wght 200–800,
 * wdth 75–100) — every value DESIGN.md § 3 asks for, unchanged.
 *
 * It is served from `app/fonts/` rather than `next/font/google` because
 * Google's latin instance is 131 KB: 268 glyphs of variable outlines for
 * eleven words of display type, and the single reason the landing page could
 * not reach the § 9 floor of Lighthouse performance 95 (measured: it is worth
 * ~450 ms of simulated LCP on its own). `scripts/subset-display-font.sh`
 * regenerates this file from that same Google instance, cut to printable
 * latin plus the typographic marks the copy uses — 77 KB, 111 glyphs, kerning
 * and every axis intact, and byte-identical rendering for every character the
 * site sets in this face.
 */
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque-latin.woff2",
  variable: "--font-bricolage",
  display: "swap",
  weight: "200 800",
  style: "normal",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
  // The google loader generated a metric-matched Arial fallback for this face;
  // keep it so the swap does not shift the H1.
  adjustFontFallback: "Arial",
  fallback: ["Helvetica Neue", "system-ui", "sans-serif"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

// DESIGN.md § 3 lists mono at 400/500/700, but nothing on either page renders
// mono at 700, so that face is not built or served.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wrkq.sh"),
  title: "wrkq — work queues for humans and coding agents",
  description:
    "wrkq is a local-first task ledger for humans and coding agents. A filesystem-flavored CLI over one SQLite file, with a principal on every write and JSON on every command.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "wrkq.sh",
    title: "wrkq — work queues for humans and coding agents",
    description:
      "A local-first task ledger your agents can read. Unix verbs, one SQLite file, JSON on every command, a principal on every write.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "wrkq — work queues for humans and coding agents.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "wrkq — work queues for humans and coding agents",
    description:
      "A local-first task ledger your agents can read. Unix verbs, one SQLite file, JSON on every command, a principal on every write.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${bricolage.variable} ${plexSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
