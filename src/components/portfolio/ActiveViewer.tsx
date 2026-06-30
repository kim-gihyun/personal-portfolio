"use client";

import { ModelViewer } from "@/components/three/ModelViewer";
import type { Project } from "@/lib/data/projects";

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
