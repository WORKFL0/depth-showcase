"use client";

import type { Chamber, SeedManifest } from "@depth-showcase/api";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ChamberHud({
  chamber,
  manifest,
  diving,
  whispers,
  health,
  onDive,
  onMap,
  onReset,
}: {
  chamber: Chamber;
  manifest: SeedManifest;
  diving: boolean;
  whispers: string[];
  health: { ok: boolean | null; version?: string; storeMode?: string } | null;
  onDive: (index: number) => void;
  onMap: () => void;
  onReset: () => void;
}) {
  const healthOk = health?.ok ?? null;
  const reduced = useReducedMotion();

  return (
    <div
      className={`hud ${reduced ? "" : "hud--enter"}`}
      aria-live="polite"
      key={chamber.id}
    >
      <header className="hud-top">
        <div>
          <p className="hud-instrument">
            <span>DEPTH {String(chamber.depth).padStart(2, "0")}</span>
            {chamber.paradox ? <span className="hud-flag">PARADOX</span> : null}
            {diving ? <span className="hud-flag">DIVING</span> : null}
            <span
              className={`health-chip ${healthOk === true ? "is-live" : healthOk === false ? "is-down" : "is-wait"}`}
            >
              {healthOk === true
                ? `v${health?.version ?? "0.2"}${health?.storeMode ? `/${health.storeMode}` : ""}`
                : healthOk === false
                  ? "API↓"
                  : "…"}
            </span>
          </p>
          <h2 className="hud-title">{chamber.title}</h2>
          <p className="hud-meta">
            seed <code>{manifest.seed}</code> · resonance{" "}
            <span className="resonance-meter" aria-hidden="true">
              <span
                className="resonance-fill"
                style={{ width: `${Math.round(chamber.resonance * 100)}%` }}
              />
            </span>{" "}
            {(chamber.resonance * 100).toFixed(0)}%
          </p>
          {manifest.palette.length > 0 ? (
            <div className="palette-row" aria-label="World palette">
              {manifest.palette.slice(0, 6).map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="palette-swatch"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="hud-actions">
          <button type="button" className="btn-ghost" onClick={onMap}>
            Map <kbd className="kbd-inline">M</kbd>
          </button>
          <button type="button" className="btn-ghost" onClick={onReset}>
            New seed
          </button>
        </div>
      </header>

      <ul className="laws" aria-label="World laws">
        {manifest.laws.slice(0, 4).map((law) => (
          <li key={law}>{law}</li>
        ))}
      </ul>

      <div className="phen-row" aria-label="Phenomena">
        {chamber.phenomena.map((ph, i) => (
          <span
            key={`${ph.kind}-${i}`}
            className={`phen-pill phen-${ph.kind}`}
            title={ph.detail}
          >
            <strong>{ph.kind}</strong> {ph.label}
            <span className="phen-intensity" aria-hidden="true">
              {Math.round(ph.intensity * 100)}%
            </span>
          </span>
        ))}
      </div>

      {whispers.length > 0 ? (
        <div className="whisper-stack" aria-label="Whispers">
          {whispers.slice(-3).map((w, i) => (
            <p key={`${w}-${i}`} className="whisper">
              {w}
            </p>
          ))}
        </div>
      ) : null}

      <nav className="exits" id="chamber-controls" tabIndex={-1} aria-label="Chamber exits">
        {chamber.exits.map((exit, i) => (
          <button
            key={`${exit.label}-${i}`}
            type="button"
            className={`exit-btn ${exit.risk > 0.65 ? "exit-hot" : ""}`}
            disabled={diving}
            onClick={() => onDive(i)}
          >
            <span className="exit-index" aria-hidden="true">
              {i + 1}
            </span>
            <span className="exit-body">
              <span className="exit-label">{exit.label}</span>
              <span className="exit-risk">
                risk {(exit.risk * 100).toFixed(0)}%
                <span
                  className="risk-bar"
                  aria-hidden="true"
                  style={{ ["--risk" as string]: `${Math.round(exit.risk * 100)}%` }}
                />
              </span>
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
