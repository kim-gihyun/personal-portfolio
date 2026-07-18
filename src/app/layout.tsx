import type { Metadata, Viewport } from "next";
import { Spectral, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { profile } from "@/lib/data/profile";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/chrome/Cursor";
import { GkBackdrop } from "@/components/chrome/GkBackdrop";
import { Nav } from "@/components/chrome/Nav";
import { Footer } from "@/components/chrome/Footer";
import { Preloader } from "@/components/chrome/Preloader";
import { Analytics } from "@/components/chrome/Analytics";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gihyunkim.com"),
  title: {
    default: "Gihyun Kim — Mechanical Engineering, HKU",
    template: "%s — Gihyun Kim",
  },
  description:
    "Gihyun Kim — engineering student at the University of Hong Kong, working across robotics, mechanical design, materials research, and applied AI.",
  openGraph: {
    title: "Gihyun Kim — Mechanical Engineering, HKU",
    description:
      "Robotics, mechanical design, materials research, and applied AI. Live 3D models, an interactive CV, and an engineering log.",
    url: "https://gihyunkim.com",
    siteName: "Gihyun Kim",
    images: [{ url: "/assets/og-card.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/assets/og-card.png"] },
  icons: { icon: "/assets/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1322" },
  ],
};

// No-flash theme + js flag, applied before first paint.
const bootScript = `(function(){try{var t=localStorage.getItem('gk-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;var r=document.documentElement;r.setAttribute('data-theme',d?'dark':'light');r.classList.add('js');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spectral.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body suppressHydrationWarning>
        <Preloader name={profile.name} />
        <GkBackdrop />
        <Cursor />
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
        <Analytics />
      </body>
      {/* GoatCounter — privacy-friendly page-view analytics */}
      <Script
        src="https://gc.zgo.at/count.js"
        data-goatcounter="https://ghkim037.goatcounter.com/count"
        strategy="afterInteractive"
      />
    </html>
  );
}
