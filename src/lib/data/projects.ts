export type Spec = { k: string; v: string };
export type Rev = { rev: string; note: string; year: string };
export type Shot = { src: string; alt: string };

export type Project = {
  id: string;
  num: string;
  title: string;
  tag: string;
  year: string;
  role: string;
  status: string;
  /** documented outcome — stated plainly, including partials and absences */
  results?: string;
  categories: string[];
  /** primary interactive model */
  model: string;
  /** optional downloadable STL */
  stl?: string;
  /** camera intent for the viewer */
  orient?: { rx?: number; ry?: number; zoom?: number };
  /** still shown before/behind the canvas */
  poster: string;
  blurb: string;
  body: string[];
  specs: Spec[];
  /** material / engineering context — drives the floating cards */
  context: { title: string; text: string }[];
  revs: Rev[];
  gallery: Shot[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "robocon-robot",
    num: "P-01",
    title: "Robocon Competition Robot",
    tag: "HKU Robocon Team",
    year: "2025",
    role: "Mechanical design & fabrication",
    status: "Built & competed",
    results:
      "Competed in Robocon's internal mini-competition — grippers and rear panel ran under timed match conditions with pneumatics integrated.",
    categories: ["robotics", "cad"],
    model: "/assets/robot.glb",
    orient: { rx: 0, ry: 210, zoom: 1.5 },
    poster: "/assets/robocon-robot-1.png",
    featured: true,
    blurb:
      "Two front grippers and a rear panel for HKU Robocon — designed in CAD, waterjet and laser fabricated, then run under timed match conditions with pneumatics.",
    body: [
      "For Robocon's internal mini-competition the robot had to pick and place game elements quickly and reliably against the clock. I led the mechanical design and fabrication of its manipulation system.",
      "Each part got the process that suited it: waterjet for load-bearing pieces, laser-cut acrylic for lighter structural panels. I then hand-assembled and tuned the fit between parts.",
      "The final build integrated pneumatics alongside the electrical systems — so I designed around actuator stroke, mounting points, and air-line routing to keep it compact and serviceable.",
    ],
    specs: [
      { k: "CAD", v: "SolidWorks" },
      { k: "Process", v: "Waterjet · Laser" },
      { k: "Material", v: "Acrylic · Alu" },
      { k: "Actuation", v: "Pneumatic" },
    ],
    context: [
      { title: "Process-matched fabrication", text: "Load paths went to waterjet metal; structure-only panels to laser-cut acrylic. Choosing the process per part kept it light and fast to iterate." },
      { title: "Designed for service", text: "Actuator stroke, mount points, and air-line routing were laid out so the gripper could be re-tuned between matches without a teardown." },
    ],
    revs: [
      { rev: "A", note: "Gripper and rear-panel concept modelled in SolidWorks.", year: "2025" },
      { rev: "B", note: "Load-bearing parts waterjet-cut; panels in laser-cut acrylic.", year: "2025" },
      { rev: "C", note: "Pneumatics integrated; competed under match conditions.", year: "2025" },
    ],
    gallery: [
      { src: "/assets/robocon-robot-1.png", alt: "Robocon robot CAD" },
      { src: "/assets/robocon-robot-2.png", alt: "Robocon robot CAD — alternate view" },
      { src: "/assets/robocon-assembled.png", alt: "Assembled Robocon robot with pneumatics" },
    ],
  },
  {
    id: "laundry-sensor",
    num: "P-02",
    title: "Laundry Availability Sensor",
    tag: "Shun Hing College · Tech Club",
    year: "2025",
    role: "Embedded enclosure design",
    status: "Deployed in dorm",
    results:
      "Live in the dorm laundry room — reads the machine's status LED and reports availability to residents via the web page.",
    categories: ["embedded", "cad"],
    model: "/assets/laundry.glb",
    stl: "/assets/Laundry%20Project.STL",
    orient: { rx: 0, ry: 0 },
    poster: "/assets/laundry-final.png",
    blurb:
      "A 3D-printed enclosure housing an ESP32 and light sensor that reads a washing machine's status LED and reports availability to a web page.",
    body: [
      "Residents wanted to know if a machine was free before walking over. My job was the physical enclosure for the ESP32 and the light sensor that reads the machine's status indicator.",
      "The first single-piece casing was hard to print accurately and awkward to assemble around the electronics. I split it into two casings that each print cleanly and snap together — which noticeably improved our prototyping turnaround.",
      "The result is a compact, reproducible housing that protects the electronics while keeping the sensor a clear line of sight to the machine.",
    ],
    specs: [
      { k: "MCU", v: "ESP32" },
      { k: "Sensor", v: "Photodiode" },
      { k: "CAD", v: "Fusion 360" },
      { k: "Print", v: "FDM" },
    ],
    context: [
      { title: "Design for printability", text: "Splitting one fussy part into two clean prints removed support material and assembly friction — the change that actually shipped." },
      { title: "Line-of-sight constraint", text: "The shell protects the board while leaving the photodiode an unobstructed view of the machine's status LED." },
    ],
    revs: [
      { rev: "A", note: "Single-piece printed casing — hard to print, awkward to assemble.", year: "2025" },
      { rev: "B", note: "Redesigned as two casings that print cleanly and snap together.", year: "2025" },
      { rev: "C", note: "Deployed in the dorm laundry room, reporting to the web.", year: "2025" },
    ],
    gallery: [
      { src: "/assets/laundry-initial.png", alt: "Initial single-piece casing CAD" },
      { src: "/assets/laundry-final.png", alt: "Final two-piece casing CAD" },
    ],
  },
  {
    id: "trolley",
    num: "P-03",
    title: "Robocon Transport Trolley",
    tag: "HKU Robocon Team",
    year: "2026",
    role: "Parametric assembly design",
    status: "Built & in use",
    results:
      "In service for ABU Robocon — carries the team's robots between workshop and venue; printed corner mounts hold them without straps.",
    categories: ["cad", "robotics"],
    model: "/assets/trolley.glb",
    orient: { rx: 90 },
    poster: "/assets/trolley.png",
    blurb:
      "A parametric trolley that moves competition robots between workshop and venue, with 3D-printed corner mounts that lock each robot in place.",
    body: [
      "The team needed to move its robots safely to ABU Robocon, so I designed a dedicated trolley sized around the machines it carries.",
      "I built it parametrically: top and bottom subassemblies driven by shared, editable dimensions and combined into the final assembly. Adjusting one key dimension propagated cleanly through the model instead of forcing rework.",
      "To stop the robots shifting in transit, I placed 3D-printed mounts at all four top corners that locate and lock each robot — a simple, printable solution that survives real handling.",
    ],
    specs: [
      { k: "Method", v: "Parametric" },
      { k: "CAD", v: "SolidWorks" },
      { k: "Mounts", v: "FDM print" },
      { k: "Use", v: "ABU Robocon" },
    ],
    context: [
      { title: "Driven by shared dimensions", text: "Top and bottom subassemblies reference one parameter set; resizing the cargo bay re-solves the whole trolley automatically." },
      { title: "Located, not clamped", text: "Printed corner mounts locate each robot positively so it can't walk during transport — no straps, no fuss." },
    ],
    revs: [
      { rev: "A", note: "Parametric top & bottom subassemblies, shared driving dimensions.", year: "2026" },
      { rev: "B", note: "3D-printed corner mounts added to lock each robot in place.", year: "2026" },
      { rev: "C", note: "In service — workshop-to-venue transport for ABU Robocon.", year: "2026" },
    ],
    gallery: [
      { src: "/assets/trolley.png", alt: "Robocon trolley CAD assembly" },
      { src: "/assets/trolley-mount.png", alt: "3D-printed corner mounting" },
      { src: "/assets/trolley-built.jpg", alt: "Assembled aluminium trolley" },
    ],
  },
  {
    id: "solar-tracker",
    num: "P-04",
    title: "Dual-Axis Solar Tracker",
    tag: "Personal Project",
    year: "2026",
    role: "Mechatronics — CAD + control",
    status: "Working prototype",
    results:
      "Reorients toward the brightest light on both axes with smooth, repeatable motion; power gain versus a fixed panel not yet measured.",
    categories: ["robotics", "embedded", "personal"],
    model: "/assets/assembly.glb",
    orient: { rx: -90, ry: 0 },
    poster: "/assets/solar-cad.png",
    blurb:
      "A tracker that chases the brightest light on two axes with photoresistors, a Raspberry Pi, and a pair of servos.",
    body: [
      "A proof-of-concept dual-axis tracker that reorients a panel toward the brightest available light — sensing balance with photoresistors, running control on a Raspberry Pi, and driving two axes with servos.",
      "I led the 3D design, printing, and assembly of the structural frame, focused on stability and smooth rotation under the weight of panel and servos.",
      "Then I iterated through print-and-test cycles: opening motor-mount clearance, adding wire-routing holes, and refining gear engagement until the motion was smooth and repeatable.",
    ],
    specs: [
      { k: "Brain", v: "Raspberry Pi" },
      { k: "Drive", v: "2× servo" },
      { k: "Sense", v: "Photoresistor" },
      { k: "Frame", v: "FDM print" },
    ],
    context: [
      { title: "Light-balance control", text: "Four photoresistors feed a simple balance loop; the Pi nulls the difference on each axis to point the panel at peak intensity." },
      { title: "Tuned through printing", text: "Clearance, wire routing, and gear mesh were all dialled in across successive prints — the mechanism is a record of its own iterations." },
    ],
    revs: [
      { rev: "A", note: "Structural frame printed; first full assembly.", year: "2026" },
      { rev: "B", note: "Motor-mount clearance opened; wire-routing holes added.", year: "2026" },
      { rev: "C", note: "Gear engagement refined — smooth, repeatable two-axis motion.", year: "2026" },
    ],
    gallery: [
      { src: "/assets/solar-cad.png", alt: "Solar tracker CAD" },
      { src: "/assets/solar-cad2.png", alt: "Solar tracker CAD — alternate view" },
      { src: "/assets/solar-built.jpg", alt: "Assembled solar tracker prototype" },
    ],
  },
  {
    id: "tensile-tester",
    num: "P-05",
    title: "C-TPU Tensile Tester",
    tag: "Shin Group · Test Rig",
    year: "2026",
    role: "Design for characterization",
    status: "Printing / build",
    results:
      "No specimen data yet — the rig is still printing in PETG; first strain-vs-resistance runs pending (see RA Progress Report 3).",
    categories: ["research", "cad", "materials"],
    model: "/assets/tensile-tester.glb",
    stl: "/assets/Tensile%20Testing.STL",
    orient: { rx: -90, ry: 0 },
    poster: "/assets/blog/ra3-p5-06.png",
    blurb:
      "A SolidWorks-designed, PETG-printed rig to pull conductive TPU under controlled strain while an Arduino logs the change in resistance.",
    body: [
      "C-TPU's resistance drops under tensile strain — non-linearly, settling into a predictable curve after ~250 load cycles. To measure that myself I designed a dedicated tensile tester rather than relying on published curves.",
      "The rig clamps a C-TPU specimen and applies controlled extension; an Arduino Uno with voltage sensors reads resistance through the cycle so I can characterise the hysteresis directly.",
      "It's part of the glove-sensor work: understanding strain-vs-resistance is what lets the finished TENG glove turn finger motion into clean signal.",
    ],
    specs: [
      { k: "CAD", v: "SolidWorks" },
      { k: "Print", v: "PETG (FDM)" },
      { k: "DAQ", v: "Arduino Uno" },
      { k: "Measures", v: "Strain ↔ R" },
    ],
    context: [
      { title: "Why build the rig", text: "Published C-TPU curves vary by print speed and geometry. Measuring my own specimens removes that uncertainty for the glove design." },
      { title: "Resistance as the readout", text: "Voltage sensors track resistance through strain-and-release so the negative gauge-factor behaviour can be modelled, not assumed." },
    ],
    revs: [
      { rev: "A", note: "Frame and clamp geometry designed in SolidWorks.", year: "2026" },
      { rev: "B", note: "Specimen grips sized for printed C-TPU coupons.", year: "2026" },
      { rev: "C", note: "PETG print in progress; Arduino DAQ wired.", year: "2026" },
    ],
    gallery: [
      { src: "/assets/blog/ra3-p5-06.png", alt: "Tensile tester — CAD render" },
      { src: "/assets/blog/ra3-p6-07.png", alt: "Tensile tester — alternate view" },
    ],
  },
  {
    id: "bending-tester",
    num: "P-06",
    title: "C-TPU Bending Tester",
    tag: "Shin Group · Test Rig",
    year: "2026",
    role: "Design for characterization",
    status: "Printing / build",
    results:
      "No bend data yet — the rig is still printing; it shares the tensile rig's Arduino DAQ once both are assembled.",
    categories: ["research", "cad", "materials"],
    model: "/assets/bending-tester.glb",
    stl: "/assets/Bending%20Tester.STL",
    orient: { rx: -90, ry: 0 },
    poster: "/assets/blog/ra3-p7-08.png",
    blurb:
      "A companion rig that flexes C-TPU through repeatable bend angles to map its negative gauge-factor response for the TENG glove's finger sensors.",
    body: [
      "Under flexural stress C-TPU's resistance falls monotonically — a negative gauge factor. The glove's back-of-finger sensors rely on it, so the bend response has to be measured at known angles.",
      "This rig drives a C-TPU strip through controlled bend angles; the same Arduino voltage-sensor stack records resistance versus angle so I can separate genuine signal from creep and hysteresis.",
      "Tensile and bending data together define how each finger's patch is laid out on the finished glove.",
    ],
    specs: [
      { k: "CAD", v: "SolidWorks" },
      { k: "Print", v: "PETG (FDM)" },
      { k: "DAQ", v: "Arduino Uno" },
      { k: "Measures", v: "Bend ↔ R" },
    ],
    context: [
      { title: "Negative gauge factor", text: "Resistance decreases as the strip bends. Mapping that curve per geometry tells the glove how to read each finger." },
      { title: "Repeatable angles", text: "Controlled, indexed bend angles make runs comparable so creep can be subtracted from the real bend signal." },
    ],
    revs: [
      { rev: "A", note: "Bend mechanism and angle indexing designed.", year: "2026" },
      { rev: "B", note: "Strip holder matched to printed C-TPU coupons.", year: "2026" },
      { rev: "C", note: "PETG print in progress; shares the tensile rig's DAQ.", year: "2026" },
    ],
    gallery: [
      { src: "/assets/blog/ra3-p7-08.png", alt: "Bending tester — CAD render" },
      { src: "/assets/blog/ra3-p8-09.png", alt: "Bending tester — alternate view" },
    ],
  },
];

export const projectFilters = [
  { id: "all", label: "All" },
  { id: "research", label: "Research" },
  { id: "robotics", label: "Robotics" },
  { id: "cad", label: "CAD" },
  { id: "embedded", label: "Embedded" },
  { id: "materials", label: "Materials" },
];
