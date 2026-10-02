import type {
  CeoDayBrief,
  HandoffCard as HandoffCardData,
  OsProject,
  OsSnapshot,
} from "@depth-showcase/api";
import type { DemoOfferte } from "@/components/sales/demo-offerte";
import {
  CEO_DAY_BRIEF_FALLBACK,
  resolveCeoDayBrief,
} from "@/lib/brief-resolve";
import handoffSample from "@/content/handoffs/card.sample.json";
import osSample from "@/content/os/projects.sample.json";
import { DEMO_OFFERTE } from "@/components/sales/demo-offerte";

function siteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://127.0.0.1:3456";
}

async function safeJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${siteOrigin()}${path}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function loadCockpitData(): Promise<{
  brief: CeoDayBrief;
  health: { ok: boolean | null; version?: string; storeMode?: string } | null;
  handoff: HandoffCardData | null;
  projects: OsProject[];
  osHeadline?: string;
  offerte: DemoOfferte;
}> {
  // Prefer aggregate when Backend has it; fall back to parallel feeds.
  type Morning = {
    dayBrief?: CeoDayBrief;
    handoff?: { card?: HandoffCardData };
    offerte?: { offerte?: DemoOfferte };
    osSnapshot?: OsSnapshot;
    health?: { ok?: boolean; version?: string; storeMode?: string };
  };

  const morning = await safeJson<Morning>("/api/cockpit/morning");

  if (morning?.dayBrief || morning?.osSnapshot) {
    const brief = resolveCeoDayBrief(morning.dayBrief ?? null);
    return {
      brief,
      health: morning.health
        ? {
            ok: morning.health.ok === true,
            version: morning.health.version,
            storeMode: morning.health.storeMode,
          }
        : null,
      handoff: morning.handoff?.card ?? (handoffSample as HandoffCardData),
      projects: morning.osSnapshot?.projects?.length
        ? morning.osSnapshot.projects
        : (osSample.projects as OsProject[]),
      osHeadline: morning.osSnapshot?.headline,
      offerte: morning.offerte?.offerte ?? DEMO_OFFERTE,
    };
  }

  const [briefLive, healthLive, handoffLive, osLive, offerteLive] = await Promise.all([
    safeJson<CeoDayBrief>("/api/ceo-day-brief"),
    safeJson<{ ok?: boolean; version?: string; storeMode?: string }>("/api/health"),
    safeJson<{ card?: HandoffCardData }>("/api/showcase/handoff"),
    safeJson<OsSnapshot>("/api/os-snapshot"),
    safeJson<{ offerte?: DemoOfferte }>("/api/showcase/offerte"),
  ]);

  return {
    brief: resolveCeoDayBrief(briefLive),
    health: healthLive
      ? { ok: healthLive.ok === true, version: healthLive.version, storeMode: healthLive.storeMode }
      : null,
    handoff: handoffLive?.card ?? (handoffSample as HandoffCardData),
    projects: osLive?.projects?.length
      ? osLive.projects
      : (osSample.projects as OsProject[]),
    osHeadline: osLive?.headline,
    offerte: offerteLive?.offerte ?? DEMO_OFFERTE,
  };
}
