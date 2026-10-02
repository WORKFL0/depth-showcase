import Link from "next/link";
import { DemoOfferteCard } from "@/components/sales/DemoOfferteCard";
import { DEMO_HALO_OFFERTE } from "@/lib/demo/halo-offerte";

export const metadata = {
  title: "Sales craft — Demo Halo offerte | Depth Atelier",
  description:
    "Playful Halo-flavored demo quote card. Fiction only — Workflo sales craft for the overnight showcase.",
};

/** Impressive sales surface: mock Halo offerte fed by /api/demo/offerte. */
export default function SalesPage() {
  return (
    <main className="sales-shell">
      <nav className="sales-nav">
        <Link href="/">← Atelier</Link>
        <a href="/api/demo/offerte">
          <code>GET /api/demo/offerte</code>
        </a>
      </nav>
      <header className="sales-hero">
        <p className="sales-kicker">Workflo OS · Quote Helper craft</p>
        <h1>One offerte. Zero sends.</h1>
        <p>
          Halo shape (status Nieuw, billingperiod, recurring item discipline)
          dressed in Depth Atelier colors — so sales craft shows up next to the
          infinite-descent engine.
        </p>
      </header>
      <DemoOfferteCard offerte={DEMO_HALO_OFFERTE} />
    </main>
  );
}
