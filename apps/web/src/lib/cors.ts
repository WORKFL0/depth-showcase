import { NextResponse } from "next/server";

const EXTRA = (process.env.DEPTH_CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null;
  try {
    const u = new URL(origin);
    const host = u.hostname;
    if (host === "localhost" || host === "127.0.0.1") return origin;
    if (host === "depth-showcase.vercel.app") return origin;
    if (host.endsWith(".vercel.app")) return origin;
    if (EXTRA.includes(origin)) return origin;
  } catch {
    return null;
  }
  return null;
}

export function corsHeaders(req?: Request): Record<string, string> {
  const origin = req ? req.headers.get("origin") : null;
  const allowed = isAllowedOrigin(origin);
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Accept, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (allowed) {
    headers["Access-Control-Allow-Origin"] = allowed;
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  return headers;
}

/** @deprecated use corsHeaders(req) — kept name for call sites during migrate */
export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
  Vary: "Origin",
};

export function withCors<T>(
  data: T,
  init?: ResponseInit,
  req?: Request,
): NextResponse<T> {
  const headers = new Headers(init?.headers);
  for (const [k, v] of Object.entries(corsHeaders(req))) headers.set(k, v);
  return NextResponse.json(data, { ...init, headers });
}

export function optionsCors(req?: Request): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req),
  });
}
