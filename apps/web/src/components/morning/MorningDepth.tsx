import Link from "next/link";
import "./morning-depth.css";

const INDEX = [
  { href: "/brief", label: "Brief", line: "Moet vandaag, vastgelopen, instappen." },
  { href: "/atelier", label: "Atelier", line: "Experiment in hetzelfde huis. Geen tweede merk." },
  { href: "/sales", label: "Sales", line: "Demo-offerte. Fiction. Niet versturen." },
];

export function MorningDepth() {
  return (
    <main className="wf-home">
      <div className="wf-home__copy">
        <p className="wf-eyebrow">Workflo B.V. · Amsterdam</p>
        <h1>De zaak, vóór de inbox.</h1>
        <p className="wf-home__lede">
          Wij zijn de IT-afdeling van je bedrijf. Eerst wat er vandaag moet,
          dan de rest.
        </p>
        <div className="wf-home__actions">
          <Link className="wf-cta" href="/brief">
            Open de ochtendbrief
          </Link>
          <Link className="wf-quiet" href="/sales">
            Demo-offerte
          </Link>
        </div>
      </div>
      <aside className="wf-home__panel" aria-label="Wat er in huis ligt">
        <p className="wf-eyebrow wf-eyebrow--on-dark">Vandaag</p>
        <ol>
          {INDEX.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <strong>{item.label}</strong>
                <span>{item.line}</span>
              </Link>
            </li>
          ))}
        </ol>
      </aside>
    </main>
  );
}
