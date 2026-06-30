import type { Metadata } from "next";
import { CVTimeline } from "@/components/cv/CVTimeline";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Profile / CV",
  description:
    "Curriculum vitae of Gihyun Kim — education at HKU, research with the Shin Group and Laidlaw Programme, leadership, and a fabrication-and-code toolkit, as an interactive timeline.",
};

export default function CVPage() {
  return (
    <div className="page">
      <PageHeader
        index="02"
        kicker="Data sheet"
        title="Profile"
        lede="BEng X + MScEng (AI Engineering) at the University of Hong Kong, on full scholarship. Education, research, and leadership — scrolled as a single thread."
      />
      <section className="shell">
        <CVTimeline />
      </section>
    </div>
  );
}
