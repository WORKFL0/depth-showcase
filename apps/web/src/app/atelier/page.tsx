import type { Metadata } from "next";
import { AtelierApp } from "@/components/ui/AtelierApp";

export const metadata: Metadata = {
  title: "Atelier (experiment)",
  description: "Depth chamber experiment — secondary to the CEO cockpit.",
  robots: { index: false, follow: false },
};

export default function AtelierPage() {
  return <AtelierApp />;
}
