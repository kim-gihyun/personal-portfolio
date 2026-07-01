"use client";

import { useEffect, useRef } from "react";

/**
 * Drafting cursor: full-screen crosshair guides, a live X/Y coordinate readout,
 * a grid-snap marker, and corner brackets that lock onto interactive elements.
 * DOM-transform based (updates only on mousemove) — light, no canvas.
 */
const GRID = 28;
const LOCK_SEL =
  'a, button, [data-cursor], [role="button"], input, summary, .hub-link, .pf-index-item, .journey-place, .song, .gallery-thumb, .map-city, .work-card, .mm-node';
const CONTENT_SEL =
  "a,button,input,summary,p,h1,h2,h3,h4,h5,h6,li,b,strong,em,i,code,dt,dd,img,svg,figure,figcaption,article,table,blockquote,pre,label,span:not(.xc-h):not(.xc-v):not(.xc-dot):not(.xc-snap):not(.xc-read),.spec-card,.pf-stage,.journey-map,.journey-card,.keeb-hero,.work-card";

export function Cursor() {
  const hRef = useRef<HTMLSpanElement>(null);
  const vRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const snapRef = useRef<HTMLSpanElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const xcRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-xcur");

    let mx = -300;
    let my = -300;
    let ticking = false;
    let boxEl: Element | null = null;

    const paint = () => {
      ticking = false;
      hRef.current!.style.transform = `translateY(${my}px)`;
      vRef.current!.style.transform = `translateX(${mx}px)`;
      dotRef.current!.style.transform = `translate(${mx}px,${my}px)`;
      fieldRef.current!.style.transform = `translate(${mx}px,${my}px)`;
      const gx = Math.round((mx + 1) / GRID) * GRID - 1;
      const gy = Math.round((my + 1) / GRID) * GRID - 1;
      snapRef.current!.style.transform = `translate(${gx}px,${gy}px)`;
      readRef.current!.style.transform = `translate(${mx + 16}px,${my + 18}px)`;
      readRef.current!.textContent =
        "X " + String(Math.max(0, Math.round(mx))).padStart(4, "0") +
        "  Y " + String(Math.max(0, Math.round(my))).padStart(4, "0");
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
    const onLeave = () => root.classList.remove("xcur-on");
    const onOver = (e: Event) => {
      const el = e.target as HTMLElement;
      const t = el.closest?.(LOCK_SEL) ?? null;
      boxEl = t;
      xcRef.current!.classList.toggle("lock", !!t);
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
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* blueprint dot-aura that reveals around the cursor (z-index:-1 background) */}
      <span ref={fieldRef} className="cursor-field" aria-hidden />
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
