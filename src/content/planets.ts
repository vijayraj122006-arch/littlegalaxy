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
    position: [14, 2, -12],
    color: "#ff5fb7",
    glowColor: "#ff90d4",
    size: 1.6,
    component: "FirstMeeting",
    payload: {
      title: "Where It All Began",
      date: "11 November 2026",
      stages: [
        { time: "Day 0", text: "Two paths crossing in a vast digital space." },
        { time: "First Message", text: "A simple hello that turned into hours of conversation." },
        { time: "Midnight", text: "Realizing we lost track of time talking about everything." },
        { time: "Today", text: "Now here we are, exploring our very own little universe." }
      ]
    }
  },
  {
    id: "planet-favorite-place",
    name: "The Sanctuary",
    theme: "Favorite Place",
    description: "A serene spot that feels warm and timeless — look around and breathe.",
    position: [-16, 6, -10],
    color: "#4fd6d0",
    glowColor: "#9cf0ec",
    size: 1.8,
    component: "FavoritePlace",
    payload: {
      title: "Under The Canopy of Stars",
      vibe: "A quiet rooftop under cool night breezes, warm tea in hand, where the noise of the world fades into peaceful silence."
    }
  },
  {
    id: "planet-inside-joke",
    name: "Silly Moon",
    theme: "Inside Jokes",
    description: "Things only we laugh at — tap through the punchlines.",
    position: [10, -10, 10],
    color: "#ffd48a",
    glowColor: "#ffe6b8",
    size: 1.4,
    component: "InsideJoke",
    payload: {
      jokes: [
        {
          setup: "Why did we stay up so late talking?",
          punchline: "Because sleep is overrated when the company is this good."
        },
        {
          setup: "Official theorem of random banter:",
          punchline: "The weirder the conversation topic, the faster 2 hours pass."
        },
        {
          setup: "Who is the cooler person in this universe?",
          punchline: "You, without a doubt! (Though Vijay tries his best 😉)"
        }
      ]
    }
  },
  {
    id: "planet-future",
    name: "The Horizon",
    theme: "Future Dreams",
    description: "Things to look forward to — tap the dark cluster to ignite each dream.",
    position: [-12, -8, -14],
    color: "#7b5cff",
    glowColor: "#b29eff",
    size: 1.7,
    component: "Future",
    payload: {
      dreams: [
        { id: "d1", title: "Unplanned Trips", note: "Exploring spontaneous places with no strict itinerary." },
        { id: "d2", title: "Celebration Feasts", note: "Trying new dessert spots and laughing over good food." },
        { id: "d3", title: "Shared Milestones", note: "Cheering for every win and exciting step ahead." },
        { id: "d4", title: "Many More Laughs", note: "Countless silly moments yet to be lived." }
      ]
    }
  },
  {
    id: "planet-song",
    name: "Mudhal Mazhai",
    theme: "Song of the Rain",
    description: "Tap to make celestial rain fall in rhythm with the melody.",
    position: [0, 14, 8],
    color: "#6ee7b7",
    glowColor: "#a7f3d0",
    size: 1.5,
    component: "Song",
    payload: {
      songTitle: "Mudhal Mazhai",
      caption: "Like the first gentle shower of rain that refreshes everything it touches."
    }
  }
];
