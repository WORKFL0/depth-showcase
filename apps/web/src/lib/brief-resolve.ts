import type { CeoDayBrief } from "@depth-showcase/api";
import mondaySample from "@/content/ceo/day-brief-panel.sample.json";

/** Old generic Atlas / OS Cartographer preview — prefer Monday sample until Backend updates. */
export function isStaleGenericBrief(brief: CeoDayBrief): boolean {
  const ids = brief.sections.mustDo.map((i) => i.id);
  if (ids.includes("md-1") || ids.includes("md-2") || ids.includes("md-3")) {
    return true;
  }
  const blob = [
    brief.headline ?? "",
    ...brief.sections.mustDo.map((i) => i.title),
  ].join(" ");
  return /Prospect Atlas|OS Cartographer INDEX/i.test(blob);
}

export function resolveCeoDayBrief(live: CeoDayBrief | null): CeoDayBrief {
  const sample = mondaySample as CeoDayBrief;
  if (!live || live.meta?.empty) return sample;
  if (isStaleGenericBrief(live)) return sample;
  return live;
}

export const CEO_DAY_BRIEF_FALLBACK = mondaySample as CeoDayBrief;
