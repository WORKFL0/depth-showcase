import { ChamberSchema } from "@depth-showcase/api";
import { optionsCors, withCors } from "@/lib/cors";
import { generateChamber, resolveChamberRef } from "@/lib/engine";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return optionsCors();
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await ctx.params;
  const id = decodeURIComponent(rawId);
  const url = new URL(req.url);
  const seedQ = url.searchParams.get("seed") ?? undefined;

  const resolved = resolveChamberRef(id, seedQ);
  if (!resolved) {
    return withCors(
      {
        error: "unknown chamber",
        hint: "Pass a full chamber id from /api/seed or an exit.targetIdHint (includes hint:…). Optional ?seed= only resolves the root.",
      },
      { status: 404 },
    );
  }

  // If caller passed opaque ch_hash without hint, only root is valid when seed given
  if (!id.includes("hint:") && !id.startsWith("hint:") && seedQ) {
    const root = generateChamber(resolved.seed, []);
    // Accept if they asked for root id prefix
    if (!root.id.startsWith(id.split("|")[0]!) && id !== root.id) {
      // still allow exact root prefix match
      const rootOpaque = root.id.split("|")[0]!;
      if (id !== rootOpaque && !id.startsWith(rootOpaque)) {
        return withCors(
          {
            error: "unknown chamber",
            hint: "Without a hint suffix, only the root chamber can be fetched via ?seed=",
          },
          { status: 404 },
        );
      }
    }
  }

  const chamber = generateChamber(resolved.seed, resolved.path);
  const parsed = ChamberSchema.safeParse(chamber);
  if (!parsed.success) {
    return withCors(
      { error: "chamber invalid", hint: parsed.error.message },
      { status: 500 },
    );
  }
  return withCors(parsed.data);
}
