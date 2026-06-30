"use client";

import { TextReveal } from "@/components/ui/TextReveal";

export function PageHeader({
  index,
  kicker,
  title,
  lede,
}: {
  index: string;
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="page-header shell">
      <div className="page-header-top">
        <span className="readout">Sheet {index} · {kicker}</span>
        <span className="readout page-header-rev">GK-26 · rev D</span>
      </div>
      <TextReveal as="h1" className="page-title" text={title} trigger={false} delay={0.15} />
      {lede && <p className="page-lede measure">{lede}</p>}
      <div className="hairline page-header-rule" />
    </header>
  );
}
