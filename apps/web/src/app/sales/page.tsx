import Link from "next/link";
import { DemoOfferteCard } from "@/components/sales/DemoOfferteCard";
import { DEMO_OFFERTE } from "@/components/sales/demo-offerte";

export const metadata = {
  title: "Sales craft — Demo Halo offerte | Depth Atelier",
  description:
    "Playful Halo-flavored demo quote card. Fiction only — Workflo sales craft for the overnight showcase.",
};

/** Shareable deep link for the demo card (primary mount: threshold in AtelierApp). */
export default function SalesPage() {
  return (
    <main className="sales-shell">
      <nav className="sales-nav">
        <Link href="/">← Atelier</Link>
        <span>
          <code>demo-offerte.ts</code> · threshold panel primary
        </span>
      </nav>
      <header className="sales-hero">
        <p className="sales-kicker">Workflo OS · Quote Helper craft</p>
        <h1>One offerte. Zero sends.</h1>
        <p>
          FE contract payload for the seed-gate secondary panel — Halo craft
          dressed for Depth Atelier.
        </p>
      </header>
      <DemoOfferteCard offerte={DEMO_OFFERTE} />
    </main>
  );
}
