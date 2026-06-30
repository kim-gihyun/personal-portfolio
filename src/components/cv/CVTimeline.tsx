"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cvGroups, skillGroups, cvMeta } from "@/lib/data/cv";
import { prefersReducedMotion } from "@/lib/theme";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function CVTimeline() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const rail = el.querySelector<HTMLElement>(".cv-rail-fill");
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.querySelector(".cv-track"),
              start: "top 60%",
              end: "bottom 80%",
              scrub: 0.6,
            },
          },
        );
      }
      el.querySelectorAll<HTMLElement>(".cv-entry").forEach((entry) => {
        gsap.from(entry, {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: entry, start: "top 86%", once: true },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="cv" ref={root}>
      <div className="cv-track">
        <div className="cv-rail" aria-hidden>
          <span className="cv-rail-fill" />
        </div>

        <div className="cv-groups">
          {cvGroups.map((group) => (
            <section className="cv-group" key={group.id} aria-label={group.label}>
              <header className="cv-group-head">
                <span className="readout tnum">{group.num}</span>
                <h2>{group.label}</h2>
              </header>

              {group.entries.map((e, i) => (
                <article className={`cv-entry ${e.highlight ? "is-key" : ""}`} key={`${group.id}-${i}`}>
                  <span className="cv-dot" aria-hidden />
                  <div className="cv-when readout tnum">{e.when}</div>
                  <div className="cv-what">
                    <div className="cv-what-head">
                      {e.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={e.logo} alt="" className="cv-logo" loading="lazy" />
                      )}
                      <div>
                        <h3>{e.title}</h3>
                        <div className="cv-org">
                          {e.org}
                          {e.location ? <span className="cv-loc"> · {e.location}</span> : null}
                        </div>
                      </div>
                    </div>
                    <ul className="cv-notes">
                      {e.notes.map((n, j) => (
                        <li key={j}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>
      </div>

      <section className="cv-skills">
        <header className="cv-group-head">
          <span className="readout tnum">04</span>
          <h2>Toolkit</h2>
        </header>
        <div className="cv-skill-grid">
          {skillGroups.map((s) => (
            <div className="cv-skill-col" key={s.label}>
              <span className="readout">{s.label}</span>
              <ul>
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a className="btn cv-download" href={cvMeta.pdf} target="_blank" rel="noopener" data-cursor="link">
          Download full CV — PDF
        </a>
      </section>
    </div>
  );
}
