"use client";

import { useEffect, useRef } from "react";

/**
 * Drafting cursor (ported from Gihyun's original site): full-screen crosshair
 * guides, a live X/Y coordinate readout, a grid-snap marker, corner brackets
 * that lock onto interactive elements, a cursor-following grid reveal, and a
 * halo of small drafting crosses. Pointer-fine only.
 */
const GRID = 28;
const XF_R = 170;
const LOCK_SEL =
  'a, button, [data-cursor], [role="button"], input, summary, .pf-index-item, .journey-place, .song, .gallery-thumb, .map-city';
// anything that isn't blank background — coords hide over these
const CONTENT_SEL =
  "a,button,input,summary,p,h1,h2,h3,h4,h5,h6,li,b,strong,em,i,code,dt,dd,img,svg,figure,figcaption,article,table,blockquote,pre,label,span:not(.xc-h):not(.xc-v):not(.xc-dot):not(.xc-snap):not(.xc-read),.spec-card,.gear-hero,.pf-stage,.hero-stage,.journey-map,.journey-card";

export function Cursor() {
  const hRef = useRef<HTMLSpanElement>(null);
  const vRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const snapRef = useRef<HTMLSpanElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const xcRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-xcur");

    const ctx = canRef.current!.getContext("2d")!;
    let rgb = "29,78,137";
    const readRGB = () => {
      const v = getComputedStyle(root).getPropertyValue("--cur-rgb").trim();
      if (v) rgb = v;
    };
    readRGB();
    const onTheme = () => readRGB();
    window.addEventListener("themechange", onTheme);

    const sizeCanvas = () => {
      const c = canRef.current!;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    let mx = -300;
    let my = -300;
    let ticking = false;
    let boxEl: Element | null = null;

    const drawHalo = (cx: number, cy: number) => {
      const c = canRef.current!;
      ctx.clearRect(0, 0, c.width, c.height);
      if (cx < 0) return;
      const x0 = Math.max(0, Math.floor((cx - XF_R) / GRID) * GRID - 1);
      const y0 = Math.max(0, Math.floor((cy - XF_R) / GRID) * GRID - 1);
      for (let gx = x0; gx <= cx + XF_R; gx += GRID) {
        for (let gy = y0; gy <= cy + XF_R; gy += GRID) {
          const d = Math.hypot(gx - cx, gy - cy);
          if (d > XF_R) continue;
          let a = 1 - d / XF_R;
          a = a * a * 0.5;
          const s = 2.2 + a * 4;
          ctx.strokeStyle = `rgba(${rgb},${a.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(gx - s, gy);
          ctx.lineTo(gx + s, gy);
          ctx.moveTo(gx, gy - s);
          ctx.lineTo(gx, gy + s);
          ctx.stroke();
        }
      }
    };

    const paint = () => {
      ticking = false;
      hRef.current!.style.transform = `translateY(${my}px)`;
      vRef.current!.style.transform = `translateX(${mx}px)`;
      dotRef.current!.style.transform = `translate(${mx}px,${my}px)`;
      const gx = Math.round((mx + 1) / GRID) * GRID - 1;
      const gy = Math.round((my + 1) / GRID) * GRID - 1;
      snapRef.current!.style.transform = `translate(${gx}px,${gy}px)`;
      readRef.current!.style.transform = `translate(${mx + 16}px,${my + 18}px)`;
      readRef.current!.textContent =
        "X " + String(Math.max(0, Math.round(mx))).padStart(4, "0") +
        "  Y " + String(Math.max(0, Math.round(my))).padStart(4, "0");
      root.style.setProperty("--mx", mx + "px");
      root.style.setProperty("--my", my + "px");
      drawHalo(mx, my);
      if (boxEl) {
        const r = boxEl.getBoundingClientRect();
        const b = boxRef.current!;
        b.style.transform = `translate(${r.left - 6}px,${r.top - 6}px)`;
        b.style.width = r.width + 12 + "px";
        b.style.height = r.height + 12 + "px";
      }
    };
    const queue = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(paint);
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      root.classList.add("xcur-on");
      queue();
    };
    const onLeave = () => {
      root.classList.remove("xcur-on");
      drawHalo(-1, -1);
    };
    const onOver = (e: Event) => {
      const el = e.target as HTMLElement;
      const t = el.closest?.(LOCK_SEL) ?? null;
      boxEl = t;
      xcRef.current!.classList.toggle("lock", !!t);
      // hide the coordinate readout unless we're over blank background
      xcRef.current!.classList.toggle("quiet", !!el.closest?.(CONTENT_SEL));
      queue();
    };
    const onScroll = () => {
      if (boxEl) queue();
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      root.classList.remove("has-xcur", "xcur-on");
      window.removeEventListener("themechange", onTheme);
      window.removeEventListener("resize", sizeCanvas);
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <canvas ref={canRef} className="xcur-halo" aria-hidden />
      <div className="grid-glow" aria-hidden />
      <div ref={xcRef} className="xcur" aria-hidden>
        <span ref={hRef} className="xc-h" />
        <span ref={vRef} className="xc-v" />
        <span ref={snapRef} className="xc-snap" />
        <span ref={readRef} className="xc-read" />
        <span ref={boxRef} className="xc-box">
          <i className="b1" />
          <i className="b2" />
          <i className="b3" />
          <i className="b4" />
        </span>
        <span ref={dotRef} className="xc-dot" />
      </div>
    </>
  );
}
