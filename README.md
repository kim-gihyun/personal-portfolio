# Gihyun Kim — Specimen Catalogue

An award-grade personal site for Gihyun Kim: a calibrated, machined, "specimen catalogue"
where his real research artefact — the **gyroid** triply-periodic minimal surface — becomes the
generative signature, ray-marched live in the hero from the same implicit equation he exports
from MATLAB.

Live 3D models you can drag/zoom (`.glb` + `.stl`), a custom Three.js journey globe, a scroll-
scrubbed CV timeline, an asymmetric About, a cheeky Off-Duty page (keyboards, songs, photos), and
an editorial engineering log parsed from Markdown — with live models embedded inside posts.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **React Three Fiber** + **drei** + **three-stdlib** — model viewer, gyroid shader, globe
- **GSAP** (ScrollTrigger) — scroll reveals, CV rail, masked text
- **Framer Motion** — page/UI transitions
- **Lenis** — smooth scroll
- **Tailwind v4** + custom CSS (OKLCH design tokens, light/dark)
- **marked** — Markdown → HTML for the log

## Develop

```bash
npm install --legacy-peer-deps
npm run dev          # http://localhost:3000
```

> `output: "export"` is enabled only for production builds (Next 16's dev server can't render
> dynamic SSG routes under export mode). Dev runs as a normal Next server.

## Build (static export)

```bash
npm run build        # → ./out  (fully static, deployable anywhere)
```

`public/CNAME` (`kim_gihyun.com`) and `public/.nojekyll` are copied into `out/` so GitHub Pages
serves the `_next/` directory and keeps the custom domain.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `out/` to
GitHub Pages. In the repo: **Settings → Pages → Source: GitHub Actions**.

## Structure

```
src/
  app/                 routes: / · /portfolio · /cv · /about · /personal · /blog · /blog/[slug]
  components/
    three/             GyroidHero · ModelViewer · Globe (R3F)
    chrome/            Nav · Footer · Cursor · Preloader · ThemeToggle
    ui/                Reveal · TextReveal · Magnetic · Marquee · Gallery · PageHeader
    home/ portfolio/ cv/ personal/ blog/
  lib/
    data/              profile · cv · projects · travel · offduty   (his real facts)
    posts.ts           reads /public/posts/*.md
public/
  assets/              .glb / .stl models, images, cv.pdf
  posts/               Markdown engineering log
```

## Design system

Ink-on-cool-paper, light-first, with a single charged **molten-orange** accent and the gyroid as
recurring motif. Type: **Archivo** (machined grotesque) + **Geist Mono** (data/readouts). Tokens
live at the top of `src/app/globals.css` (`:root` / `[data-theme="dark"]`).
