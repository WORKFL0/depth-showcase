import { HandoffPanelSchema, type HandoffPanel } from "@depth-showcase/api";
import sample from "../../../data/handoff-panel.sample.json";

export function loadHandoffPanel():
  | { ok: true; data: HandoffPanel }
  | { ok: false; error: string; hint?: string } {
  const body = structuredClone(sample) as Record<string, unknown>;
  body.generatedAt = new Date().toISOString();
  const parsed = HandoffPanelSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, error: "handoff panel invalid", hint: parsed.error.message };
  }
  return { ok: true, data: parsed.data };
}
