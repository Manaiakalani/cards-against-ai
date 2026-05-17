import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GameProvider } from "@/contexts/GameContext";
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
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
      className={`${archivoBlack.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <GameProvider>{children}</GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
