"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WORLD_LAND } from "@/lib/data/worldPath";
import { places, travelStats, type Place } from "@/lib/data/travel";
import { prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const ROUTE =
  "M794.5 141.7 Q420 6 57.2 60.8 Q130 78 226.1 121.7 Q510 46 794.5 141.7 Q762 196 720.2 230.3";

type Pt = {
  name: string;
  x: number;
  y: number;
  kind: Place["kind"];
  lx: number;
  ly: number;
  anchor: "start" | "middle" | "end";
  sub?: string;
};

// Pixel positions carried over from the original map (aligned to the land path).
const POINTS: Pt[] = [
  { name: "Seoul", x: 794.5, y: 141.7, kind: "lived", lx: 784, ly: 124, anchor: "end", sub: "HOME BASE" },
  { name: "Istanbul", x: 226.1, y: 121.7, kind: "lived", lx: 226, ly: 146, anchor: "middle", sub: "4.5 YRS" },
  { name: "London", x: 57.2, y: 60.8, kind: "lived", lx: 70, ly: 48, anchor: "start", sub: "1 YR" },
  { name: "Hong Kong", x: 720.2, y: 230.3, kind: "now", lx: 734, ly: 248, anchor: "start", sub: "NOW" },
  { name: "Singapore", x: 660.3, y: 351.8, kind: "visited", lx: 672, ly: 355, anchor: "start" },
  { name: "Osaka", x: 843.9, y: 158.4, kind: "visited", lx: 833, ly: 174, anchor: "end" },
  { name: "Prague", x: 141.6, y: 69.1, kind: "visited", lx: 141.6, ly: 58, anchor: "middle" },
  { name: "Vienna", x: 152.9, y: 80, kind: "visited", lx: 166, ly: 90, anchor: "start" },
  { name: "Shenzhen", x: 714, y: 217, kind: "visited", lx: 702, ly: 212, anchor: "end" },
];

const GRAT_X = [58, 145, 232, 319, 406, 493, 580, 667, 754, 841];
const GRAT_Y = [11.6, 98.6, 185.6, 272.6, 359.6];

const kindLabel: Record<Place["kind"], string> = { now: "Now", lived: "Lived", visited: "Visited" };

export function JourneyMap() {
  const [active, setActive] = useState<Place | null>(null);
  const shown = active ?? places.find((p) => p.kind === "now")!;
  const routeRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<SVGSVGElement>(null);
  const place = (name: string) => places.find((p) => p.name === name)!;

  useEffect(() => {
    const path = routeRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap || prefersReducedMotion()) return;
    const len = path.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.inOut",
        scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
      });
      gsap.from(".map-city", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.5,
        scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  // depth: the sheet rests at a gentle tilt and steers toward the cursor;
  // the land/graticule layer sits sunk behind the route and pins.
  // Desktop-only (fine pointer, ≥1024px); reduced motion keeps the static tilt.
  useEffect(() => {
    const wrap = wrapRef.current;
    const scene = sceneRef.current;
    const back = backRef.current;
    if (!wrap || !scene || !back || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let enabled = window.innerWidth >= 1024;
    const cur = { x: 0.5, y: 0.5 };
    const tgt = { x: 0.5, y: 0.5 };
    let raf = 0;
    let inside = false;

    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.16;
      cur.y += (tgt.y - cur.y) * 0.16;
      const px = cur.x * 2 - 1;
      const py = cur.y * 2 - 1;
      scene.style.transform = `rotateX(${(3 - py * 2.2).toFixed(2)}deg) rotateY(${(px * 3).toFixed(2)}deg)`;
      back.style.transform = `translate3d(${(px * 4).toFixed(2)}px, ${(py * 3).toFixed(2)}px, -20px)`;
      if (inside) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      if (!inside) return;
      inside = false;
      cancelAnimationFrame(raf);
      gsap.to(scene, { rotationX: 3, rotationY: 0, duration: 0.6, ease: "power2.out" });
      gsap.to(back, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
    };
    const setEnabled = () => {
      enabled = window.innerWidth >= 1024;
      if (!enabled) onLeave();
    };
    window.addEventListener("resize", setEnabled);
    const onMove = (e: MouseEvent) => {
      if (!enabled) return;
      const r = wrap.getBoundingClientRect();
      tgt.x = (e.clientX - r.left) / r.width;
      tgt.y = (e.clientY - r.top) / r.height;
      if (!inside) {
        inside = true;
        gsap.killTweensOf([scene, back]);
        raf = requestAnimationFrame(loop);
      }
    };
    wrap.addEventListener("mousemove", onMove, { passive: true });
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setEnabled);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="journey">
      <div className="journey-map" ref={wrapRef}>
        {/* 3D scene: sheet tilts toward the cursor; layers sit on their own Z */}
        <div className="map-scene" ref={sceneRef}>
        <div className="map-head readout">
          <span>Fig. 02 — Journey · 2006–present</span>
          <span>Equirectangular · NTS</span>
        </div>

        <div className="map-frame">
        {/* depth layer 1 — land + graticule, sunk behind the route */}
        <svg viewBox="0 0 900 380" className="journey-svg journey-svg--back" aria-hidden ref={backRef}>
          <path className="map-land" d={WORLD_LAND} />

          <g className="map-grat">
            {GRAT_X.map((x) => (
              <line key={`x${x}`} x1={x} y1="0" x2={x} y2="380" />
            ))}
            {GRAT_Y.map((y) => (
              <line key={`y${y}`} x1="0" y1={y} x2="900" y2={y} />
            ))}
          </g>
        </svg>

        {/* depth layer 2 — route, craft, and pins */}
        <svg
          viewBox="0 0 900 380"
          className="journey-svg journey-svg--front"
          role="img"
          aria-label="World map: lived in Seoul, London, and Istanbul; now in Hong Kong; visited Singapore, Osaka, Prague, Vienna, and Shenzhen."
          data-cursor="view"
          data-cursor-label="hover a pin"
        >
          <path ref={routeRef} className="map-route" d={ROUTE} fill="none" />

          <g className="map-craft" aria-hidden>
            <path className="craft-trail" d="M-14 0 H-7" />
            <path d="M7 0 L-5 4.2 L-2.2 0 L-5 -4.2 Z" />
            <animateMotion dur="12s" repeatCount="indefinite" rotate="auto" path={ROUTE} />
          </g>

          {POINTS.map((pt) => {
            const p = place(pt.name);
            const on = () => setActive(p);
            return (
              <g
                key={pt.name}
                className={`map-city map-city--${pt.kind} ${shown.name === pt.name ? "is-active" : ""}`}
                tabIndex={0}
                role="button"
                aria-label={`${pt.name} — ${p.stat}`}
                onMouseEnter={on}
                onFocus={on}
                onClick={on}
              >
                {pt.kind === "visited" ? (
                  <path className="map-cross" d={`M${pt.x - 4} ${pt.y} h8 M${pt.x} ${pt.y - 4} v8`} />
                ) : (
                  <>
                    {pt.kind === "now" && <circle className="map-now-ring" cx={pt.x} cy={pt.y} r="10" />}
                    <circle className="map-ring" cx={pt.x} cy={pt.y} r="6.5" />
                    <circle className="map-dot" cx={pt.x} cy={pt.y} r="3.2" />
                  </>
                )}
                <text className="map-label" x={pt.lx} y={pt.ly} textAnchor={pt.anchor}>
                  {pt.name.toUpperCase()}
                </text>
                {pt.sub && (
                  <text className="map-sub" x={pt.lx} y={pt.ly + 10} textAnchor={pt.anchor}>
                    {pt.sub}
                  </text>
                )}
                <circle className="map-hit" cx={pt.x} cy={pt.y} r="15" />
              </g>
            );
          })}
        </svg>
        </div>

        <ul className="map-legend readout">
          <li><i className="lg-dot lg-now" /> now</li>
          <li><i className="lg-dot lg-lived" /> lived</li>
          <li><i className="lg-dot lg-visited" /> visited</li>
        </ul>
        </div>
      </div>

      <div className="journey-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={shown.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="journey-card"
          >
            <span className="readout">{kindLabel[shown.kind]} · {shown.stat}</span>
            <h3>{shown.name}</h3>
            {shown.years && <p className="journey-years readout">{shown.years}</p>}
            <p className="journey-quip">{shown.quip}</p>
          </motion.div>
        </AnimatePresence>

        <ul className="journey-list">
          {places.map((p) => (
            <li key={p.name}>
              <button
                type="button"
                className={`journey-place ${shown.name === p.name ? "is-active" : ""}`}
                onMouseEnter={() => setActive(p)}
                onFocus={() => setActive(p)}
                onClick={() => setActive(p)}
                data-cursor="link"
              >
                <i className={`lg-dot lg-${p.kind}`} />
                <span>{p.name}</span>
                <span className="readout journey-place-stat">{p.stat}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="journey-stats">
          {travelStats.map((s) => (
            <div key={s.k}>
              <span className="readout">{s.k}</span>
              <b>{s.v}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
