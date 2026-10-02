# Sales craft — demo Halo offerte

**Primary mount (Frontend):** secondary panel on seed gate / threshold in `AtelierApp` (idle). Route stays `/`. Optional deep link: `/sales`.

## FE contract (source of truth for the card)

| Piece | Path |
|-------|------|
| Type + const | `apps/web/src/components/sales/demo-offerte.ts` (`DEMO_OFFERTE`) |
| JSON twin | `apps/web/src/components/sales/demo-offerte.json` |
| Card | `apps/web/src/components/sales/DemoOfferteCard.tsx` |

Fiction only — no real emails. Keep DEMO banner / disclaimer visible.

## Optional richer Halo API (Quote Helper)

`GET /api/demo/offerte` + Zod `DemoOfferte` in `@depth-showcase/api` is a parallel Halo-flavored payload (`billingPeriod`, craft palette). Card UI uses the **FE cents contract** above.
