"use client";

import type { CSSProperties } from "react";
import type { DemoOfferte } from "@depth-showcase/api";

function eur(n: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

type Props = { offerte: DemoOfferte };

/** Halo-flavored sales craft card — demo data only. */
export function DemoOfferteCard({ offerte }: Props) {
  const [voidC, amber, signal, mistBlue, hot] = offerte.craft.palette;

  return (
    <article
      className="demo-offerte"
      style={
        {
          "--do-void": voidC,
          "--do-amber": amber,
          "--do-signal": signal,
          "--do-mist": mistBlue,
          "--do-hot": hot,
        } as CSSProperties
      }
      aria-label={`Demo offerte ${offerte.quoteId}: ${offerte.title}`}
    >
      <header className="demo-offerte__banner">
        <span className="demo-offerte__pill">DEMO · Halo craft</span>
        <span className="demo-offerte__status">
          status {offerte.status.id} · {offerte.status.label}
        </span>
      </header>

      <div className="demo-offerte__meta">
        <p className="demo-offerte__whisper">{offerte.craft.whisper}</p>
        <h1 className="demo-offerte__title">{offerte.title}</h1>
        <p className="demo-offerte__tagline">{offerte.craft.tagline}</p>
        <dl className="demo-offerte__parties">
          <div>
            <dt>Klant</dt>
            <dd>
              {offerte.client.tradingName}
              <span className="demo-offerte__muted">
                {" "}
                · {offerte.client.city} · fictional
              </span>
            </dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>
              {offerte.contact.name}
              <span className="demo-offerte__muted">
                {" "}
                · {offerte.contact.email}
              </span>
            </dd>
          </div>
          <div>
            <dt>Quote</dt>
            <dd>
              #{offerte.quoteId}
              <span className="demo-offerte__muted"> · never sent</span>
            </dd>
          </div>
        </dl>
      </div>

      <table className="demo-offerte__lines">
        <caption className="sr-only">Offerte regels</caption>
        <thead>
          <tr>
            <th scope="col">Regel</th>
            <th scope="col">Halo</th>
            <th scope="col">Facturatie</th>
            <th scope="col">Excl.</th>
          </tr>
        </thead>
        <tbody>
          {offerte.lines.map((line) => (
            <tr key={line.id}>
              <td>
                <strong>{line.name}</strong>
                {line.note ? (
                  <div className="demo-offerte__note">{line.note}</div>
                ) : null}
              </td>
              <td>
                {line.haloItemId != null ? (
                  <code>item {line.haloItemId}</code>
                ) : (
                  "—"
                )}
              </td>
              <td>
                <code>bp={line.billingPeriod}</code>
                <div className="demo-offerte__note">{line.billingLabel}</div>
              </td>
              <td className="demo-offerte__price">
                {eur(line.unitPriceExcl * line.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="demo-offerte__totals">
        <div>
          <span>Eenmalig excl.</span>
          <strong>{eur(offerte.totals.oneOffExcl)}</strong>
        </div>
        <div>
          <span>Maandelijks excl.</span>
          <strong>{eur(offerte.totals.monthlyExcl)}</strong>
        </div>
        <div>
          <span>BTW</span>
          <strong>{Math.round(offerte.totals.vatRate * 100)}%</strong>
        </div>
      </footer>

      <ul className="demo-offerte__flavors">
        {offerte.craft.haloFlavors.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <p className="demo-offerte__disclaimer" role="note">
        {offerte.disclaimer}
      </p>
    </article>
  );
}
