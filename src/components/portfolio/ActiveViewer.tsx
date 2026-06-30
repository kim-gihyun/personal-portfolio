"use client";

import { ModelViewer } from "@/components/three/ModelViewer";
import type { Project } from "@/lib/data/projects";

// Only the Robocon robot stays as a live, interactive 3D model — every other
// project shows a static CAD render so the page stays fast (one WebGL context max).
export function ActiveViewer({ project }: { project: Project }) {
  if (project.id === "robocon-robot") {
    return (
      <ModelViewer
        key={project.id}
        src={project.model}
        orient={project.orient}
        className="pf-canvas"
        label={project.title}
      />
    );
  }
  return (
    <div className="pf-canvas pf-static">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={project.poster} alt={`${project.title} — CAD render`} />
      <span className="model-hint readout" aria-hidden>
        CAD render
      </span>
    </div>
  );
}
