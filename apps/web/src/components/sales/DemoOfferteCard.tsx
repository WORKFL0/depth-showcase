"use client";

import type { DemoOfferte } from "./demo-offerte";

function eurFromCents(cents: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

type Props = { offerte: DemoOfferte };

/** Halo-flavored sales craft card — demo data only. FE owns atelier polish. */
export function DemoOfferteCard({ offerte }: Props) {
  const vatPct = (offerte.vatRateBps / 100).toFixed(0);

  return (
    <article
      className="demo-offerte"
      aria-label={`Demo offerte ${offerte.id}: ${offerte.title}`}
    >
      <header className="demo-offerte__banner">
        <span className="demo-offerte__pill">DEMO · Halo craft</span>
        {offerte.haloTicketRef ? (
          <span className="demo-offerte__status">
            <code>{offerte.haloTicketRef}</code>
          </span>
        ) : null}
      </header>

      <div className="demo-offerte__meta">
        {offerte.toneNote ? (
          <p className="demo-offerte__whisper">{offerte.toneNote}</p>
        ) : null}
        <h1 className="demo-offerte__title">{offerte.title}</h1>
        <dl className="demo-offerte__parties">
          <div>
            <dt>Klant</dt>
            <dd>
              {offerte.clientCompany}
              <span className="demo-offerte__muted"> · fictional</span>
            </dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>{offerte.clientName}</dd>
          </div>
          <div>
            <dt>Offerte</dt>
            <dd>
              <code>{offerte.id}</code>
              <span className="demo-offerte__muted">
                {" "}
                · geldig tot {offerte.validUntil}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <table className="demo-offerte__lines">
        <caption className="sr-only">Offerte regels</caption>
        <thead>
          <tr>
            <th scope="col">SKU</th>
            <th scope="col">Omschrijving</th>
            <th scope="col">Qty</th>
            <th scope="col">Excl.</th>
          </tr>
        </thead>
        <tbody>
          {offerte.lines.map((line) => (
            <tr key={line.sku}>
              <td>
                <code>{line.sku}</code>
              </td>
              <td>{line.description}</td>
              <td>{line.qty}</td>
              <td className="demo-offerte__price">
                {eurFromCents(line.unitPriceCents * line.qty)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="demo-offerte__totals">
        <div>
          <span>Subtotaal excl.</span>
          <strong>{eurFromCents(offerte.subtotalCents)}</strong>
        </div>
        <div>
          <span>BTW ({vatPct}%)</span>
          <strong>
            {eurFromCents(offerte.totalCents - offerte.subtotalCents)}
          </strong>
        </div>
        <div>
          <span>Totaal incl.</span>
          <strong>{eurFromCents(offerte.totalCents)}</strong>
        </div>
      </footer>

      <p className="demo-offerte__disclaimer" role="note">
        DEMO ONLY — fictional client & quote. Not a HaloPSA record. Do not send.
      </p>
    </article>
  );
}
