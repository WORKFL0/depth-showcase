"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Chamber, SeedManifest } from "@depth-showcase/api";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

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
  const reduced = useReducedMotion();
  const palette = manifest.palette;

  return (
    <motion.div
      className="hud"
      aria-live="polite"
      key={chamber.id}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="hud-top">
        <div>
          <p className="eyebrow">
            DEPTH {String(chamber.depth).padStart(2, "0")}
            {chamber.paradox ? " · PARADOX" : ""}
            {diving ? " · DIVING" : ""}
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
          {palette.length > 0 ? (
            <div className="palette-row" aria-label="World palette">
              {palette.slice(0, 6).map((c, i) => (
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
            Constellation <kbd className="kbd-inline">M</kbd>
          </button>
          <button type="button" className="btn-ghost" onClick={onReset}>
            New seed
          </button>
        </div>
      </header>

      <ul className="laws" aria-label="World laws">
        {manifest.laws.slice(0, 4).map((law, i) => (
          <motion.li
            key={law}
            initial={reduced ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reduced ? 0 : 0.08 + i * 0.05 }}
          >
            {law}
          </motion.li>
        ))}
      </ul>

      <div className="phen-row" aria-label="Phenomena">
        {chamber.phenomena.map((ph, i) => (
          <motion.span
            key={`${ph.kind}-${i}`}
            className={`phen-pill phen-${ph.kind}`}
            title={ph.detail}
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduced ? 0 : 0.12 + i * 0.04 }}
          >
            <strong>{ph.kind}</strong> {ph.label}
            <span className="phen-intensity" aria-hidden="true">
              {Math.round(ph.intensity * 100)}%
            </span>
          </motion.span>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {whispers.length > 0 ? (
          <motion.div
            className="whisper-stack"
            aria-label="Whispers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {whispers.slice(-3).map((w, i) => (
              <motion.p
                key={`${w}-${i}`}
                className="whisper"
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 0.9 - (2 - i) * 0.15, y: 0 }}
              >
                {w}
              </motion.p>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <nav className="exits" aria-label="Chamber exits">
        {chamber.exits.map((exit, i) => (
          <motion.button
            key={`${exit.label}-${i}`}
            type="button"
            className={`exit-btn ${exit.risk > 0.65 ? "exit-hot" : ""}`}
            disabled={diving}
            onClick={() => onDive(i)}
            whileHover={
              reduced || diving ? undefined : { y: -3, x: -1 }
            }
            whileTap={reduced || diving ? undefined : { scale: 0.98 }}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.15 + i * 0.06 }}
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
                  style={{
                    ["--risk" as string]: `${Math.round(exit.risk * 100)}%`,
                  }}
                />
              </span>
            </span>
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
}
