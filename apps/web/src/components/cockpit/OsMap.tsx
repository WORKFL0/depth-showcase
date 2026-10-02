"use client";

import type { OsProject } from "@depth-showcase/api";

type Props = { projects: OsProject[]; headline?: string };

const STATUS_NL: Record<string, string> = {
  active: "actief",
  wip: "wip",
  on_hold: "on-hold",
  archived: "archief",
  unknown: "?",
};

export function OsMap({ projects, headline }: Props) {
  return (
    <section className="craft-card os-map" aria-label="OS-kaart">
      <header className="craft-card__head">
        <span className="craft-card__mark">OS-kaart</span>
        <span className="craft-card__meta-inline">{projects.length} projecten</span>
      </header>
      <p className="os-map__lede">
        {headline ?? "INDEX-slice — wat draait, wat wacht."}
      </p>
      <ul className="os-map__grid">
        {projects.map((p) => (
          <li key={p.id} className={`os-tile status-${p.status}`}>
            <div className="os-tile__top">
              <strong className="os-tile__name">{p.name}</strong>
              <span className="os-tile__status">{STATUS_NL[p.status] ?? p.status}</span>
            </div>
            {p.stack ? <span className="os-tile__stack">{p.stack}</span> : null}
            {p.attention ? <span className="os-tile__note">{p.attention}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
