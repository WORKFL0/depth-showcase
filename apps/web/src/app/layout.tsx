import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import "../../public/brand/tokens/tokens.css";
import "./globals.css";

const SITE_URL = "https://depth-showcase.vercel.app";
const TITLE = "Workflo · Ochtendbrief";
const DESCRIPTION =
  "CEO cockpit voor Florian: moet vandaag, vastgelopen, instappen. Company OS, sales craft, bots.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Workflo",
  },
  description: DESCRIPTION,
  keywords: [
    "Workflo",
    "CEO cockpit",
    "ochtendbrief",
    "day brief",
    "company OS",
  ],
  authors: [{ name: "Workflo" }],
  creator: "Workflo",
  publisher: "Workflo",
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Workflo",
    locale: "nl_NL",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Workflo ochtendbrief — CEO cockpit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1218",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link
          rel="preload"
          href="/Navigo-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/Navigo-Black.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SeoJsonLd />
        {children}
      </body>
    </html>
  );
}
