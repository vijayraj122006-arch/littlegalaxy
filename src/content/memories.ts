export type MemoryType = "moment" | "observation" | "future";

export type Memory = {
  id: string;
  title: string;
  date?: string;
  tag: string;
  note: string;
  photo?: string;
  position: [number, number, number];
  color: string;
  constellationId?: string;
  interaction?: "tap" | "hold";
};

export const MEMORIES: Memory[] = [
  // 1. The Red Moon First Story Reply (Real Screenshot!)
  {
    id: "mem-p1",
    title: "Aadha Pakka Kudadu 🌙",
    date: "08 Sept 2025",
    tag: "The First Story Reply",
    note: "You replied to my red moon story warning me about the eclipse.\n'Idu garano ila' — who knew a superstition would spark our entire universe?",
    photo: "/photos/first-chat.jpg",
    position: [-6, -4, 2],
    color: "#ff5fb7",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  // 2. November 11 - Confession Day
  {
    id: "mem-p2",
    title: "11 • 11 • 2026 ✨",
    date: "11 Nov 2026",
    tag: "A Little Beginning",
    note: "A simple Instagram chat turned into something worth everything.\nTwo people, different cities, and conversations we never wanted to end.",
    photo: "/photos/universe.svg",
    position: [-6, -1, 2],
    color: "#ffd48a",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  // 3. Observation - Her Expressive Texting
  {
    id: "mem-p3",
    title: "Her Famous '😭😭😭' & 'Amah'",
    tag: "Something I've Noticed",
    note: "You claimed you were introverted at first,\nbut when you're comfortable, your joyful energy and endless laughter light up the whole screen.",
    photo: "/photos/laughter.svg",
    position: [-6, 2, 2],
    color: "#4fd6d0",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  // 4. Observation - Creative & Art Side
  {
    id: "mem-p4",
    title: "Paintbrushes & Pinterest",
    tag: "Something I've Noticed",
    note: "How painting and sketching bring you quiet peace when days get loud.\nThe world is so much softer through your art.",
    photo: "/photos/spark.svg",
    position: [-3, 3, 2],
    color: "#a5b4fc",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  // 5. Observation - Stickers & Blushing Cats
  {
    id: "mem-p5",
    title: "Dancing Cats & Hugs",
    tag: "Something I've Noticed",
    note: "That blushing cat sticker when I teased you,\nand our dancing cat hugs. Some things don't even need words.",
    photo: "/photos/comfort.svg",
    position: [-1, 1.5, 2],
    color: "#ff5fb7",
    constellationId: "constellation-p",
    interaction: "tap"
  },
  // 6. Future Star - Cookie Taste Test (Hold to ignite)
  {
    id: "mem-p6",
    title: "The Cookie Taste Test 🍪",
    tag: "A Promise for the Future",
    note: "Hunting down the warmest, gooey chocolate chip cookies together.\nYour official answer was 'Kandipaaa' — so consider this locked in.",
    photo: "/photos/coffee.svg",
    position: [-3, 0, 2],
    color: "#ffd48a",
    constellationId: "constellation-p",
    interaction: "hold"
  },
  // 7. Future Star - Harris Jayaraj on Repeat (Hold to ignite)
  {
    id: "mem-p7",
    title: "Mundhinam Paartheney 🎵",
    tag: "A Promise for the Future",
    note: "Sharing a pair of earbuds on a quiet evening walk,\nlistening to your favorite Harris Jayaraj songs side by side.",
    photo: "/photos/music.svg",
    position: [-6, 0.2, 2],
    color: "#6ee7b7",
    constellationId: "constellation-p",
    interaction: "hold"
  }
];

// Ordered edges to draw the constellation "P" for Pooja!
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
