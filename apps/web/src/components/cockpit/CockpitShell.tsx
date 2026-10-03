"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  CeoDayBrief,
  HandoffCard as HandoffCardData,
  Health,
  OsProject,
} from "@depth-showcase/api";
import { SkipLink } from "@/components/a11y/SkipLink";
import { LiveRegion } from "@/components/a11y/LiveRegion";
import { CeoDayBriefPanel } from "@/components/craft/CeoDayBriefPanel";
import { HandoffCard } from "@/components/craft/HandoffCard";
import { DemoOfferteCard } from "@/components/sales/DemoOfferteCard";
import { DEMO_OFFERTE, type DemoOfferte } from "@/components/sales/demo-offerte";
import { BotRoster } from "@/components/cockpit/BotRoster";
import { OsMap } from "@/components/cockpit/OsMap";
import {
  fetchHealth,
  getCeoDayBrief,
  getDemoOfferte,
  getOsSnapshot,
  getShowcaseHandoff,
} from "@/lib/client-api";
import { resolveCeoDayBrief } from "@/lib/brief-resolve";

type HealthChip = { ok: boolean | null; version?: string; storeMode?: string };

type Props = {
  initialBrief: CeoDayBrief;
  initialHealth: HealthChip | null;
  initialHandoff: HandoffCardData | null;
  initialProjects: OsProject[];
  initialOsHeadline?: string;
  initialOfferte: DemoOfferte;
};

export function CockpitShell({
  initialBrief,
  initialHealth,
  initialHandoff,
  initialProjects,
  initialOsHeadline,
  initialOfferte,
}: Props) {
  const [brief, setBrief] = useState<CeoDayBrief>(initialBrief);
  const [health, setHealth] = useState<HealthChip | null>(initialHealth);
  const [handoff, setHandoff] = useState<HandoffCardData | null>(initialHandoff);
  const [projects, setProjects] = useState<OsProject[]>(initialProjects);
  const [osHeadline, setOsHeadline] = useState<string | undefined>(initialOsHeadline);
  const [offerte, setOfferte] = useState<DemoOfferte>(initialOfferte);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const live = await getCeoDayBrief();
        if (alive) setBrief(resolveCeoDayBrief(live));
      } catch {
        /* keep SSR brief */
      }
      try {
        const panel = await getShowcaseHandoff();
        if (alive && panel?.card) setHandoff(panel.card);
      } catch {
        /* keep SSR / sample */
      }
      try {
        const snap = await getOsSnapshot();
        if (alive && snap.projects?.length) {
          setProjects(snap.projects);
          if (snap.headline) setOsHeadline(snap.headline);
        }
      } catch {
        /* sample stays */
      }
      try {
        const panel = await getDemoOfferte();
        if (alive && panel?.offerte) setOfferte(panel.offerte);
      } catch {
        /* DEMO_OFFERTE stays */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const tick = () => {
      void fetchHealth()
        .then((h: Health) => {
          if (alive) setHealth({ ok: h.ok === true, version: h.version, storeMode: h.storeMode });
        })
        .catch(() => alive && setHealth({ ok: false }));
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  const healthClass =
    health?.ok === true ? "is-live" : health?.ok === false ? "is-down" : "";
  const healthLabel =
    health?.ok === true
      ? `v${health.version ?? "?"} · ${health.storeMode ?? "ok"}`
      : health?.ok === false
        ? "API down"
        : "…";

  return (
    <>
      <SkipLink href="#day-brief" label="Ga naar ochtendbrief" />
      <main className="floor-brief floor-pad">
        <header className="floor-brief__intro">
          <div>
            <p className="floor-kicker">Ochtendbrief</p>
            <p className="floor-brief__hello">Wat er vandaag moet.</p>
          </div>
          <div className="floor-brief__meta">
            <span>Ochtend · Florian</span>
            <span className={`health-chip ${healthClass}`} title="API health">
              {healthLabel}
            </span>
          </div>
        </header>

        <div className="floor-brief__split">
          <div className="cockpit-hero-col">
            <CeoDayBriefPanel brief={brief} variant="hero" />
          </div>
          <aside className="cockpit-rail" aria-label="Diepere surfaces">
            <OsMap projects={projects} headline={osHeadline} />
            <div className="cockpit-offerte-wrap">
              <DemoOfferteCard offerte={offerte ?? DEMO_OFFERTE} />
              <Link className="cockpit-rail-link" href="/sales">
                Volledige salesverdieping
              </Link>
            </div>
            {handoff ? <HandoffCard card={handoff} /> : null}
          </aside>
        </div>

        <BotRoster />

        <footer className="floor-brief__foot">
          <p>
            Workflo B.V. · Wij zijn de IT-afdeling van je bedrijf.
          </p>
        </footer>
        <LiveRegion message={`Ochtendbrief geladen · ${brief.sections.mustDo.length} moet vandaag`} />
      </main>
    </>
  );
}
