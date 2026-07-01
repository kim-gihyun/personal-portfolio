"use client";

import Link from "next/link";
import { ModelViewer } from "@/components/three/ModelViewer";
import { profile } from "@/lib/data/profile";

export function HomeHero() {
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

          <div className="home-cta">
            <Link href="/portfolio" className="btn" data-cursor="link">
              View the work <span aria-hidden>→</span>
            </Link>
            <Link href="/cv" className="btn btn--ghost" data-cursor="link">
              CV
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

      <div className="home-scroll readout" aria-hidden>
        <span>scroll</span>
        <span className="home-scroll-line" />
      </div>
    </section>
  );
}
