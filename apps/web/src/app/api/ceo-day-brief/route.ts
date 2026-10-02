import { optionsCors, withCors } from "@/lib/cors";
import { loadCeoDayBrief } from "@/lib/cockpit/load-day-brief";

export const dynamic = "force-dynamic";

export function OPTIONS(req: Request) {
  return optionsCors(req);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const result = loadCeoDayBrief(url.searchParams.get("trigger"));
  if (!result.ok) {
    return withCors(
      { error: result.error, hint: result.hint },
      { status: result.status },
      req,
    );
  }
  return withCors(result.data, undefined, req);
}
