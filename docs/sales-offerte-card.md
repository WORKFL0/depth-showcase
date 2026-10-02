# Sales craft — demo Halo offerte

Workflo sales surface for Depth Atelier. **Fiction only** — never email, never write to real Halo.

## Surface

| Piece | Path |
|-------|------|
| Page | `/sales` |
| API | `GET /api/demo/offerte` |
| Contract | `DemoOfferte` in `@depth-showcase/api` (`packages/api/src/schemas.ts`) |
| Static mock | `apps/web/src/lib/demo/halo-offerte.ts` |
| Card | `apps/web/src/components/sales/DemoOfferteCard.tsx` |

## Contract highlights

- `demo: true` + hard disclaimer
- Halo-ish: `status.id = 1` (Nieuw), `billingPeriod` 0 / 2 / 3, optional `haloItemId`
- Totals split one-off vs monthly (recurring discipline callout)
- `craft.whisper` / `palette` / `haloFlavors` for Atelier dressing

## Frontend notes

- Page currently server-renders the static mock (same payload as the API).
- Prefer `fetchDemoOfferte()` from `@/lib/client-api` if you want a client fetch + loading state.
- Safe to restyle the card; keep the DEMO banner and disclaimer visible.
