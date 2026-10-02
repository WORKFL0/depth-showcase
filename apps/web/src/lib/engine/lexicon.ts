export const ADJECTIVES = [
  "liminal",
  "hollow",
  "iridescent",
  "forgotten",
  "tidal",
  "crystalline",
  "umbrous",
  "resonant",
  "unspooled",
  "mercurial",
  "quiet",
  "fractured",
  "slow",
  "veiled",
  "borrowed",
  "ancient",
  "spiral",
  "weightless",
  "emberlit",
  "salted",
  "mirrored",
  "breathing",
  "inverted",
  "soft",
  "endless",
] as const;

export const NOUNS = [
  "atrium",
  "well",
  "gallery",
  "threshold",
  "archive",
  "cauldron",
  "nave",
  "rift",
  "cloister",
  "basin",
  "observatory",
  "cavern",
  "passage",
  "sanctum",
  "kiln",
  "orchard",
  "machinery",
  "harbor",
  "cathedral",
  "mirror",
  "stair",
  "vault",
  "garden",
  "engine",
  "chorus",
] as const;

export const VERBS = [
  "remembers",
  "forgets",
  "listens",
  "folds",
  "unspools",
  "echoes",
  "drifts",
  "waits",
  "knives",
  "hums",
  "breathes",
  "fractures",
  "softens",
  "devours",
  "reflects",
] as const;

export const WHISPERS = [
  "You were already here, in another tense.",
  "The walls keep a ledger of almosts.",
  "Depth is a kindness with sharp edges.",
  "Someone left their shadow as a bookmark.",
  "Gravity apologizes in lower frequencies.",
  "A door opens only for the version of you that stays.",
  "Silence is not empty; it is crowded with names.",
  "The seed remembers the hand that planted it.",
  "Paradox is just honesty with two faces.",
  "Light arrives late and leaves early.",
  "Every exit is a rumor wearing shoes.",
  "You descend by agreeing to be smaller.",
  "The chamber knows your first unfinished sentence.",
  "Risk tastes like copper and unfinished music.",
  "What you call down is only sideways in disguise.",
] as const;

export const LAW_TEMPLATES = [
  "What {verb} once must {verb2} twice.",
  "No chamber deeper than {n} may keep its name.",
  "Light owes interest to the dark.",
  "Echoes travel uphill; gravity travels alone.",
  "Memory is taxed at the seventh threshold.",
  "Silence may not be entered without leaving a gift.",
  "Fracture precedes truth by exactly one breath.",
  "A paradox chamber returns what you did not ask.",
  "Risk compounds; resonance forgives.",
  "The seed is law; the path is suggestion.",
] as const;

export const EXIT_LABELS = [
  "Descend the salt stair",
  "Follow the borrowed light",
  "Enter the listening well",
  "Take the soft fracture",
  "Pass the veiled atrium",
  "Lean into the gravity hymn",
  "Cross the echo lattice",
  "Open the memory kiln",
  "Slip beneath the quieter floor",
  "Accept the unsigned door",
  "Climb into the inverted orchard",
  "Touch the mercurial hinge",
] as const;

export const PHENOMENON_LABELS: Record<
  "light" | "echo" | "gravity" | "memory" | "silence" | "fracture",
  readonly string[]
> = {
  light: ["ember veil", "borrowed dawn", "slow aurora", "salt lantern"],
  echo: ["double footfall", "returned name", "lattice reply", "hollow chorus"],
  gravity: ["soft weight", "downward hymn", "pull of almost", "heavy quiet"],
  memory: ["archive dust", "unfinished map", "ledger of almosts", "warm residue"],
  silence: ["held breath", "crowded hush", "wordless tide", "muted orbit"],
  fracture: ["hairline truth", "split horizon", "cracked palette", "open seam"],
};

export const PHENOMENON_DETAILS: Record<
  "light" | "echo" | "gravity" | "memory" | "silence" | "fracture",
  readonly string[]
> = {
  light: [
    "Photons arrive out of order.",
    "Color forgets which wall it belongs to.",
  ],
  echo: [
    "Your last question answers itself sideways.",
    "Footsteps rehearse arrivals that never happen.",
  ],
  gravity: [
    "The floor prefers some versions of you.",
    "Weight redistributes toward unfinished choices.",
  ],
  memory: [
    "A previous visitor left a sentence half-erased.",
    "The room catalogs what you almost said.",
  ],
  silence: [
    "Noise is politely asked to wait outside.",
    "Even the clocks refuse to tick aloud.",
  ],
  fracture: [
    "Geometry admits it was improvising.",
    "A seam opens onto a room that shares your name.",
  ],
};

export const PALETTE_POOL = [
  "#0b1020",
  "#1a1a2e",
  "#16213e",
  "#0f3460",
  "#e94560",
  "#f2a65a",
  "#7ec8e3",
  "#a8e6cf",
  "#c3b1e1",
  "#ffd3b6",
  "#2ec4b6",
  "#ff9f1c",
  "#e71d36",
  "#011627",
  "#fdfffc",
  "#b5179e",
  "#4cc9f0",
  "#80ed99",
  "#ff6b6b",
  "#dee2ff",
] as const;

export const KINDS = [
  "light",
  "echo",
  "gravity",
  "memory",
  "silence",
  "fracture",
] as const;
