"use client";

import { useState, type FormEvent } from "react";
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
  health,
}: {
  busy: boolean;
  error: string | null;
  onEnter: (seed?: string) => void;
  health: { ok: boolean | null; version?: string; storeMode?: string } | null;
}) {
  const healthOk = health?.ok ?? null;
  const [value, setValue] = useState("");
  const reduced = useReducedMotion();

  function submit(e: FormEvent) {
    e.preventDefault();
    onEnter(value.trim() || undefined);
  }

  return (
    <section
      className={`gate ${reduced ? "gate--static" : "gate--enter"}`}
      aria-labelledby="gate-title"
    >
      <div className="gate-brand">
        <img
          src="/brand/logos/logo-horizontal-on-dark.png"
          alt="Workflo"
          className="gate-logo"
          width={160}
          height={36}
        />
        <span
          className={`health-chip ${healthOk === true ? "is-live" : healthOk === false ? "is-down" : "is-wait"}`}
          aria-live="polite"
        >
          {healthOk === true
            ? `API ${health?.version ?? "live"}${health?.storeMode ? ` · ${health.storeMode}` : ""}`
            : healthOk === false
              ? "API down"
              : "API…"}
        </span>
      </div>
      <p className="floor-kicker">Experimentverdieping</p>
      <h1 id="gate-title" className="gate-title">
        Noem een seed. Daal af.
      </h1>
      <p className="gate-lede">
        Zelfde schacht, een verdieping lager. De kamers hier zijn een experiment,
        geen tweede merk.
      </p>
      <form className="gate-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="seed-input">
          World seed
        </label>
        <input
          id="seed-input"
          className="gate-input"
          placeholder="name a seed"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={128}
          disabled={busy}
          autoComplete="off"
        />
        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? "Seeding…" : "Daal af"}
        </button>
      </form>
      <ul className="chip-row">
        {SUGGESTIONS.map((s) => (
          <li key={s}>
            <button
              type="button"
              className="chip"
              disabled={busy}
              onClick={() => onEnter(s)}
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      <p className="gate-hint">
        After entry: focus exits, then <kbd>1</kbd>–<kbd>9</kbd> to dive · <kbd>M</kbd> map
      </p>
    </section>
  );
}
