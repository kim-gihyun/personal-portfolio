import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Log",
  description:
    "The engineering log of Gihyun Kim — research progress reports on triboelectric materials, gyroid fabrics, and the TENG glove, plus the occasional note.",
};

const covers: Record<string, string> = {
  "2026-06-12-ra-progress-3": "/assets/blog/ra3-p3-04.png",
  "2026-06-05-ra-progress-2": "/assets/blog/ra2-p2-02.png",
  "2026-05-29-ra-progress-1": "/assets/blog/ra1-p3-03.png",
};

function fmtDate(d: string) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BlogPage() {
  const posts = getAllPosts();
  const [feature, ...rest] = posts;

  return (
    <div className="page blog">
      <PageHeader
        index="05"
        kicker="Engineering log"
        title="The log"
        lede="Short, regular notes from the lab — mostly research progress on triboelectric materials, with live 3D models where they help."
      />

      <section className="shell">
        {/* feature */}
        <Reveal>
          <Link href={`/blog/${feature.slug}/`} className="log-feature" data-cursor="view" data-cursor-label="read">
            <div className="log-feature-media">
              {covers[feature.slug] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={covers[feature.slug]} alt="" loading="lazy" />
              )}
              <span className="log-feature-flag readout">Latest</span>
            </div>
            <div className="log-feature-text">
              <div className="log-meta readout tnum">
                {fmtDate(feature.date)} · {feature.readMins} min
              </div>
              <h2>{feature.title}</h2>
              <p>{feature.excerpt}</p>
              <div className="log-tags">
                {feature.tags.map((t) => (
                  <span key={t} className="log-tag">
                    {t}
                  </span>
                ))}
              </div>
              <span className="ulink log-feature-cta">Read the report →</span>
            </div>
          </Link>
        </Reveal>

        {/* list */}
        <Reveal className="log-list" stagger={0.08}>
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}/`} className="log-row" data-cursor="link">
              <span className="readout tnum log-row-date">{fmtDate(p.date)}</span>
              <span className="log-row-main">
                <b>{p.title}</b>
                <span className="log-row-excerpt">{p.excerpt}</span>
              </span>
              <span className="log-row-tags">
                {p.tags.map((t) => (
                  <span key={t} className="log-tag">
                    {t}
                  </span>
                ))}
              </span>
              <span className="readout log-row-read">{p.readMins}m →</span>
            </Link>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
