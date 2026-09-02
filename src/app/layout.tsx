import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GameProvider } from "@/contexts/GameContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Analytics } from "@/components/Analytics";
import { SITE_URL } from "@/lib/tokens";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Cards Against AI",
  description:
    "The unhinged party card game for the chronically online. Play with AI bots in this Cards Against Humanity-inspired game.",
  keywords: [
    "cards against humanity",
    "party game",
    "card game",
    "AI",
    "multiplayer",
  ],
  authors: [{ name: "Cards Against AI" }],
  openGraph: {
    title: "Cards Against AI",
    description: "The unhinged party card game for the chronically online",
    type: "website",
    siteName: "Cards Against AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cards Against AI",
    description: "The unhinged party card game for the chronically online",
  },
  icons: {
    shortcut: "/favicon.ico",
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F4EE" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivoBlack.variable} ${inter.variable} antialiased`}
    >
      <head>
        {/* Prevent dark-mode FOUC: apply saved theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('cai-theme');if(!t){t=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})()` }} />
        <Analytics />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to game
        </a>
        <ThemeProvider>
          <ErrorBoundary>
            <GameProvider>
              <main id="main-content" tabIndex={-1} className="h-full">
                {children}
              </main>
            </GameProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
