# depth-showcase

Depth Atelier — generative API + Atelier UI. Zod contract: `packages/api`.

## Endpoints

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/health` | ok, version, storeMode |
| POST | `/api/seed` | SeedManifest |
| POST/GET/PATCH | `/api/session` | signed session + discoveries |
| GET | `/api/chamber/:id` | Chamber |
| POST | `/api/dive` | SSE DiveEvent (+ sessionId updates graph) |
| GET | `/api/constellation` | procedural or `?sessionId=` discovered |
| GET | `/api/ceo-day-brief` | CEO Day Brief panel sample |
| GET | `/api/showcase/handoff` | Handoff panel envelope |

Persistence: MemorySessionStore (Vercel) or FileSessionStore via `DEPTH_SESSION_DIR`. Sessions HMAC-signed (`DEPTH_SESSION_SECRET`).

```bash
pnpm install && pnpm --filter web dev   # :3456
```
