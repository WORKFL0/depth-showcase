import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Session, StoreMode } from "@depth-showcase/api";

export interface SessionStore {
  mode: StoreMode;
  get(id: string): Promise<Session | null>;
  set(session: Session): Promise<void>;
  delete?(id: string): Promise<void>;
}

const g = globalThis as unknown as {
  __depthSessions?: Map<string, Session>;
};

function memMap(): Map<string, Session> {
  if (!g.__depthSessions) g.__depthSessions = new Map();
  return g.__depthSessions;
}

export class MemorySessionStore implements SessionStore {
  mode: StoreMode = "memory";
  async get(id: string): Promise<Session | null> {
    return memMap().get(id) ?? null;
  }
  async set(session: Session): Promise<void> {
    memMap().set(session.id, session);
  }
  async delete(id: string): Promise<void> {
    memMap().delete(id);
  }
}

export class FileSessionStore implements SessionStore {
  mode: StoreMode = "file";
  constructor(private dir: string) {}
  private file(id: string) {
    const safe = id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 128);
    return path.join(this.dir, `${safe}.json`);
  }
  async get(id: string): Promise<Session | null> {
    try {
      const raw = await readFile(this.file(id), "utf8");
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  }
  async set(session: Session): Promise<void> {
    await mkdir(this.dir, { recursive: true });
    await writeFile(this.file(session.id), JSON.stringify(session, null, 2), "utf8");
  }
  async delete(id: string): Promise<void> {
    try {
      const { unlink } = await import("node:fs/promises");
      await unlink(this.file(id));
    } catch {
      /* ignore */
    }
  }
}

let cached: SessionStore | null = null;

export function getSessionStore(): SessionStore {
  if (cached) return cached;
  const dir = process.env.DEPTH_SESSION_DIR?.trim();
  if (dir) {
    cached = new FileSessionStore(dir);
  } else {
    cached = new MemorySessionStore();
  }
  return cached;
}

export function storeMode(): StoreMode {
  return getSessionStore().mode;
}
