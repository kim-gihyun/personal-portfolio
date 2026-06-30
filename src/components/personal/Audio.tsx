"use client";

import { audioHero, audioGear, type Glyph } from "@/lib/data/offduty";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function DeviceGlyph({ type }: { type: Glyph }) {
  if (type === "overear")
    return (
      <svg viewBox="0 0 100 80" className="gear-glyph" aria-hidden>
        <path {...stroke} d="M14 52 V44 a36 30 0 0 1 72 0 V52" />
        <rect {...stroke} x="7" y="46" width="18" height="30" rx="7" />
        <rect {...stroke} x="75" y="46" width="18" height="30" rx="7" />
      </svg>
    );
  if (type === "iem")
    return (
      <svg viewBox="0 0 100 80" className="gear-glyph" aria-hidden>
        <path {...stroke} d="M50 16 a26 24 0 1 0 4 46 q14 3 20 -11 q6 -17 -7 -29 q-9 -8 -17 -6Z" />
        <path {...stroke} d="M62 30 l20 -9" />
        <path {...stroke} d="M38 60 q2 13 16 17" />
      </svg>
    );
  if (type === "earbud")
    return (
      <svg viewBox="0 0 100 80" className="gear-glyph" aria-hidden>
        <circle {...stroke} cx="44" cy="38" r="21" />
        <circle {...stroke} cx="44" cy="38" r="7" />
        <path {...stroke} d="M60 50 q11 8 15 22" />
      </svg>
    );
  // stembud (AirPods)
  return (
    <svg viewBox="0 0 100 80" className="gear-glyph" aria-hidden>
      <circle {...stroke} cx="42" cy="30" r="16" />
      <path {...stroke} d="M49 42 q5 16 3 28 a6 6 0 0 1 -13 0 q-2 -12 1 -22" />
    </svg>
  );
}

export function Audio() {
  const rest = audioGear.filter((g) => g.tag !== "daily driver");

  return (
    <div className="gear">
      <div className="gear-hero">
        <div className="gear-hero-art" aria-hidden>
          <DeviceGlyph type="iem" />
        </div>
        <div className="gear-hero-text">
          <span className="readout">The daily driver</span>
          <h3>
            {audioHero.name} <span className="gear-rev">{audioHero.rev}</span>
          </h3>
          <p className="gear-oneliner">{audioHero.oneLiner}</p>
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

      <div className="gear-grid">
        {rest.map((g) => (
          <article key={g.name} className={`gear-card ${g.status ? "is-lost" : ""}`}>
            <div className="gear-card-art" aria-hidden>
              <DeviceGlyph type={g.glyph} />
            </div>
            <span className="readout">{g.type}</span>
            <h4>{g.name}</h4>
            <p>{g.note}</p>
            {g.status && <span className="gear-status readout">{g.status}</span>}
          </article>
        ))}
      </div>
    </div>
  );
}
