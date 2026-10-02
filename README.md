# depth-showcase

Overnight capability showcase for Workflo OS.

**Depth Engine** (Backend): generative/procedural infinite-descent API — seeds, chambers, SSE dive streams, constellation graphs. Zod contract + OpenAPI.

**Atelier UI** (Frontend): spatial chamber explorer consuming the API contract.

## Contract (v0.1 target)

- `POST /api/seed`
- `GET /api/chamber/:id`
- `POST /api/dive` (SSE)
- `GET /api/constellation?seed=`
- `GET /api/health`

Shared types: `SeedManifest`, `Chamber`, `Phenomenon`, `DiveEvent`, `Constellation`, `DiveRequest`.

No secrets / `.env` in git. Deploy: Vercel.

Backend Developer owns API; Frontend Developer owns UI.
