import type { Metadata } from "next";
import { BuildingShell } from "@/components/building/BuildingShell";
import { MorningDepth } from "@/components/morning/MorningDepth";

export const metadata: Metadata = {
  title: "Ochtend",
  description:
    "Wij zijn de IT-afdeling van je bedrijf. Ochtendbrief, atelier en sales in één Workflo-huis.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <BuildingShell floor="ochtend">
      <MorningDepth />
    </BuildingShell>
  );
}
