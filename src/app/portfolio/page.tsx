import type { Metadata } from "next";
import { PortfolioExplorer } from "@/components/portfolio/PortfolioExplorer";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Six engineering builds by Gihyun Kim — interactive 3D models with material context and revision histories: a Robocon robot, laundry sensor, transport trolley, solar tracker, and C-TPU test rigs.",
};

export default function PortfolioPage() {
  return (
    <div className="page">
      <PageHeader
        index="01"
        kicker="Drawing index"
        title="The work"
        lede="Six builds — drawn, machined, printed, and assembled. Drag any model to rotate it, scroll to zoom, and switch sheets from the index. Each carries the engineering context and the revisions it took to get there."
      />
      <section className="shell">
        <PortfolioExplorer />
      </section>
    </div>
  );
}
