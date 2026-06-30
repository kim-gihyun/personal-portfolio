"use client";

import { ModelViewer } from "@/components/three/ModelViewer";
import type { Project } from "@/lib/data/projects";

// The Work page is where the CAD lives — every project is an interactive 3D
// model. Only one is mounted at a time (the active sheet), so it stays light.
export function ActiveViewer({ project }: { project: Project }) {
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
