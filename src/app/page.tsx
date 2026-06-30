import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { WorkPreview } from "@/components/home/WorkPreview";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { focusAreas, profile } from "@/lib/data/profile";

export default function Home() {
  return (
    <>
      <HomeHero />

      <Marquee
        items={[
          "GK-26 · 2026",
          "22.28°N 114.17°E",
          "MATLAB · SolidWorks · Arduino",
          "Laidlaw Scholar",
          "CGPA 3.68 / 4.3",
          "Σ builds = 06",
          "PETG · FDM · waterjet",
        ]}
      />

      {/* intro / thesis */}
      <section className="section shell" id="intro">
        <div className="intro-grid">
          <Reveal className="intro-kicker">
            <span className="readout">General notes</span>
          </Reveal>
          <div className="intro-body">
            <TextReveal
              as="h2"
              className="intro-statement"
              text="The work I like best is where mechanical design, electronics, and software meet."
            />
            <Reveal className="intro-meta-row" stagger={0.1}>
              <div>
                <span className="readout">Based</span>
                <b>{profile.location}</b>
              </div>
              <div>
                <span className="readout">Reading</span>
                <b>Linear algebra · complex analysis</b>
              </div>
              <div>
                <span className="readout">Building</span>
                <b>TENG glove · Robocon</b>
              </div>
              <Link href="/about" className="ulink" data-cursor="link">
                More about me →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* selected work */}
      <section className="section shell" id="work">
        <div className="section-head">
          <div className="section-head-lead">
            <span className="readout">Fig. 02 · six builds · live</span>
            <h2 className="section-title">Selected work</h2>
          </div>
          <Link href="/portfolio" className="ulink section-link" data-cursor="link">
            All six builds →
          </Link>
        </div>
        <p className="section-note measure">
          Drag a model to rotate it; scroll to zoom. Each build carries its revision history and the
          engineering context behind it.
        </p>
        <Reveal>
          <WorkPreview />
        </Reveal>
      </section>

      {/* focus areas */}
      <section className="section shell" id="focus">
        <div className="section-head">
          <div className="section-head-lead">
            <span className="readout">Fig. 03 · field allocation</span>
            <h2 className="section-title">Where my time goes</h2>
          </div>
        </div>
        <Reveal className="focus-list" stagger={0.08}>
          {focusAreas.map((f, i) => (
            <div className="focus-row" key={f.label}>
              <span className="readout focus-idx tnum">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="focus-label">{f.label}</h3>
              <span className="focus-tag">{f.tag}</span>
            </div>
          ))}
        </Reveal>
      </section>
    </>
  );
}
