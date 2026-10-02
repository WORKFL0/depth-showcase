"use client";

import type { Chamber, SeedManifest } from "@depth-showcase/api";

export function ChamberHud({
  chamber,
  manifest,
  diving,
  whispers,
  onDive,
  onMap,
  onReset,
}: {
  chamber: Chamber;
  manifest: SeedManifest;
  diving: boolean;
  whispers: string[];
  onDive: (index: number) => void;
  onMap: () => void;
  onReset: () => void;
}) {
  return (
    <div className="hud" aria-live="polite">
      <header className="hud-top">
        <div>
          <p className="eyebrow">
            DEPTH {String(chamber.depth).padStart(2, "0")}
            {chamber.paradox ? " · PARADOX" : ""}
          </p>
          <h2 className="hud-title">{chamber.title}</h2>
          <p className="hud-meta">
            seed <code>{manifest.seed}</code> · resonance{" "}
            {(chamber.resonance * 100).toFixed(0)}%
          </p>
        </div>
        <div className="hud-actions">
          <button type="button" className="btn-ghost" onClick={onMap}>
            Constellation
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
          <span key={`${ph.kind}-${i}`} className="phen-pill" title={ph.detail}>
            <strong>{ph.kind}</strong> {ph.label}
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

      <nav className="exits" aria-label="Chamber exits">
        {chamber.exits.map((exit, i) => (
          <button
            key={`${exit.label}-${i}`}
            type="button"
            className="exit-btn"
            disabled={diving}
            onClick={() => onDive(i)}
          >
            <span className="exit-label">{exit.label}</span>
            <span className="exit-risk">
              risk {(exit.risk * 100).toFixed(0)}%
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
