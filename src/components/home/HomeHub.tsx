"use client";

import Link from "next/link";
import { useEffect } from "react";
import { profile } from "@/lib/data/profile";

type Hub = { index: string; label: string; href: string; desc: string };
const HUB: Hub[] = [
  { index: "01", label: "Work", href: "/portfolio", desc: "Engineering builds, in 3D" },
  { index: "02", label: "CV", href: "/cv", desc: "Education · research · leadership" },
  { index: "03", label: "About", href: "/about", desc: "How I got here" },
  { index: "04", label: "Personal", href: "/personal", desc: "Map · music · gear" },
  { index: "05", label: "Log", href: "/blog", desc: "Notes from the lab" },
];

interface LenisLike {
  stop?: () => void;
  start?: () => void;
}

export function HomeHub() {
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
    <section className="hub">
      <div className="hub-inner shell">
        <header className="hub-head">
          <span className="readout">DWG GK-26 · General arrangement</span>
          <h1 className="hub-name">
            Gihyun <span className="hub-accent">Kim</span>
          </h1>
          <p className="hub-tagline">
            Drafting ideas. Building <em>reality</em>.
          </p>
        </header>

        <nav className="hub-nav" aria-label="Sections">
          {HUB.map((s) => (
            <Link key={s.href} href={s.href} className="hub-link" data-cursor="link">
              <span className="readout hub-link-idx tnum">{s.index}</span>
              <span className="hub-link-name">{s.label}</span>
              <span className="hub-link-desc">{s.desc}</span>
              <span className="hub-link-arrow" aria-hidden>
                →
              </span>
            </Link>
          ))}
        </nav>

        <footer className="hub-foot readout">
          <span>{profile.location} · Mechanical Engineering, HKU</span>
          <span className="hub-foot-links">
            <a href={`mailto:${profile.email}`} className="ulink" data-cursor="link">
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/gihyun-kim"
              target="_blank"
              rel="noopener"
              className="ulink"
              data-cursor="link"
            >
              LinkedIn
            </a>
          </span>
        </footer>
      </div>
    </section>
  );
}
