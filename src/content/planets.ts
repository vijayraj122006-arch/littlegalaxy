export type PlanetComponentType =
  | "FirstMeeting"
  | "FavoritePlace"
  | "Playlist"
  | "Song";

export type PlanetDef = {
  id: string;
  name: string;
  theme: string;
  description: string;
  position: [number, number, number];
  color: string;
  glowColor: string;
  size: number;
  component: PlanetComponentType;
  payload: Record<string, any>;
};

export const PLANETS: PlanetDef[] = [
  {
    id: "planet-first-meeting",
    name: "The Red Moon",
    theme: "Where It Began",
    description: "The story reply that started everything — scrub through time.",
    position: [22, 5, -16],
    color: "#ff4d6d",
    glowColor: "#ff758f",
    size: 2.0,
    component: "FirstMeeting",
    payload: {
      title: "The Eclipse That Started Our Universe",
      date: "08 September 2025",
      stages: [
        { time: "The Story", text: "Vijay posts a story of the red eclipse moon..." },
        { time: "Pooja replies", text: "'Aadha pakka kudadu... negative energy transfer aagum nu yage Amma yanna madi ke mudiyala!'" },
        { time: "Vijay", text: "'Idu garano ila 😉'" },
        { time: "11 Nov 2026", text: "A superstitious warning turned into late night talks, laughter, and now your own little galaxy." }
      ]
    }
  },
  {
    id: "planet-playlist",
    name: "Our Playlist",
    theme: "Songs For You",
    description: "Melodies that remind me of your voice and quiet evenings.",
    position: [-20, -5, 18],
    color: "#ffd166",
    glowColor: "#ffe3a8",
    size: 2.2,
    component: "Playlist",
    payload: {
      title: "Songs That Feel Like You",
    }
  },
  {
    id: "planet-favorite-place",
    name: "Music & Canvas",
    theme: "Our Vibe",
    description: "A sanctuary of Harris Jayaraj melodies, sketchbooks, and cozy tea.",
    position: [18, -6, 22],
    color: "#06d6a0",
    glowColor: "#70f3cb",
    size: 2.1,
    component: "FavoritePlace",
    payload: {
      title: "Mundhinam Paartheney & Sketchbooks",
      vibe: "Losing track of time listening to Harris Jayaraj, trading reels, sharing Pinterest art inspirations, and smiling at dancing cat stickers."
    }
  }
];
