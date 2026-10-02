import { SeedManifestSchema } from "@depth-showcase/api";
import { optionsCors, withCors } from "@/lib/cors";
import { generateSeedManifest, randomSeed } from "@/lib/engine";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return optionsCors();
}

export async function POST(req: Request) {
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
    // empty / invalid body → random seed
  }

  if (!seed) seed = randomSeed();

  const manifest = generateSeedManifest(seed);
  const parsed = SeedManifestSchema.safeParse(manifest);
  if (!parsed.success) {
    return withCors(
      { error: "manifest generation failed", hint: parsed.error.message },
      { status: 500 },
    );
  }
  return withCors(parsed.data);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  let seed = url.searchParams.get("seed")?.trim() || "";
  if (!seed) seed = randomSeed();
  seed = seed.slice(0, 128);
  const manifest = generateSeedManifest(seed);
  return withCors(manifest);
}
