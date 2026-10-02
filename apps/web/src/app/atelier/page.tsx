import type { Metadata } from "next";
import { BuildingShell } from "@/components/building/BuildingShell";
import { AtelierApp } from "@/components/ui/AtelierApp";

export const metadata: Metadata = {
  title: "Atelier (experiment)",
  description: "Experimentverdieping van hetzelfde Workflo-gebouw. Geen tweede merk.",
  robots: { index: false, follow: false },
};

export default function AtelierPage() {
  return (
    <BuildingShell floor="experiment">
      <AtelierApp />
    </BuildingShell>
  );
}
