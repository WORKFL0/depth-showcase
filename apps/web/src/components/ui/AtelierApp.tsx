"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Health } from "@depth-showcase/api";
import { LiveRegion } from "@/components/a11y/LiveRegion";
import { SkipLink } from "@/components/a11y/SkipLink";
import { ChamberHud } from "@/components/hud/ChamberHud";
import { ConstellationMap } from "@/components/hud/ConstellationMap";
import { SeedGate } from "@/components/hud/SeedGate";
import { useDepthSession } from "@/hooks/use-depth-session";
import { fetchHealth } from "@/lib/client-api";

const DepthField = dynamic(
  () =>
    import("@/components/engine/DepthField").then((m) => m.DepthField),
  { ssr: false, loading: () => <div className="depth-field depth-field--fallback" aria-hidden="true" /> },
);

export function AtelierApp() {
  const session = useDepthSession();
  const pointer = useRef({ x: 0, y: 0 });
  const [health, setHealth] = useState<{ ok: boolean | null; version?: string; storeMode?: string } | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const h: Health = await fetchHealth();
        if (alive) setHealth({ ok: h.ok === true, version: h.version, storeMode: h.storeMode });
      } catch {
        if (alive) setHealth({ ok: false });
      }
    })();
    const id = window.setInterval(() => {
      void fetchHealth()
        .then((h) => alive && setHealth({ ok: h.ok === true, version: h.version, storeMode: h.storeMode }))
        .catch(() => alive && setHealth({ ok: false }));
    }, 30000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  const focusInExits = useCallback(() => {
    const root = document.getElementById("chamber-controls");
    if (!root) return false;
    const ae = document.activeElement;
    return !!ae && (ae === root || root.contains(ae));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "Escape" && session.mapOpen) {
        session.toggleMap();
        return;
      }
      if (!focusInExits()) return;
      if (e.key === "m" || e.key === "M") {
        if (session.chamber) session.toggleMap();
        return;
      }
      const n = Number(e.key);
      if (
        session.status === "ready" &&
        session.chamber &&
        !session.mapOpen &&
        n >= 1 &&
        n <= session.chamber.exits.length
      ) {
        void session.dive(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [session, focusInExits]);

  const palette =
    session.manifest?.palette ?? ["#0a0a0a", "#f2f400", "#6b6b6b", "#f7f7f5", "#dada00"];
  const live =
    session.status === "diving"
      ? "Diving into the next chamber"
      : session.status === "seeding"
        ? "Seeding world"
        : session.chamber
          ? `Arrived at ${session.chamber.title}, depth ${session.chamber.depth}${
              session.chamber.paradox ? ", paradox chamber" : ""
            }`
          : "Awaiting a seed";

  const idle =
    session.status === "idle" ||
    session.status === "seeding" ||
    !session.chamber ||
    !session.manifest;

  if (idle) {
    return (
      <>
        <SkipLink href="#seed-input" label="Skip to seed" />
        <main className="shell threshold">
          {/* CSS void only — no WebGL on idle gate */}
          <div className="depth-field depth-field--fallback" aria-hidden="true" />
          <div className="overlay threshold-layout" id="main">
            <div className="threshold-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/stills/still-01-hero-depth.png"
                alt=""
                className="threshold-still"
                width={720}
                height={900}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="threshold-main">
              <p className="atelier-back">
                <Link href="/">← Terug naar ochtendbrief</Link>
              </p>
              <SeedGate
                busy={session.status === "seeding"}
                error={session.error}
                health={health}
                onEnter={(s) => void session.seedWorld(s)}
              />
            </div>
          </div>
          <LiveRegion message={live} />
        </main>
      </>
    );
  }

  return (
    <>
      <SkipLink href="#chamber-controls" label="Skip to chamber controls" />
      <main className={`shell ${session.status === "diving" ? "is-diving" : ""}`}>
        <DepthField
          chamber={session.chamber}
          palette={palette}
          diving={session.status === "diving"}
          pointer={pointer}
        />
        <div className="overlay" id="main" inert={session.mapOpen || undefined}>
          <ChamberHud
            chamber={session.chamber!}
            manifest={session.manifest!}
            diving={session.status === "diving"}
            whispers={session.whispers}
            health={health}
            onDive={(i) => void session.dive(i)}
            onMap={session.toggleMap}
            onReset={session.reset}
          />
          {session.error ? (
            <p className="error floating" role="alert">
              {session.error}
            </p>
          ) : null}
        </div>
        {session.mapOpen ? (
          <>
            <div className="map-backdrop" aria-hidden="true" onClick={session.toggleMap} />
            <ConstellationMap
              key="constellation"
              data={session.constellation}
              currentId={session.chamber!.id}
              onClose={session.toggleMap}
            />
          </>
        ) : null}
        <LiveRegion message={live} />
      </main>
    </>
  );
}
