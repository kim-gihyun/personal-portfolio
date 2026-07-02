"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------------------
   Radial constellation map. A glowing core (Gihyun · HKU) with six colour-coded
   branches; each branch sprouts a little constellation of nodes that draws in as
   the section scrolls into view. Geometry is fully deterministic (seeded), so the
   server and client render byte-identical markup.
   -------------------------------------------------------------------------- */

const VW = 1000;
const VH = 620;
const CX = VW / 2;
const CY = VH / 2;
const RX = 300; // ring radii (ellipse — wider than tall)
const RY = 190;
const LABEL_F = 1.26; // how far past the hub the clickable label sits

type Seed = {
  id: string;
  label: string;
  cat: string;
  href: string;
  color: string; // OKLCH — legible on both paper and navy
};

const SEEDS: Seed[] = [
  { id: "robocon", label: "HKU Robocon", cat: "Robotics · fabrication", href: "/portfolio#robocon-robot", color: "oklch(0.56 0.15 255)" },
  { id: "racing", label: "HKU Racing", cat: "Aero · composites", href: "/cv", color: "oklch(0.585 0.17 25)" },
  { id: "laidlaw", label: "Laidlaw", cat: "Research scholar", href: "/cv", color: "oklch(0.56 0.16 300)" },
  { id: "shin", label: "Shin Group", cat: "TENG · materials", href: "/blog", color: "oklch(0.62 0.115 190)" },
  { id: "projects", label: "Projects", cat: "CAD · in 3D", href: "/portfolio", color: "oklch(0.68 0.13 75)" },
  { id: "personal", label: "Off-duty", cat: "Map · keebs · music", href: "/personal", color: "oklch(0.63 0.13 150)" },
];

// tiny deterministic PRNG so twig geometry is stable across SSR/CSR
function rng(seed: number) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const DEG = Math.PI / 180;
// round to 2dp so SSR (Node) and CSR (browser) serialise trig output identically
// — Math.sin/cos/atan2 are not bit-identical across JS engines (hydration safety)
const r2 = (n: number) => Math.round(n * 100) / 100;

type Line = { x1: number; y1: number; x2: number; y2: number };
type Dot = { x: number; y: number; r: number };
type Hub = Seed & {
  hx: number;
  hy: number;
  lx: number;
  ly: number;
  spoke: string;
  twigs: Line[];
  dots: Dot[];
};

// angular connector from a → b: 45° diagonal leg, then an axis-aligned run —
// the octilinear routing of a drafting leader line / PCB trace
function elbow(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const diag = Math.min(Math.abs(dx), Math.abs(dy));
  const mx = r2(ax + Math.sign(dx) * diag);
  const my = r2(ay + Math.sign(dy) * diag);
  return `M${ax} ${ay} L${mx} ${my} L${bx} ${by}`;
}

const HUBS: Hub[] = SEEDS.map((seed, i) => {
  const a = (-90 + i * 60) * DEG; // even ring, start at top
  const hx = r2(CX + RX * Math.cos(a));
  const hy = r2(CY + RY * Math.sin(a));
  const lx = r2(CX + (hx - CX) * LABEL_F);
  const ly = r2(CY + (hy - CY) * LABEL_F);

  // true outward direction (ellipse distorts the ring angle), snapped to the
  // 45° drafting grid — every twig leaves the hub on an octilinear bearing
  const outDeg = Math.atan2(hy - CY, hx - CX) / DEG;
  const base = Math.round(outDeg / 45) * 45;
  const r = rng(i * 131 + 7);
  const twigs: Line[] = [];
  const dots: Dot[] = [];
  const offsets = [-90, -45, 0, 45, 90]; // fan of grid bearings around the spoke
  for (let b = offsets.length - 1; b > 0; b--) {
    const j = Math.floor(r() * (b + 1));
    [offsets[b], offsets[j]] = [offsets[j], offsets[b]];
  }
  const branches = 3 + Math.floor(r() * 2); // 3–4 primary branches
  for (let b = 0; b < branches; b++) {
    const ang = (base + offsets[b]) * DEG;
    const len = 42 + r() * 38;
    const x1 = r2(hx + Math.cos(ang) * len);
    const y1 = r2(hy + Math.sin(ang) * len);
    twigs.push({ x1: hx, y1: hy, x2: x1, y2: y1 });
    dots.push({ x: x1, y: y1, r: r2(2.2 + r() * 1.5) });
    if (r() > 0.42) {
      const ang2 = ang + (r() > 0.5 ? 45 : -45) * DEG; // hard 45° dogleg
      const len2 = 16 + r() * 24;
      const x2 = r2(x1 + Math.cos(ang2) * len2);
      const y2 = r2(y1 + Math.sin(ang2) * len2);
      twigs.push({ x1, y1, x2, y2 });
      dots.push({ x: x2, y: y2, r: r2(1.5 + r() * 1.3) });
    }
  }
  return { ...seed, hx, hy, lx, ly, spoke: elbow(CX, CY, hx, hy), twigs, dots };
});

// dashed guide polygons through the hubs (outer) and at half radius (inner)
const GUIDE_OUT = HUBS.map((h) => `${h.hx},${h.hy}`).join(" ");
const GUIDE_IN = HUBS.map(
  (h) => `${r2(CX + (h.hx - CX) * 0.52)},${r2(CY + (h.hy - CY) * 0.52)}`,
).join(" ");

// diamond survey marker at each hub
const diamond = (x: number, y: number, s: number) =>
  `M${x} ${r2(y - s)} L${r2(x + s)} ${y} L${x} ${r2(y + s)} L${r2(x - s)} ${y} Z`;

// scattered particle core
const CORE: Dot[] = (() => {
  const r = rng(917);
  return Array.from({ length: 16 }, () => {
    const a = r() * 360 * DEG;
    const rad = 6 + r() * 26;
    return { x: r2(CX + Math.cos(a) * rad), y: r2(CY + Math.sin(a) * rad * 0.72), r: r2(0.9 + r() * 1.7) };
  });
})();

const pct = (v: number, max: number) => `${(v / max) * 100}%`;

export function Mindmap() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const strokes = el.querySelectorAll<SVGGeometryElement>(".mm-spoke, .mm-twig");

    const ctx = gsap.context(() => {
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      // centering lives on the wrappers (.mm-center/.mm-node); GSAP only touches the
      // inner card so its scale/translate never fights the -50%/-50% centre transform
      gsap.set(".mm-center-box", { opacity: 0, scale: 0.7, transformOrigin: "center" });
      gsap.set(".mm-node-card", { opacity: 0, y: 10, scale: 0.85, transformOrigin: "center" });
      gsap.set(".mm-guide", { opacity: 0 });
      gsap.set([".mm-hub", ".mm-dot", ".mm-core-dot", ".mm-center-dot"], {
        opacity: 0,
        scale: 0.2,
        transformOrigin: "center",
      });

      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 82%", once: true } });
      tl.to(".mm-guide", { opacity: 1, duration: 0.35, ease: "power1.out" })
        .to(".mm-center-box", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.25")
        .to(".mm-center-dot", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, "<")
        .to(".mm-core-dot", { opacity: 0.85, scale: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.015 }, "<0.03")
        .to(".mm-spoke", { strokeDashoffset: 0, duration: 0.45, ease: "power2.out", stagger: 0.035 }, "-=0.25")
        .to(".mm-hub", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)", stagger: 0.035 }, "-=0.3")
        .to(".mm-twig", { strokeDashoffset: 0, duration: 0.3, ease: "power2.out", stagger: 0.008 }, "-=0.22")
        .to(".mm-dot", { opacity: 0.92, scale: 1, duration: 0.25, ease: "back.out(2)", stagger: 0.006 }, "-=0.25")
        .to(".mm-node-card", { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out", stagger: 0.04 }, "-=0.3");
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="mm" ref={root}>
      <div className="mm-stage">
        <svg className="mm-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" aria-hidden>
          <defs>
            <radialGradient id="mm-core" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="var(--accent-2)" stopOpacity="0.42" />
              <stop offset="0.5" stopColor="var(--accent)" stopOpacity="0.14" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* faint blueprint guide polygons through the hubs */}
          <polygon className="mm-guide" points={GUIDE_OUT} />
          <polygon className="mm-guide mm-guide--in" points={GUIDE_IN} />

          {/* core glow */}
          <circle cx={CX} cy={CY} r={150} fill="url(#mm-core)" />

          {/* per-branch linework + nodes; currentColor carries each branch hue */}
          {HUBS.map((h) => (
            <g key={h.id} className="mm-cat" style={{ color: h.color }}>
              <path className="mm-spoke" d={h.spoke} />
              {h.twigs.map((t, j) => (
                <line key={`t${j}`} className="mm-twig" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
              ))}
              {h.dots.map((d, j) => (
                <circle key={`d${j}`} className="mm-dot" cx={d.x} cy={d.y} r={d.r} />
              ))}
              <path className="mm-hub" d={diamond(h.hx, h.hy, 8)} />
            </g>
          ))}

          {/* core particles + centre pip */}
          {CORE.map((d, j) => (
            <circle key={`c${j}`} className="mm-core-dot" cx={d.x} cy={d.y} r={d.r} />
          ))}
          <circle className="mm-center-dot" cx={CX} cy={CY} r={5} />
        </svg>

        {/* centre label (wrapper centres, inner box animates) */}
        <div className="mm-center" style={{ left: pct(CX, VW), top: pct(CY, VH) }}>
          <div className="mm-center-box">
            <span className="readout">Mechanical Engineering</span>
            <b>Gihyun Kim · HKU</b>
          </div>
        </div>

        {/* clickable branch labels (wrapper centres, inner card animates) */}
        {HUBS.map((h) => (
          <div key={h.id} className="mm-node" style={{ left: pct(h.lx, VW), top: pct(h.ly, VH) }}>
            <Link
              href={h.href}
              className="mm-node-card"
              style={{ "--c": h.color } as React.CSSProperties}
              data-cursor="link"
            >
              <span className="mm-node-dot" />
              <span className="mm-node-text">
                <span className="mm-node-label">{h.label}</span>
                <span className="mm-node-cat readout">{h.cat}</span>
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* mobile fallback — the same links as a plain list */}
      <ul className="mm-list">
        {HUBS.map((h) => (
          <li key={h.id}>
            <Link href={h.href} className="mm-list-link" data-cursor="link" style={{ "--c": h.color } as React.CSSProperties}>
              <span className="mm-node-dot" />
              <b>{h.label}</b>
              <span className="mm-node-cat readout">{h.cat}</span>
              <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
