# PRODUCT — Gihyun Kim

**What:** A personal site / portfolio for Gihyun Kim — engineering student at HKU working across
triboelectric materials, robotics, and applied AI. The site itself is the artefact: a "specimen
catalogue" where his real research surface (the gyroid) is the generative identity.

**Register:** Brand / portfolio — *design IS the product*. Communicate, don't transact.

**Audience:** Research supervisors, scholarship committees, recruiters, and fellow makers — people
who should come away feeling both the precision and the playfulness of how he works.

**Surfaces:**
- **Home** — ray-marched gyroid hero, intro thesis, live showpiece model, focus areas.
- **Work** (heavy emphasis) — interactive R3F viewer for 7 builds (.glb/.stl) with floating
  material/engineering-context cards, revision histories, galleries.
- **Profile / CV** (heavy emphasis) — scroll-scrubbed interactive timeline + toolkit.
- **About** — asymmetric editorial narrative on the applied-maths ⟷ materials intersection.
- **Off-Duty** — custom Three.js journey globe, mechanical-keyboard shrine, songs, photos.
- **Log** — editorial index + Markdown posts with live 3D models embedded inline.

**Success criteria:**
- Reads as unmistakably *his* — not "AI made this". Distinctiveness over safety.
- The 3D is genuinely interactive (drag / rotate / zoom) and loads efficiently.
- Real content throughout (his actual CV, projects, research, travel), no placeholder copy.
- Fast, accessible (WCAG AA), responsive 375→1440, full reduced-motion fallbacks.
- Ships as a static export to GitHub Pages on `kim_gihyun.com`.

**Constraints:** Next.js 16 App Router, static export (no server). Three.js / R3F, GSAP, Framer
Motion, Lenis, Tailwind v4 + custom CSS.

See **DESIGN.md** for the visual system (tokens, type, motion, anti-slop guardrails).
