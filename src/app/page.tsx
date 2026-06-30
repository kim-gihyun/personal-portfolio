import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { profile } from "@/lib/data/profile";

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
              <Link href="/portfolio" className="ulink" data-cursor="link">
                See the work →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
