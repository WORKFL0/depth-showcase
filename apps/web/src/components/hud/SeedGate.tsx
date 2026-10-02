"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const SUGGESTIONS = [
  "obsidian-tide",
  "amber-undercroft",
  "soft-horizon",
  "workflo-void",
  "paradox-nave",
];

export function SeedGate({
  busy,
  error,
  onEnter,
}: {
  busy: boolean;
  error: string | null;
  onEnter: (seed?: string) => void;
}) {
  const [value, setValue] = useState("");
  const reduced = useReducedMotion();

  function submit(e: FormEvent) {
    e.preventDefault();
    onEnter(value.trim() || undefined);
  }

  const enter = reduced
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 8 };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.section
      className="gate"
      aria-labelledby="gate-title"
      initial={enter}
      animate={shown}
      transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="gate-glow" aria-hidden="true" />
      <motion.p
        className="eyebrow"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 0.06, duration: reduced ? 0 : 0.22 }}
      >
        DEPTH ATELIER · v0.1
      </motion.p>
      <motion.h1
        id="gate-title"
        className="gate-title"
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.08, duration: reduced ? 0 : 0.24 }}
      >
        Descend into a seeded world
      </motion.h1>
      <motion.p
        className="gate-lede"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 0.1, duration: reduced ? 0 : 0.22 }}
      >
        One seed. Infinite chambers. Procedural laws, SSE dives, and a living
        constellation — an overnight atelier piece of spatial depth.
      </motion.p>
      <form className="gate-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="seed-input">
          World seed
        </label>
        <input
          id="seed-input"
          className="gate-input"
          placeholder="name a world — or leave blank"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={128}
          disabled={busy}
          autoComplete="off"
          autoFocus
        />
        <button className="btn-primary" type="submit" disabled={busy}>
          <span className="btn-primary-label">
            {busy ? "Seeding…" : "Cross the threshold"}
          </span>
          {!busy ? <span className="btn-primary-arrow" aria-hidden="true">↓</span> : null}
        </button>
      </form>
      <div className="chip-row" role="list">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s}
            type="button"
            className="chip"
            role="listitem"
            disabled={busy}
            onClick={() => onEnter(s)}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.12 + i * 0.03, duration: reduced ? 0 : 0.2 }}
            whileHover={reduced ? undefined : { y: -1 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
          >
            {s}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {error ? (
          <motion.p
            className="error"
            role="alert"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
      <p className="gate-hint">
        Tip: after entry, press <kbd>1</kbd>–<kbd>9</kbd> to dive · <kbd>M</kbd>{" "}
        constellation
      </p>
    </motion.section>
  );
}
