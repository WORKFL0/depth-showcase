import type { Metadata } from "next";
import { BuildingShell } from "@/components/building/BuildingShell";
import { AtelierApp } from "@/components/ui/AtelierApp";

export const metadata: Metadata = {
  title: "Atelier",
  description: "Experiment in hetzelfde Workflo-huis. Geen tweede merk.",
  robots: { index: false, follow: false },
};

export default function AtelierPage() {
  return (
    <BuildingShell floor="atelier">
      <AtelierApp />
    </BuildingShell>
  );
}
