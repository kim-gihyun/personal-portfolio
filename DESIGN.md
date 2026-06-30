# DESIGN — "Specimen"

The design language for Gihyun Kim's site. One sentence: **a calibrated, machined catalogue where
his own research artefact — the gyroid — is the generative signature.**

## Voice (three physical-object words)

**Machined · charged · exacting.** Reference object: a precision tool's calibration certificate and
a 3D-printer hotend at temperature — hazard-and-readout, not cool-engineer-blue.

## Strategy

- **Register:** brand / portfolio — design IS the product.
- **Colour strategy:** Committed. Ink on cool paper, light-first; a single charged accent.
- **Concept:** the gyroid TPMS (`sin x cos y + sin y cos z + sin z cos x = 0`) — the surface he
  generates in MATLAB for his TENG research — ray-marched live in the hero and recurring as motif.

## Tokens (OKLCH — see `src/app/globals.css`)

| Role | Light | Dark |
|------|-------|------|
| bg | `oklch(0.984 0.003 230)` cool paper | `oklch(0.168 0.012 260)` graphite |
| ink | `oklch(0.205 0.013 255)` | `oklch(0.955 0.004 250)` |
| muted | `oklch(0.475 0.013 255)` | `oklch(0.685 0.014 250)` |
| accent | `oklch(0.605 0.214 36)` molten orange | `oklch(0.705 0.205 42)` |

Accent is for large/interactive/structural use; body text is always ink. `--accent-ink` is the
small-text-safe variant on paper.

## Type

- **Archivo** — display + UI + body (machined grotesque; one superfamily, weight/size contrast).
- **Geist Mono** — data, coordinates, figure ids, spec readouts (`.readout`).
- No editorial serif — that lane is deliberately avoided. Engineering edge comes from mono + layout.

Fluid scale at 1.25 ratio, display clamp caps at 6rem.

## Anti-slop guardrails honoured

- No gradient text, no glass-as-default, no hero-metric template, no identical card grids.
- No per-section numbered eyebrows — sheet numbers are one-per-page (the catalogue system).
- Reflex-reject fonts (Inter/Space Grotesk/Instrument Serif/IBM Plex) avoided.
- Reveals set their hidden state in JS (GSAP), so no-JS/headless ships visible.

## Motion

GSAP ScrollTrigger (reveals, CV rail scrub, masked text) · Framer Motion (overlays, swaps) ·
Lenis smooth scroll · magnetic CTAs · bespoke morphing cursor. Every path has a
`prefers-reduced-motion` fallback.
