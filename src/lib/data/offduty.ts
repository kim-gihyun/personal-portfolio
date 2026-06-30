export type Song = { title: string; artist: string; href: string; cover: string };

export const songs: Song[] = [
  { title: "晩餐歌 (Bansanka)", artist: "tuki.", href: "https://www.youtube.com/watch?v=oZpYEEcvu5I", cover: "/assets/song/bansanka%20cover%20photo.png" },
  { title: "Vancouver 2", artist: "BIG Naughty", href: "https://www.youtube.com/watch?v=mev609MxcRE", cover: "/assets/song/Vancouver%202%20cover%20pgoto.jpeg" },
  { title: "Peter Pan Was Right", artist: "Anson Seabra", href: "https://www.youtube.com/watch?v=D8rlcLH0pqk", cover: "/assets/song/peter%20pan%20was%20right.jpg" },
  { title: "Locked Away", artist: "R. City ft. Adam Levine", href: "https://www.youtube.com/watch?v=6GUm5g8SG4o", cover: "/assets/song/locked%20away.jpeg" },
  { title: "Take This Home", artist: "RoadTrip", href: "https://www.youtube.com/watch?v=BJdaS7uI3RM", cover: "/assets/song/take%20this%20home%20cover%20photo.jpg" },
  { title: "Viva la Vida", artist: "Coldplay", href: "https://www.youtube.com/watch?v=dvgZkm1xWPE", cover: "/assets/song/viva%20la%20vida.jpg" },
  { title: "My Love", artist: "Westlife", href: "https://www.youtube.com/watch?v=ulOb9gIGGd0", cover: "/assets/song/my%20love.jpeg" },
];

export type Photo = { src: string; fig: string; caption: string; year: string };

export const photos: Photo[] = [
  { src: "/assets/Life%20Photos/2019.JPG", fig: "01", caption: "Among the ruins", year: "2019" },
  { src: "/assets/Life%20Photos/2020%20-%20Eagle.jpg", fig: "02", caption: "First eagle", year: "2020" },
  { src: "/assets/Life%20Photos/2022%20-%20Coming%20home%20%28Seoul%29%20and%20leaving%20home%20%28Istanbul%29.jpg", fig: "03", caption: "Two homes, one summer", year: "2022" },
  { src: "/assets/Life%20Photos/2022%20-%20First%20Day%20of%20CDS%20%28My%20high%20school%20name%20in%20korea%29.jpg", fig: "04", caption: "First bell at CDS", year: "2022" },
  { src: "/assets/Life%20Photos/2023%20-%20With%20dog.jpg", fig: "05", caption: "Me & 뭉이", year: "2023" },
  { src: "/assets/Life%20Photos/2024%20-%20After%2011th%20Grade.jpg", fig: "06", caption: "Eleventh grade, done", year: "2024" },
  { src: "/assets/Life%20Photos/2025%20-%20Day%201%20HK.jpg", fig: "07", caption: "Hong Kong, night one", year: "2025" },
  { src: "/assets/Life%20Photos/2025%20-%20Japan%20Grip.jpg", fig: "08", caption: "Neon in Osaka", year: "2025" },
  { src: "/assets/Life%20Photos/2025.jpg", fig: "09", caption: "Under the lights", year: "2025" },
  { src: "/assets/Life%20Photos/2026%20-%20shun%20hiing%20college%20high%20table%20dinner.jpg", fig: "10", caption: "High table, Shun Hing", year: "2026" },
];

/* ---- audio gear (TODO(Gihyun): notes are plain drafts — add your own take) ---- */
export const audioHero = {
  name: "Sennheiser IE 600",
  rev: "IEM",
  oneLiner: "The pair I reach for first.",
  verdict:
    "My main in-ear monitors — a single dynamic driver tuned for detailed, natural sound. What I use when I actually want to listen, not just have something on.",
  specs: [
    { k: "Type", v: "In-ear monitor" },
    { k: "Driver", v: "Single dynamic" },
    { k: "Cable", v: "Wired · removable" },
    { k: "Use", v: "Critical listening" },
  ],
};

export type Glyph = "iem" | "overear" | "earbud" | "stembud";
export type AudioItem = { name: string; type: string; note: string; glyph: Glyph; tag?: string; status?: string };
export const audioGear: AudioItem[] = [
  {
    name: "Sennheiser IE 600",
    type: "In-ear monitors",
    note: "Reference IEMs — detailed and natural.",
    glyph: "iem",
    tag: "daily driver",
  },
  {
    name: "Sennheiser Momentum 4",
    type: "Wireless over-ear",
    note: "ANC headphones for long sessions.",
    glyph: "overear",
  },
  {
    name: "Galaxy Buds 4 Pro",
    type: "Wireless earbuds",
    note: "Daily buds for calls and walks.",
    glyph: "earbud",
    status: "currently lost",
  },
  {
    name: "AirPods 3",
    type: "Open-fit earbuds",
    note: "Grab-and-go pair by the laptop.",
    glyph: "stembud",
  },
];
