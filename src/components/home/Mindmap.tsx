"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------------------
   Gyroid field map. The particles sample the gyroid implicit surface
   (sin x cos y + sin y cos z + sin z cos x = 0) — the TPMS Gihyun generates in
   MATLAB for his TENG research — as a 3D point cloud with perspective. Six
   clearings are carved out and the subsystem cards live in the voids.

   The field behaves like his triboelectric fabric: press the cursor into it
   and the material indents — particles sink away in z with an elastic bulge
   around the rim (click presses harder). Signal streams of luminous particles
   arc in 3D from the centre to each subsystem, surging when you hover its
   card. Canvas is client-only, so SSR/CSR markup stays identical.
   -------------------------------------------------------------------------- */

const VW = 1400; // base scene units — wide cinematic band (stage keeps this aspect)
const VH = 620;
const HW = VW / 2;
const HH = VH / 2;
const ZD = 90; // slab half-depth in scene units
const F = 700; // perspective focal length
const PRESS_R = 118; // press radius in css px
const PRESS_D = 80; // how deep the fabric indents (scene z units)

type Seed = {
  id: string;
  label: string;
  cat: string;
  href: string;
  color: string; // OKLCH — legible on both paper and navy
  tier: 1 | 2 | 3; // visual hierarchy: 1 primary · 2 middle · 3 secondary
  clear: number; // clearing radius carved out of the field
};

const SEEDS: Seed[] = [
  { id: "robocon", label: "HKU Robocon", cat: "Robotics · fabrication", href: "/portfolio#robocon-robot", color: "oklch(0.56 0.15 255)", tier: 1, clear: 96 },
  { id: "racing", label: "HKU Racing", cat: "Aero · composites", href: "/cv", color: "oklch(0.585 0.17 25)", tier: 2, clear: 86 },
  { id: "laidlaw", label: "Laidlaw", cat: "Research scholar", href: "/cv", color: "oklch(0.56 0.16 300)", tier: 1, clear: 96 },
  { id: "shin", label: "Shin Group", cat: "TENG · materials", href: "/blog", color: "oklch(0.62 0.115 190)", tier: 1, clear: 96 },
  { id: "projects", label: "Projects", cat: "CAD · in 3D", href: "/portfolio", color: "oklch(0.68 0.13 75)", tier: 2, clear: 86 },
  { id: "personal", label: "Off-duty", cat: "Map · keebs · music", href: "/personal", color: "oklch(0.63 0.13 150)", tier: 3, clear: 78 },
];

const DEG = Math.PI / 180;
const r2 = (n: number) => Math.round(n * 100) / 100;

// card anchors on an even ring (centered coords), plus the centre clearing
const CARDS = SEEDS.map((seed, i) => {
  const a = (-90 + i * 60) * DEG;
  return { ...seed, x: r2(Math.cos(a) * 500), y: r2(Math.sin(a) * 222) };
});
const CLEARINGS = [...CARDS.map((c) => ({ x: c.x, y: c.y, r: c.clear })), { x: 0, y: 0, r: 108 }];

// tiny deterministic PRNG so the field is identical on every visit
function rng(seed: number) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const W = (2 * Math.PI) / 160; // gyroid unit cell ≈ 160 scene units
const gyroid = (x: number, y: number, z: number) =>
  Math.sin(W * x) * Math.cos(W * y) + Math.sin(W * y) * Math.cos(W * z) + Math.sin(W * z) * Math.cos(W * x);

type Particle = {
  x: number; y: number; z: number; // home position on the gyroid surface
  sx: number; sy: number; sz: number; // scattered start for the entrance
  ox: number; oy: number; // eased sideways displacement under the press
  pz: number; // eased press depth (indentation / rim bulge)
  tph: number; tsp: number; // twinkle phase/speed
  d: number; // entrance stagger
  b: number; // colour bucket: -1 field · 0..5 branch
  band: number; // 0 near · 1 far — far particles sink into the atmosphere
  ef: number; // edge feather — the field dissolves instead of ending in a box
};

function buildField() {
  const r = rng(1106);
  const pts: Particle[] = [];
  let tries = 0;
  while (pts.length < 6800 && tries++ < 500000) {
    const x = (r() * 2 - 1) * (HW + 25);
    const y = (r() * 2 - 1) * (HH + 15);
    const z = (r() * 2 - 1) * ZD;
    // cards live in the voids — no particles inside a clearing
    if (CLEARINGS.some((c) => Math.hypot((x - c.x) / 1.55, y - c.y) < c.r)) continue;
    if (Math.abs(gyroid(x, y, z)) > 0.34) continue; // keep only the surface
    let b = -1;
    let best = 200; // particles near a clearing take that branch's hue
    CARDS.forEach((c, i) => {
      const d = Math.hypot(x - c.x, y - c.y);
      if (d < best) { best = d; b = i; }
    });
    pts.push({
      x, y, z,
      sx: x + (r() * 2 - 1) * 200, sy: y + (r() * 2 - 1) * 140, sz: z + (r() * 2 - 1) * 160,
      ox: 0, oy: 0, pz: 0,
      tph: r() * 6.28, tsp: 0.5 + r() * 1.1,
      d: r(),
      b,
      band: z >= 0 ? 0 : 1,
      ef: Math.min(1, (HW + 25 - Math.abs(x)) / 130) * Math.min(1, (HH + 15 - Math.abs(y)) / 90),
    });
  }
  // halo populations: the field crowds in around every subsystem, so the
  // cards sit nested in the material instead of floating in empty voids.
  // Density peaks at each clearing's rim and decays outward.
  const halo = (hx: number, hy: number, rad: number, bucket: number, count: number) => {
    let n = 0, guard = 0;
    while (n < count && guard++ < count * 40) {
      const th = r() * 6.283;
      const d = rad + 4 + 135 * Math.pow(r(), 1.9);
      const x = hx + Math.cos(th) * d * 1.55;
      const y = hy + Math.sin(th) * d;
      if (Math.abs(x) > HW + 25 || Math.abs(y) > HH + 15) continue;
      if (CLEARINGS.some((c) => Math.hypot((x - c.x) / 1.55, y - c.y) < c.r)) continue;
      const z = (r() * 2 - 1) * ZD;
      if (Math.abs(gyroid(x, y, z)) > 0.6) continue; // looser: crowds densely
      pts.push({
        x, y, z,
        sx: x + (r() * 2 - 1) * 200, sy: y + (r() * 2 - 1) * 140, sz: z + (r() * 2 - 1) * 160,
        ox: 0, oy: 0, pz: 0,
        tph: r() * 6.28, tsp: 0.5 + r() * 1.1,
        d: r(),
        b: bucket,
        band: z >= 0 ? 0 : 1,
        ef: Math.min(1, (HW + 25 - Math.abs(x)) / 130) * Math.min(1, (HH + 15 - Math.abs(y)) / 90),
      });
      n++;
    }
  };
  CARDS.forEach((c, i) => halo(c.x, c.y, c.clear, i, 330));
  halo(0, 0, 108, -1, 300);

  // group by colour bucket + depth band so fillStyle switches stay rare
  pts.sort((a, bb) => (a.b * 2 + a.band) - (bb.b * 2 + bb.band));
  return pts;
}

/* signal streams: luminous particles that arc in 3D from the centre to each
   subsystem — current flowing through the material, not a drawn line */
type Runner = { p: number; sp: number; amp: number; lf: number; ph: number };
type Stream = {
  bx: number; by: number; // quadratic bezier control point
  ex: number; ey: number; // end (card anchor)
  runners: Runner[];
};

function buildStreams(): Stream[] {
  const r = rng(77);
  return CARDS.map((c, i) => {
    const mx = c.x / 2;
    const my = c.y / 2;
    const len = Math.hypot(c.x, c.y) || 1;
    const bow = (60 + r() * 45) * (i % 2 ? 1 : -1);
    return {
      bx: mx + (-c.y / len) * bow,
      by: my + (c.x / len) * bow,
      ex: c.x,
      ey: c.y,
      runners: Array.from({ length: 13 }, () => ({
        p: r(),
        sp: 0.2 + r() * 0.14, // trips per second
        amp: 2 + r() * 6,
        lf: 1 + r() * 2.5,
        ph: r() * 6.28,
      })),
    };
  });
}

const pct = (v: number, max: number) => `${(v / max) * 100}%`;

export function Mindmap() {
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredIdx = useRef(-1);
  const fxRef = useRef(false); // fine-pointer interactions
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const el = root.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!el || !stage || !canvas) return;
    if (!stage.getBoundingClientRect().width) return; // mobile list fallback
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const reduced = prefersReducedMotion();
    const particles = buildField();
    const streams = buildStreams();

    // canvas sizing (dpr-aware) — k maps scene units to css px
    let cssW = 0, cssH = 0, k = 1;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => {
      const r = stage.getBoundingClientRect();
      cssW = r.width; cssH = r.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      k = cssW / VW;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(stage);

    // palette: near/far variant per hue — far particles sink into the
    // atmosphere (mixed toward the page bg). Rebuilt when the theme flips.
    const palette: string[] = new Array(14).fill("#6aa9e9");
    let glowColor = "rgba(106,169,233,0.5)";
    const buildPalette = () => {
      const cs = getComputedStyle(stage);
      const bg = cs.getPropertyValue("--bg").trim();
      const base = cs.getPropertyValue("--accent-2").trim() || "#6aa9e9";
      const probe = document.createElement("span");
      probe.style.display = "none";
      stage.appendChild(probe);
      const resolve = (c: string) => {
        probe.style.color = c;
        return getComputedStyle(probe).color;
      };
      [base, ...SEEDS.map((s) => s.color)].forEach((c, i) => {
        palette[i * 2] = resolve(c);
        palette[i * 2 + 1] = resolve(`color-mix(in oklch, ${c} 45%, ${bg})`);
      });
      glowColor = resolve(`color-mix(in oklch, ${base} 55%, transparent)`);
      probe.remove();
    };
    buildPalette();
    window.addEventListener("themechange", buildPalette);

    // signal-arrival ripples (a ring blooms where a runner lands)
    const ripples: { x: number; y: number; age: number; c: number }[] = [];

    const setEnabled = () => (fxRef.current = window.matchMedia("(pointer: fine)").matches);
    setEnabled();
    window.addEventListener("resize", setEnabled);

    // cursor press state in css px over the stage
    const cur = { x: -9999, y: -9999, on: false, down: false };
    let rect = stage.getBoundingClientRect();
    const onMove = (e: MouseEvent) => {
      if (!fxRef.current) return;
      rect = stage.getBoundingClientRect();
      cur.x = e.clientX - rect.left;
      cur.y = e.clientY - rect.top;
      cur.on = true;
    };
    const onLeave = () => { cur.on = false; cur.down = false; };
    const onDown = () => (cur.down = true);
    const onUp = () => (cur.down = false);
    stage.addEventListener("mousemove", onMove, { passive: true });
    stage.addEventListener("mouseleave", onLeave);
    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    // entrance progress (0→1) driven by scroll-into-view, once
    const entr = { e: reduced ? 1 : 0 };
    const gctx = gsap.context(() => {
      if (reduced) return;
      gsap.set(".mm-center-box", { opacity: 0, scale: 0.8, transformOrigin: "center" });
      gsap.set(".mm-node-card", { opacity: 0, scale: 1.05, filter: "blur(5px)", transformOrigin: "center" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
        onComplete: () => gsap.set(".mm-node-card", { clearProps: "transform,filter,opacity" }),
      });
      tl.to(entr, { e: 1, duration: 1.4, ease: "power2.out" }, 0)
        .to(".mm-center-box", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, 0.5)
        .to(".mm-node-card", { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.35, ease: "power3.out", stagger: 0.05 }, 0.7);
    }, el);

    let raf = 0;
    let running = false;
    let lastT = performance.now();
    const t0 = lastT;

    const frame = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const t = (now - t0) / 1000;

      const cx = cssW / 2, cy = cssH / 2;
      const e = entr.e;
      const hov = hoveredIdx.current;
      const pressD = cur.down ? PRESS_D * 1.6 : PRESS_D; // click presses harder

      ctx2d.clearRect(0, 0, cssW, cssH);

      /* --- the core: a soft breathing glow where the streams originate ---- */
      if (e > 0.3) {
        const grd = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, 150 * k);
        grd.addColorStop(0, glowColor);
        grd.addColorStop(1, "transparent");
        ctx2d.globalCompositeOperation = "lighter";
        ctx2d.globalAlpha = (0.5 + 0.28 * Math.sin(t * 0.8)) * Math.min(1, (e - 0.3) / 0.7);
        ctx2d.fillStyle = grd;
        ctx2d.fillRect(cx - 160 * k, cy - 160 * k, 320 * k, 320 * k);
        ctx2d.globalCompositeOperation = "source-over";
      }

      /* --- the fabric ----------------------------------------------------- */
      let bucket = -99;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const key = (p.b + 1) * 2 + p.band;
        if (key !== bucket) {
          bucket = key;
          ctx2d.fillStyle = palette[key];
        }
        // entrance: converge from the scattered cloud onto the surface
        const ei = e >= 1 ? 1 : Math.min(1, Math.max(0, (e * 1.35 - p.d * 0.35) / 1));
        if (ei <= 0) continue;
        const m = 1 - (1 - ei) * (1 - ei);
        const hx = p.sx + (p.x - p.sx) * m;
        const hy = p.sy + (p.y - p.sy) * m;
        const hz = p.sz + (p.z - p.sz) * m;

        // where the particle sits on screen before the press
        const px0 = cx + hx * k;
        const py0 = cy + hy * k;

        // press the fabric: inside the radius it indents (sinks in z, slides
        // outward); just past the rim it bulges up — elastic, like his TENG
        let target = 0;
        let sideX = 0, sideY = 0;
        if (cur.on) {
          const dx = px0 - cur.x;
          const dy = py0 - cur.y;
          const d = Math.hypot(dx, dy);
          if (d < PRESS_R) {
            const f = Math.cos((d / PRESS_R) * Math.PI * 0.5);
            target = -pressD * f * f; // sink
            if (d > 0.001) {
              const side = f * 13;
              sideX = (dx / d) * side;
              sideY = (dy / d) * side;
            }
          } else if (d < PRESS_R * 1.5) {
            const u = (d - PRESS_R) / (PRESS_R * 0.5);
            target = Math.sin(u * Math.PI) * pressD * 0.28; // rim bulge
          }
        }
        p.pz += (target - p.pz) * 0.16;
        p.ox += (sideX - p.ox) * 0.16;
        p.oy += (sideY - p.oy) * 0.16;

        const z2 = hz + p.pz;
        const s = F / (F - z2);
        const px = cx + hx * s * k + p.ox;
        const py = cy + hy * s * k + p.oy;

        const depth = Math.min(1, Math.max(0, (z2 + ZD) / (2 * ZD)));
        const tw = 0.85 + 0.15 * Math.sin(t * p.tsp + p.tph);
        let alpha = (0.5 + 0.45 * depth) * tw * ei * p.ef;
        let sz = (1.4 + 2 * depth) * s * Math.max(0.85, k);
        if (hov >= 0) alpha *= p.b === hov ? 1.5 : 0.45;
        ctx2d.globalAlpha = Math.min(1, alpha);
        ctx2d.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }

      /* --- press footprint: the indenter's dashed contact ring ------------ */
      if (cur.on && fxRef.current) {
        ctx2d.globalAlpha = cur.down ? 0.28 : 0.15;
        ctx2d.strokeStyle = palette[0];
        ctx2d.lineWidth = 1;
        ctx2d.setLineDash([4, 6]);
        ctx2d.beginPath();
        ctx2d.arc(cur.x, cur.y, PRESS_R * 0.55, 0, 6.2832);
        ctx2d.stroke();
        ctx2d.setLineDash([]);
      }

      /* --- signal streams: centre → subsystems, arcing over the fabric ---- */
      const streamGate = e >= 1 ? 1 : Math.min(1, Math.max(0, (e - 0.75) / 0.25));
      if (streamGate > 0) {
        ctx2d.globalCompositeOperation = "lighter"; // streams are light, not ink
        for (let si = 0; si < streams.length; si++) {
          const st = streams[si];
          const isHov = hov === si;
          const spMul = isHov ? 1.9 : 1;
          const aMul = hov >= 0 ? (isHov ? 1.4 : 0.4) : 1;
          ctx2d.fillStyle = SEEDS[si].color;
          for (const rn of st.runners) {
            rn.p += dt * rn.sp * spMul;
            if (rn.p >= 1) {
              rn.p %= 1;
              if (ripples.length < 24) ripples.push({ x: cx + st.ex * k, y: cy + st.ey * k, age: 0, c: si });
            }
            for (let g = 0; g < 4; g++) {
              const tp = rn.p - g * 0.016;
              if (tp < 0 || tp > 1) continue;
              const o = 1 - tp;
              // quadratic bezier through the bowed control point
              const bx = o * o * 0 + 2 * o * tp * st.bx + tp * tp * st.ex;
              const by = o * o * 0 + 2 * o * tp * st.by + tp * tp * st.ey;
              // lateral shimmer + a 3D arc over the slab
              const wob = Math.sin(tp * rn.lf * 6.28 + rn.ph) * rn.amp;
              const z = Math.sin(tp * Math.PI) * 52;
              const s = F / (F - z);
              const env = Math.min(1, tp / 0.1) * Math.min(1, (1 - tp) / 0.1);
              const px = cx + (bx + wob) * s * k;
              const py = cy + (by + wob * 0.4) * s * k;
              const alpha = 0.95 * env * (1 - g * 0.26) * aMul * streamGate;
              const sz = (2.6 - g * 0.45) * s;
              ctx2d.globalAlpha = Math.max(0, Math.min(1, alpha));
              ctx2d.fillRect(px - sz / 2, py - sz / 2, sz, sz);
            }
          }
        }

        /* signal arrivals: a ring blooms where a runner lands */
        ctx2d.lineWidth = 1.4;
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rp = ripples[i];
          rp.age += dt;
          const u = rp.age / 0.55;
          if (u >= 1) { ripples.splice(i, 1); continue; }
          ctx2d.globalAlpha = (1 - u) * (1 - u) * 0.55 * streamGate;
          ctx2d.strokeStyle = palette[(rp.c + 1) * 2];
          ctx2d.beginPath();
          ctx2d.arc(rp.x, rp.y, 5 + u * 44, 0, 6.2832);
          ctx2d.stroke();
        }
        ctx2d.globalCompositeOperation = "source-over";
      }
      ctx2d.globalAlpha = 1;

      if (running && !reduced) raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      frame(); // one static frame: assembled field + dotted signal arcs
      return () => {
        ro.disconnect();
        gctx.revert();
        window.removeEventListener("themechange", buildPalette);
        window.removeEventListener("resize", setEnabled);
        window.removeEventListener("pointerup", onUp);
        stage.removeEventListener("mousemove", onMove);
        stage.removeEventListener("mouseleave", onLeave);
        stage.removeEventListener("pointerdown", onDown);
      };
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(stage);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      ro.disconnect();
      gctx.revert();
      window.removeEventListener("themechange", buildPalette);
      window.removeEventListener("resize", setEnabled);
      window.removeEventListener("pointerup", onUp);
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
    };
  }, []);

  /* card tilt (≤4°, fine pointers) ------------------------------------------ */
  const tiltCard = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!fxRef.current) return;
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const ry = Math.max(-4, Math.min(4, ((e.clientX - r.left) / r.width - 0.5) * 8));
    const rx = Math.max(-4, Math.min(4, -((e.clientY - r.top) / r.height - 0.5) * 8));
    c.style.transform = `perspective(650px) translateY(-2px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  return (
    <div className={`mm ${hovered ? "has-focus" : ""}`} ref={root}>
      <div className="mm-stage" ref={stageRef}>
        {/* the gyroid point cloud — depth lives in its perspective projection */}
        <canvas ref={canvasRef} className="mm-canvas" aria-hidden />

        <div className="mm-float">
          <div className="mm-center" style={{ left: pct(HW, VW), top: pct(HH, VH) }}>
            <div className="mm-center-box">
              <b>GK-26 · Field map</b>
              <span className="readout">Select a subsystem</span>
            </div>
          </div>

          {CARDS.map((h, i) => (
            <div
              key={h.id}
              className={`mm-node ${hovered === h.id ? "is-focus" : ""}`}
              style={{ left: pct(HW + h.x, VW), top: pct(HH + h.y, VH) }}
            >
              <Link
                href={h.href}
                className={`mm-node-card mm-node-card--t${h.tier}`}
                style={{ "--c": h.color } as React.CSSProperties}
                data-cursor="link"
                onMouseEnter={() => {
                  setHovered(h.id);
                  hoveredIdx.current = i;
                }}
                onMouseMove={tiltCard}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  setHovered(null);
                  hoveredIdx.current = -1;
                }}
              >
                <span className="mm-node-dot" />
                <span className="mm-node-text">
                  <span className="mm-node-label">{h.label}</span>
                  <span className="mm-node-cat readout">{h.cat}</span>
                </span>
                <span className="mm-node-arrow" aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* mobile fallback — the same links as a plain list */}
      <ul className="mm-list">
        {CARDS.map((h) => (
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
