import { HandoffPanelSchema } from "@depth-showcase/api";
import sample from "../../../../../data/handoff-panel.sample.json";
import { optionsCors, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";

export function OPTIONS(req: Request) {
  return optionsCors(req);
}

export async function GET(req: Request) {
  const body = structuredClone(sample) as Record<string, unknown>;
  body.generatedAt = new Date().toISOString();
  const parsed = HandoffPanelSchema.safeParse(body);
  if (!parsed.success) {
    return withCors(
      { error: "handoff panel invalid", hint: parsed.error.message },
      { status: 500 },
      req,
    );
  }
  return withCors(parsed.data, undefined, req);
}
