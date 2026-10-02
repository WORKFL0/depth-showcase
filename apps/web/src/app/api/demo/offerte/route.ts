import { DemoOfferteSchema, type DemoOfferte } from "@depth-showcase/api";
import { DEMO_HALO_OFFERTE } from "@/lib/demo/halo-offerte";
import { optionsCors, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return optionsCors();
}

/** Playful Halo-flavored demo quote — fiction only, never outbound. */
export function GET() {
  const body: DemoOfferte = DemoOfferteSchema.parse(DEMO_HALO_OFFERTE);
  return withCors(body);
}
