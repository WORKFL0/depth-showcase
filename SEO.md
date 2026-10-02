# SEO / SEA layer — Depth Atelier

## Purpose

Crawlable identity for the overnight showcase: honest meta, structured data, and a **demo** SEA strip so stakeholders can see ad-copy tone without touching Google Ads.

## Live

- **URL / canonical:** https://depth-showcase.vercel.app
- **Repo:** https://github.com/WORKFL0/depth-showcase

## What shipped

| Layer | Status |
| --- | --- |
| App Router `metadata` (title template, description, canonical, robots index/follow) | Live in `apps/web/src/app/layout.tsx` |
| Open Graph + Twitter `summary_large_image` | Live; image `/og.png` |
| JSON-LD `@graph` (WebApplication + Organization Workflo) | Live via `SeoJsonLd` |
| `robots.ts` + `sitemap.ts` | Live (homepage only) |
| Demo SEA strip | Live as footer rail on threshold idle UI — **not** inside SeedGate |
| This doc | `SEO.md` |

## Copy bank

### Title / meta

- **Default title:** Depth Atelier · Workflo showcase
- **Template:** `%s · Depth Atelier`
- **Description (≤155):** Seed a world. Descend through procedural chambers. Live dive streams and a constellation map. Workflo overnight showcase.
- **OG / Twitter:** same title + description; image `/og.png`

### Demo SEA variants (sample only)

1. **Headline:** Depth Atelier: seed a world, then descend  
   **URL:** depth-showcase.vercel.app  
   **Desc:** Procedural chambers, live dive streams, constellation map. Workflo overnight showcase — try a seed.

2. **Headline:** Seed a world. Watch the constellation grow.  
   **Desc:** One seed, infinite chambers. SSE dives. Built overnight by Workflo bots.

3. **Headline:** Depth Atelier · generative chambers  
   **Desc:** Name a seed. Descend. Map what you find. No account. No fluff.

## Anti-slop rules

- Concrete, spatial, short. Prefer chamber / seed / descend / constellation language.
- **Avoid:** unlock, revolutionize, seamless, cutting-edge, elevate, empower, next-gen, game-changing.
- **Titles:** no em-dashes; no “Elevate”.
- Match brand voice already on the gate: “Descend into a seeded world”, “Seed a world. Descend. Watch the constellation grow.”

## Demo vs live

| Thing | Live? |
| --- | --- |
| Meta / OG / Twitter / JSON-LD / robots / sitemap | Yes — served by the Next app |
| Demo SEA strip | **Demo only.** Badge: “Demo SEA · sample ad copy · no spend”. Not wired to Google Ads, Search Ads 360, or any bid/spend API. |
| Search Console / Bing Webmaster | Future |
| Paid campaigns | Not started; do not treat the strip as a live ad |

## Placement note (Frontend)

Demo SEA sits as a hard-atelier strip **below the threshold fold** (footer rail on AtelierApp idle/seeding state). It must **not** live inside the SeedGate hero. Optional later: link from `/sales` if that route appears — do not invent `/sales` here.

## Future

- Verify property in Google Search Console; submit sitemap.
- Stronger OG art (photo/illustration) if brand wants more than the flat yellow card.
- Per-chamber URLs only if chambers become shareable and crawlable (today the app is effectively a single page after seed).
