export type PlanetComponentType =
  | "FirstMeeting"
  | "FavoritePlace"
  | "InsideJoke"
  | "Future"
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
    name: "The Origin",
    theme: "First Meeting",
    description: "The day we started talking — scrub through time to see how the spark began.",
    position: [12, 3, -10],
    color: "#ff5fb7",
    glowColor: "#ff90d4",
    size: 1.6,
    component: "FirstMeeting",
    payload: {
      title: "Where It Began",
      date: "11 November 2026",
      stages: [
        { time: "Day 0", text: "Two paths crossing in a quiet corner of the digital world." },
        { time: "First Message", text: "A simple hello that unexpectedly turned into hours of banter." },
        { time: "Midnight", text: "Realizing neither of us wanted to say goodnight just yet." },
        { time: "Now", text: "Now here you are, exploring your very own little universe." }
      ]
    }
  },
  {
    id: "planet-favorite-place",
    name: "The Sanctuary",
    theme: "Favorite Place",
    description: "A serene spot that feels warm and timeless — look around and breathe.",
    position: [-14, 5, -8],
    color: "#4fd6d0",
    glowColor: "#9cf0ec",
    size: 1.8,
    component: "FavoritePlace",
    payload: {
      title: "Under The Canopy of Stars",
      vibe: "A quiet rooftop under a cool night breeze, warm cups in hand, where the noise of the busy world fades into comfortable peace."
    }
  },
  {
    id: "planet-inside-joke",
    name: "Silly Moon",
    theme: "Inside Jokes",
    description: "Things only we smile at — tap through the punchlines.",
    position: [8, -8, 8],
    color: "#ffd48a",
    glowColor: "#ffe6b8",
    size: 1.5,
    component: "InsideJoke",
    payload: {
      jokes: [
        {
          setup: "Why did we stay up so late talking?",
          punchline: "Because sleep is overrated when the conversation is this good."
        },
        {
          setup: "Official law of our banter:",
          punchline: "The more random the topic, the faster two hours disappear."
        },
        {
          setup: "Who is the cooler person in this universe?",
          punchline: "You, hands down! (Vijay is still taking notes 😉)"
        }
      ]
    }
  }
];
