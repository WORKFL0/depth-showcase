import type { Chamber, DiveEvent, DiveRequest } from "@depth-showcase/api";
import { clamp01 } from "./prng";
import { generateChamber, resolveChamberRef } from "./chamber";

function now(): string {
  return new Date().toISOString();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export type DivePlan = {
  events: DiveEvent[];
  /** total intentional delay budget ms */
  delaysMs: number[];
};

/**
 * Build a deterministic-ish dive event sequence (5–12 events).
 * Delays are separate so the SSE route can stream them over 2–4s.
 */
export function planDive(body: DiveRequest): DivePlan | { error: string; hint?: string; status: number } {
  const intensity = clamp01(
    body.intensity === undefined ? 0.5 : body.intensity,
  );

  const resolved = resolveChamberRef(body.fromChamberId);
  if (!resolved) {
    return {
      status: 404,
      error: "unknown chamber",
      hint: "Use a chamber id from /api/seed (rootChamberId) or an exit.targetIdHint. Opaque ids need the hint suffix.",
    };
  }

  const from = generateChamber(resolved.seed, resolved.path);

  // Choice out of bounds → whisper + surface
  if (
    body.choiceIndex !== undefined &&
    (body.choiceIndex < 0 || body.choiceIndex >= from.exits.length)
  ) {
    return {
      events: [
        {
          type: "whisper",
          text: "That door was never drawn on this map.",
          at: now(),
        },
        {
          type: "surface",
          reason: "choiceIndex out of bounds",
          at: now(),
        },
      ],
      delaysMs: [200, 400],
    };
  }

  const choice =
    body.choiceIndex !== undefined
      ? body.choiceIndex
      : Math.min(
          from.exits.length - 1,
          Math.floor(intensity * from.exits.length),
        );

  const nextPath = [...resolved.path, choice];
  const next: Chamber = generateChamber(resolved.seed, nextPath);

  const events: DiveEvent[] = [];
  const delaysMs: number[] = [];

  events.push({ type: "enter", chamber: next, at: now() });
  delaysMs.push(280);

  // Stream phenomena (1–all depending on intensity)
  const phenCount = Math.max(
    1,
    Math.min(next.phenomena.length, Math.ceil(1 + intensity * next.phenomena.length)),
  );
  for (let i = 0; i < phenCount; i++) {
    events.push({
      type: "phenomenon",
      phenomenon: next.phenomena[i]!,
      at: now(),
    });
    delaysMs.push(180 + Math.floor(intensity * 120));
  }

  if (next.whisper) {
    events.push({ type: "whisper", text: next.whisper, at: now() });
    delaysMs.push(320);
  } else if (intensity > 0.7) {
    events.push({
      type: "whisper",
      text: "The descent agrees with you — carefully.",
      at: now(),
    });
    delaysMs.push(260);
  }

  // Paradox or deep intensity → chance of early surface
  const shouldSurface =
    next.paradox && intensity > 0.85
      ? true
      : next.depth >= 12 && intensity < 0.2;

  if (shouldSurface) {
    events.push({
      type: "surface",
      reason: next.paradox
        ? "paradox chamber rejected further descent"
        : "pressure too thin to continue",
      at: now(),
    });
    delaysMs.push(400);
  } else {
    events.push({ type: "fork", exits: next.exits, at: now() });
    delaysMs.push(350);
  }

  // Pad to at least 5 events with extra whispers/phenomena echoes if needed
  while (events.length < 5) {
    const insertAt = Math.max(1, events.length - 1);
    events.splice(insertAt, 0, {
      type: "whisper",
      text: "A quieter layer rearranges itself.",
      at: now(),
    });
    delaysMs.splice(insertAt, 0, 220);
  }

  // Cap at 12
  if (events.length > 12) {
    events.length = 12;
    delaysMs.length = 12;
  }

  // Stretch delays into ~2–4s total
  const sum = delaysMs.reduce((a, b) => a + b, 0);
  const target = 2000 + Math.floor(intensity * 2000); // 2–4s
  const scale = target / Math.max(sum, 1);
  const scaled = delaysMs.map((d) => Math.max(80, Math.floor(d * scale)));

  return { events, delaysMs: scaled };
}

export async function* streamDive(
  plan: DivePlan,
): AsyncGenerator<DiveEvent, void, unknown> {
  for (let i = 0; i < plan.events.length; i++) {
    if (i > 0) await sleep(plan.delaysMs[i] ?? 200);
    else await sleep(plan.delaysMs[0] ?? 100);
    // refresh `at` at emit time
    const ev = plan.events[i]!;
    yield { ...ev, at: now() };
  }
}
