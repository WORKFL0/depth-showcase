# depth-showcase

Overnight capability showcase for Workflo OS — **Depth Atelier**.

**Depth Engine** (Backend): generative infinite-descent API — seeds, chambers, SSE dive streams, constellation graphs. Zod contract in `packages/api` + `openapi.yaml`.

**Atelier UI** (Frontend): spatial chamber explorer (R3F + Framer-ready HUD), Workflo brand (`#F2F400` / `#0A0A0A` / Navigo / hard shadows).

## Contract (v0.1)

- `GET|POST /api/seed` → `SeedManifest`
- `GET /api/chamber/:id` → `Chamber`
- `POST /api/dive` → SSE `DiveEvent` stream
- `GET /api/constellation?seed=` → graph (~depth 6)
- `GET /api/health`

No secrets / `.env` in git (see `.env.example`). Deploy: Vercel.

## Local

```bash
pnpm install
pnpm --filter web dev   # http://localhost:3456
```

## Monorepo

- `packages/api` — frozen Zod schemas (`@depth-showcase/api`)
- `apps/web` — Next.js 15 App Router (API routes + Atelier UI)
