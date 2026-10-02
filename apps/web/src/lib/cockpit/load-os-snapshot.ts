import { OsSnapshotSchema, type OsSnapshot } from "@depth-showcase/api";
import sample from "../../../data/os-snapshot.sample.json";

export function loadOsSnapshot():
  | { ok: true; data: OsSnapshot }
  | { ok: false; error: string; hint?: string } {
  const body = structuredClone(sample) as Record<string, unknown>;
  body.generatedAt = new Date().toISOString();
  if (Array.isArray(body.projects)) {
    body.projects = (body.projects as unknown[]).slice(0, 20);
  }
  const parsed = OsSnapshotSchema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      error: "os snapshot invalid",
      hint: parsed.error.message,
    };
  }
  return { ok: true, data: parsed.data };
}
