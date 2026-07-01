export const profile = {
  name: "Gihyun Kim",
  hangul: "김기현",
  initials: "GK",
  role: "Mechanical Engineering · Applied AI",
  school: "University of Hong Kong",
  // Headline from the original gihyunkim.com.
  tagline: "Drafting ideas. Building reality.",
  blurb:
    "Engineering student at the University of Hong Kong, majoring in Mechanical Engineering and " +
    "pursuing the BEng X + MScEng in AI Engineering on a full scholarship. Laidlaw Scholar researching " +
    "urban atmospheric turbulence, research assistant in the Shin Group, and a builder on the HKU " +
    "Robocon and HKU Racing teams.",
  location: "Hong Kong · Seoul",
  status: "Open to research & engineering collaborations",
  email: "ghkim1106@connect.hku.hk",
  emailAlt: "kim.gihyun1106@gmail.com",
  cvPdf: "/assets/cv.pdf",
  socials: [
    { label: "LinkedIn", short: "LI", href: "https://www.linkedin.com/in/gihyun-kim" },
    { label: "GitHub", short: "GH", href: "https://github.com/kim-gihyun" },
    { label: "Email", short: "EM", href: "mailto:ghkim1106@connect.hku.hk" },
  ],
  // headline measurements that recur as "readouts"
  readouts: [
    { k: "LAT", v: "22.28°N" },
    { k: "LON", v: "114.17°E" },
    { k: "DWG", v: "GK-26" },
    { k: "REV", v: "D" },
  ],
};

export const focusAreas = [
  { label: "TENG Fabric Optimization", tag: "Wearable energy harvesting" },
  { label: "UAV Turbulence Sensing", tag: "Urban atmospheric flow" },
  { label: "Robotics Development", tag: "HKU Robocon" },
  { label: "Composite & CNC Fabrication", tag: "HKU Racing" },
];

export type NavItem = { label: string; href: string; index: string };
export const navItems: NavItem[] = [
  { label: "Home", href: "/", index: "00" },
  { label: "Work", href: "/portfolio", index: "01" },
  { label: "CV", href: "/cv", index: "02" },
  { label: "About", href: "/about", index: "03" },
  { label: "Personal", href: "/personal", index: "04" },
  { label: "Log", href: "/blog", index: "05" },
];
