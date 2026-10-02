import type {
  Chamber,
  Exit,
  Phenomenon,
  PhenomenonKind,
  SeedManifest,
} from "@depth-showcase/api";
import {
  ADJECTIVES,
  EXIT_LABELS,
  KINDS,
  LAW_TEMPLATES,
  NOUNS,
  PALETTE_POOL,
  PHENOMENON_DETAILS,
  PHENOMENON_LABELS,
  VERBS,
  WHISPERS,
} from "./lexicon";
import { clamp01, hexHash, pick, pickN, rngFromKey } from "./prng";

/** Path key: seed + '/' + slash-joined choice indices from root. */
export function chamberId(seed: string, path: number[]): string {
  const pathKey = path.length ? path.join(".") : "root";
  return `ch_${hexHash(`${seed}::${pathKey}`, 10)}`;
}

export function parseChamberId(
  id: string,
): { seed: string; path: number[] } | null {
  // Encoded form: ch_<hash> alone is not enough — we also accept
  // ch_<hash>__seed=<url>__path=0.1.2 for transport, OR look up via
  // opaque id registry. For determinism without storage we embed
  // seed+path in an extended id used by exits as targetIdHint.
  // Primary public id remains ch_<hash>; targetIdHint carries payload.
  return null;
}

/**
 * Transport-stable target hint that encodes seed + path so any chamber
 * can be reconstituted without a database.
 * Format: `hint:<seedB64>:<pathJoined>`
 */
export function encodeHint(seed: string, path: number[]): string {
  const seedB64 = Buffer.from(seed, "utf8").toString("base64url");
  const pathPart = path.length ? path.join(".") : "root";
  return `hint:${seedB64}:${pathPart}`;
}

export function decodeHint(
  hint: string,
): { seed: string; path: number[] } | null {
  if (!hint.startsWith("hint:")) return null;
  const rest = hint.slice(5);
  const colon = rest.indexOf(":");
  if (colon < 0) return null;
  const seedB64 = rest.slice(0, colon);
  const pathPart = rest.slice(colon + 1);
  try {
    const seed = Buffer.from(seedB64, "base64url").toString("utf8");
    if (!seed) return null;
    const path =
      pathPart === "root" || pathPart === ""
        ? []
        : pathPart.split(".").map((n) => {
            const v = Number(n);
            if (!Number.isInteger(v) || v < 0) throw new Error("bad path");
            return v;
          });
    return { seed, path };
  } catch {
    return null;
  }
}

/** Resolve a chamber from either a full hint-id or opaque ch_ id + seed query. */
export function resolveChamberRef(
  id: string,
  seedFallback?: string,
): { seed: string; path: number[] } | null {
  if (id.startsWith("hint:")) return decodeHint(id);
  // Allow composite: ch_<hash>|hint:...
  const pipe = id.indexOf("|");
  if (pipe >= 0) {
    const hint = id.slice(pipe + 1);
    return decodeHint(hint);
  }
  if (seedFallback) {
    // Without path we can only return root
    return { seed: seedFallback, path: [] };
  }
  return null;
}

function isParadox(seed: string, depth: number, path: number[]): boolean {
  if (depth === 0) return false;
  if (depth % 7 !== 0) return false;
  const bit = hexHash(`${seed}:paradox:${path.join(".")}`, 1);
  return parseInt(bit, 16) % 2 === 0;
}

function makeTitle(rng: () => number, depth: number, paradox: boolean): string {
  const adj = pick(rng, ADJECTIVES);
  const noun = pick(rng, NOUNS);
  if (paradox) return `Paradox ${noun[0]!.toUpperCase()}${noun.slice(1)}`;
  if (depth === 0) return `The ${adj} ${noun}`;
  if (rng() > 0.55) return `${adj[0]!.toUpperCase()}${adj.slice(1)} ${noun}`;
  return `The ${adj} ${noun}`;
}

function makePhenomena(
  rng: () => number,
  depth: number,
  paradox: boolean,
): Phenomenon[] {
  const count = 1 + Math.floor(rng() * (paradox ? 4 : 3));
  const kinds = pickN(rng, KINDS, count) as PhenomenonKind[];
  return kinds.map((kind) => {
    const intensity = clamp01(
      0.25 + rng() * 0.6 + (paradox ? 0.15 : 0) + depth * 0.02,
    );
    const label = pick(rng, PHENOMENON_LABELS[kind]);
    const detail =
      rng() > 0.35 ? pick(rng, PHENOMENON_DETAILS[kind]) : undefined;
    return { kind, intensity, label, ...(detail ? { detail } : {}) };
  });
}

function makeExits(
  seed: string,
  path: number[],
  rng: () => number,
  depth: number,
): Exit[] {
  const count = 2 + Math.floor(rng() * 3); // 2–4
  const labels = pickN(rng, EXIT_LABELS, count);
  return labels.map((label, i) => {
    const childPath = [...path, i];
    const risk = clamp01(0.1 + rng() * 0.7 + depth * 0.03);
    return {
      label,
      targetIdHint: `${chamberId(seed, childPath)}|${encodeHint(seed, childPath)}`,
      risk,
    };
  });
}

export function generateChamber(seed: string, path: number[]): Chamber {
  const depth = path.length;
  const key = `${seed}::chamber::${path.join(".") || "root"}`;
  const rng = rngFromKey(key);
  const paradox = isParadox(seed, depth, path);
  const title = makeTitle(rng, depth, paradox);
  const phenomena = makePhenomena(rng, depth, paradox);
  const exits = makeExits(seed, path, rng, depth);
  const resonance = clamp01(0.15 + rng() * 0.7 + (paradox ? 0.2 : 0));
  const whisper =
    paradox || rng() > 0.45 ? pick(rng, WHISPERS) : undefined;

  return {
    id: `${chamberId(seed, path)}|${encodeHint(seed, path)}`,
    depth,
    title,
    seed,
    phenomena,
    exits,
    resonance,
    ...(paradox ? { paradox: true } : {}),
    ...(whisper ? { whisper } : {}),
  };
}

export function generateSeedManifest(seed: string): SeedManifest {
  const rng = rngFromKey(`${seed}::manifest`);
  const hash = hexHash(`world:${seed}`, 16);
  const palette = pickN(rng, PALETTE_POOL, 5);
  const lawCount = 3 + Math.floor(rng() * 3);
  const laws: string[] = [];
  for (let i = 0; i < lawCount; i++) {
    const tpl = pick(rng, LAW_TEMPLATES);
    laws.push(
      tpl
        .replace("{verb}", pick(rng, VERBS))
        .replace("{verb2}", pick(rng, VERBS))
        .replace("{n}", String(3 + Math.floor(rng() * 9))),
    );
  }
  const root = generateChamber(seed, []);
  return {
    seed,
    hash,
    palette,
    rootChamberId: root.id,
    laws,
    createdAt: new Date().toISOString(),
  };
}

export function randomSeed(): string {
  const rng = rngFromKey(`rand:${Date.now()}:${Math.random()}`);
  const a = pick(rng, ADJECTIVES);
  const n = pick(rng, NOUNS);
  const num = Math.floor(rng() * 9000 + 1000);
  return `${a}-${n}-${num}`;
}
