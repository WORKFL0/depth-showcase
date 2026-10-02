import { ConstellationSchema } from "@depth-showcase/api";
import { optionsCors, withCors } from "@/lib/cors";
import { buildConstellation, randomSeed } from "@/lib/engine";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return optionsCors();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  let seed = url.searchParams.get("seed")?.trim() || "";
  if (!seed) seed = randomSeed();
  seed = seed.slice(0, 128);

  const constellation = buildConstellation(seed);
  const parsed = ConstellationSchema.safeParse(constellation);
  if (!parsed.success) {
    return withCors(
      { error: "constellation failed", hint: parsed.error.message },
      { status: 500 },
    );
  }
  return withCors(parsed.data);
}
