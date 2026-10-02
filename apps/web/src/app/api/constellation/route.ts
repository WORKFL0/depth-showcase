import { ConstellationSchema } from "@depth-showcase/api";
import { optionsCors, withCors } from "@/lib/cors";
import { buildConstellation, randomSeed } from "@/lib/engine";
import {
  discoveredConstellation,
  loadSession,
  resolveSessionRef,
} from "@/lib/session";

export const dynamic = "force-dynamic";

export function OPTIONS(req: Request) {
  return optionsCors(req);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionRef =
    url.searchParams.get("sessionId") || resolveSessionRef(req);
  if (sessionRef) {
    const session = await loadSession(sessionRef);
    if (session) {
      const discovered = discoveredConstellation(session);
      const parsed = ConstellationSchema.safeParse(discovered);
      if (parsed.success) return withCors(parsed.data, undefined, req);
    }
  }

  let seed = url.searchParams.get("seed")?.trim() || "";
  if (!seed) seed = randomSeed();
  seed = seed.slice(0, 128);

  const constellation = { ...buildConstellation(seed), mode: "procedural" as const };
  const parsed = ConstellationSchema.safeParse(constellation);
  if (!parsed.success) {
    return withCors(
      { error: "constellation failed", hint: parsed.error.message },
      { status: 500 },
      req,
    );
  }
  return withCors(parsed.data, undefined, req);
}
