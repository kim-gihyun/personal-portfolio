import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { WorkPreview } from "@/components/home/WorkPreview";
import { Reveal } from "@/components/ui/Reveal";

export default function Home() {
  return (
    <>
      <HomeHero />

      <section className="section shell" id="work">
        <div className="section-head">
          <h2 className="section-title">Selected work</h2>
          <Link href="/portfolio" className="ulink section-link" data-cursor="link">
            All six builds →
          </Link>
        </div>
        <Reveal>
          <WorkPreview />
        </Reveal>
      </section>
    </>
  );
}
