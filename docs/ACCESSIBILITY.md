# Accessibility — Depth Atelier (depth-showcase)

| Field | Value |
| --- | --- |
| Standard | WCAG 2.2 Level AA |
| Target | https://depth-showcase.vercel.app |
| Repo | WORKFL0/depth-showcase (`apps/web`) |
| Audit date | 2026-10-02 (CEST) |
| Auditor | Workflo Accessibility agent |
| Method | Live SSR HTML + deployed CSS; GitHub `main` source review; API seed/dive checks for high-risk UI states; contrast math (relative luminance). Interactive Playwright keyboard pass **blocked** (shared browser lock) — keyboard/focus items below are code-verified against live markup; re-verify manually after fixes. |

## Summary

| Severity | Count |
| --- | --- |
| Critical | 2 |
| Serious | 3 |
| Moderate | 3 |
| Minor | 2 |
| **Total** | **10** |

**F1–F5 remediations (2026-10-02 follow-up):** F1 chip list markup; F2 focus-gated shortcuts; F3 dialog focus + `#main` `inert`; F4 split `--danger` / `--danger-text` + white on hot index; F5 SkipLink before `<main>` with gate/chamber targets. Re-QA keyboard when Playwright is free.

**Already in good shape (keep):** `lang="en"`; global `:focus-visible` ring (`--signal` on void); `prefers-reduced-motion` CSS kill-switch + `useReducedMotion` + R3F reduced paths; seed field has visible-adjacent `sr-only` label; WebGL shell `aria-hidden`; exit controls are native `<button>`s; assertive `LiveRegion` for session status; skip-link styles exist.

## Findings

| ID | Criterion | Severity | Where | Evidence | Fix |
| --- | --- | --- | --- | --- | --- |
| F1 | 4.1.2 Name, Role, Value | Critical | Gate chips — `SeedGate.tsx`; live `/` | Live HTML: `<button type="button" class="chip" role="listitem">` (×5). Explicit `role="listitem"` **overrides** the button role → AT exposes list items, not buttons. | Remove `role="listitem"` / `role="list"`. Prefer `<ul class="chip-row"><li><button class="chip">…</button></li></ul>` (style `li` reset). |
| F2 | 2.1.4 Character Key Shortcuts | Critical | Global keys — `AtelierApp.tsx` | Single-character handlers for `m`/`M` and `1`–`9` (when not in an input). No turn-off, remap, or “active only on focus” control. | Require a modifier (e.g. Alt+digit), **or** add a persistent “Disable letter/number shortcuts” control, **or** activate digits only while focus is inside `nav.exits`. Keep Esc for dialog close (non-character). |
| F3 | 2.4.3 Focus Order (dialog) | Serious | Constellation — `ConstellationMap.tsx` | Dialog lacked initial focus / trap / restore; background HUD was not inert. | **Remediated:** Close gets initial focus; Tab trap + focus restore on close; `#main` (HUD) gets `inert` while map open; Esc closes. |
| F4 | 1.4.3 Contrast (Minimum) | Serious | Hot exits — `globals.css` `.exit-hot .exit-index` | Originally `#ffffff` on `#ff4d6d` ≈ **3.21:1**; after darkening fill to `#c62828`, ink-on-danger was **3.52:1**. Index is `font-size: 1rem` (not large text → needs 4.5:1). | **Remediated:** `--danger` `#c62828` kept as fill; `--danger-text` `#ff4d6d` for text/icons (≥4.5:1 on void). `.exit-hot .exit-index` uses white on danger fill (**5.62:1**). |
| F5 | 2.4.1 Bypass Blocks | Serious | Skip link — `SkipLink.tsx`, `AtelierApp.tsx`, `SeedGate.tsx` | Skip link was **inside** `<main>`; gate had no `#chamber-controls` target; seed `autoFocus` stole first focus. | **Remediated:** `<SkipLink />` before `<main>`; gate → `#seed-input` (“Skip to seed”); chamber → `#chamber-controls`. `autoFocus` removed. |
| F6 | 1.3.1 / 2.4.6 Headings | Moderate | Chamber HUD — `ChamberHud.tsx` | After seed, page has **no `h1`** (gate `h1` unmounted); chamber title is `h2`. | Make chamber title `h1` (or keep a visually hidden `h1` for the atelier). |
| F7 | 1.3.1 Info and Relationships | Moderate | Phenomena — `ChamberHud.tsx` | `ph.detail` only on `title=`; intensity in `.phen-intensity` is `aria-hidden`. Keyboard/AT users miss detail/intensity. | Surface detail in text or `aria-describedby`; do not hide intensity from the accessible name (or announce via live region on change). |
| F8 | 4.1.3 Status Messages | Moderate | HUD live — `ChamberHud.tsx` + `LiveRegion.tsx` | Whole `.hud` has `aria-live="polite"` and remounts via `key={chamber.id}`, while assertive `LiveRegion` also announces arrivals → duplicate/noisy status. | Remove `aria-live` from `.hud`; keep a single assertive/polite live region with concise messages. |
| F9 | 1.4.3 / hydration UX | Minor | Gate motion — `SeedGate.tsx` SSR | Live SSR ships Framer `style="opacity:0"` on title/lede/chips. `useReducedMotion` `getServerSnapshot()` is `false`, so first paint can be invisible until hydrate/animate. | SSR/`initial` should assume reduced or opacity 1; or CSS `@media (prefers-reduced-motion: reduce)` override for `.gate [style]` is fragile — prefer motion-safe initials. |
| F10 | 2.2.2 Pause/Stop/Hide (residual) | Minor | Depth field — `DepthField.tsx` | Continuous Stars/Sparkles/particle motion when PRM is off; no in-app pause. PRM + reduced R3F paths largely mitigate (OS setting is an accepted mechanism). | Optional: in-HUD “Pause field motion” toggle for users who won’t enable OS PRM. |

### Contrast spot-checks (tokens on `--void` / declared surfaces)

| Pair | Ratio | AA normal | Notes |
| --- | --- | --- | --- |
| `#f2f400` / `#0a0a0a` | 16.7:1 | Pass | Brand signal |
| `#f5f5f0` / `#0a0a0a` | 18.1:1 | Pass | Body mist |
| `#0a0a0a` / `#f2f400` | 16.7:1 | Pass | Primary button |
| `#ff4d6d` / `#0a0a0a` | 6.2:1 | Pass | Danger text |
| `#ffffff` / `#ff4d6d` | 3.2:1 | **Fail** | Hot exit index (F4) |
| mist @0.55 / void | ~5.8:1 | Pass | `.gate-hint` / phen intensity (still small type — UX, not AA fail) |

Placeholder contrast not measured in-browser (Playwright lock); treat as **incomplete** until checked with computed styles.

## Remediations (priority order)

1. **F1** chip roles — unblock AT on seed suggestions.  
2. **F2** shortcut policy — WCAG 2.2 AA hard fail if single-key shortcuts stay global.  
3. **F3** dialog focus management for constellation.  
4. **F4** hot-exit index contrast.  
5. **F5** skip-link placement + autofocus.  
6. **F6–F8** heading / phenomena / live-region cleanup.  
7. **F9–F10** motion SSR + optional pause.

## Frontend handoff (critical path only)

Scope: keyboard, focus, contrast, reduced-motion **critical/serious** items.

| File | Change |
| --- | --- |
| `apps/web/src/components/hud/SeedGate.tsx` | Fix chip list markup (F1). Remove or defer `autoFocus` (F5). Prefer reduced-safe `initial` opacity 1 (F9 / motion). |
| `apps/web/src/components/ui/AtelierApp.tsx` | SkipLink before `<main>`; gate `#seed-input` / chamber `#chamber-controls` (F5). Digit/`M` shortcuts only when focus in `#chamber-controls` (F2). `#main` `inert` while map open (F3). |
| `apps/web/src/components/hud/ConstellationMap.tsx` | Focus trap + initial focus + restore; dialog outside inert `#main` (F3). |
| `apps/web/src/components/a11y/SkipLink.tsx` | Props for `href`/`label` — gate “Skip to seed”, chamber “Skip to chamber controls” (F5). |
| `apps/web/src/app/globals.css` | `--danger` fill `#c62828`; `--danger-text` `#ff4d6d`; hot index white-on-danger (F4). Keep `:focus-visible` + `@media (prefers-reduced-motion: reduce)` blocks. |
| `apps/web/src/components/hud/ChamberHud.tsx` | Add `id="chamber-controls"` on `nav.exits` (F5). (Heading/live-region cleanups F6/F8 are moderate — do after criticals.) |
| `apps/web/src/hooks/use-reduced-motion.ts` | Optional: `getServerSnapshot → true` or document PRM-safe SSR strategy (F9). |
| `apps/web/src/components/engine/DepthField.tsx` | No critical defect if PRM respected; optional pause control (F10). |

## Residual risk / blockers

- **Playwright MCP browser lock** prevented interactive Tab-order / focus-ring / dialog-trap confirmation on the live site this session. Re-run keyboard QA after F1–F5.  
- **Placeholder** and **canvas-adjacent** contrast not instrumented with computed styles.  
- **No auth wall**; public Vercel deploy and public GitHub repo accessible.  
- Repo `main` moved during audit (`5a5a9a2` → `9125702`); a11y surfaces reviewed match deployed CSS chunk `4f95baea777ecdf8` and live SSR structure.

## Out of scope

API-only consumers, OpenAPI docs, non-UI packages, marketing pages outside this deploy.
