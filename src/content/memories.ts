export type Memory = {
  id: string;
  title: string;
  date: string;               // ISO "2026-11-11"
  note: string;               // 1 to 3 short lines
  photo?: string;             // "/photos/first-chat.webp"
  position: [number, number, number];
  color: string;              // hex from palette
  constellationId?: string;
  interaction?: "tap" | "hold";
};

export const MEMORIES: Memory[] = [
  // Constellation "P" stars
  {
    id: "mem-p1",
    title: "The First Hello",
    date: "2026-08-14",
    note: "A quiet evening when our first conversation started.\nNeither of us realized what a lovely world it would become.",
    photo: "/photos/first-chat.svg",
    position: [-10, -8, 4],
    color: "#ff5fb7",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  {
    id: "mem-p2",
    title: "Unstoppable Laughter",
    date: "2026-09-02",
    note: "That absurdly silly joke that made no sense to anyone else,\nbut had us laughing until our stomachs hurt.",
    photo: "/photos/laughter.svg",
    position: [-10, -3, 4],
    color: "#4fd6d0",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  {
    id: "mem-p3",
    title: "Late Night Musings",
    date: "2026-09-19",
    note: "Talking about everything and nothing past midnight.\nWhen the rest of the world was asleep, our thoughts wandered free.",
    photo: "/photos/stargazing.svg",
    position: [-10, 2, 4],
    color: "#7b5cff",
    constellationId: "constellation-p",
    interaction: "hold"
  },
  {
    id: "mem-p4",
    title: "Shared Playlists",
    date: "2026-10-05",
    note: "Trading songs back and forth across distance.\nEvery track felt like a secret postcard sent in rhythm.",
    photo: "/photos/music.svg",
    position: [-6, 3, 4],
    color: "#ffd48a",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  {
    id: "mem-p5",
    title: "Quiet Understanding",
    date: "2026-10-18",
    note: "A day when not many words were needed.\nJust knowing you were there made the heavy air feel light.",
    photo: "/photos/tea.svg",
    position: [-3, 1, 4],
    color: "#fff4e0",
    constellationId: "constellation-p",
    interaction: "hold"
  },
  {
    id: "mem-p6",
    title: "Spontaneous Adventures",
    date: "2026-11-01",
    note: "Finding magic in the most ordinary corners.\nYou make simple days turn into unforgettable memories.",
    photo: "/photos/adventure.svg",
    position: [-6, -0.5, 4],
    color: "#ff5fb7",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  {
    id: "mem-p7",
    title: "The Heart of the 'P'",
    date: "2026-11-11",
    note: "The special day where everything aligned.\nA spark that lit this entire little galaxy.",
    photo: "/photos/universe.svg",
    position: [-10, -0.5, 4],
    color: "#ffd48a",
    constellationId: "constellation-p",
    interaction: "hold"
  },

  // Other memories across the galaxy arms
  {
    id: "mem-8",
    title: "Rainy Afternoon Reflections",
    date: "2026-10-24",
    note: "Listening to the sound of raindrops on glass while we texted.\nComfortable, cozy, and wonderfully genuine.",
    photo: "/photos/rain.svg",
    position: [12, 5, -6],
    color: "#4fd6d0",
    interaction: "tap"
  },
  {
    id: "mem-9",
    title: "Coffee & Daydreams",
    date: "2026-11-04",
    note: "Sharing our morning thoughts and favorite routines.\nSmall rituals that brighten up the start of any day.",
    photo: "/photos/coffee.svg",
    position: [8, -7, -8],
    color: "#ffd48a",
    interaction: "hold"
  },
  {
    id: "mem-10",
    title: "Random Brainwaves",
    date: "2026-11-08",
    note: "Out of nowhere ideas and creative rabbit holes.\nTalking to you always sparks something new and inspiring.",
    photo: "/photos/spark.svg",
    position: [15, -2, 5],
    color: "#7b5cff",
    interaction: "tap"
  },
  {
    id: "mem-11",
    title: "The Comfort Zone",
    date: "2026-11-14",
    note: "That rare feeling where you can be 100% yourself,\nflaws and silliness and all, and feel completely welcomed.",
    photo: "/photos/comfort.svg",
    position: [-8, 9, -5],
    color: "#ff5fb7",
    interaction: "hold"
  },
  {
    id: "mem-12",
    title: "Looking Forward",
    date: "2026-11-20",
    note: "All the unwritten chapters and upcoming smiles.\nThis galaxy is just getting started.",
    photo: "/photos/future.svg",
    position: [4, 11, 7],
    color: "#fff4e0",
    interaction: "tap"
  }
];

// Ordered edges for constellations
export const CONSTELLATION_LINES: Record<string, [string, string][]> = {
  "constellation-p": [
    ["mem-p1", "mem-p2"],
    ["mem-p2", "mem-p3"],
    ["mem-p3", "mem-p4"],
    ["mem-p4", "mem-p5"],
    ["mem-p5", "mem-p6"],
    ["mem-p6", "mem-p7"],
    ["mem-p7", "mem-p2"] // complete the loop of P!
  ]
};
