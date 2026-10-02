"use client";

import { useState, type FormEvent } from "react";

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

  function submit(e: FormEvent) {
    e.preventDefault();
    onEnter(value.trim() || undefined);
  }

  return (
    <section className="gate" aria-labelledby="gate-title">
      <p className="eyebrow">DEPTH ATELIER · v0.1</p>
      <h1 id="gate-title" className="gate-title">
        Descend into a seeded world
      </h1>
      <p className="gate-lede">
        One seed. Infinite chambers. Procedural laws, SSE dives, and a living
        constellation — built overnight to show what Workflo bots can do.
      </p>
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
        />
        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? "Seeding…" : "Enter"}
        </button>
      </form>
      <div className="chip-row" role="list">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className="chip"
            role="listitem"
            disabled={busy}
            onClick={() => onEnter(s)}
          >
            {s}
          </button>
        ))}
      </div>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
