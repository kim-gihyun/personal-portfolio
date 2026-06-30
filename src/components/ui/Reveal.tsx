"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  delay?: number;
  /** animate direct children with a stagger instead of the container */
  stagger?: number;
  start?: string;
};

/**
 * GSAP scroll reveal. The hidden state is set in JS, so server / no-JS /
 * headless renders always ship fully visible — the animation only enhances.
 */
export function Reveal({
  children,
  as,
  className,
  y = 26,
  delay = 0,
  stagger,
  start = "top 85%",
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets = stagger ? Array.from(el.children) : [el];
    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: "expo.out",
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger, start]);

  return createElement(Tag, { ref, className }, children);
}
