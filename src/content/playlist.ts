export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  note: string;
  spotifyUri?: string;
}

export const PLAYLIST_CONFIG = {
  title: "Songs That Feel Like You",
  curator: "Vijay",
  description: "A collection of melodies that remind me of your voice, our late-night conversations, and how comfortable everything feels when I'm talking to you.",
  spotifyPlaylistUrl: "https://open.spotify.com/track/4Nk88cgvkUWPz1gX2uoK4a?si=e7bac96f650c4953",
  tracks: [
    {
      id: "track-1",
      title: "Mudhal Mazhai",
      artist: "Harris Jayaraj, Hariharan, Mahathi",
      note: "Like the very first rain that changes the scent of the entire earth — that's what talking to you felt like.",
      spotifyUri: "https://open.spotify.com/track/4Nk88cgvkUWPz1gX2uoK4a"
    },
    {
      id: "track-2",
      title: "Mundhinam Paartheney",
      artist: "Harris Jayaraj, Naresh Iyer",
      note: "Your favorite melody. The one that belongs to quiet walks, shared earbuds, and moments where no words are needed.",
      spotifyUri: "https://open.spotify.com/search/Mundhinam%20Paartheney"
    },
    {
      id: "track-3",
      title: "Unakkul Naane",
      artist: "Harris Jayaraj, Bombay Jayashri",
      note: "Gentle, calm, and soothing — just like how safe and peaceful it feels to be completely myself around you.",
      spotifyUri: "https://open.spotify.com/search/Unakkul%20Naane"
    },
    {
      id: "track-4",
      title: "Enna Sona",
      artist: "A.R. Rahman, Arijit Singh",
      note: "For the way you laugh before you even finish telling a joke, and how your face lights up when you smile.",
      spotifyUri: "https://open.spotify.com/search/Enna%20Sona"
    }
  ]
};
