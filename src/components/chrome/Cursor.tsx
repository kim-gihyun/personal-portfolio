"use client";

import { useEffect, useRef } from "react";

/**
 * Bespoke cursor: a precise center reticle + a trailing ring that morphs by
 * context. Elements opt in with `data-cursor="link|view|drag|none"` and an
 * optional `data-cursor-label`. Pointer-fine only; never shown on touch.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    const r = ring.current!;
    const d = dot.current!;
    const lb = label.current!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        r.style.opacity = "1";
        d.style.opacity = "1";
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const setState = (state: string, text?: string) => {
      r.dataset.state = state;
      if (text) {
        lb.textContent = text;
        r.dataset.hasLabel = "1";
      } else {
        r.dataset.hasLabel = "0";
      }
    };

    const onOver = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      if (!el) {
        setState("default");
        return;
      }
      const kind = el.getAttribute("data-cursor") ?? (el.tagName === "A" || el.tagName === "BUTTON" ? "link" : "default");
      const text = el.getAttribute("data-cursor-label") ?? undefined;
      setState(kind, text);
    };

    const onDown = () => (r.dataset.down = "1");
    const onUp = () => (r.dataset.down = "0");
    const onLeave = () => {
      r.style.opacity = "0";
      d.style.opacity = "0";
      visible = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div className="cursor-root" aria-hidden>
      <div ref={ring} className="cursor-ring" data-state="default">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
