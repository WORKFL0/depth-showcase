import type { Metadata } from "next";
import { BuildingShell } from "@/components/building/BuildingShell";
import { DemoOfferteCard } from "@/components/sales/DemoOfferteCard";
import { DEMO_OFFERTE } from "@/components/sales/demo-offerte";

export const metadata: Metadata = {
  title: "Sales craft — Demo Halo offerte",
  description: "Demo quote card. Fiction only. Workflo sales craft.",
};

export default function SalesPage() {
  return (
    <BuildingShell floor="sales">
      <main className="floor-sales floor-pad">
        <p className="floor-kicker">Sales</p>
        <h1 className="floor-sales__title">Demo-offerte</h1>
        <p className="floor-sales__lede">
          Halo-flavored quote voor de sales craft. Fiction. Niet versturen.
        </p>
        <DemoOfferteCard offerte={DEMO_OFFERTE} />
      </main>
    </BuildingShell>
  );
}
