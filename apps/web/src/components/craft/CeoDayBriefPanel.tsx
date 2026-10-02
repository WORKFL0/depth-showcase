"use client";

import type { CeoDayBrief } from "@depth-showcase/api";
import { formatAmsterdam } from "@/lib/format-amsterdam";

type Props = {
  brief: CeoDayBrief;
  /** Larger hero treatment for cockpit landing */
  variant?: "card" | "hero";
};

export function CeoDayBriefPanel({ brief, variant = "card" }: Props) {
  if (brief.meta?.empty) return null;
  const { mustDo, stuck, stepIn } = brief.sections;
  const rootClass =
    variant === "hero" ? "craft-card day-brief day-brief--hero" : "craft-card day-brief";

  return (
    <article className={rootClass} aria-label="CEO ochtendbrief" id="day-brief">
      <header className="craft-card__head">
        <span className="craft-card__mark">Ochtendbrief</span>
        <span className="craft-card__meta-inline">{brief.trigger}</span>
      </header>
      {brief.headline ? (
        <h2 className="craft-card__title day-brief__headline">{brief.headline}</h2>
      ) : (
        <h2 className="craft-card__title day-brief__headline">Drie dingen vóór de lunch.</h2>
      )}
      {mustDo.length ? (
        <section className="craft-card__section">
          <h3>Moet vandaag</h3>
          <ul>
            {mustDo.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                {item.due ? (
                  <span className="craft-card__due"> · {formatAmsterdam(item.due)}</span>
                ) : null}
                {item.why ? <span className="craft-card__why"> — {item.why}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {stuck.length ? (
        <section className="craft-card__section section-stuck">
          <h3>Vastgelopen</h3>
          <ul>
            {stuck.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span className="craft-card__why">
                  {" "}
                  — wacht op {item.waitingOn ?? "…"}: {item.blocker}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {stepIn.length ? (
        <section className="craft-card__section section-stepin">
          <h3>Instappen</h3>
          <ul>
            {stepIn.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span className="craft-card__why"> — Jouw call nodig: {item.decision}</span>
                {item.urgency === "today" ? (
                  <span className="craft-card__urgency"> vandaag</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
