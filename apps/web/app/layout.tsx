import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "wdth"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
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
      <body>{children}</body>
    </html>
  );
}
