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

/* ---- the keyboard shrine ---- */
export const keebHero = {
  name: "Halo65",
  rev: "V1",
  oneLiner: "The one I keep coming back to.",
  verdict:
    "I've typed on a lot of 65s. The Halo65 V1 wins on sound — a deep, rounded thock with none of the hollow ping the louder boards make. It's not the flashiest spec sheet on paper; it's the one my ears agree with.",
  specs: [
    { k: "Layout", v: "65% · 67 keys" },
    { k: "Mount", v: "Gasket" },
    { k: "Plate", v: "POM" },
    { k: "Switch", v: "Linear, lubed" },
    { k: "Profile", v: "Cherry PBT" },
    { k: "Acoustic", v: "Deep thock" },
  ],
};

export type MountType = { name: string; feel: string; sound: string; verdict: string; pick?: boolean };
export const mounts: MountType[] = [
  {
    name: "Gasket mount",
    feel: "Soft, cushioned bottom-out — the plate floats on gaskets, so there's a little give before it stops.",
    sound: "Deeper, rounder, more absorbed. Less high-frequency clack.",
    verdict: "My default. The give is the point.",
    pick: true,
  },
  {
    name: "Top mount",
    feel: "Firmer and more uniform across the board; a defined, consistent bottom-out.",
    sound: "Crisper and a touch louder, with more of the plate's voice coming through.",
    verdict: "Great if you like a stiffer typing surface. Not my acoustic.",
  },
  {
    name: "Tray mount",
    feel: "Stiff in the middle, softer at the edges — the classic, uneven feel.",
    sound: "Most variable; depends heavily on foam and how it's tightened down.",
    verdict: "Fine, fixable, but I'd rather start somewhere better.",
  },
];

// TODO(Gihyun): keyboard notes are drafts — adjust to match your actual setup.
export const keebNotes = [
  { k: "Ergonomics", v: "65% layout keeps the mouse closer — less shoulder reach, more desk for notes." },
  { k: "Tuning", v: "Switches lubed and stabilisers modded — a quick pass that fixes most of the sound." },
  { k: "Preference", v: "Mostly linear switches for everyday typing and CAD." },
];
