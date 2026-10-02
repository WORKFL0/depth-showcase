import { DiveRequestSchema } from "@depth-showcase/api";
import { corsHeaders, optionsCors } from "@/lib/cors";
import { generateChamber, planDive, resolveChamberRef, streamDive } from "@/lib/engine";
import {
  acquireDive,
  clientIp,
  rateLimit,
  releaseDive,
  tooManyResponse,
} from "@/lib/rate-limit";
import { recordDiveVisit } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_STREAM_MS = 8000;

export function OPTIONS(req: Request) {
  return optionsCors(req);
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`dive:${ip}`, 10, 60_000);
  if (!rl.ok) return tooManyResponse(rl.retryAfterSec, req);

  if (!acquireDive(ip, 2)) {
    return tooManyResponse(5, req);
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    releaseDive(ip);
    return new Response(JSON.stringify({ error: "invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }

  const parsed = DiveRequestSchema.safeParse(json);
  if (!parsed.success) {
    releaseDive(ip);
    return new Response(
      JSON.stringify({
        error: "invalid DiveRequest",
        hint: parsed.error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      },
    );
  }

  const plan = planDive(parsed.data);
  if ("error" in plan) {
    releaseDive(ip);
    return new Response(
      JSON.stringify({ error: plan.error, hint: plan.hint }),
      {
        status: plan.status,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      },
    );
  }

  const sessionId = parsed.data.sessionId;
  const fromId = parsed.data.fromChamberId;
  let exitLabel: string | undefined;
  const fromResolved = resolveChamberRef(fromId);
  if (fromResolved && parsed.data.choiceIndex !== undefined) {
    const from = generateChamber(fromResolved.seed, fromResolved.path);
    exitLabel = from.exits[parsed.data.choiceIndex]?.label;
  }

  const encoder = new TextEncoder();
  const started = Date.now();
  let recorded = false;
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of streamDive(plan)) {
          if (Date.now() - started > MAX_STREAM_MS) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "surface",
                  reason: "max stream duration",
                  at: new Date().toISOString(),
                })}\n\n`,
              ),
            );
            break;
          }
          if (event.type === "enter" && sessionId && !recorded) {
            recorded = true;
            await recordDiveVisit(sessionId, fromId, event.chamber, exitLabel);
          }
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
          );
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`),
        );
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "surface",
              reason: String(err),
              at: new Date().toISOString(),
            })}\n\n`,
          ),
        );
        controller.close();
      } finally {
        releaseDive(ip);
      }
    },
    cancel() {
      releaseDive(ip);
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders(req),
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
