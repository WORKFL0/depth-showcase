import type { Metadata } from "next";
import { BuildingShell } from "@/components/building/BuildingShell";
import { MorningDepth } from "@/components/morning/MorningDepth";

export const metadata: Metadata = {
  title: "De zaak, vóór de inbox",
  description:
    "Wij zijn de IT-afdeling van je bedrijf. Eerst wat er vandaag moet, dan de rest.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <BuildingShell floor="ochtend">
      <MorningDepth />
    </BuildingShell>
  );
}
