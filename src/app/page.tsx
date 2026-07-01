import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { Mindmap } from "@/components/home/Mindmap";

export default function Home() {
  return (
    <>
      <HomeHero />

      <section className="section shell" id="map">
        <div className="section-head">
          <div className="section-head-lead">
            <span className="readout">Assembly diagram</span>
            <h2 className="section-title">How it all connects</h2>
          </div>
          <Link href="/portfolio" className="ulink section-link" data-cursor="link">
            Straight to the work →
          </Link>
        </div>
        <Mindmap />
      </section>
    </>
  );
}
