import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { pageOg } from "@/lib/og";

const description =
  "Gihyun Kim grew up across Seoul, London, and Istanbul, and now studies Mechanical Engineering at the University of Hong Kong — robotics, materials research, and applied AI.";

export const metadata: Metadata = {
  title: "About",
  description,
  ...pageOg("About", description, "/about/"),
};

// Body copy below is Gihyun's own, carried over from his original site.
// The math/matter framing is a light draft — edit the two cards in your voice.
export default function AboutPage() {
  return (
    <div className="page about">
      <PageHeader
        index="03"
        kicker="General notes"
        title="About"
        lede="How a kid who moved every few years ended up designing, machining, and assembling parts that have to survive competition."
      />

      <section className="shell about-lead">
        <div className="about-lead-text">
          <TextReveal
            as="h2"
            className="about-statement"
            text="The moment a part finally fits is still my favourite part of engineering."
          />
          <Reveal className="about-lead-cols" stagger={0.12}>
            <p>
              I&rsquo;m an engineering student at the <strong>University of Hong Kong</strong>, majoring in
              Mechanical Engineering and pursuing the BEng X + MScEng in AI Engineering on a full scholarship.
              I grew up in South Korea, spent five and a half years between London and Istanbul, and now live
              between Hong Kong and Seoul.
            </p>
            <p>
              As a <strong>Laidlaw Scholar</strong>, I&rsquo;m researching UAV-based analysis of urban
              atmospheric turbulence, and in Prof. Dong-Myeong Shin&rsquo;s lab I work on 3D-printed
              triboelectric nanogenerators for wearable sensing. Outside research, I build real hardware with
              the <strong>HKU Robocon</strong> and <strong>HKU Racing</strong> teams — designing, machining,
              and assembling parts that have to survive competition.
            </p>
          </Reveal>
        </div>
        <figure className="about-portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/profile.jpg" alt="Gihyun Kim at Victoria Harbour, Hong Kong" loading="lazy" />
          <figcaption className="readout">Fig. 1 — Victoria Harbour, HK · 2026</figcaption>
        </figure>
      </section>

      {/* pull quote — his words */}
      <section className="shell about-quote">
        <Reveal>
          <blockquote>
            <span className="about-quote-mark" aria-hidden>
              &ldquo;
            </span>
            An idea becomes a CAD model, the model becomes a printed or machined part, and the part becomes
            something that actually moves.
          </blockquote>
        </Reveal>
      </section>

      {/* now */}
      <section className="shell about-now">
        <Reveal className="about-facts" stagger={0.08}>
          <div className="about-fact">
            <span className="readout">Based in</span>
            <b>Hong Kong / Seoul</b>
          </div>
          <div className="about-fact">
            <span className="readout">Majoring</span>
            <b>Mechanical Engineering</b>
          </div>
          <div className="about-fact">
            <span className="readout">Focus</span>
            <b>Robotics · materials research · applied AI</b>
          </div>
          <div className="about-fact">
            <span className="readout">Also</span>
            <b>Founds study clubs · TAs physics &amp; math</b>
          </div>
        </Reveal>
        <Reveal className="about-cta">
          <p>This site is organised like a drawing set — a data sheet, the project drawings, and a log.</p>
          <div className="about-cta-links">
            <Link href="/portfolio" className="btn" data-cursor="link">
              See the work →
            </Link>
            <Link href="/cv" className="btn btn--ghost" data-cursor="link">
              Read the CV
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
