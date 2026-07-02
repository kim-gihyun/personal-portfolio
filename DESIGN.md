# DESIGN — "Blueprint"

The design language for Gihyun Kim's site. One sentence: **an engineering drawing set recut for
academia — Yale-blue ink on technical paper, the whole site reading as one of his own drafted
sheets.**

## Voice (three physical-object words)

**Drafted · inked · scholarly.** Reference object: the title block of a hand-drafted engineering
drawing — and, in dark mode, the same sheet on a light table during the night shift: midnight
navy, sky-blue glow.

## Strategy

- **Register:** brand / portfolio — design IS the product.
- **Colour strategy:** Committed. Yale-blue ink on technical paper, light-first; dark is a
  "night shift" recut (midnight navy + glowing sky blue), not a plain inversion.
- **Concept:** the drawing set. Recurring motifs:
  - a faint blueprint grid on the page itself (96px rules on `<html>`);
  - the **drafting cursor** (`src/components/chrome/Cursor.tsx`) — full-screen crosshair guides,
    live X/Y coordinate readout, grid-snap marker, corner brackets that lock onto interactive
    targets, and a dot-grid halo that reveals the blueprint around the pointer (grid pinned to
    page space — the light moves, the drawing doesn't);
  - a giant italic **GK watermark** behind every page (`GkBackdrop.tsx`; slides to centre on the
    home as you scroll);
  - the home **mindmap as assembly diagram** (`src/components/home/Mindmap.tsx`) — octilinear
    leader lines snapped to the 45° drafting grid, survey-diamond hubs, dashed guide polygons,
    six colour-coded branches drawn in on scroll;
  - mono `.readout` annotations (figure ids, coords, specs) as the sheet's marginalia.
  - Live 3D CAD stages (React Three Fiber) are the artefacts on the sheet; the gyroid survives
    as one portfolio specimen, no longer the hero.

## Tokens (OKLCH — see `src/app/globals.css`)

| Role | Light | Dark |
|------|-------|------|
| bg | `oklch(0.976 0.004 235)` technical paper | `oklch(0.190 0.040 255)` midnight navy |
| ink | `oklch(0.250 0.022 252)` near-navy | `oklch(0.950 0.008 235)` |
| muted | `oklch(0.470 0.030 252)` | `oklch(0.700 0.026 235)` |
| accent | `oklch(0.420 0.105 256)` deep blue | `oklch(0.800 0.130 232)` glowing sky blue |
| accent-ink | `oklch(0.360 0.110 256)` Yale blue | `oklch(0.835 0.115 232)` |
| accent-2 | `oklch(0.660 0.100 245)` sky blue | `oklch(0.700 0.100 245)` |

`--accent` is linework and fills (large/interactive/structural); `--accent-ink` is the
small-text-safe variant for text and links; `--accent-2` is for highlights, sparingly. Body text
is always ink. Supporting tokens: `--line-2` (the faint blue page grid), `--glow` (halo),
`--cur-rgb` (cursor halo), and fixed `--scene-light` / `--scene-dark` tones for the 3D canvases
(these do not flip with theme).

## Type

- **Spectral** — display + body (academic serif; 400–800 with italics). Body copy reads as
  serif — that's the scholarly register. Display weights are retuned to 600–700 with gentle
  tracking (the "academic serif re-tune" block at the end of `globals.css`).
- **Geist** — UI chrome (`--font-ui`): nav links, filters, tabs, small data values.
- **Geist Mono** — annotations: coordinates, figure ids, spec readouts (`.readout`), the
  cursor's X/Y readout.

Fluid scale at 1.25 ratio, display clamp caps at 6rem.

## Anti-slop guardrails honoured

- No gradient text, no glass-as-default, no hero-metric template, no identical card grids.
- The serif is Spectral, chosen deliberately — reflex-reject fonts (Inter/Space Grotesk/
  Instrument Serif/IBM Plex) still avoided.
- Reveals set their hidden state in JS (GSAP), so no-JS/headless ships visible.
- Cursor and halo run only on fine pointers and vanish under `pointer: coarse` or reduced
  motion; the mindmap ships a plain-list fallback below 860px.
- Contrast holds: `--muted` is ≥4.5:1 on paper; button hover text flips to `--scene-dark` so
  the accent fill stays AA in both themes.

## Motion

GSAP ScrollTrigger (reveals, mindmap draw-in, GK-backdrop scrub, CV rail scrub) · Framer Motion
(overlays, swaps) · Lenis smooth scroll · magnetic CTAs · the drafting cursor (DOM transforms on
mousemove; the halo's rAF loop parks itself once settled). House easings: `--ease-out-quart`,
`--ease-out-expo`. Every path has a `prefers-reduced-motion` fallback.
