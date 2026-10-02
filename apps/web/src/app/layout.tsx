import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Depth Atelier — Workflo showcase",
  description:
    "Generative infinite-descent atelier: seeded chambers, SSE dives, constellation graph. Built overnight by Workflo OS bots.",
  openGraph: {
    title: "Depth Atelier",
    description: "Seed a world. Descend. Watch the constellation grow.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
