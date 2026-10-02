import Link from "next/link";
import { DemoOfferteCard } from "@/components/sales/DemoOfferteCard";
import { DEMO_OFFERTE } from "@/components/sales/demo-offerte";

export const metadata = {
  title: "Sales craft — Demo Halo offerte",
  description: "Demo quote card. Fiction only. Workflo sales craft.",
};

export default function SalesPage() {
  return (
    <main className="sales-shell">
      <nav className="sales-nav">
        <Link href="/">← Ochtendbrief</Link>
        <span>
          <code>DEMO_OFFERTE</code> · hard-atelier
        </span>
      </nav>
      <header className="sales-hero">
        <p className="sales-kicker">Workflo · Quote Helper</p>
        <h1>Demo offerte</h1>
        <p>
          Fiction-only Halo-flavored quote voor de sales craft. Niet versturen.
        </p>
      </header>
      <DemoOfferteCard offerte={DEMO_OFFERTE} />
    </main>
  );
}
