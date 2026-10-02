import type { Metadata } from "next";
import { MorningDepth } from "@/components/morning/MorningDepth";
import { depthDisplay, depthMono } from "@/lib/depth-fonts";

export const metadata: Metadata = {
  title: "De ochtend ligt dieper",
  description:
    "Workflo B.V. — de dag begint onder de inbox. Een diepteveld voor de ochtend, daarna de brief.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <MorningDepth
      displayClass={depthDisplay.className}
      monoClass={depthMono.className}
    />
  );
}
