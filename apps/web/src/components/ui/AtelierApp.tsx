"use client";

import { useEffect, useRef } from "react";
import { DepthField } from "@/components/engine/DepthField";
import { LiveRegion } from "@/components/a11y/LiveRegion";
import { SkipLink } from "@/components/a11y/SkipLink";
import { ChamberHud } from "@/components/hud/ChamberHud";
import { ConstellationMap } from "@/components/hud/ConstellationMap";
import { SeedGate } from "@/components/hud/SeedGate";
import { useDepthSession } from "@/hooks/use-depth-session";

export function AtelierApp() {
  const session = useDepthSession();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;
      if (e.key === "m" || e.key === "M") {
        if (session.chamber) session.toggleMap();
      }
      if (e.key === "Escape" && session.mapOpen) {
        session.toggleMap();
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
  }, [session]);

  const palette =
    session.manifest?.palette ?? ["#F2F400", "#F2F400", "#ffffff"];
  const live =
    session.status === "diving"
      ? "Diving into the next chamber"
      : session.chamber
        ? `Arrived at ${session.chamber.title}, depth ${session.chamber.depth}`
        : "Awaiting a seed";

  if (
    session.status === "idle" ||
    session.status === "seeding" ||
    !session.chamber ||
    !session.manifest
  ) {
    return (
      <main className="shell threshold">
        <SkipLink />
        <DepthField
          chamber={null}
          palette={palette}
          diving={false}
          pointer={pointer}
        />
        <div className="overlay" id="main">
          <SeedGate
            busy={session.status === "seeding"}
            error={session.error}
            onEnter={(s) => void session.seedWorld(s)}
          />
        </div>
        <LiveRegion message={live} />
      </main>
    );
  }

  return (
    <main className="shell">
      <SkipLink />
      <DepthField
        chamber={session.chamber}
        palette={palette}
        diving={session.status === "diving"}
        pointer={pointer}
      />
      <div className="overlay" id="main">
        <ChamberHud
          chamber={session.chamber}
          manifest={session.manifest}
          diving={session.status === "diving"}
          whispers={session.whispers}
          onDive={(i) => void session.dive(i)}
          onMap={session.toggleMap}
          onReset={session.reset}
        />
        {session.mapOpen ? (
          <ConstellationMap
            data={session.constellation}
            currentId={session.chamber.id}
            onClose={session.toggleMap}
          />
        ) : null}
        {session.error ? (
          <p className="error floating" role="alert">
            {session.error}
          </p>
        ) : null}
      </div>
      <LiveRegion message={live} />
    </main>
  );
}
