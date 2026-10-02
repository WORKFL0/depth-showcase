import {
  CeoDayBriefSchema,
  CeoDayBriefTriggerSchema,
  type CeoDayBrief,
} from "@depth-showcase/api";
import sample from "../../../data/ceo-day-brief.sample.json";

export function loadCeoDayBrief(
  trigger?: string | null,
): { ok: true; data: CeoDayBrief } | { ok: false; error: string; hint?: string; status: number } {
  const triggerParsed = trigger
    ? CeoDayBriefTriggerSchema.safeParse(trigger)
    : null;
  if (trigger && !triggerParsed?.success) {
    return {
      ok: false,
      error: "invalid trigger",
      hint: "preview | manual | tesla_car_entry",
      status: 400,
    };
  }

  const base = structuredClone(sample) as Record<string, unknown>;
  if (triggerParsed?.success) base.trigger = triggerParsed.data;
  base.generatedAt = new Date().toISOString();

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
    return {
      ok: false,
      error: "ceo day brief invalid",
      hint: parsed.error.message,
      status: 500,
    };
  }
  return { ok: true, data: parsed.data };
}
