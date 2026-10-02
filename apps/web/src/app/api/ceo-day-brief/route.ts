import {
  CeoDayBriefSchema,
  CeoDayBriefTriggerSchema,
} from "@depth-showcase/api";
import sample from "../../../../data/ceo-day-brief.sample.json";
import { optionsCors, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";

export function OPTIONS(req: Request) {
  return optionsCors(req);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const triggerQ = url.searchParams.get("trigger");
  const triggerParsed = triggerQ
    ? CeoDayBriefTriggerSchema.safeParse(triggerQ)
    : null;
  if (triggerQ && !triggerParsed?.success) {
    return withCors(
      {
        error: "invalid trigger",
        hint: "preview | manual | tesla_car_entry",
      },
      { status: 400 },
      req,
    );
  }

  const base = structuredClone(sample) as Record<string, unknown>;
  if (triggerParsed?.success) base.trigger = triggerParsed.data;
  base.generatedAt = new Date().toISOString();

  // Cap sections at 5
  const sections = base.sections as {
    mustDo: unknown[];
    stuck: unknown[];
    stepIn: unknown[];
  };
  if (sections) {
    sections.mustDo = (sections.mustDo || []).slice(0, 5);
    sections.stuck = (sections.stuck || []).slice(0, 5);
    sections.stepIn = (sections.stepIn || []).slice(0, 5);
  }

  const parsed = CeoDayBriefSchema.safeParse(base);
  if (!parsed.success) {
    return withCors(
      { error: "ceo day brief invalid", hint: parsed.error.message },
      { status: 500 },
      req,
    );
  }
  return withCors(parsed.data, undefined, req);
}
