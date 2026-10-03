# SEO / SEA layer

One site. Homepage line: **De zaak, vóór de inbox.**

- **URL / canonical:** https://depth-showcase.vercel.app
- **Repo:** https://github.com/WORKFL0/depth-showcase

Not a separate product. Not Depth Atelier. Brief, atelier, and sales are routes on the same site.

## Routes

| Path | Index | Rendered title |
| --- | --- | --- |
| `/` | index | "De zaak, vóór de inbox" + `%s · Workflo` → "De zaak, vóór de inbox · Workflo" |
| `/brief` | index | "Ochtendbrief" → "Ochtendbrief · Workflo" |
| `/atelier` | **noindex** (`robots: { index: false, follow: false }`) | "Atelier · Workflo". Same site, not a product. Not in the sitemap |
| `/sales` | index | "Sales craft — Demo Halo offerte" → "Sales craft — Demo Halo offerte · Workflo" |

## What is live

| Layer | Status |
| --- | --- |
| App Router metadata (default title, template `%s · Workflo`, description, canonical, robots index/follow) | Live in `apps/web/src/app/layout.tsx` |
| Open Graph + Twitter `summary_large_image` | Live. Image `/og.png`. Alt: "De zaak, vóór de inbox" |
| JSON-LD `@graph` (WebSite + Organization Workflo) | Live via `SeoJsonLd` |
| `robots.ts` + `sitemap.ts` | Live. Sitemap: `/`, `/brief`, `/sales`. Not `/atelier` |
| Demo SEA strip | Demo only. Badge: "Demo SEA · sample ad copy · no spend". No Google Ads. No spend |
| This doc | `SEO.md` |

## Copy bank

### Site

- **Default title:** De zaak, vóór de inbox
- **Template:** `%s · Workflo`
- **Homepage title:** De zaak, vóór de inbox · Workflo
- **Description:** Wij zijn de IT-afdeling van je bedrijf. Eerst wat er vandaag moet, dan de rest.
- **Keywords:** Workflo, ochtendbrief, atelier, sales
- **OG / Twitter title:** De zaak, vóór de inbox
- **OG / Twitter description:** same as the site description
- **OG alt:** De zaak, vóór de inbox

### JSON-LD

- **WebSite name:** De zaak, vóór de inbox
- **alternateName:** Workflo
- **description:** same as the site description
- **Organization:** Workflo, https://workflo.it
- No Offer. No applicationCategory.

### Demo SEA (sample only)

- **Headline:** De zaak, vóór de inbox
- **URL:** depth-showcase.vercel.app
- **Desc:** Wij zijn de IT-afdeling van je bedrijf. Voorbeeldadvertentie, geen spend.
- **Badge:** Demo SEA · sample ad copy · no spend

## Anti-slop

- One site. Do not name Depth Atelier as a product. Do not use "Seed a world", "the morning shaft", or "De ochtend ligt dieper".
- The Workflo suffix uses a middle dot (`·`), not an em dash.
- No "Elevate".
- Avoid unlock, revolutionize, seamless, cutting-edge, elevate, empower, next-gen, game-changing.

## Demo vs live

| Thing | Live? |
| --- | --- |
| Meta / OG / Twitter / JSON-LD / robots / sitemap | Yes. Served by the Next app |
| Demo SEA strip | **Demo only.** Not wired to Google Ads or any bid or spend API |
| Search Console | Future |
| Paid campaigns | Not started. Do not treat the strip as a live ad |
