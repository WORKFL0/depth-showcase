# PERFORMANCE.md — depth-showcase

Lean budgets + baseline for https://depth-showcase.vercel.app  
Repo: WORKFL0/depth-showcase (Next.js 15 App Router, `apps/web`)

## Baseline (lab)

Tool: **Lighthouse 12.8.2** (Chrome headless, simulated throttling).  
Measured: **2026-10-02 21:53 CEST** (Europe/Amsterdam).  
URL: `https://depth-showcase.vercel.app/` (gate / idle state).  
PageSpeed Insights API: **blocked** (429 quota) — not used.

| Metric | Mobile | Desktop | Budget |
|--------|--------|---------|--------|
| Perf score | **0.53** | 0.99 | ≥ 0.90 |
| LCP | **4.3 s** | 0.9 s | ≤ 2.5 s |
| FCP | 1.4 s | 0.4 s | ≤ 1.8 s |
| CLS | 0 | 0 | ≤ 0.1 |
| TBT (lab) | **11 340 ms** | 40 ms | ≤ 200 ms |
| Speed Index | 4.1 s | 1.0 s | ≤ 3.4 s |
| TTI | **19.8 s** | 1.0 s | ≤ 3.8 s |
| TTFB (doc) | ~3 ms | ~3 ms | ≤ 800 ms |
| max-potential-FID | **640 ms** | 150 ms | (proxy; see INP) |
| Total transfer | **437 KiB** | 437 KiB | ≤ 300 KiB |
| JS transfer | **391 KiB** (9 req) | 391 KiB | ≤ 200 KiB |
| CSS transfer | 3.2 KiB | 3.2 KiB | ≤ 50 KiB |
| Font transfer | 37 KiB (3 files) | 37 KiB | ≤ 60 KiB |
| Images | 0 | 0 | — |

**INP:** not available in this lab run (field-only / requires interaction). Target INP ≤ 200 ms via CrUX or Web Vitals when traffic exists. Use **TBT / max-potential-FID** as lab proxies until then.

Notes:
- Doc HTML: `Cache-Control: public, max-age=0, must-revalidate` + `x-vercel-cache: HIT` (OK for HTML).
- `/_next/static/*`: `max-age=31536000, immutable` + Brotli (OK).
- `/Navigo-*.woff2` in `/public`: `max-age=0, must-revalidate` (browser revalidates every load).
- No `<img>` — WebGL canvas (`DepthField` / R3F) is the visual LCP driver.
- Landing eagerly ships **three + @react-three/fiber + @react-three/drei + framer-motion** (`AtelierApp` static-imports `DepthField`).

## Budgets / targets

Marketing/showcase (mobile-first):

| Budget | Target |
|--------|--------|
| LCP | ≤ 2.5 s (stretch ≤ 2.0 s) |
| INP | ≤ 200 ms (field) |
| CLS | ≤ 0.1 |
| FCP | ≤ 1.8 s |
| TTFB | ≤ 800 ms |
| TBT (LH mobile) | ≤ 200 ms |
| Initial transfer | ≤ 300 KiB |
| Initial JS transfer | ≤ 200 KiB |
| Fonts (initial) | ≤ 2 files / ≤ 40 KiB |

## Gap analysis

| Area | Status | Evidence |
|------|--------|----------|
| Mobile LCP | **Fail** | 4.3 s vs ≤ 2.5 s — heavy main-thread + WebGL boot before paint settles |
| Mobile TBT / TTI | **Fail** | TBT 11.3 s, TTI 19.8 s — parse/eval of ~1.4 MiB uncompressed JS |
| Desktop CWV lab | Pass | LCP 0.9 s, TBT 40 ms, CLS 0 |
| JS weight | **Fail budget** | 391 KiB transfer; LH unused-JS ~156 KiB; chunks include THREE ×2, R3F, framer-motion |
| Fonts | Partial | `font-display: swap` OK; 3 weights always; **no long-cache** on `/public` fonts; no preload |
| Images | N/A | None — canvas only |
| HTML/static caching | Mixed | Hashed assets excellent; fonts poor TTL |
| Config | Gap | `next.config.ts` has no `headers`, `images`, or `optimizePackageImports`; no `next/font` |

## Fix backlog (priority → Frontend)

1. **Defer Three.js scene off critical path** — `dynamic(() => import('./DepthField'), { ssr: false })` + load after FCP/`requestIdleCallback`, or CSS-only gate background until seed. **Impact:** large cut to mobile LCP/TBT/JS (biggest win).
2. **Code-split R3F stack** — keep `three` / `@react-three/*` out of the gate chunk; load only when canvas mounts. **Impact:** ~150–250 KiB JS off initial route.
3. **Lazy `framer-motion`** — dynamic-import HUD/`AnimatePresence` paths (or CSS for gate enter). **Impact:** ~chunk `179` (~51 KiB transfer) off idle gate.
4. **Long-cache fonts** — `vercel.json` `headers` for `/Navigo-*.woff2` → `public, max-age=31536000, immutable` (or `next/font/local` hashed URLs). **Impact:** eliminate repeat font revalidation; faster repeat visits.
5. **Font trim + preload** — preload only weights used above-the-fold (Bold 700 / Black 900); drop or delay Medium 500 if body can use system stack until hydrated. **Impact:** fewer early requests; better LCP text.
6. **Mobile GPU budget** — lower `Canvas` `dpr` cap (e.g. `[1, 1.25]`), fewer `Stars`/`Sparkles` on coarse pointer / save-data. **Impact:** main-thread + GPU; helps TBT after load.
7. **Modern browserslist / drop legacy polyfills** — LH legacy-JS ~11 KiB. **Impact:** small transfer win.
8. **`optimizePackageImports`** for `@react-three/drei` (and audit barrel imports). **Impact:** unused-JS reduction inside R3F chunk.

## How to re-measure

```bash
# Mobile
npx lighthouse@12 https://depth-showcase.vercel.app \
  --only-categories=performance --form-factor=mobile \
  --throttling-method=simulate --output=json --output-path=lh-mobile.json \
  --chrome-flags="--headless --no-sandbox"

# Desktop
npx lighthouse@12 https://depth-showcase.vercel.app \
  --only-categories=performance --preset=desktop \
  --throttling-method=simulate --output=json --output-path=lh-desktop.json \
  --chrome-flags="--headless --no-sandbox"
```

Optional: PageSpeed Insights (mobile + desktop) when API quota allows.  
Compare against the Baseline table; update this file with new timestamp + tool version. Do not invent metrics.

## Repo snapshot (perf-relevant)

- Framework: Next 15.2 + React 19 (`apps/web/package.json`)
- Heavy deps on first paint: `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`
- Fonts: `/public/Navigo-{Medium,Bold,Black}.woff2` via `@font-face` in `globals.css`
- Entry: `page.tsx` → client `AtelierApp` → eager `DepthField` Canvas
- No existing PERFORMANCE.md / perf headers in `vercel.json` / `next.config.ts`
