import type {
  Chamber,
  Constellation,
  DiveEvent,
  DiveRequest,
  Health,
  SeedManifest,
} from "@depth-showcase/api";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchHealth(): Promise<Health> {
  return json(await fetch("/api/health"));
}

export async function postSeed(seed?: string): Promise<SeedManifest> {
  return json(
    await fetch("/api/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seed ? { seed } : {}),
    }),
  );
}

/** Chamber ids can be long / hint-embedded — always URL-encode. */
export async function fetchChamber(
  id: string,
  seed?: string,
): Promise<Chamber> {
  const q = seed ? `?seed=${encodeURIComponent(seed)}` : "";
  return json(await fetch(`/api/chamber/${encodeURIComponent(id)}${q}`));
}

export async function fetchConstellation(seed: string): Promise<Constellation> {
  return json(
    await fetch(`/api/constellation?seed=${encodeURIComponent(seed)}`),
  );
}

export type DiveHandlers = {
  onEvent: (event: DiveEvent) => void;
  onDone?: () => void;
  onError?: (err: Error) => void;
};

/** Consume POST /api/dive as SSE (Backend emits `data: {...}` frames). */
export async function diveStream(
  body: DiveRequest,
  _seed: string | undefined,
  handlers: DiveHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`/api/dive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      ...body,
      // fromChamberId is in JSON body; still keep ids opaque/encoded when
      // they ever appear in query/path elsewhere.
      fromChamberId: body.fromChamberId,
    }),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`Dive failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    handlers.onDone?.();
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";
    for (const chunk of chunks) {
      const dataLine = chunk.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const raw = dataLine.slice(5).trim();
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw) as DiveEvent | { type: "done" };
        if (parsed.type === "done") {
          finish();
          continue;
        }
        handlers.onEvent(parsed as DiveEvent);
      } catch (e) {
        handlers.onError?.(e instanceof Error ? e : new Error(String(e)));
      }
    }
  }
  finish();
}
