"use client";

import type { HandoffCard as HandoffCardData } from "@depth-showcase/api";

type Props = { card: HandoffCardData };

export function HandoffCard({ card }: Props) {
  return (
    <article className="craft-card handoff-card" aria-label={`Handoff: ${card.title}`}>
      <header className="craft-card__head">
        <span className="craft-card__mark">Handoff</span>
        <span className={`craft-card__status status-${card.status}`}>{card.status}</span>
      </header>
      <h2 className="craft-card__title">{card.title}</h2>
      <p className="craft-card__meta">
        <code>{card.id}</code> · {card.date} · {card.owner}
      </p>
      <p className="craft-card__summary">{card.summary}</p>
      {card.outcomes?.length ? (
        <section className="craft-card__section">
          <h3>Outcomes</h3>
          <ul>
            {card.outcomes.map((o) => (
              <li key={o.id}>{o.text}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {card.openLoops?.length ? (
        <section className="craft-card__section">
          <h3>Open loops</h3>
          <ul>
            {card.openLoops.map((o) => (
              <li key={o.id}>
                {o.text}
                {o.owner ? <span className="craft-card__owner"> · {o.owner}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {card.nextSteps?.length ? (
        <section className="craft-card__section">
          <h3>Next</h3>
          <ul>
            {card.nextSteps.map((o) => (
              <li key={o.id}>
                {o.text}
                {o.owner ? <span className="craft-card__owner"> · {o.owner}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
