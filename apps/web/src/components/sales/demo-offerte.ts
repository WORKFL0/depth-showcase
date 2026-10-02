/**
 * Demo-only Halo-flavored offerte for Depth Atelier threshold panel.
 * Fiction — no real customers, no outbound email.
 * Shape owned by @depth-showcase/api DemoOfferteSchema (cents contract).
 */
import type { DemoOfferte } from "@depth-showcase/api";
import raw from "./demo-offerte.json";

export type { DemoOfferte };
export const DEMO_OFFERTE = raw as DemoOfferte;
