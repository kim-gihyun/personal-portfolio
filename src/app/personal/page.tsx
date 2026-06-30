import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { JourneyMap } from "@/components/personal/JourneyMap";
import { Keyboards } from "@/components/personal/Keyboards";
import { Gallery } from "@/components/ui/Gallery";
import { songs, photos } from "@/lib/data/offduty";

export const metadata: Metadata = {
  title: "Personal",
  description:
    "Off the clock — a map of where Gihyun Kim has lived and travelled, mechanical keyboards, songs on repeat, and life in photographs.",
};

export default function PersonalPage() {
  return (
    <div className="page personal">
      <PageHeader
        index="04"
        kicker="Off the clock"
        title="Personal"
        lede="Where I've lived and travelled, the keyboards I keep tuning, what I'm listening to, and a few photos worth keeping."
      />

      {/* journey map */}
      <section className="section shell">
        <div className="section-head">
          <h2 className="section-title">The route so far</h2>
          <span className="section-note readout">hover a pin</span>
        </div>
        <JourneyMap />
      </section>

      {/* keyboards */}
      <section className="section shell" id="keebs">
        <div className="section-head">
          <h2 className="section-title">Mechanical keyboards</h2>
        </div>
        {/* TODO(Gihyun): make this yours — a line or two in your own voice. */}
        <p className="section-note measure">
          A small obsession on the side: ergonomics first, then sound. A quick tour of mounts and the
          board I keep coming back to.
        </p>
        <Reveal>
          <Keyboards />
        </Reveal>
      </section>

      {/* songs */}
      <section className="section shell">
        <div className="section-head">
          <h2 className="section-title">On repeat</h2>
          <span className="section-note readout">the build playlist · {songs.length} tracks</span>
        </div>
        <Reveal className="song-list" stagger={0.06}>
          {songs.map((s) => (
            <a key={s.title} className="song" href={s.href} target="_blank" rel="noopener" data-cursor="link">
              <span className="song-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.cover} alt={`${s.title} cover`} loading="lazy" />
              </span>
              <span className="song-text">
                <b>{s.title}</b>
                <span className="song-artist">{s.artist}</span>
              </span>
              <span className="song-play" aria-hidden>
                ▶
              </span>
            </a>
          ))}
        </Reveal>
      </section>

      {/* photos */}
      <section className="section shell">
        <div className="section-head">
          <h2 className="section-title">Daily life, dated</h2>
          <span className="section-note readout">10 plates · 2019—2026</span>
        </div>
        <Reveal>
          <Gallery
            images={photos.map((p) => ({ src: p.src, alt: `${p.caption} · ${p.year}` }))}
            className="photo-gallery"
          />
        </Reveal>
      </section>
    </div>
  );
}
