"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ModelViewer } from "@/components/three/ModelViewer";
import { TextReveal } from "@/components/ui/TextReveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { profile } from "@/lib/data/profile";
import { prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // scroll-driven parallax
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = (end: string, scrub: number) => ({
        trigger: el,
        start: "top top",
        end,
        scrub,
      });
      gsap.to(".hero-left", { yPercent: -16, opacity: 0.15, ease: "none", scrollTrigger: st("bottom top", 0.5) });
      gsap.to(".hero-stage", { yPercent: 14, ease: "none", scrollTrigger: st("bottom top", 0.5) });
      gsap.to(".hero-watermark", { yPercent: 32, ease: "none", scrollTrigger: st("bottom top", 1) });
      gsap.fromTo(
        ".hero-eyebrow, .hero-tagline, .hero-facts > div, .hero-cta",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.35 },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  // cursor parallax (safe 2D translate — keeps OrbitControls pointer math intact)
  useEffect(() => {
    const s = stage.current;
    if (!s || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: MouseEvent) => {
      cx = (e.clientX / window.innerWidth - 0.5) * 2;
      cy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      tx += (cx * 14 - tx) * 0.06;
      ty += (cy * 10 - ty) * 0.06;
      s.style.setProperty("--px", `${tx.toFixed(2)}px`);
      s.style.setProperty("--py", `${ty.toFixed(2)}px`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section className="hero" ref={root}>
      <span className="hero-watermark" aria-hidden>
        GK
      </span>

      <div className="hero-grid shell">
        <div className="hero-left">
          <span className="readout hero-eyebrow">Mechanical Engineering · University of Hong Kong</span>
          <h1 className="hero-title">
            <TextReveal as="span" text="Gihyun" className="hero-line" trigger={false} delay={0.15} />
            <TextReveal as="span" text="Kim" className="hero-line" trigger={false} delay={0.28} />
          </h1>
          <p className="hero-tagline">{profile.tagline}</p>

          <div className="hero-facts">
            <div>
              <span className="readout">Programme</span>
              <b>BEng X + MScEng, AI Engineering · Full Scholarship</b>
            </div>
            <div>
              <span className="readout">Research</span>
              <b>Laidlaw Scholar · Shin Group RA</b>
            </div>
            <div>
              <span className="readout">Building</span>
              <b>HKU Robocon · HKU Racing</b>
            </div>
          </div>

          <div className="hero-cta">
            <Magnetic strength={0.4}>
              <Link href="/portfolio" className="btn" data-cursor="link">
                View the work <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Magnetic strength={0.4}>
              <Link href="/cv" className="btn btn--ghost" data-cursor="link">
                Curriculum vitae
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="hero-stage" ref={stage}>
          <div className="hero-stage-inner">
            <ModelViewer
              src="/assets/robot.glb"
              orient={{ rx: 0, ry: 210, zoom: 1.5 }}
              className="hero-canvas"
              label="Robocon competition robot"
            />
          </div>
          <span className="hero-stage-cap readout">Fig. 01 — Robocon robot · drag to rotate</span>
        </div>
      </div>

      <div className="hero-scroll readout" aria-hidden>
        <span>scroll</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
}
