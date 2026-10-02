import type { Health } from "@depth-showcase/api";
import { optionsCors, withCors } from "@/lib/cors";
import { storeMode } from "@/lib/session";

export const dynamic = "force-dynamic";

export function OPTIONS(req: Request) {
  return optionsCors(req);
}

export function GET(req: Request) {
  const body: Health = {
    ok: true,
    service: "depth-engine",
    version: "0.2.0",
    storeMode: storeMode(),
  };
  return withCors(body, undefined, req);
}
