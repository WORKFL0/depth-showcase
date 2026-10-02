/**
 * Demo-only Halo-flavored offerte for Depth Atelier threshold panel.
 * Fiction — no real customers, no outbound email.
 */
export type DemoOfferte = {
  id: string;
  clientName: string;
  clientCompany: string;
  title: string;
  currency: "EUR";
  lines: Array<{
    sku: string;
    description: string;
    qty: number;
    unitPriceCents: number;
  }>;
  subtotalCents: number;
  vatRateBps: number;
  totalCents: number;
  validUntil: string;
  haloTicketRef?: string;
  toneNote?: string;
};

export const DEMO_OFFERTE: DemoOfferte = {
  id: "DEMO-WF-0042",
  clientName: "Nova Threshold",
  clientCompany: "Diepteatelier Demo B.V.",
  title: "Starterspakket Paradox — chamber support retainer",
  currency: "EUR",
  lines: [
    {
      sku: "WF-SEED-01",
      description: "Opstart — seed the world & first constellation",
      qty: 1,
      unitPriceCents: 16900,
    },
    {
      sku: "WF-HALO-139",
      description: "Maandelijkse dieptebewaking (Halo item 139 vibe)",
      qty: 1,
      unitPriceCents: 5900,
    },
    {
      sku: "WF-DIVE-4H",
      description: "Paradox-uurpakket — 4× remote engineer dives",
      qty: 4,
      unitPriceCents: 9500,
    },
  ],
  // 16900 + 5900 + 4*9500 = 60800
  subtotalCents: 60800,
  vatRateBps: 2100,
  // 60800 * 1.21 = 73568
  totalCents: 73568,
  validUntil: "2026-11-02",
  haloTicketRef: "Q-DEMO-9001",
  toneNote:
    "Workflo sales craft: status Nieuw, recurring lines on real items — draft until a human says yes.",
};
