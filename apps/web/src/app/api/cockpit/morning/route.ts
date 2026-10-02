import { CockpitMorningSchema } from "@depth-showcase/api";
import { optionsCors, withCors } from "@/lib/cors";
import { clientIp, rateLimit, tooManyResponse } from "@/lib/rate-limit";
import { loadCeoDayBrief } from "@/lib/cockpit/load-day-brief";
import { loadHandoffPanel } from "@/lib/cockpit/load-handoff";
import { loadDemoOffertePanel } from "@/lib/cockpit/load-offerte";
import { loadOsSnapshot } from "@/lib/cockpit/load-os-snapshot";
import { storeMode } from "@/lib/session";

export const dynamic = "force-dynamic";

export function OPTIONS(req: Request) {
  return optionsCors(req);
}

export async function GET(req: Request) {
  const rl = rateLimit(`cockpit-morning:${clientIp(req)}`, 30, 60_000);
  if (!rl.ok) return tooManyResponse(rl.retryAfterSec, req);

  const url = new URL(req.url);
  const dayBrief = loadCeoDayBrief(url.searchParams.get("trigger"));
  if (!dayBrief.ok) {
    return withCors(
      { error: dayBrief.error, hint: dayBrief.hint },
      { status: dayBrief.status },
      req,
    );
  }

  const handoff = loadHandoffPanel();
  const offerte = loadDemoOffertePanel();
  const osSnapshot = loadOsSnapshot();

  if (!offerte.ok) {
    return withCors(
      { error: offerte.error, hint: offerte.hint },
      { status: 500 },
      req,
    );
  }
  if (!osSnapshot.ok) {
    return withCors(
      { error: osSnapshot.error, hint: osSnapshot.hint },
      { status: 500 },
      req,
    );
  }

  const body = {
    panel: "ceo_morning" as const,
    version: "1.0",
    generatedAt: new Date().toISOString(),
    dayBrief: dayBrief.data,
    handoff: handoff.ok ? handoff.data : null,
    offerte: offerte.data,
    osSnapshot: osSnapshot.data,
    health: {
      ok: true,
      version: "0.3.0",
      storeMode: storeMode(),
    },
  };

  const parsed = CockpitMorningSchema.safeParse(body);
  if (!parsed.success) {
    return withCors(
      { error: "cockpit morning invalid", hint: parsed.error.message },
      { status: 500 },
      req,
    );
  }
  return withCors(parsed.data, undefined, req);
}
