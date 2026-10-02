import { corsHeaders } from "./cors";

type Bucket = { tokens: number; resetAt: number };
type DiveTrack = { count: number };

const g = globalThis as unknown as {
  __depthBuckets?: Map<string, Bucket>;
  __depthDives?: Map<string, DiveTrack>;
};

function buckets() {
  if (!g.__depthBuckets) g.__depthBuckets = new Map();
  return g.__depthBuckets;
}
function dives() {
  if (!g.__depthDives) g.__depthDives = new Map();
  return g.__depthDives;
}

export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const map = buckets();
  let b = map.get(key);
  if (!b || now >= b.resetAt) {
    b = { tokens: limit, resetAt: now + windowMs };
    map.set(key, b);
  }
  if (b.tokens <= 0) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
    };
  }
  b.tokens -= 1;
  return { ok: true };
}

export function acquireDive(ip: string, maxConcurrent = 2): boolean {
  const map = dives();
  const t = map.get(ip) || { count: 0 };
  if (t.count >= maxConcurrent) return false;
  t.count += 1;
  map.set(ip, t);
  return true;
}

export function releaseDive(ip: string): void {
  const map = dives();
  const t = map.get(ip);
  if (!t) return;
  t.count = Math.max(0, t.count - 1);
  if (t.count === 0) map.delete(ip);
  else map.set(ip, t);
}

export function tooManyResponse(retryAfterSec: number, req?: Request) {
  return new Response(
    JSON.stringify({ error: "rate limit exceeded", hint: "slow down" }),
    {
      status: 429,
      headers: {
        ...corsHeaders(req),
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
      },
    },
  );
}
