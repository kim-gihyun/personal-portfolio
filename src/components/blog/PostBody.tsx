"use client";

import { Fragment } from "react";
import { ModelViewer } from "@/components/three/ModelViewer";

const MODEL_RE = /<div class="post-model" data-model="([^"]*)" data-rx="([^"]*)"><\/div>/g;

/**
 * Renders post HTML and interleaves live, draggable 3D viewers wherever the
 * markdown embedded a model — split into segments, no imperative mounting.
 */
export function PostBody({ html }: { html: string }) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  MODEL_RE.lastIndex = 0;
  while ((m = MODEL_RE.exec(html)) !== null) {
    const before = html.slice(last, m.index);
    if (before.trim()) {
      nodes.push(<div key={key++} dangerouslySetInnerHTML={{ __html: before }} />);
    }
    const src = m[1];
    const rx = parseFloat(m[2] || "0");
    nodes.push(
      <div key={key++} className="post-model-live">
        <ModelViewer src={src} orient={{ rx }} autoRotate contact />
      </div>,
    );
    last = m.index + m[0].length;
  }
  const tail = html.slice(last);
  if (tail.trim()) {
    nodes.push(<div key={key++} dangerouslySetInnerHTML={{ __html: tail }} />);
  }

  return (
    <div className="post-prose">
      {nodes.map((n, i) => (
        <Fragment key={i}>{n}</Fragment>
      ))}
    </div>
  );
}
