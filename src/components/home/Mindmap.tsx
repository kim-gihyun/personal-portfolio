"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ----------------------------------------------------------------------------
   Gyroid field map. The particles sample the gyroid implicit surface
   (sin x cos y + sin y cos z + sin z cos x = 0) — the TPMS Gihyun generates in
   MATLAB for his TENG research — as a 3D point cloud with perspective. The
   field runs under everything (cards float on backdrop-blur above it), each
   subsystem owns a colour population, and a dense blue core sits behind the
   centre plate. Press the cursor in and the fabric indents elastically
   (click presses harder); signal streams arc from the core to each subsystem;
   clicking a card warps the whole field into it before navigating.
   Canvas is client-only, so SSR/CSR markup stays identical.
   -------------------------------------------------------------------------- */

const VW = 1400; // base scene units — wide cinematic band (stage keeps this aspect)
const VH = 1040; // taller frame; card ring stays fixed so distances are unchanged
const HW = VW / 2;
const HH = VH / 2;
const ZD = 90; // slab half-depth in scene units
const F = 700; // perspective focal length
const PRESS_R = 118; // press radius in css px
const PRESS_D = 80; // how deep the fabric indents (scene z units)

/* branch colour populations (fixed OKLCH, legible on paper and navy) */
const COLORS = [
  "", // 0 — theme base (resolved from --accent-2 at runtime)
  "oklch(0.60 0.14 255)", // 1 blue
  "oklch(0.63 0.13 150)", // 2 green
  "oklch(0.35 0.02 255)", // 3 black (ink)
  "oklch(0.58 0.16 300)", // 4 purple
  "oklch(0.54 0.11 155)", // 5 racing green
  "oklch(0.72 0.13 85)",  // 6 gold
  "oklch(0.80 0.01 250)", // 7 silver
  "oklch(0.68 0.15 55)",  // 8 orange
];

type Seed = {
  id: string;
  label: string;
  cat: string;
  href: string;
  accent: string; // card chrome (--c)
  ci: number[]; // colour population indices into COLORS
  tier: 1 | 2 | 3;
  zone: number; // radius of the subsystem's dense zone
};

const SEEDS: Seed[] = [
  { id: "robocon", label: "HKU Robocon", cat: "Robotics · fabrication", href: "/portfolio#robocon-robot", accent: COLORS[4], ci: [4], tier: 1, zone: 96 },
  { id: "racing", label: "HKU Racing", cat: "Aero · composites", href: "/cv", accent: COLORS[5], ci: [5], tier: 2, zone: 86 },
  { id: "laidlaw", label: "Laidlaw", cat: "Research scholar", href: "/cv", accent: COLORS[1], ci: [1, 2, 3], tier: 1, zone: 96 },
  { id: "shin", label: "Shin Group", cat: "TENG · materials", href: "/blog", accent: COLORS[8], ci: [8], tier: 1, zone: 96 },
  { id: "projects", label: "Projects", cat: "CAD · in 3D", href: "/portfolio", accent: COLORS[6], ci: [6], tier: 2, zone: 86 },
  { id: "personal", label: "Off-duty", cat: "Map · keebs · music", href: "/personal", accent: COLORS[7], ci: [7], tier: 3, zone: 78 },
];

const DEG = Math.PI / 180;
const r2 = (n: number) => Math.round(n * 100) / 100;

// card anchors on an even ring (centered coords)
const CARDS = SEEDS.map((seed, i) => {
  const a = (-90 + i * 60) * DEG;
  return { ...seed, x: r2(Math.cos(a) * 500), y: r2(Math.sin(a) * 272) };
});

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
  x: number; y: number; z: number;
  sx: number; sy: number; sz: number; // scattered start for the entrance
  ox: number; oy: number; // eased sideways displacement under the press
  pz: number; // eased press depth (indentation / rim bulge)
  tph: number; tsp: number; // twinkle phase/speed
  d: number; // entrance stagger
  b: number; // hover bucket: -1 field · 0..5 branch
  ci: number; // colour index into the palette
  band: number; // 0 near · 1 far
  ef: number; // edge feather
};

function buildField() {
  const r = rng(1106);
  const pts: Particle[] = [];
  const feather = (x: number, y: number) =>
    Math.min(1, (HW + 25 - Math.abs(x)) / 130) * Math.min(1, (HH + 15 - Math.abs(y)) / 90);
  const push = (x: number, y: number, z: number, b: number, ci: number) =>
    pts.push({
      x, y, z,
      sx: x + (r() * 2 - 1) * 200, sy: y + (r() * 2 - 1) * 140, sz: z + (r() * 2 - 1) * 160,
      ox: 0, oy: 0, pz: 0,
      tph: r() * 6.28, tsp: 0.5 + r() * 1.1,
      d: r(),
      b, ci,
      band: z >= 0 ? 0 : 1,
      ef: feather(x, y),
    });
  const pick = (list: number[]) => list[Math.floor(r() * list.length)];

  // base fabric — runs under everything, no voids
  let tries = 0;
  while (pts.length < 6800 && tries++ < 500000) {
    const x = (r() * 2 - 1) * (HW + 25);
    const y = (r() * 2 - 1) * (HH + 15);
    const z = (r() * 2 - 1) * ZD;
    if (Math.abs(gyroid(x, y, z)) > 0.34) continue; // keep only the surface
    let b = -1;
    let best = 210; // particles near a subsystem join its population
    CARDS.forEach((c, i) => {
      const d = Math.hypot(x - c.x, y - c.y);
      if (d < best) { best = d; b = i; }
    });
    // thin the unassigned field in the mid-radius corridor between the core and
    // the cards, so the signal streams read cleanly instead of drowning in
    // static noise. Core, card clusters, and the outer frame stay dense.
    if (b === -1) {
      const rC = Math.hypot(x * 0.72, y);
      if (rC > 150 && rC < 410 && r() > 0.2) continue;
    }
    push(x, y, z, b, b === -1 ? 0 : pick(CARDS[b].ci));
  }

  // dense cluster behind + around a point (the field crowds the subsystems)
  const cluster = (hx: number, hy: number, rad: number, b: number, ciList: number[], count: number, thr: number) => {
    let n = 0, guard = 0;
    while (n < count && guard++ < count * 40) {
      const th = r() * 6.283;
      const rr = rad * Math.sqrt(r());
      const x = hx + Math.cos(th) * rr * 1.45;
      const y = hy + Math.sin(th) * rr;
      if (Math.abs(x) > HW + 25 || Math.abs(y) > HH + 15) continue;
      const z = (r() * 2 - 1) * ZD;
      if (Math.abs(gyroid(x, y, z)) > thr) continue;
      push(x, y, z, b, pick(ciList));
      n++;
    }
  };
  // behind every card, and a decaying ring further out
  CARDS.forEach((c, i) => {
    cluster(c.x, c.y, c.zone * 1.2, i, c.ci, 260, 0.8); // directly behind the card
    cluster(c.x, c.y, c.zone * 2.4, i, c.ci, 300, 0.55); // surrounding crowd
  });
  // a shit ton of blue behind the GK-26 centre plate
  cluster(0, 0, 185, -1, [0, 1], 640, 0.85);
  cluster(0, 0, 320, -1, [0], 260, 0.5);

  // group by colour + depth band so fillStyle switches stay rare
  pts.sort((a, bb) => (a.ci * 2 + a.band) - (bb.ci * 2 + bb.band));
  return pts;
}

/* signal streams: luminous particles that arc in 3D from the centre to each
   subsystem — current flowing through the material, not a drawn line */
type Runner = { p: number; sp: number; amp: number; lf: number; ph: number };
type Stream = { bx: number; by: number; ex: number; ey: number; runners: Runner[] };

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
        p: r(), sp: 0.2 + r() * 0.14, amp: 2 + r() * 6, lf: 1 + r() * 2.5, ph: r() * 6.28,
      })),
    };
  });
}

const pct = (v: number, max: number) => `${(v / max) * 100}%`;

export function Mindmap() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredIdx = useRef(-1);
  const fxRef = useRef(false);
  const warpRef = useRef<{ x: number; y: number; t0: number } | null>(null);
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

    // canvas sizing (dpr-aware) — k maps scene units to css px.
    // The stage rect is cached; mousemove must never force layout.
    let cssW = 0, cssH = 0, k = 1;
    let rect = stage.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => {
      rect = stage.getBoundingClientRect();
      cssW = rect.width; cssH = rect.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      k = cssW / VW;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(stage);
    const refreshRect = () => (rect = stage.getBoundingClientRect());
    window.addEventListener("scroll", refreshRect, { passive: true });

    // palette: near/far variant per colour — far particles sink into the
    // atmosphere (mixed toward the page bg). Rebuilt when the theme flips.
    const palette: string[] = new Array(COLORS.length * 2).fill("#6aa9e9");
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
      COLORS.forEach((c, i) => {
        const hue = i === 0 ? base : c;
        palette[i * 2] = resolve(hue);
        palette[i * 2 + 1] = resolve(`color-mix(in oklch, ${hue} 45%, ${bg})`);
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
    const onMove = (e: MouseEvent) => {
      if (!fxRef.current) return;
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
      const pressD = cur.down ? PRESS_D * 1.6 : PRESS_D;

      // warp: on click the whole field is sucked into the chosen subsystem
      const w = warpRef.current;
      let wEase = 0, wx = 0, wy = 0;
      if (w) {
        const u = Math.min(1, (now - w.t0) / 450);
        wEase = u * u;
        wx = cx + w.x * k;
        wy = cy + w.y * k;
      }

      ctx2d.clearRect(0, 0, cssW, cssH);

      /* --- the core: a soft breathing glow where the streams originate ---- */
      if (e > 0.3) {
        const grd = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, 180 * k);
        grd.addColorStop(0, glowColor);
        grd.addColorStop(1, "transparent");
        ctx2d.globalCompositeOperation = "lighter";
        ctx2d.globalAlpha = (0.5 + 0.28 * Math.sin(t * 0.8)) * Math.min(1, (e - 0.3) / 0.7);
        ctx2d.fillStyle = grd;
        ctx2d.fillRect(cx - 190 * k, cy - 190 * k, 380 * k, 380 * k);
        ctx2d.globalCompositeOperation = "source-over";
      }

      /* --- the fabric ----------------------------------------------------- */
      let bucket = -99;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const key = p.ci * 2 + p.band;
        if (key !== bucket) {
          bucket = key;
          ctx2d.fillStyle = palette[key];
        }
        const ei = e >= 1 ? 1 : Math.min(1, Math.max(0, (e * 1.35 - p.d * 0.35) / 1));
        if (ei <= 0) continue;
        const m = 1 - (1 - ei) * (1 - ei);
        const hx = p.sx + (p.x - p.sx) * m;
        const hy = p.sy + (p.y - p.sy) * m;
        const hz = p.sz + (p.z - p.sz) * m;

        const px0 = cx + hx * k;
        const py0 = cy + hy * k;

        // press the fabric: indent inside, elastic bulge past the rim
        // (cheap box pre-check keeps hypot off the ~95% of far particles)
        let target = 0;
        let sideX = 0, sideY = 0;
        const dx = px0 - cur.x;
        const dy = py0 - cur.y;
        if (cur.on && dx < 180 && dx > -180 && dy < 180 && dy > -180) {
          const d = Math.hypot(dx, dy);
          if (d < PRESS_R) {
            const f = Math.cos((d / PRESS_R) * Math.PI * 0.5);
            target = -pressD * f * f;
            if (d > 0.001) {
              const side = f * 13;
              sideX = (dx / d) * side;
              sideY = (dy / d) * side;
            }
          } else if (d < PRESS_R * 1.5) {
            const u = (d - PRESS_R) / (PRESS_R * 0.5);
            target = Math.sin(u * Math.PI) * pressD * 0.28;
          }
        }
        p.pz += (target - p.pz) * 0.16;
        p.ox += (sideX - p.ox) * 0.16;
        p.oy += (sideY - p.oy) * 0.16;

        const z2 = hz + p.pz;
        const s = F / (F - z2);
        let px = cx + hx * s * k + p.ox;
        let py = cy + hy * s * k + p.oy;
        if (wEase > 0) { px += (wx - px) * wEase; py += (wy - py) * wEase; }

        const depth = Math.min(1, Math.max(0, (z2 + ZD) / (2 * ZD)));
        // twinkle only the near band — the dim far band doesn't need the sin
        const tw = p.band === 0 ? 0.85 + 0.15 * Math.sin(t * p.tsp + p.tph) : 0.9;
        let alpha = (0.5 + 0.45 * depth) * tw * ei * p.ef;
        let sz = (1.4 + 2 * depth) * s * Math.max(0.85, k);
        if (hov >= 0) alpha *= p.b === hov ? 1.5 : 0.45;
        if (wEase > 0) sz *= 1 - wEase * 0.5;
        ctx2d.globalAlpha = Math.min(1, alpha);
        // integer snap: no per-rect anti-aliasing — faster and crisper squares
        ctx2d.fillRect((px - sz / 2) | 0, (py - sz / 2) | 0, (sz + 0.5) | 0 || 1, (sz + 0.5) | 0 || 1);
      }

      /* --- press footprint: the indenter's dashed contact ring ------------ */
      if (cur.on && fxRef.current && !w) {
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
      const streamGate = (e >= 1 ? 1 : Math.min(1, Math.max(0, (e - 0.75) / 0.25))) * (1 - wEase);
      if (streamGate > 0) {
        ctx2d.globalCompositeOperation = "lighter"; // streams are light, not ink
        for (let si = 0; si < streams.length; si++) {
          const st = streams[si];
          const isHov = hov === si;
          const spMul = isHov ? 1.9 : 1;
          const aMul = hov >= 0 ? (isHov ? 1.4 : 0.4) : 1;
          ctx2d.fillStyle = palette[(si === 2 ? 1 : SEEDS[si].ci[0]) * 2];
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
              const bx = 2 * o * tp * st.bx + tp * tp * st.ex;
              const by = 2 * o * tp * st.by + tp * tp * st.ey;
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
          ctx2d.strokeStyle = palette[(rp.c === 2 ? 1 : SEEDS[rp.c].ci[0]) * 2];
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
      window.removeEventListener("scroll", refreshRect);
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
      window.removeEventListener("scroll", refreshRect);
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

  /* click → the field warps into the chosen subsystem, then we navigate ----- */
  const warpTo = (e: React.MouseEvent<HTMLAnchorElement>, x: number, y: number, href: string) => {
    if (prefersReducedMotion() || warpRef.current) return; // plain navigation
    if (!stageRef.current?.getBoundingClientRect().width) return; // mobile list
    e.preventDefault();
    warpRef.current = { x, y, t0: performance.now() };
    root.current?.classList.add("is-warping");
    window.setTimeout(() => router.push(href), 480);
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
                style={{ "--c": h.accent } as React.CSSProperties}
                data-cursor="link"
                onClick={(e) => warpTo(e, h.x, h.y, h.href)}
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

        {/* whiteout that covers the warp → navigation seam */}
        <div className="mm-fade" aria-hidden />
      </div>

      {/* mobile fallback — the same links as a plain list */}
      <ul className="mm-list">
        {CARDS.map((h) => (
          <li key={h.id}>
            <Link href={h.href} className="mm-list-link" data-cursor="link" style={{ "--c": h.accent } as React.CSSProperties}>
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
