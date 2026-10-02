import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import "../../public/brand/tokens/tokens.css";
import "./globals.css";

const SITE_URL = "https://depth-showcase.vercel.app";
const TITLE = "Depth Atelier · Workflo showcase";
const DESCRIPTION =
  "Seed a world. Descend through procedural chambers. Live dive streams and a constellation map. Workflo overnight showcase.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Depth Atelier",
  },
  description: DESCRIPTION,
  keywords: [
    "Depth Atelier",
    "depth engine",
    "generative chambers",
    "Workflo",
    "procedural world",
  ],
  authors: [{ name: "Workflo" }],
  creator: "Workflo",
  publisher: "Workflo",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Depth Atelier",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Depth Atelier: seed a world, then descend",
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
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
