import Link from "next/link";
import { DemoOfferteCard } from "@/components/sales/DemoOfferteCard";
import { DEMO_OFFERTE } from "@/components/sales/demo-offerte";

export const metadata = {
  title: "Sales craft - Demo Halo offerte",
  description: "Demo quote card. Fiction only. Workflo sales craft for Depth Atelier.",
};

export default function SalesPage() {
  return (
    <main className="sales-shell">
      <nav className="sales-nav">
        <Link href="/">← Atelier</Link>
        <span>
          <code>DEMO_OFFERTE</code> · threshold panel primary
        </span>
      </nav>
      <header className="sales-hero">
        <p className="sales-kicker">Workflo · Quote Helper</p>
        <h1>Demo offerte</h1>
        <p>
          Fiction-only Halo-flavored quote for the seed-gate craft rail. Do not
          send.
        </p>
      </header>
      <DemoOfferteCard offerte={DEMO_OFFERTE} />
    </main>
  );
}
