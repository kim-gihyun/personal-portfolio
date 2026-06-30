"use client";

import { createElement, useEffect, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Masked, word-by-word reveal for headlines. Renders the full text in markup
 * (so it's selectable + crawlable + visible without JS); GSAP splits and lifts
 * each word from behind a clip on the client.
 */
export function TextReveal({
  text,
  as,
  className,
  start = "top 88%",
  delay = 0,
  trigger = true,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  start?: string;
  delay?: number;
  /** false = play on mount (heroes); true = on scroll */
  trigger?: boolean;
}) {
  const Tag = (as ?? "h2") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const words = text.split(" ");
    el.innerHTML = words
      .map((w) => `<span class="tr-word"><span class="tr-inner">${w}</span></span>`)
      .join(" ");

    const inners = el.querySelectorAll<HTMLElement>(".tr-inner");
    let safety: ReturnType<typeof setTimeout>;
    let onVis: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const animate = () => {
        gsap.fromTo(
          inners,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.06,
            delay,
            scrollTrigger: trigger ? { trigger: el, start, once: true } : undefined,
            onComplete: () => clearTimeout(safety),
          },
        );
      };

      // play-on-mount heroes: never hide if the tab can't paint (headless / bg tab)
      if (!trigger && document.visibilityState !== "visible") {
        gsap.set(inners, { yPercent: 0 });
        onVis = () => {
          if (document.visibilityState === "visible") {
            animate();
            document.removeEventListener("visibilitychange", onVis!);
          }
        };
        document.addEventListener("visibilitychange", onVis);
      } else {
        animate();
      }

      // hard safety: words are visible no matter what within 1.6s
      safety = setTimeout(() => gsap.set(inners, { yPercent: 0 }), 1600);
    }, el);

    return () => {
      clearTimeout(safety);
      if (onVis) document.removeEventListener("visibilitychange", onVis);
      ctx.revert();
    };
  }, [text, start, delay, trigger]);

  return createElement(Tag, { ref, className }, text);
}
