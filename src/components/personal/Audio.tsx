"use client";

import { audioHero, audioGear } from "@/lib/data/offduty";
import { IE600 } from "./IE600";

export function Audio() {
  const rest = audioGear.filter((g) => g.tag !== "daily driver");

  return (
    <div className="gear">
      <div className="gear-feature">
        <div className="gear-feature-art">
          <IE600 />
        </div>
        <div className="gear-feature-text">
          <span className="readout">The daily driver</span>
          <h3>
            {audioHero.name} <span className="gear-rev">{audioHero.rev}</span>
          </h3>
          <p className="gear-verdict">{audioHero.verdict}</p>
          <dl className="gear-specs">
            {audioHero.specs.map((s) => (
              <div key={s.k}>
                <dt>{s.k}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <ul className="gear-list">
        {rest.map((g) => (
          <li key={g.name} className={`gear-line ${g.status ? "is-lost" : ""}`}>
            <span className="readout gear-line-type">{g.type}</span>
            <b className="gear-line-name">{g.name}</b>
            <span className="gear-line-note">
              {g.note}
              {g.status ? ` · ${g.status}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
