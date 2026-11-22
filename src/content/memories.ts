export type MemoryType = "moment" | "observation" | "future";

export type Memory = {
  id: string;
  title: string;
  date?: string;              // Optional for observations/future stars
  tag: string;                // "Moment" | "Something I've noticed" | "A future thought"
  note: string;               // 1 to 3 short lines
  photo?: string;             // "/photos/first-chat.svg"
  position: [number, number, number];
  color: string;              // hex from palette
  constellationId?: string;
  interaction?: "tap" | "hold";
};

export const MEMORIES: Memory[] = [
  // 1. Real Moment (Tap)
  {
    id: "mem-p1",
    title: "The First Hello",
    date: "11 Nov 2026",
    tag: "Moment",
    note: "A quiet evening when our first conversation started.\nNeither of us realized we'd end up talking for hours.",
    photo: "/photos/first-chat.svg",
    position: [-6, -4, 2],
    color: "#ff5fb7",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  // 2. Real Moment (Tap)
  {
    id: "mem-p2",
    title: "Laughing Before The Punchline",
    date: "A few days later",
    tag: "Moment",
    note: "You started telling a funny story and began laughing so hard\nhalfway through that you couldn't even finish the sentence.",
    photo: "/photos/laughter.svg",
    position: [-6, -1, 2],
    color: "#4fd6d0",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  // 3. Observation (Tap)
  {
    id: "mem-p3",
    title: "How Your Voice Warms Up",
    tag: "Something I've noticed",
    note: "The unmistakable shift in your voice whenever\nyou talk about something you are genuinely passionate about.",
    photo: "/photos/spark.svg",
    position: [-6, 2, 2],
    color: "#ffd48a",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  // 4. Observation (Tap)
  {
    id: "mem-p4",
    title: "Comfortable Silence",
    tag: "Something I've noticed",
    note: "Even the random pauses when neither of us is saying much\nfeel completely easy, natural, and warm.",
    photo: "/photos/tea.svg",
    position: [-3, 3, 2],
    color: "#fff4e0",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  // 5. Future Star (Hold-to-ignite)
  {
    id: "mem-p5",
    title: "A Coffee We Don't Rush",
    tag: "A thought for the future",
    note: "Sitting across a table with warm coffee in hand,\nwithout anywhere else we have to be.",
    photo: "/photos/coffee.svg",
    position: [-1, 1.5, 2],
    color: "#ffd48a",
    constellationId: "constellation-p",
    interaction: "hold"
  },
  // 6. Future Star (Hold-to-ignite)
  {
    id: "mem-p6",
    title: "A Quiet Walk Somewhere New",
    tag: "A thought for the future",
    note: "Exploring a peaceful spot in the evening,\njust talking about everything and nothing as we walk.",
    photo: "/photos/adventure.svg",
    position: [-3, 0, 2],
    color: "#4fd6d0",
    constellationId: "constellation-p",
    interaction: "hold"
  },
  // 7. Future Star (Hold-to-ignite)
  {
    id: "mem-p7",
    title: "Unwritten Chapters",
    tag: "A thought for the future",
    note: "All the silly inside jokes, shared playlists,\nand random smiles we haven't even had yet.",
    photo: "/photos/future.svg",
    position: [-6, 0.2, 2],
    color: "#ff5fb7",
    constellationId: "constellation-p",
    interaction: "hold"
  }
];

// Ordered edges to draw the constellation "P"
export const CONSTELLATION_LINES: Record<string, [string, string][]> = {
  "constellation-p": [
    ["mem-p1", "mem-p2"],
    ["mem-p2", "mem-p3"],
    ["mem-p3", "mem-p4"],
    ["mem-p4", "mem-p5"],
    ["mem-p5", "mem-p6"],
    ["mem-p6", "mem-p7"],
    ["mem-p7", "mem-p2"] // loop of the letter P
  ]
};
