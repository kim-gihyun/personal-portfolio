"use client";

import { useEffect, useRef } from "react";

/**
 * "Field scanner" cursor: a soft blueprint dot-aura that follows the pointer and
 * lights up the background (interactive background), plus a precise crosshair
 * reticle that expands over links. Transform-only — GPU-composited, no per-frame
 * repaint or canvas work.
 */
const LINK_SEL =
  'a, button, [data-cursor], [role="button"], input, summary, .hub-link, .pf-index-item, .journey-place, .song, .gallery-thumb, .map-city';

export function Cursor() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-xcur");

    let mx = -400;
    let my = -400;
    let fx = -400;
    let fy = -400;
    let raf = 0;
    let visible = false;

    const loop = () => {
      // reticle tracks precisely; the field trails with a soft ease
      fx += (mx - fx) * 0.16;
      fy += (my - fy) * 0.16;
      if (markRef.current) markRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (fieldRef.current) fieldRef.current.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
      raf = Math.abs(mx - fx) + Math.abs(my - fy) > 0.4 ? requestAnimationFrame(loop) : 0;
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        root.classList.add("xcur-on");
      }
      queue();
    };
    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement).closest?.(LINK_SEL);
      markRef.current?.classList.toggle("is-link", !!t);
    };
    const onLeave = () => root.classList.remove("xcur-on");

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-xcur", "xcur-on");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={fieldRef} className="cursor-field" aria-hidden />
      <div ref={markRef} className="cursor-mark" aria-hidden>
        <span className="cm-h" />
        <span className="cm-v" />
      </div>
    </>
  );
}
