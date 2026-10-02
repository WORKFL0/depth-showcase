import type { Health } from "@depth-showcase/api";
import { optionsCors, withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return optionsCors();
}

export function GET() {
  const body: Health = {
    ok: true,
    service: "depth-engine",
    version: "0.1.0",
  };
  return withCors(body);
}
