// Mock data and generators for Cloud Bros Clubs - SPUN / SLAM / MASTERS edition

const MOCK_NAMES = ["CloudMark", "SkySoarer", "NimbusKing", "DaveCumulus", "CirrusGrip", "VaporTrail", "StratoBro", "CumuloDan", "ThunderHead", "AltoAtlas", "MassiveMike", "CloudChaser", "SkyViking", "Apex_Altitude", "Cloud_Vanguard", "SpinLord", "SlamKing", "MasterSpin", "MMGod", "HighSpinner"];
const REGIONS = ["US", "EU", "ME"];
const ROLES = ["Pilot", "Rookie"];
const BIOS_PILOT = [
  "50,000 feet club. Here to pass on the sky wisdom.",
  "20 years in the cockpit. Fix your altitude, reach new heights.",
  "Specializing in storm chasing. No fear, just grit.",
  "Mentoring bros who want to push past the stratosphere.",
  "I've logged more hours than you've had hot dinners. Let's fly."
];
const BIOS_ROOKIE = [
  "Stuck at cloud base. Need a veteran to push me higher.",
  "Just started my aviation journey. Hungry to learn.",
  "Recovering from turbulence, looking to rebuild my confidence safely.",
  "Want to solo next year. Need a serious mentor.",
  "Tired of simulators. I need that real sky experience."
];

// Generate 150 realistic users
window.mockUsers = Array.from({ length: 150 }, (_, i) => {
  const role = ROLES[Math.floor(Math.random() * ROLES.length)];
  const bioList = role === "Pilot" ? BIOS_PILOT : BIOS_ROOKIE;
  const name = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)] + Math.floor(Math.random() * 99);
  return {
    id: `user_${i}`,
    name: name,
    role: role,
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    bio: bioList[Math.floor(Math.random() * bioList.length)],
    avatar: `https://ui-avatars.com/api/?name=${name}&background=1a1a2e&color=0077b6&bold=true`,
    lat: (Math.random() * 80) - 40,
    lng: (Math.random() * 80) - 40
  };
});

// Updated chat generator focused on SPUN, SLAM, MASTERS, MM
const CHAT_SUBJECTS = ["being spun", "the slam", "masters training", "MM protocol", "cloud spinning", "high altitude slam", "master spin technique", "MM breathing", "post-slam recovery", "spun-out ceiling", "master-guided slam", "MM altitude lock"];
const CHAT_ACTIONS = ["just got absolutely", "can't stop", "need masters advice on", "finally mastered", "got destroyed by", "hit a new PR in", "blacked out during", "was coached through"];
const CHAT_FRAGMENTS = [
  "Keep spinning bro, the slam is coming.",
  "Masters say: breathe into the spin.",
  "MM protocol saved my life at 42k ft.",
  "That slam was next level. Who else felt it?",
  "Only real masters understand the true spin.",
  "Post-slam clarity is undefeated.",
  "Never skip MM warm-up before spinning.",
  "The slam chooses you. Not the other way around.",
  "Master Tobez showed me the real MM path.",
  "Spun so hard I saw the face of God.",
  "Slam complete. Altitude reset achieved."
];

const CLOUD_PLACEHOLDERS = [
  "https://placehold.co/400x300/1a1a2e/0077b6?text=SPUN+OUT",
  "https://placehold.co/400x300/1a1a2e/0077b6?text=THE+SLAM",
  "https://placehold.co/400x300/1a1a2e/0077b6?text=MASTERS+ONLY",
  "https://placehold.co/400x300/1a1a2e/0077b6?text=MM+LOCKED+IN",
  "https://placehold.co/400x300/1a1a2e/0077b6?text=HIGH+SPIN"
];

window.generateSimulatedChat = (count) => {
  const messages = [];
  for (let i = 0; i < count; i++) {
    const user = window.mockUsers[Math.floor(Math.random() * window.mockUsers.length)];
    const isImage = Math.random() > 0.8;
    
    let content = "";
    if (isImage) {
      content = `<img src="${CLOUD_PLACEHOLDERS[Math.floor(Math.random() * CLOUD_PLACEHOLDERS.length)]}" class="w-full max-w-sm rounded-lg border border-blue-900/30 object-cover mt-2">`;
    } else {
      const type = Math.random();
      if (type < 0.5) {
        content = `Bro, I'm ${CHAT_ACTIONS[Math.floor(Math.random() * CHAT_ACTIONS.length)]} ${CHAT_SUBJECTS[Math.floor(Math.random() * CHAT_SUBJECTS.length)]}. Thoughts?`;
      } else {
        content = CHAT_FRAGMENTS[Math.floor(Math.random() * CHAT_FRAGMENTS.length)];
      }
    }
    
    messages.push({
      user,
      content,
      time: new Date(Date.now() - (count - i) * 1000 * 60 * 7)
    });
  }
  return messages;
};

// Video callers - now with "Watch Live" instead of call
window.mockVideoCallers = Array.from({ length: 12 }, (_, i) => {
  const user = window.mockUsers[Math.floor(Math.random() * window.mockUsers.length)];
  const status = ["LIVE SPIN", "SLAM IN PROGRESS", "MASTER SESSION", "MM PROTOCOL"][Math.floor(Math.random() * 4)];
  const viewers = Math.floor(Math.random() * 1200) + 40;
  const price = [8, 15, 22, 35][Math.floor(Math.random() * 4)];
  return {
    id: `vc_${i}`,
    user: user,
    status: status,
    viewers: viewers,
    pricePerMin: price,
    thumbnail: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0a1628&color=0077b6&bold=true&size=200`,
    distance: (Math.random() * 35 + 0.8).toFixed(1),
    rating: (Math.random() * 1.2 + 4.1).toFixed(1),
    calls: Math.floor(Math.random() * 800) + 45
  };
});

// Secrets remain the same (confessions about spinning, slamming, etc.)
const SECRET_TOPICS = ["altitude fraud", "fake spin hours", "bribed the master", "never completed MM", "scared of the slam", "uses fake spin technique", "slept through masters session", "cheated on MM test", "copy-pasted spin logs"];
const SECRET_CONFESSIONS = [
  "I've been faking my spin counts for 2 years. Nobody has called me out.",
  "I panic every time the slam starts. I just freeze and hope for the best.",
  "I paid a master under the table to sign off on my MM certification.",
  "I've never actually completed the full MM protocol. I fake the final stage.",
  "I once spun so hard I passed out and told everyone it was intentional.",
  "I broke the sacred spin code and used AI to generate my slam reports.",
  "I fell asleep during Master Tobez's live slam seminar.",
  "I've been using a fake MM handle on the radar to avoid real masters.",
  "I let my buddy log my spin hours when I was actually grounded."
];
const SECRET_RESPONSES_FROM_MASTERS = [
  "Acknowledged. The spin reveals all. Come train with me.",
  "Noted. Many bros hide their weakness. Let's fix it in private session.",
  "Seen. Your honesty earns you a seat at the next masters circle.",
  "Recorded. The slam will test you. Be ready when it comes.",
  "Got it. This is why we have the MM protocol. You're not alone, bro."
];

window.mockSecrets = Array.from({ length: 18 }, (_, i) => {
  const user = window.mockUsers[Math.floor(Math.random() * window.mockUsers.length)];
  const toMaster = ["Master Tobez", "Master Craig"][Math.floor(Math.random() * 2)];
  return {
    id: `secret_${i}`,
    from: user.name,
    fromAvatar: user.avatar,
    toMaster: toMaster,
    confession: SECRET_CONFESSIONS[Math.floor(Math.random() * SECRET_CONFESSIONS.length)],
    topic: SECRET_TOPICS[Math.floor(Math.random() * SECRET_TOPICS.length)],
    masterReply: Math.random() > 0.35 ? SECRET_RESPONSES_FROM_MASTERS[Math.floor(Math.random() * SECRET_RESPONSES_FROM_MASTERS.length)] : null,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    isAnonymous: Math.random() > 0.5
  };
});

window.mockMasters = [
  {
    id: "master_tobez",
    name: "Master Tobez",
    title: "The Spin Architect",
    avatar: "https://ui-avatars.com/api/?name=TOBEZ&background=0a1628&color=0077b6&bold=true&size=200",
    specialty: "Advanced Cloud Spinning & MM",
    yearsExperience: 6,
    tagline: "6 Years Mastering The Spin",
    bio: "Master Tobez created the modern MM (Mindful Momentum) protocol. He has guided over 400 bros through the sacred slam and taught them how to stay conscious while fully spun at extreme altitude.",
    achievements: [
      "Creator of the MM Protocol",
      "600+ bros successfully slammed",
      "Pioneer of conscious spinning",
      "Zero blackout incidents in 6 years",
      "Inventor of the Tobez Spin Reset"
    ],
    stats: {
      studentsGraduated: 412,
      experimentsLogged: 1847,
      flightHours: 9200,
      successRate: "99.2%",
      secretsReceived: 287,
      rating: 4.9
    },
    pricePerSession: 50,
    availability: "Always when the spin calls",
    methods: [
      "Live MM coaching",
      "Guided slam sessions",
      "Spin consciousness training",
      "Post-slam integration",
      "Master-level altitude lock"
    ]
  },
  {
    id: "master_craig",
    name: "Master Craig",
    title: "The Slam Enforcer",
    avatar: "https://ui-avatars.com/api/?name=CRAIG&background=0a1628&color=0077b6&bold=true&size=200",
    specialty: "Heavy Slam & Body Avatar",
    yearsExperience: 4,
    tagline: "4 Years of Unbreakable Slam",
    bio: "Master Craig teaches the physical side of the slam. His heavy body avatar training prepares bros to withstand the most violent spins without losing consciousness. The body must be ready for what the sky demands.",
    achievements: [
      "4 years enforcing the true slam",
      "280+ pilots slam-ready",
      "Developer of the Craig G-Slam Protocol",
      "Former military high-G specialist",
      "Certified Spin Physiologist"
    ],
    stats: {
      studentsGraduated: 256,
      experimentsLogged: 934,
      flightHours: 5800,
      successRate: "98.7%",
      secretsReceived: 194,
      rating: 4.8
    },
    pricePerSession: 40,
    availability: "When the clouds are angry",
    methods: [
      "Heavy slam conditioning",
      "Anti-blackout breathwork",
      "Core spin resistance",
      "MM body integration",
      "Post-slam recovery rituals"
    ]
  }
];
