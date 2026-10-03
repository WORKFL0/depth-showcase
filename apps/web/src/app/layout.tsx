import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import "../../public/brand/tokens/tokens.css";
import "./globals.css";

const SITE_URL = "https://depth-showcase.vercel.app";
const TITLE = "De zaak, vóór de inbox";
const DESCRIPTION =
  "Wij zijn de IT-afdeling van je bedrijf. Eerst wat er vandaag moet, dan de rest.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Workflo",
  },
  description: DESCRIPTION,
  keywords: [
    "Workflo",
    "ochtendbrief",
    "atelier",
    "sales",
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
        alt: "De zaak, vóór de inbox",
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
  themeColor: "#F7F7F5",
  colorScheme: "light",
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
