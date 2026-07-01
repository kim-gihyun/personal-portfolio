"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Giant faint "GK" behind every page. On the home it starts beside the hero
 *  and slides to centre as you scroll into the work. */
export function GkBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });

    if (pathname !== "/" || prefersReducedMotion()) {
      gsap.set(el, { x: 0, y: 0, scale: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { x: "24vw", y: "-6vh", scale: 0.82 },
        {
          x: 0,
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: () => window.innerHeight * 0.9, scrub: 0.6 },
        },
      );
    });
    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={ref} className="gk-backdrop" aria-hidden>
      GK
    </div>
  );
}
