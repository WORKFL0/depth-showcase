import type {
  Chamber,
  ConstellationNode,
  Session,
  SessionPatch,
  SeedManifest,
} from "@depth-showcase/api";
import {
  generateChamber,
  generateSeedManifest,
  randomSeed,
  resolveChamberRef,
} from "@/lib/engine";
import { getSessionStore } from "./store";
import { signSession, verifySessionToken, verifySessionIdToken } from "./sign";

export { getSessionStore, storeMode } from "./store";
export {
  signSession,
  verifySessionToken,
  sessionSecret,
  DEMO_SESSION_SECRET,
} from "./sign";

function now() {
  return new Date().toISOString();
}

function newId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function nodeFromChamber(c: Chamber): ConstellationNode {
  return {
    id: c.id,
    depth: c.depth,
    title: c.title,
    ...(c.paradox ? { paradox: true } : {}),
  };
}

function ensureNode(session: Session, id: string) {
  if (session.discoveries.nodes.some((n) => n.id === id)) return;
  const resolved = resolveChamberRef(id, session.seed);
  if (!resolved) return;
  session.discoveries.nodes.push(
    nodeFromChamber(generateChamber(resolved.seed, resolved.path)),
  );
}

export async function createSession(seedInput?: string): Promise<{
  session: Session;
  manifest: SeedManifest;
  chamber: Chamber;
  token: string;
}> {
  const seed = (seedInput?.trim() || randomSeed()).slice(0, 128);
  const manifest = generateSeedManifest(seed);
  const chamber = generateChamber(seed, []);
  const ts = now();
  const session: Session = {
    id: newId(),
    seed: manifest.seed,
    hash: manifest.hash,
    visitedChamberIds: [chamber.id],
    lastChamberId: chamber.id,
    diveCount: 0,
    discoveries: { nodes: [nodeFromChamber(chamber)], edges: [] },
    createdAt: ts,
    updatedAt: ts,
  };
  await getSessionStore().set(session);
  return { session, manifest, chamber, token: signSession(session) };
}

export async function loadSession(idOrToken: string): Promise<Session | null> {
  const store = getSessionStore();
  if (idOrToken.includes(".")) {
    const fromToken = verifySessionToken(idOrToken);
    if (fromToken) {
      const cached = await store.get(fromToken.id);
      if (
        cached &&
        new Date(cached.updatedAt).getTime() >=
          new Date(fromToken.updatedAt).getTime()
      ) {
        return cached;
      }
      await store.set(fromToken);
      return fromToken;
    }
    const idFromSig = verifySessionIdToken(idOrToken);
    if (idFromSig) {
      const s = await store.get(idFromSig);
      if (s) return s;
    }
  }
  const bare = await store.get(idOrToken);
  if (bare) return bare;
  const again = verifySessionToken(idOrToken);
  if (again) {
    const cached = await store.get(again.id);
    if (
      cached &&
      new Date(cached.updatedAt).getTime() >=
        new Date(again.updatedAt).getTime()
    ) {
      return cached;
    }
    await store.set(again);
    return again;
  }
  return null;
}

export function resolveSessionRef(
  req: Request,
  bodyId?: string | null,
): string | null {
  const url = new URL(req.url);
  const q = url.searchParams.get("id") || url.searchParams.get("sessionId");
  if (q) return q;
  if (bodyId) return bodyId;
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim() || null;
  }
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)depth_session=([^;]+)/);
  if (m?.[1]) return decodeURIComponent(m[1]);
  return null;
}

export async function patchSession(
  session: Session,
  patch: SessionPatch,
): Promise<Session> {
  const next: Session = {
    ...session,
    discoveries: {
      nodes: [...session.discoveries.nodes],
      edges: [...session.discoveries.edges],
    },
    visitedChamberIds: [...session.visitedChamberIds],
    updatedAt: now(),
  };

  if (patch.visitChamberId) {
    const id = patch.visitChamberId;
    if (!next.visitedChamberIds.includes(id)) next.visitedChamberIds.push(id);
    next.lastChamberId = id;
    ensureNode(next, id);
  }

  if (patch.unlockEdge) {
    const e = patch.unlockEdge;
    const exists = next.discoveries.edges.some(
      (x) => x.from === e.from && x.to === e.to && x.label === e.label,
    );
    if (!exists) next.discoveries.edges.push(e);
    for (const id of [e.from, e.to]) {
      if (!next.visitedChamberIds.includes(id)) next.visitedChamberIds.push(id);
      ensureNode(next, id);
    }
  }

  await getSessionStore().set(next);
  return next;
}

export async function recordDiveVisit(
  sessionId: string,
  fromChamberId: string,
  toChamber: Chamber,
  exitLabel?: string,
): Promise<Session | null> {
  const session = await loadSession(sessionId);
  if (!session) return null;
  const patch: SessionPatch = { visitChamberId: toChamber.id };
  if (exitLabel) {
    patch.unlockEdge = {
      from: fromChamberId,
      to: toChamber.id,
      label: exitLabel,
    };
  }
  const next = await patchSession(session, patch);
  next.diveCount = session.diveCount + 1;
  next.updatedAt = now();
  await getSessionStore().set(next);
  return next;
}

export function discoveredConstellation(session: Session) {
  return {
    seed: session.seed,
    nodes: session.discoveries.nodes,
    edges: session.discoveries.edges,
    mode: "discovered" as const,
  };
}

export const SESSION_COOKIE = "depth_session";

export function sessionCookieHeader(token: string): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}
