export const CONFIG = {
  recipientName: "Pooja",
  author: "Vijay",
  passwordDate: "11/11/2026",      // accept 11/11/2026, 11-11-2026, 11112026, 111126
  birthday: { day: 17, month: 11 }, // 17 Nov, used for the birthday star
  song: {
    title: "Mudhal Mazhai",
    file: "/audio/ambient.mp3",
    // External links so she can play the original song directly without heavy downloads
    spotifyUrl: "https://open.spotify.com/search/Mudhal%20Mazhai",
    youtubeUrl: "https://www.youtube.com/results?search_query=Mudhal+Mazhai+song",
  },
  introLine: "I made you a small universe.",
  targetUnlockCount: 4,            // tuned for 6-7 curated stars
  targetPlanetCount: 2,            // 2 planets needed for finale
};
