export const episodeZero = {
  id: "episode-zero",
  title: "The Invitation",
  opening: {
    narration: [
      "Everybody wants through the gates.",
      "Money. Music. Power. Protection.",
      "But Heavens Gates was never built for everybody.",
      "Because once you're inside… what you choose matters."
    ]
  },
  scenes: {
    opening: {
      id: "opening",
      label: "Episode Zero",
      title: "The Invitation",
      location: "Heavens Gates",
      visual: { src: "/interactive/episode-zero/opening.webp", position: "center", alt: "Heavens Gates Interactive Chronicles opening" },
      narration: "Your choices will be remembered.",
      choices: [{ text: "Enter the Gates", next: "scene-1" }]
    },
    "scene-1": {
      id: "scene-1",
      label: "Scene One",
      title: "Unknown Number",
      location: "Heavens Gates HQ — Night",
      visual: { src: "/interactive/episode-zero/scene-1-barry-makaila.webp", position: "center", alt: "Barry and Makaila at Heavens Gates headquarters at night" },
      narration: "Barry's phone lights up with a message from an unknown number: “WE NEED TO TALK. TONIGHT.”",
      dialogue: [{ speaker: "Makaila", text: "You gonna tell me what that was?" }],
      choices: [
        { id: "tell-makaila", text: "Tell Makaila", effect: { trust: 1 }, next: "scene-2" },
        { id: "keep-quiet", text: "Keep it quiet", effect: { power: 1 }, next: "scene-2" },
        { id: "call-gangsta", text: "Call Gangsta", effect: { legacy: 1 }, next: "scene-2" }
      ]
    },
    "scene-2": {
      id: "scene-2",
      label: "Scene Two",
      title: "The Studio",
      location: "South Beltline Studio",
      visual: { src: "/interactive/episode-zero/scene-2-studio.webp", position: "center", alt: "Asad, Gangsta and Sarah Rae in the South Beltline studio" },
      narration: "Asad discovers that somebody outside Heavens Gates knows something that has not been announced. A file was accessed from the wrong place.",
      conditionalPrelude: {
        "tell-makaila": { speaker: "Makaila", text: "Barry showed me the message. Nobody moves alone until we know what this is." },
        "keep-quiet": { speaker: "Barry", text: "Keep this room tight. I don't want this traveling until we know what we're looking at." },
        "call-gangsta": { speaker: "Gangsta", text: "Barry called me before I got here. Whatever this is, we handle it together." }
      },
      dialogue: [
        { speaker: "Gangsta", text: "Then let's find out who talking." },
        { speaker: "Sarah Rae", text: "And do what? You don't even know what happened yet." }
      ],
      choices: [
        { id: "follow-gangsta", text: "Follow Gangsta", effect: { power: 1 }, next: "scene-3" },
        { id: "listen-sarah", text: "Listen to Sarah", effect: { trust: 1 }, next: "scene-3" },
        { id: "call-barry", text: "Call Barry", effect: { legacy: 1 }, next: "scene-3" }
      ]
    },
    "scene-3": {
      id: "scene-3",
      label: "Scene Three",
      title: "Somebody Has the Key",
      location: "Administrative Office",
      visual: { src: "/interactive/episode-zero/scene-3-jamila.webp", position: "center", alt: "Jamila discovering the unauthorized Heavens Gates file access" },
      narration: "Jamila finds HG_EXPANSION_PLAN.pdf accessed three times from unauthorized locations. The administrator credential attached to the access log reads: BARRY PARKER.",
      dialogue: [
        { speaker: "Jamila", text: "Daddy… I think y'all need to see this." },
        { speaker: "Barry", text: "Who opened it?" },
        { speaker: "Jamila", text: "That's the problem." },
        { speaker: "Jamila", text: "It says you did." }
      ],
      conditionalReaction: {
        "follow-gangsta": { speaker: "Gangsta", text: "Say the word. We trace whoever touched it." },
        "listen-sarah": { speaker: "Sarah Rae", text: "Now you see why we needed facts before somebody made a move." },
        "call-barry": { speaker: "Barry", text: "Good. Nobody touches that log until I see everything." }
      },
      choices: [{ id: "face-it", text: "Face the breach", next: "payoff" }]
    },
    payoff: {
      id: "payoff",
      label: "The Payoff",
      title: "Inside the System",
      location: "Heavens Gates HQ",
      visual: { src: "/interactive/episode-zero/payoff.webp", position: "center", alt: "Barry, Makaila and Jamila confronting the Heavens Gates security breach" },
      narration: "Empires don't always fall because somebody kicks the door in. Sometimes… somebody already has the key.",
      conditionalDialogue: {
        "tell-makaila": { speaker: "Makaila", text: "Somebody's inside our system." },
        "keep-quiet": { speaker: "Makaila", text: "Is there something else you haven't told me?" },
        "call-gangsta": { speaker: "System", text: "GANGSTA CALLING…" }
      },
      choices: [{ id: "continue", text: "Continue", next: "ending" }]
    },
    ending: {
      id: "ending",
      label: "Episode Complete",
      title: "Your Choices Have Only Begun.",
      location: "Heavens Gates: The Interactive Chronicles",
      visual: { src: "/interactive/episode-zero/ending.webp", position: "center", alt: "Heavens Gates Interactive Chronicles episode ending" },
      narration: "The breach remains unresolved.",
      endingVariations: {
        trust: "You chose openness and restraint. The people closest to the Gates know more — and they will remember that.",
        power: "You chose control and decisive action. The Gates are on alert — but pressure has a way of exposing fractures.",
        legacy: "You chose the people and structure behind the empire. The circle is tightening around what Heavens Gates must protect."
      },
      ending: true
    }
  }
};

export const initialEpisodeState = {
  currentScene: "opening",
  choices: [],
  trust: 0,
  power: 0,
  legacy: 0,
  audioSettings: { muted: false, captions: true, autoplay: false },
  readMode: false,
  episodeCompleted: false
};
