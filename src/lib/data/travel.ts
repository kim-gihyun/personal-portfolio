export type Place = {
  name: string;
  kind: "now" | "lived" | "visited";
  lat: number;
  lon: number;
  years?: string;
  stat: string;
  quip: string;
};

// Coordinates are real. Notes are plain drafts — TODO(Gihyun): rewrite in your voice.
export const places: Place[] = [
  {
    name: "Hong Kong",
    kind: "now",
    lat: 22.3193,
    lon: 114.1694,
    years: "2025 — now",
    stat: "Current base · HKU",
    quip: "Current base — studying Mechanical Engineering at HKU, a few minutes from the workshop.",
  },
  {
    name: "Seoul",
    kind: "lived",
    lat: 37.5665,
    lon: 126.978,
    years: "home base since 2006",
    stat: "Home base",
    quip: "Home base since 2006 — where family (and the dog, 뭉이) are.",
  },
  {
    name: "Istanbul",
    kind: "lived",
    lat: 41.0082,
    lon: 28.9784,
    years: "gr. 5 · 4.5 yrs",
    stat: "4.5 years",
    quip: "Lived here from fifth grade — four and a half years across two continents.",
  },
  {
    name: "London",
    kind: "lived",
    lat: 51.5074,
    lon: -0.1278,
    years: "age 3 · 1 yr",
    stat: "1 year",
    quip: "Age three, about a year — the first move abroad.",
  },
  {
    name: "Singapore",
    kind: "visited",
    lat: 1.3521,
    lon: 103.8198,
    stat: "2 weeks",
    quip: "Visited for about two weeks.",
  },
  {
    name: "Osaka",
    kind: "visited",
    lat: 34.6937,
    lon: 135.5023,
    stat: "4 days",
    quip: "A few days — food, arcades, and neon.",
  },
  {
    name: "Prague",
    kind: "visited",
    lat: 50.0755,
    lon: 14.4378,
    stat: "3 days",
    quip: "Three days around the old town.",
  },
  {
    name: "Vienna",
    kind: "visited",
    lat: 48.2082,
    lon: 16.3738,
    stat: "2 days",
    quip: "Two days passing through.",
  },
  {
    name: "Shenzhen",
    kind: "visited",
    lat: 22.5431,
    lon: 114.0579,
    stat: "2 days",
    quip: "Two days around the electronics markets.",
  },
];

export const travelStats = [
  { k: "Cities lived", v: "4" },
  { k: "Continents", v: "3" },
  { k: "Longest stint", v: "Seoul" },
  { k: "Shortest", v: "Vienna · 2d" },
];
