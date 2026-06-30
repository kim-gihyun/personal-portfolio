"use client";

import Link from "next/link";
import { ModelViewer } from "@/components/three/ModelViewer";
import { Magnetic } from "@/components/ui/Magnetic";
import { projects } from "@/lib/data/projects";

export function WorkPreview() {
  const hero = projects.find((p) => p.id === "robocon-robot")!;
  const rest = projects.filter((p) => ["trolley", "solar-tracker", "tensile-tester"].includes(p.id));

  return (
    <div className="work-preview">
      <div className="wp-showpiece">
        <div className="wp-stage">
          <ModelViewer src={hero.model} orient={hero.orient} className="wp-canvas" />
          <span className="wp-stage-id readout">{hero.num} · {hero.tag}</span>
        </div>

        <aside className="wp-cards">
          <article className="spec-card spec-card--lift">
            <span className="readout">{hero.num}</span>
            <h3>{hero.title}</h3>
            <p>{hero.blurb}</p>
            <Magnetic strength={0.3}>
              <Link href="/portfolio" className="ulink wp-open" data-cursor="link">
                Open full sheet →
              </Link>
            </Magnetic>
          </article>
          <article className="spec-card spec-card--specs">
            <span className="readout">Specifications</span>
            <dl>
              {hero.specs.map((s) => (
                <div key={s.k}>
                  <dt>{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
          </article>
        </aside>
      </div>

      <div className="wp-rest">
        {rest.map((p) => (
          <Link key={p.id} href="/portfolio" className="wp-thumb" data-cursor="link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.poster} alt={p.title} loading="lazy" />
            <div className="wp-thumb-meta">
              <span className="readout">{p.num}</span>
              <b>{p.title}</b>
              <span className="wp-thumb-tag">{p.tag}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
