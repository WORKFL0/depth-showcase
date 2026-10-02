import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
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
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SeoJsonLd />
        {children}
      </body>
    </html>
  );
}
