"use client";

import type { CeoDayBrief } from "@depth-showcase/api";

type Props = { brief: CeoDayBrief };

export function CeoDayBriefPanel({ brief }: Props) {
  if (brief.meta?.empty) return null;
  const { mustDo, stuck, stepIn } = brief.sections;

  return (
    <article className="craft-card day-brief" aria-label="CEO day brief">
      <header className="craft-card__head">
        <span className="craft-card__mark">Day brief</span>
        <span className="craft-card__meta-inline">{brief.trigger}</span>
      </header>
      {brief.headline ? <h2 className="craft-card__title">{brief.headline}</h2> : null}
      {mustDo.length ? (
        <section className="craft-card__section">
          <h3>Must-do</h3>
          <ul>
            {mustDo.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                {item.why ? <span className="craft-card__why"> - {item.why}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {stuck.length ? (
        <section className="craft-card__section section-stuck">
          <h3>Stuck</h3>
          <ul>
            {stuck.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span className="craft-card__why"> - {item.blocker}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {stepIn.length ? (
        <section className="craft-card__section section-stepin">
          <h3>Step-in</h3>
          <ul>
            {stepIn.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span className="craft-card__why"> - {item.decision}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
