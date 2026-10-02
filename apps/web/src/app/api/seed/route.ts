import { SeedManifestSchema } from "@depth-showcase/api";
import { optionsCors, withCors } from "@/lib/cors";
import { generateSeedManifest, randomSeed } from "@/lib/engine";
import { clientIp, rateLimit, tooManyResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export function OPTIONS(req: Request) {
  return optionsCors(req);
}

export async function POST(req: Request) {
  const rl = rateLimit(`seed:${clientIp(req)}`, 20, 60_000);
  if (!rl.ok) return tooManyResponse(rl.retryAfterSec, req);

  let seed: string | undefined;
  try {
    const text = await req.text();
    if (text.trim()) {
      const json = JSON.parse(text) as { seed?: unknown };
      if (typeof json.seed === "string" && json.seed.trim()) {
        seed = json.seed.trim().slice(0, 128);
      }
    }
  } catch {
    /* empty */
  }
  if (!seed) seed = randomSeed();
  const manifest = generateSeedManifest(seed);
  const parsed = SeedManifestSchema.safeParse(manifest);
  if (!parsed.success) {
    return withCors(
      { error: "manifest generation failed", hint: parsed.error.message },
      { status: 500 },
      req,
    );
  }
  return withCors(parsed.data, undefined, req);
}

export async function GET(req: Request) {
  const rl = rateLimit(`seed:${clientIp(req)}`, 20, 60_000);
  if (!rl.ok) return tooManyResponse(rl.retryAfterSec, req);
  const url = new URL(req.url);
  let seed = url.searchParams.get("seed")?.trim() || "";
  if (!seed) seed = randomSeed();
  seed = seed.slice(0, 128);
  return withCors(generateSeedManifest(seed), undefined, req);
}
