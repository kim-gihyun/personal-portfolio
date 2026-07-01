import Link from "next/link";
import { projects } from "@/lib/data/projects";

// Static CAD posters that deep-link into the Work page — light and minimal.
export function WorkPreview() {
  return (
    <div className="work-grid">
      {projects.map((p) => (
        <Link key={p.id} href={`/portfolio#${p.id}`} className="work-card" data-cursor="link">
          <span className="work-card-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.poster} alt={`${p.title} — CAD render`} loading="lazy" />
          </span>
          <span className="work-card-meta">
            <span className="readout">{p.num}</span>
            <b>{p.title}</b>
            <span className="work-card-tag">{p.tag}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
