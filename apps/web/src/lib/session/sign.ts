import { createHmac, timingSafeEqual } from "node:crypto";
import type { Session } from "@depth-showcase/api";
import { SessionSchema } from "@depth-showcase/api";

/**
 * DEMO ONLY default — override with DEPTH_SESSION_SECRET in production.
 * Marked clearly so showcase deploys work without env wiring.
 */
export const DEMO_SESSION_SECRET =
  "depth-showcase-demo-secret-NOT-FOR-PRODUCTION";

export function sessionSecret(): string {
  return process.env.DEPTH_SESSION_SECRET?.trim() || DEMO_SESSION_SECRET;
}

function b64url(buf: Buffer | string): string {
  const b = typeof buf === "string" ? Buffer.from(buf, "utf8") : buf;
  return b
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

export function signSession(session: Session): string {
  const payload = b64url(JSON.stringify(session));
  const mac = createHmac("sha256", sessionSecret())
    .update(payload)
    .digest();
  return `${payload}.${b64url(mac)}`;
}

export function verifySessionToken(token: string): Session | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let expected: Buffer;
  try {
    expected = createHmac("sha256", sessionSecret()).update(payload).digest();
  } catch {
    return null;
  }
  let got: Buffer;
  try {
    got = fromB64url(sig);
  } catch {
    return null;
  }
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) {
    return null;
  }
  try {
    const json = JSON.parse(fromB64url(payload).toString("utf8"));
    const parsed = SessionSchema.safeParse(json);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function signSessionId(id: string): string {
  const mac = createHmac("sha256", sessionSecret()).update(`id:${id}`).digest();
  return `${id}.${b64url(mac)}`;
}

export function verifySessionIdToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const id = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", sessionSecret())
    .update(`id:${id}`)
    .digest();
  let got: Buffer;
  try {
    got = fromB64url(sig);
  } catch {
    return null;
  }
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) {
    return null;
  }
  return id || null;
}
