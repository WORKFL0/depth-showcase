"use client";

import { WORKFLO_BOTS } from "@/content/os/bots";

export function BotRoster() {
  return (
    <section className="bot-roster" aria-label="Bot roster">
      <header className="bot-roster__head">
        <span className="craft-card__mark">Bots</span>
        <span className="bot-roster__hint">Workflo agenten — geen live status</span>
      </header>
      <ul className="bot-roster__strip">
        {WORKFLO_BOTS.map((b) => (
          <li key={b.id} className="bot-chip">
            <strong>{b.name}</strong>
            <span>{b.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
