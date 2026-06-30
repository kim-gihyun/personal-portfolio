export type CVEntry = {
  when: string;
  start: string; // sortable
  title: string;
  org: string;
  location?: string;
  logo?: string;
  notes: string[];
  highlight?: boolean;
};

export type CVGroup = { id: string; num: string; label: string; entries: CVEntry[] };

export const cvGroups: CVGroup[] = [
  {
    id: "education",
    num: "01",
    label: "Education",
    entries: [
      {
        when: "2025 — 2029",
        start: "2025-09",
        title: "University of Hong Kong",
        org: "BEng X + MScEng in AI Engineering · Full Scholarship",
        location: "Hong Kong",
        logo: "/assets/hku-eng.png",
        highlight: true,
        notes: ["CGPA 3.68 / 4.3 — First Class Honours.", "Mechanical Engineering major; integrated master's in AI Engineering."],
      },
      {
        when: "2022 — 2025",
        start: "2022-08",
        title: "Cheongna Dalton School",
        org: "High School Diploma",
        location: "Incheon, South Korea",
        logo: "/assets/cds%20logo.png",
        notes: ["AP: 11 exams, all 5/5.", "SAT 1520 · TOEFL 120/120."],
      },
    ],
  },
  {
    id: "research",
    num: "02",
    label: "Research & Experience",
    entries: [
      {
        when: "Apr 2026 — Present",
        start: "2026-04",
        title: "Laidlaw Scholar",
        org: "HKU Laidlaw Leadership & Research Programme",
        logo: "/assets/laidlaw.png",
        highlight: true,
        notes: [
          "One of 25 Laidlaw Scholars at HKU; faculty-supervised research on UAV-based analysis of urban atmospheric turbulence under Prof. Chun-Ho Liu.",
          "Experimental planning, environmental sensing, and data-driven engineering investigation.",
        ],
      },
      {
        when: "Mar 2026 — Present",
        start: "2026-03",
        title: "Undergraduate Research Assistant",
        org: "Shin Group · HKU Faculty of Engineering",
        logo: "/assets/hku-eng.png",
        highlight: true,
        notes: [
          "3D-printed fabric-based triboelectric nanogenerators (TENG) for wearable sensing and human–machine interfaces.",
          "Device design, fabrication planning, materials selection, and prototyping of flexible, self-powered sensor systems.",
        ],
      },
      {
        when: "Feb 2026 — Present",
        start: "2026-02",
        title: "Aerodynamics & Vehicle Dynamics",
        org: "HKU Racing Team",
        logo: "/assets/hkur.png",
        notes: [
          "Composite fabrication via vacuum infusion — layup prep, bagging setup, post-process handling.",
          "Vehicle manufacturing & assembly: component fit-up, workshop builds, on-track testing.",
        ],
      },
      {
        when: "Sept 2025 — Present",
        start: "2025-09",
        title: "Trainee, Mechanical Division",
        org: "HKU Robocon Team",
        logo: "/assets/hku-eng.png",
        notes: [
          "Student-Initiated Group for HKU Robocon — robotics design, mechanical assembly, competition strategy.",
          "SolidWorks, CNC machining, and waterjet cutting for precision prototyping.",
        ],
      },
      {
        when: "Jun — Aug 2023",
        start: "2023-06",
        title: "Student Researcher",
        org: "UC Irvine × GATI Program",
        location: "South Korea",
        logo: "/assets/uci%20gati%20logo.png",
        notes: [
          "Proposed SEFMS — integrating SEM, fluorescence microscopy, and AI computer vision for sub-100 nm aerospace defect detection.",
          "Published in the Journal of Student Research; preprint archived in RARS.",
        ],
      },
    ],
  },
  {
    id: "leadership",
    num: "03",
    label: "Teaching & Leadership",
    entries: [
      {
        when: "Apr — May 2026",
        start: "2026-04",
        title: "Teaching Assistant — AP Physics C: Mechanics",
        org: "Makers Academy",
        logo: "/assets/makers%20logo.jpg",
        notes: ["Graded mock papers and gave targeted feedback to 20+ students; surfaced recurring mistakes ahead of exams."],
      },
      {
        when: "Aug 2024 — Jun 2025",
        start: "2024-08",
        title: "Founder & Developer — Elmag Club",
        org: "AP Physics C: E&M Resource Platform",
        logo: "/assets/cds%20logo.png",
        notes: ["Built and deployed a learning platform: 15+ lectures, problem sets, recorded explanations used by 30+ students."],
      },
      {
        when: "2023 — 2025",
        start: "2023-09",
        title: "President — STEM Honor Societies",
        org: "Cheongna Dalton School",
        logo: "/assets/cds%20logo.png",
        notes: [
          "President of SNHS, Mu Alpha Theta, and the CS Honor Society — ran STEM Night, workshops, and coding bootcamps.",
          "Host of the Korean Science Olympiad 2025; Secretariat of Finance for DalMUN.",
        ],
      },
    ],
  },
];

export type SkillGroup = { label: string; items: string[] };
export const skillGroups: SkillGroup[] = [
  { label: "Fabrication", items: ["SolidWorks", "CNC Machining", "Waterjet / Laser", "FDM 3D Printing", "Composite Layup"] },
  { label: "Code", items: ["Python", "C", "C++", "Java", "MATLAB"] },
  { label: "Domains", items: ["TENG / Materials", "Computer Vision · AI", "Mechatronics", "Aerodynamics"] },
];

export const cvMeta = {
  pdf: "/assets/cv.pdf",
  revised: "Jun 2026",
  dwg: "GK-26-CV",
};
