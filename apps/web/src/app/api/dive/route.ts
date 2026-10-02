import { DiveRequestSchema } from "@depth-showcase/api";
import { CORS_HEADERS, optionsCors } from "@/lib/cors";
import { planDive, streamDive } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function OPTIONS() {
  return optionsCors();
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const parsed = DiveRequestSchema.safeParse(json);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "invalid DiveRequest",
        hint: parsed.error.message,
      }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  const plan = planDive(parsed.data);
  if ("error" in plan) {
    return new Response(
      JSON.stringify({ error: plan.error, hint: plan.hint }),
      {
        status: plan.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of streamDive(plan)) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
          );
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "surface", reason: String(err), at: new Date().toISOString() })}\n\n`,
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
