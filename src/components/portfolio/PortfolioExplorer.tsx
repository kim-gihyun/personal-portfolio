"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ActiveViewer } from "./ActiveViewer";
import { Gallery } from "@/components/ui/Gallery";
import { projects, projectFilters } from "@/lib/data/projects";

export function PortfolioExplorer() {
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(projects[0].id);

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter],
  );

  // keep active valid within the current filter
  const active = useMemo(() => {
    const inList = filtered.find((p) => p.id === activeId);
    return inList ?? filtered[0] ?? projects[0];
  }, [filtered, activeId]);

  return (
    <div className="pf">
      {/* filters */}
      <div className="pf-filters" role="group" aria-label="Filter work">
        {projectFilters.map((f) => {
          const count =
            f.id === "all" ? projects.length : projects.filter((p) => p.categories.includes(f.id)).length;
          return (
            <button
              key={f.id}
              type="button"
              className={`pf-filter ${filter === f.id ? "is-active" : ""}`}
              onClick={() => setFilter(f.id)}
              data-cursor="link"
            >
              {f.label}
              <i className="readout tnum">{count}</i>
            </button>
          );
        })}
      </div>

      <div className="pf-main">
        {/* sticky stage with floating cards */}
        <div className="pf-stage-wrap">
          <div className="pf-stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className="pf-stage-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <ActiveViewer project={active} />
              </motion.div>
            </AnimatePresence>

            {/* floating: identity */}
            <motion.div
              key={`id-${active.id}`}
              className="pf-float pf-float--id"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="readout">{active.num} · {active.year}</span>
              <h3>{active.title}</h3>
              <span className="pf-float-tag">{active.tag}</span>
            </motion.div>

            {/* floating: specs */}
            <motion.div
              key={`sp-${active.id}`}
              className="pf-float pf-float--spec"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="readout">Specification</span>
              <dl>
                {active.specs.map((s) => (
                  <div key={s.k}>
                    <dt>{s.k}</dt>
                    <dd>{s.v}</dd>
                  </div>
                ))}
              </dl>
              {active.stl && (
                <a className="pf-stl ulink" href={active.stl} download data-cursor="link">
                  ↓ STL
                </a>
              )}
            </motion.div>
          </div>
        </div>

        {/* detail */}
        <div className="pf-detail">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pf-detail-meta">
                <div><span className="readout">Role</span><b>{active.role}</b></div>
                <div><span className="readout">Status</span><b>{active.status}</b></div>
              </div>

              <p className="pf-lead">{active.blurb}</p>

              <div className="pf-body">
                {active.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="pf-context">
                <span className="readout">Engineering context</span>
                <div className="pf-context-grid">
                  {active.context.map((c) => (
                    <div key={c.title} className="pf-context-card">
                      <h4>{c.title}</h4>
                      <p>{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pf-revs">
                <span className="readout">Revision history</span>
                <ol>
                  {active.revs.map((r) => (
                    <li key={r.rev}>
                      <span className="pf-rev-tag">REV {r.rev}</span>
                      <span className="pf-rev-note">{r.note}</span>
                      <span className="readout tnum">{r.year}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {active.gallery.length > 0 && (
                <div className="pf-gallery-wrap">
                  <span className="readout">Plates</span>
                  <Gallery images={active.gallery} className="pf-gallery" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* index */}
      <div className="pf-index">
        <span className="readout pf-index-label">Drawing index — {filtered.length} sheets</span>
        <div className="pf-index-list">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pf-index-item ${active.id === p.id ? "is-active" : ""}`}
              onClick={() => setActiveId(p.id)}
              data-cursor="link"
            >
              <span className="readout pf-index-num">{p.num}</span>
              <span className="pf-index-title">{p.title}</span>
              <span className="pf-index-tag">{p.tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
