# Sessie-log — 2 oktober 2026 (depth-atelier-handoff)

> Sample for Depth Atelier showcase. Mirrors real `05-knowledge/handoffs` style.
> Safe content only — no finance, PII, secrets, or `_ceo` material.
> Card JSON: `docs/handoffs/card.sample.json` · API envelope: `api-response.sample.json`.

---

## 1. Handoff Runner zichtbaar in de showcase

**Probleem.** Depth Atelier toonde chambers en whispers, maar geen sessie-overdracht.

**Aanpak.** HandoffCard JSON (FE shape) + API envelope sample + markdown session log. Canonical `_template.md` in `05-knowledge/handoffs/`.

**Status.** Samples on disk. FE mounts `HandoffCard`; BE wires `GET /api/showcase/handoff?id=sample`.

---

## 2. Pad-afspraak

| Rol | Pad |
|---|---|
| Echte sessielogs | `05-knowledge/handoffs/JJJJ-MM-DD-slug.md` |
| Showcase source of truth | `02-projects/depth-showcase/docs/handoffs/` |
| FE typed import (fallback) | `apps/web/src/content/handoffs/card.sample.json` |
| Runtime | `GET /api/showcase/handoff` (prefer over static) |

---

## Open / next

- [ ] Frontend: mount `HandoffCard` — prefer API, fall back to typed import
- [ ] Backend: Zod envelope + route reading `card.sample.json`
- [ ] Florian: commit when wire is ready
