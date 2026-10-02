# Showcase handoffs (Handoff Runner)

| File | Purpose |
|---|---|
| `card.schema.json` | JSON Schema for HandoffCard fields |
| `card.template.json` | Empty HandoffCard |
| `card.sample.json` | Filled sample (source of truth for card fields) |
| `api-response.sample.json` | Backend `GET /api/showcase/handoff` envelope |
| `sample-session.md` | Full 05-knowledge-style session log |

FE typed copy: `apps/web/src/content/handoffs/card.sample.json`  
OS template: `05-knowledge/handoffs/_template.md`

Runtime: prefer `GET /api/showcase/handoff` (`?id=sample`). No secrets/finance/PII.
