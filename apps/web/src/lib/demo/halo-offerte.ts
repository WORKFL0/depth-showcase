import type { DemoOfferte } from "@depth-showcase/api";

/**
 * Fiction-only Halo-flavored quote for the Depth Atelier sales surface.
 * Never email, never push to real Halo — craft demo for Workflo OS.
 */
export const DEMO_HALO_OFFERTE: DemoOfferte = {
  demo: true,
  disclaimer:
    "DEMO ONLY — fictional client & quote. Not a HaloPSA record. Do not send.",
  quoteId: 9001,
  status: { id: 1, label: "Nieuw" },
  title: "Starterspakket Paradox — chamber support retainer",
  client: {
    name: "Diepteatelier Demo B.V.",
    tradingName: "Diepteatelier",
    city: "Leiden",
    fictional: true,
  },
  contact: {
    name: "Nova Threshold",
    email: "nova@example.invalid",
    fictional: true,
  },
  currency: "EUR",
  lines: [
    {
      id: "L1",
      name: "Opstart — seed the world & first constellation",
      quantity: 1,
      unitPriceExcl: 169,
      billingPeriod: 0,
      billingLabel: "eenmalig",
      haloItemId: 101,
      note: "Onboarding whisper + palette lock",
    },
    {
      id: "L2",
      name: "Maandelijkse dieptebewaking (item 139 vibe)",
      quantity: 1,
      unitPriceExcl: 59,
      billingPeriod: 2,
      billingLabel: "per maand",
      haloItemId: 139,
      note: "billingperiod=2 · recurring craft, not a free line",
    },
    {
      id: "L3",
      name: "Paradox-uurpakket — remote engineer dives",
      quantity: 4,
      unitPriceExcl: 95,
      billingPeriod: 0,
      billingLabel: "eenmalig",
      haloItemId: 42,
      note: "Raming 4 uur · nacalculatie in de echte wereld",
    },
  ],
  totals: {
    oneOffExcl: 169 + 4 * 95,
    monthlyExcl: 59,
    yearlyExcl: 59 * 12,
    vatRate: 0.21,
  },
  craft: {
    tagline: "Workflo sales craft — Halo shape, Atelier soul",
    whisper:
      "Status Nieuw. No PDF flew. The chamber remembers what was never sent.",
    palette: ["#0a0a0a", "#f2a65a", "#f2f400", "#7ec8e3", "#e94560"],
    haloFlavors: [
      "status 1 · Nieuw",
      "billingperiod 0 / 2",
      "recurring item discipline",
      "quote stays draft until a human says yes",
    ],
  },
  createdAt: "2026-10-02T19:50:00+02:00",
};
