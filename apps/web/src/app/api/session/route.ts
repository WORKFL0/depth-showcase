import { SessionPatchSchema, SessionSchema } from "@depth-showcase/api";
import { optionsCors, withCors, corsHeaders } from "@/lib/cors";
import { generateChamber, resolveChamberRef } from "@/lib/engine";
import { clientIp, rateLimit, tooManyResponse } from "@/lib/rate-limit";
import {
  createSession,
  loadSession,
  patchSession,
  resolveSessionRef,
  sessionCookieHeader,
  signSession,
} from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function OPTIONS(req: Request) {
  return optionsCors(req);
}

export async function POST(req: Request) {
  const rl = rateLimit(`session:${clientIp(req)}`, 20, 60_000);
  if (!rl.ok) return tooManyResponse(rl.retryAfterSec, req);

  let seed: string | undefined;
  try {
    const text = await req.text();
    if (text.trim()) {
      const json = JSON.parse(text) as { seed?: unknown };
      if (typeof json.seed === "string" && json.seed.trim()) {
        seed = json.seed.trim().slice(0, 128);
      }
    }
  } catch {
    /* empty */
  }

  const { session, manifest, chamber, token } = await createSession(seed);
  const headers = new Headers(corsHeaders(req));
  headers.set("Set-Cookie", sessionCookieHeader(token));
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify({ session, manifest, chamber, token }), {
    status: 200,
    headers,
  });
}

export async function GET(req: Request) {
  const ref = resolveSessionRef(req);
  if (!ref) {
    return withCors(
      {
        error: "missing session",
        hint: "Bearer token, ?id=, or depth_session cookie",
      },
      { status: 401 },
      req,
    );
  }
  const session = await loadSession(ref);
  if (!session) {
    return withCors({ error: "session not found" }, { status: 404 }, req);
  }
  const resolved = resolveChamberRef(session.lastChamberId, session.seed);
  const chamber = resolved
    ? generateChamber(resolved.seed, resolved.path)
    : generateChamber(session.seed, []);
  return withCors(
    { session, chamber, token: signSession(session) },
    undefined,
    req,
  );
}

export async function PATCH(req: Request) {
  const rl = rateLimit(`session:${clientIp(req)}`, 20, 60_000);
  if (!rl.ok) return tooManyResponse(rl.retryAfterSec, req);

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return withCors({ error: "invalid JSON" }, { status: 400 }, req);
  }
  const parsed = SessionPatchSchema.safeParse(json);
  if (!parsed.success) {
    return withCors(
      { error: "invalid SessionPatch", hint: parsed.error.message },
      { status: 400 },
      req,
    );
  }
  const ref = resolveSessionRef(req);
  if (!ref) {
    return withCors({ error: "missing session" }, { status: 401 }, req);
  }
  const session = await loadSession(ref);
  if (!session) {
    return withCors({ error: "session not found" }, { status: 404 }, req);
  }
  const next = await patchSession(session, parsed.data);
  const ok = SessionSchema.safeParse(next);
  if (!ok.success) {
    return withCors({ error: "session invalid" }, { status: 500 }, req);
  }
  const token = signSession(next);
  const headers = new Headers(corsHeaders(req));
  headers.set("Set-Cookie", sessionCookieHeader(token));
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify({ session: next, token }), {
    status: 200,
    headers,
  });
}
