"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ModelViewer } from "@/components/three/ModelViewer";
import { profile } from "@/lib/data/profile";

interface LenisLike {
  stop?: () => void;
  start?: () => void;
}

export function HomeHero() {
  // single, unscrollable screen — lock the page and hide the footer while here
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("home-locked");
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    lenis?.stop?.();
    return () => {
      root.classList.remove("home-locked");
      lenis?.start?.();
    };
  }, []);

  return (
    <section className="home">
      <div className="home-grid shell">
        <div className="home-text">
          <span className="readout home-eyebrow">DWG GK-26 · General arrangement</span>
          <h1 className="home-name">
            Gihyun <span className="home-accent">Kim</span>
          </h1>
          <p className="home-tagline">
            Drafting ideas. Building <em>reality</em>.
          </p>
          <p className="home-sub">Mechanical Engineering · University of Hong Kong</p>

          <div className="home-cta">
            <Link href="/portfolio" className="btn" data-cursor="link">
              View the work <span aria-hidden>→</span>
            </Link>
            <Link href="/cv" className="btn btn--ghost" data-cursor="link">
              Curriculum vitae
            </Link>
          </div>

          <nav className="home-quick readout" aria-label="Quick links">
            <Link href="/about" className="ulink" data-cursor="link">About</Link>
            <a href={`mailto:${profile.email}`} className="ulink" data-cursor="link">Email</a>
            <a href="https://www.linkedin.com/in/gihyun-kim" target="_blank" rel="noopener" className="ulink" data-cursor="link">
              LinkedIn
            </a>
          </nav>
        </div>

        <div className="home-model">
          <div className="home-model-stage">
            <ModelViewer
              src="/assets/robot.glb"
              orient={{ rx: 0, ry: 210, zoom: 1.5 }}
              className="home-canvas"
              label="Robocon competition robot"
              hint={false}
            />
          </div>
          <span className="home-model-cap readout">Fig. 01 · Robocon robot · drag to rotate</span>
        </div>
      </div>
    </section>
  );
}
