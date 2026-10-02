# Workflo site brand kit

Production-ready brand assets for Frontend (depth-showcase / Workflo sites).
**Do not publish externally without Florian’s explicit yes.** Shipping into the repo is OK.

## Where this lives

| Location | Path |
|----------|------|
| **Canonical (company)** | `~/workbot/00-company/brand/site-kit/` |
| **Frontend consume** | `~/workbot/02-projects/depth-showcase/apps/web/public/brand/` |
| **Box mirror** | `/workspace/workflo-brand-kit/` |

Frontend should import from **`public/brand/`** (Next.js static):

```ts
// CSS variables
import '@/../public/brand/tokens/tokens.css' // or copy into globals
// or read tokens.json at build time
```

```html
<img src="/brand/logos/logo-horizontal-black.png" alt="Workflo" />
<img src="/brand/logos/logo-horizontal-on-dark.png" alt="Workflo" />
```

## Contents

```
brand/
  README.md                 ← this file
  tokens/
    tokens.css              ← CSS variables + helpers
    tokens.json             ← palette, rules, logo map
  logos/
    logo-horizontal-black.png       ← black mark+wordmark (light/paper)
    logo-horizontal-yellow-mark.png ← black + yellow W (light, accent)
    logo-horizontal-on-dark.png     ← yellow mark + white wordmark (dark)
    logo-vertical-*.png
    mark-black.png / mark-on-dark.png / mark-yellow-on-black.png
    preview-*.png                   ← designer plates (optional)
  type/
    specimen-paper.png
    specimen-yellow.png
  stills/
    still-01-hero-depth.png         ← dark geometric hero
    still-02-peace-paper.png        ← paper / peace-of-mind
    still-03-brand-block.png        ← yellow-scarce brand block
  fonts/                            ← Navigo woff/woff2/ttf (self-host)
  source/                           ← raw exports from actueel/brand (reference)
```

No Workflo wordmark SVG existed in source — PNGs only (cleaned + consistent padding).

## Token names (CSS)

`--wf-yellow` `#F2F400` · `--wf-yellow-ink` · `--wf-yellow-tint`  
`--wf-black` `--wf-ink` `--wf-graphite` `--wf-steel` `--wf-fog` `#6B6B6B`  
`--wf-mist` `--wf-bone` `--wf-paper` `--wf-white`  
`--wf-cyber` `#00FF88` (cyber series only)  
`--wf-shadow-hard` · `--wf-radius` / `--wf-radius-max`

## Do

- Yellow scarce (1–2 accents). Text on yellow = **black only**.
- Hard shadow `6px 6px 0 #0A0A0A` (or yellow on dark). No blur.
- Square corners (max 4px). Navigo only.
- Tagline: *Wij zijn de IT-afdeling van je bedrijf*

## Don’t

- Navy `#0A1628` · gold `#FFD700` · fog `#9A9A9A`
- White text on yellow · URL chrome in visuals · stock-slop imagery
- Publish without Florian’s yes

## Source

Logos from `00-company/brand/website-assets/actueel/brand/`.  
Fog corrected to `#6B6B6B` per current brand brief (overrides older README `#9A9A9A`).
