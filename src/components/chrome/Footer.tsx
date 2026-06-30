"use client";

import Link from "next/link";
import { navItems, profile } from "@/lib/data/profile";
import { Magnetic } from "@/components/ui/Magnetic";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-cta">
          <p className="readout">{profile.status}</p>
          <Magnetic strength={0.2}>
            <a className="footer-mail" href={`mailto:${profile.email}`} data-cursor="link">
              {profile.email}
            </a>
          </Magnetic>
        </div>

        <div className="hairline" />

        <div className="footer-grid">
          <div className="footer-col">
            <span className="readout">Sitemap</span>
            <ul>
              {navItems.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="ulink" data-cursor="link">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <span className="readout">Elsewhere</span>
            <ul>
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener" className="ulink" data-cursor="link">
                    {s.label} ↗
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.cvPdf} target="_blank" rel="noopener" className="ulink" data-cursor="link">
                  CV (PDF) ↗
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-block">
            <span className="readout">Title block</span>
            <div className="footer-tb">
              <div><i>Drawn by</i><b>G. KIM</b></div>
              <div><i>Dwg no.</i><b>GK-26</b></div>
              <div><i>Rev</i><b>D</b></div>
              <div><i>Date</i><b>JUN 2026</b></div>
            </div>
          </div>
        </div>

        <div className="footer-base">
          <span className="readout">© {year} Gihyun Kim — all sheets</span>
          <span className="readout">{profile.location} · 22.28°N 114.17°E</span>
        </div>
      </div>
    </footer>
  );
}
