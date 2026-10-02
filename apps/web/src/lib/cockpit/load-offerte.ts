import {
  DemoOffertePanelSchema,
  DemoOfferteSchema,
  type DemoOffertePanel,
} from "@depth-showcase/api";
import raw from "../../components/sales/demo-offerte.json";

export function loadDemoOffertePanel():
  | { ok: true; data: DemoOffertePanel }
  | { ok: false; error: string; hint?: string } {
  const offerte = DemoOfferteSchema.safeParse(raw);
  if (!offerte.success) {
    return {
      ok: false,
      error: "demo offerte invalid",
      hint: offerte.error.message,
    };
  }
  const panel = DemoOffertePanelSchema.safeParse({
    panel: "demo_offerte",
    version: "1.0",
    generatedAt: new Date().toISOString(),
    offerte: offerte.data,
    meta: { fiction: true, source: "demo-offerte.json" },
  });
  if (!panel.success) {
    return {
      ok: false,
      error: "demo offerte panel invalid",
      hint: panel.error.message,
    };
  }
  return { ok: true, data: panel.data };
}
