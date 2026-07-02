"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------------------
   Live assembly diagram. A glowing core (Gihyun · HKU) with six colour-coded
   branches drawn as octilinear leader lines. The constellation never sits
   still: satellite nodes drift on seeded oscillators, signal pulses travel the
   spokes, dots shy away from the cursor, and pressing a branch extends it into
   child links. Geometry is fully deterministic (seeded), so the server and
   client render byte-identical markup.
   -------------------------------------------------------------------------- */

const VW = 1000;
const VH = 620;
const CX = VW / 2;
const CY = VH / 2;
const RX = 300; // ring radii (ellipse — wider than tall)
const RY = 190;
const LABEL_F = 1.26; // how far past the hub the clickable label sits

type Kid = { label: string; href: string };
type Seed = {
  id: string;
  label: string;
  cat: string;
  href: string;
  color: string; // OKLCH — legible on both paper and navy
  kids: Kid[];
};

const SEEDS: Seed[] = [
  {
    id: "robocon", label: "HKU Robocon", cat: "Robotics · fabrication", href: "/portfolio#robocon-robot", color: "oklch(0.56 0.15 255)",
    kids: [
      { label: "Competition robot", href: "/portfolio#robocon-robot" },
      { label: "Transport trolley", href: "/portfolio#trolley" },
      { label: "Team & role", href: "/cv" },
    ],
  },
  {
    id: "racing", label: "HKU Racing", cat: "Aero · composites", href: "/cv", color: "oklch(0.585 0.17 25)",
    kids: [
      { label: "Role & season", href: "/cv" },
      { label: "Composite layup", href: "/cv" },
    ],
  },
  {
    id: "laidlaw", label: "Laidlaw", cat: "Research scholar", href: "/cv", color: "oklch(0.56 0.16 300)",
    kids: [
      { label: "Urban turbulence", href: "/cv" },
      { label: "Scholar programme", href: "/cv" },
    ],
  },
  {
    id: "shin", label: "Shin Group", cat: "TENG · materials", href: "/blog", color: "oklch(0.62 0.115 190)",
    kids: [
      { label: "Tensile tester", href: "/portfolio#tensile-tester" },
      { label: "Bending tester", href: "/portfolio#bending-tester" },
      { label: "Progress reports", href: "/blog" },
    ],
  },
  {
    id: "projects", label: "Projects", cat: "CAD · in 3D", href: "/portfolio", color: "oklch(0.68 0.13 75)",
    kids: [
      { label: "Laundry sensor", href: "/portfolio#laundry-sensor" },
      { label: "Solar tracker", href: "/portfolio#solar-tracker" },
      { label: "All seven sheets", href: "/portfolio" },
    ],
  },
  {
    id: "personal", label: "Off-duty", cat: "Map · keebs · music", href: "/personal", color: "oklch(0.63 0.13 150)",
    kids: [
      { label: "Journey map", href: "/personal" },
      { label: "Keyboard shrine", href: "/personal#keebs" },
      { label: "On repeat", href: "/personal" },
    ],
  },
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

type Node = { ax: number; ay: number; r: number; ph: number; sp: number; amp: number };
type Edge = { a: number; b: number }; // node indices; -1 = the hub itself
type KidPos = Kid & { kx: number; ky: number; path: string };
type Hub = Seed & {
  hx: number;
  hy: number;
  lx: number;
  ly: number;
  spoke: string;
  nodes: Node[];
  edges: Edge[];
  kidPos: KidPos[];
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
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const drift = (): Pick<Node, "ph" | "sp" | "amp"> => ({
    ph: r2(r() * 6.28),
    sp: r2(0.5 + r() * 0.7),
    amp: r2(2.5 + r() * 3.5),
  });
  const offsets = [-90, -45, 0, 45, 90]; // fan of grid bearings around the spoke
  for (let b = offsets.length - 1; b > 0; b--) {
    const j = Math.floor(r() * (b + 1));
    [offsets[b], offsets[j]] = [offsets[j], offsets[b]];
  }
  const branches = 3 + Math.floor(r() * 2); // 3–4 primary branches
  for (let b = 0; b < branches; b++) {
    const ang = (base + offsets[b]) * DEG;
    const len = 42 + r() * 38;
    const n0: Node = { ax: r2(hx + Math.cos(ang) * len), ay: r2(hy + Math.sin(ang) * len), r: r2(2.2 + r() * 1.5), ...drift() };
    nodes.push(n0);
    edges.push({ a: -1, b: nodes.length - 1 });
    if (r() > 0.42) {
      const ang2 = ang + (r() > 0.5 ? 45 : -45) * DEG; // hard 45° dogleg
      const len2 = 16 + r() * 24;
      const n1: Node = { ax: r2(n0.ax + Math.cos(ang2) * len2), ay: r2(n0.ay + Math.sin(ang2) * len2), r: r2(1.5 + r() * 1.3), ...drift() };
      nodes.push(n1);
      edges.push({ a: nodes.length - 2, b: nodes.length - 1 });
    }
  }

  // pressed-state extensions: children fan out on grid bearings around the hub
  const bearings = [base - 45, base + 45, base - 90, base + 90];
  const dists = [118, 118, 104, 104];
  const kidPos: KidPos[] = seed.kids.map((kid, k) => {
    const kx = r2(hx + Math.cos(bearings[k] * DEG) * dists[k]);
    const ky = r2(hy + Math.sin(bearings[k] * DEG) * dists[k]);
    return { ...kid, kx, ky, path: elbow(hx, hy, kx, ky) };
  });

  return { ...seed, hx, hy, lx, ly, spoke: elbow(CX, CY, hx, hy), nodes, edges, kidPos };
});

// dashed guide polygons through the hubs (outer) and at half radius (inner)
const GUIDE_OUT = HUBS.map((h) => `${h.hx},${h.hy}`).join(" ");
const GUIDE_IN = HUBS.map(
  (h) => `${r2(CX + (h.hx - CX) * 0.52)},${r2(CY + (h.hy - CY) * 0.52)}`,
).join(" ");

// diamond survey marker at each hub
const diamond = (x: number, y: number, s: number) =>
  `M${x} ${r2(y - s)} L${r2(x + s)} ${y} L${x} ${r2(y + s)} L${r2(x - s)} ${y} Z`;

// scattered particle core — each orbits the centre slowly
const CORE = (() => {
  const r = rng(917);
  return Array.from({ length: 16 }, () => {
    const a0 = r() * 360 * DEG;
    const rad = 6 + r() * 26;
    return {
      a0: r2(a0),
      rad: r2(rad),
      r: r2(0.9 + r() * 1.7),
      sp: r2(0.08 + r() * 0.2) * (r() > 0.5 ? 1 : -1),
      x: r2(CX + Math.cos(a0) * rad),
      y: r2(CY + Math.sin(a0) * rad * 0.72),
    };
  });
})();

const pct = (v: number, max: number) => `${(v / max) * 100}%`;

export function Mindmap() {
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // intro draw-in (once, on scroll into view)
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

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
        onComplete: () => {
          // twig endpoints drift after the intro — drop the dash mask so the
          // lines stay solid as their measured length changes
          gsap.set(strokes, { clearProps: "strokeDasharray,strokeDashoffset" });
          el.classList.add("is-live"); // arms the spoke pulses
        },
      });
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

  // ambient life: seeded drift on every satellite node (edges follow), orbiting
  // core particles, cursor-proximity repulsion, and a soft stage parallax.
  // Runs only while the stage is on screen; skipped for reduced motion.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const svg = el.querySelector<SVGSVGElement>(".mm-svg");
    const floatLayer = el.querySelector<HTMLElement>(".mm-float");
    if (!svg || !floatLayer) return;

    const dotEls = HUBS.map((h, i) =>
      h.nodes.map((_, j) => svg.querySelector<SVGCircleElement>(`[data-dot="${i}-${j}"]`)!),
    );
    const edgeEls = HUBS.map((h, i) =>
      h.edges.map((_, j) => svg.querySelector<SVGLineElement>(`[data-edge="${i}-${j}"]`)!),
    );
    const coreEls = CORE.map((_, j) => svg.querySelector<SVGCircleElement>(`[data-core="${j}"]`)!);

    // smoothed cursor in viewBox coordinates; w eases 0→1 while the pointer is over
    const cur = { x: CX, y: CY, tx: CX, ty: CY, w: 0, tw: 0 };
    const onMove = (e: MouseEvent) => {
      const r = svg.getBoundingClientRect();
      if (!r.width || !r.height) return; // stage hidden (mobile fallback)
      cur.tx = ((e.clientX - r.left) / r.width) * VW;
      cur.ty = ((e.clientY - r.top) / r.height) * VH;
      cur.tw = 1;
    };
    const onLeave = () => (cur.tw = 0);
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);

    let raf = 0;
    let running = false;
    const t0 = performance.now();
    const px = new Array(24).fill(0); // per-hub scratch for node positions
    const py = new Array(24).fill(0);

    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      cur.x += (cur.tx - cur.x) * 0.12;
      cur.y += (cur.ty - cur.y) * 0.12;
      cur.w += (cur.tw - cur.w) * 0.08;

      for (let i = 0; i < HUBS.length; i++) {
        const h = HUBS[i];
        for (let j = 0; j < h.nodes.length; j++) {
          const n = h.nodes[j];
          let x = n.ax + Math.sin(t * n.sp + n.ph) * n.amp;
          let y = n.ay + Math.cos(t * n.sp * 0.9 + n.ph * 1.7) * n.amp * 0.8;
          const dx = x - cur.x;
          const dy = y - cur.y;
          const d = Math.hypot(dx, dy);
          const R = 110;
          const dot = dotEls[i][j];
          if (d < R && d > 0.001) {
            const k = (1 - d / R) * cur.w;
            x += (dx / d) * k * k * 26; // shy away from the pointer
            y += (dy / d) * k * k * 26;
            dot.setAttribute("r", String(n.r * (1 + k * 1.3)));
            dot.style.opacity = String(Math.min(1, 0.92 + k * 0.5));
          } else {
            dot.setAttribute("r", String(n.r));
            dot.style.opacity = "";
          }
          px[j] = x;
          py[j] = y;
          dot.setAttribute("cx", x.toFixed(2));
          dot.setAttribute("cy", y.toFixed(2));
        }
        for (let j = 0; j < h.edges.length; j++) {
          const e = h.edges[j];
          const line = edgeEls[i][j];
          const sx = e.a === -1 ? h.hx : px[e.a];
          const sy = e.a === -1 ? h.hy : py[e.a];
          line.setAttribute("x1", sx.toFixed(2));
          line.setAttribute("y1", sy.toFixed(2));
          line.setAttribute("x2", px[e.b].toFixed(2));
          line.setAttribute("y2", py[e.b].toFixed(2));
        }
      }

      for (let j = 0; j < CORE.length; j++) {
        const c = CORE[j];
        const a = c.a0 + t * c.sp;
        coreEls[j].setAttribute("cx", (CX + Math.cos(a) * c.rad).toFixed(2));
        coreEls[j].setAttribute("cy", (CY + Math.sin(a) * c.rad * 0.72).toFixed(2));
      }

      // stage parallax — the drawing leans gently toward the pointer
      const lx = ((cur.x - CX) / CX) * 6 * cur.w;
      const ly = ((cur.y - CY) / CY) * 4 * cur.w;
      svg.style.transform = `translate(${lx.toFixed(2)}px, ${ly.toFixed(2)}px)`;
      floatLayer.style.transform = `translate(${(lx * 1.6).toFixed(2)}px, ${(ly * 1.6).toFixed(2)}px)`;

      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Esc collapses an extended branch
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const openHub = expanded ? HUBS.find((h) => h.id === expanded) : null;
  const focus = expanded ?? hovered; // one branch in focus dims the rest

  return (
    <div className={`mm ${focus ? "has-focus" : ""}`} ref={root}>
      <div className="mm-stage" onClick={() => setExpanded(null)}>
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
          {HUBS.map((h, i) => (
            <g key={h.id} className={`mm-cat ${focus === h.id ? "is-focus" : ""}`} style={{ color: h.color }}>
              <path className="mm-spoke" d={h.spoke} />
              <path className="mm-pulse" d={h.spoke} style={{ animationDelay: `${i * 0.7}s` }} />
              {h.edges.map((e, j) => (
                <line
                  key={`e${j}`}
                  className="mm-twig"
                  data-edge={`${i}-${j}`}
                  x1={e.a === -1 ? h.hx : h.nodes[e.a].ax}
                  y1={e.a === -1 ? h.hy : h.nodes[e.a].ay}
                  x2={h.nodes[e.b].ax}
                  y2={h.nodes[e.b].ay}
                />
              ))}
              {h.nodes.map((n, j) => (
                <circle key={`d${j}`} className="mm-dot" data-dot={`${i}-${j}`} cx={n.ax} cy={n.ay} r={n.r} />
              ))}
              <path className="mm-hub" d={diamond(h.hx, h.hy, 8)} />
            </g>
          ))}

          {/* pressed-state extensions: leader lines out to the child links */}
          <AnimatePresence>
            {openHub && (
              <g key={openHub.id} className="mm-cat mm-kids-lines" style={{ color: openHub.color }}>
                {openHub.kidPos.map((k, j) => (
                  <motion.path
                    key={k.label}
                    className="mm-kid-link"
                    d={k.path}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.28, delay: j * 0.05, ease: "easeOut" }}
                  />
                ))}
              </g>
            )}
          </AnimatePresence>

          {/* core particles + centre pip */}
          {CORE.map((c, j) => (
            <circle key={`c${j}`} className="mm-core-dot" data-core={j} cx={c.x} cy={c.y} r={c.r} />
          ))}
          <circle className="mm-center-dot" cx={CX} cy={CY} r={5} />
        </svg>

        {/* parallax layer for all HTML labels */}
        <div className="mm-float">
          {/* centre label (wrapper centres, inner box animates) */}
          <div className="mm-center" style={{ left: pct(CX, VW), top: pct(CY, VH) }}>
            <div className="mm-center-box">
              <span className="readout">Mechanical Engineering</span>
              <b>Gihyun Kim · HKU</b>
            </div>
          </div>

          {/* branch labels — press to extend, press again (or Esc) to fold */}
          {HUBS.map((h) => (
            <div
              key={h.id}
              className={`mm-node ${focus === h.id ? "is-focus" : ""}`}
              style={{ left: pct(h.lx, VW), top: pct(h.ly, VH) }}
            >
              <button
                type="button"
                className={`mm-node-card ${expanded === h.id ? "is-open" : ""}`}
                style={{ "--c": h.color } as React.CSSProperties}
                aria-expanded={expanded === h.id}
                data-cursor="link"
                onMouseEnter={() => setHovered(h.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((v) => (v === h.id ? null : h.id));
                }}
              >
                <span className="mm-node-dot" />
                <span className="mm-node-text">
                  <span className="mm-node-label">{h.label}</span>
                  <span className="mm-node-cat readout">{h.cat}</span>
                </span>
                <span className="mm-node-plus" aria-hidden>{expanded === h.id ? "−" : "+"}</span>
              </button>
            </div>
          ))}

          {/* child links for the pressed branch */}
          <AnimatePresence>
            {openHub &&
              openHub.kidPos.map((k, j) => (
                <motion.div
                  key={`${openHub.id}-${k.label}`}
                  className="mm-kid"
                  style={{ left: pct(k.kx, VW), top: pct(k.ky, VH) }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.24, delay: j * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={k.href}
                    className="mm-kid-card"
                    style={{ "--c": openHub.color } as React.CSSProperties}
                    data-cursor="link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="mm-node-dot" />
                    {k.label}
                  </Link>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
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
