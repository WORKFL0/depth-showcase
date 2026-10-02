import { optionsCors, withCors } from "@/lib/cors";
import { clientIp, rateLimit, tooManyResponse } from "@/lib/rate-limit";
import { loadDemoOffertePanel } from "@/lib/cockpit/load-offerte";

export const dynamic = "force-dynamic";

export function OPTIONS(req: Request) {
  return optionsCors(req);
}

export async function GET(req: Request) {
  const rl = rateLimit(`offerte:${clientIp(req)}`, 60, 60_000);
  if (!rl.ok) return tooManyResponse(rl.retryAfterSec, req);

  const result = loadDemoOffertePanel();
  if (!result.ok) {
    return withCors(
      { error: result.error, hint: result.hint },
      { status: 500 },
      req,
    );
  }
  return withCors(result.data, undefined, req);
}
