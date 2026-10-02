import type {
  CeoDayBrief,
  Chamber,
  Constellation,
  DiveEvent,
  DiveRequest,
  Health,
  HandoffPanel,
  SeedManifest,
  Session,
  SessionPatch,
  SessionResponse,
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

export async function createSession(seed?: string): Promise<SessionResponse> {
  return json(
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(seed ? { seed } : {}),
    }),
  );
}

export async function fetchSession(sessionId: string): Promise<SessionResponse> {
  return json(
    await fetch(`/api/session?id=${encodeURIComponent(sessionId)}`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${sessionId}` },
    }),
  );
}

export async function patchSessionApi(
  sessionId: string,
  body: SessionPatch,
): Promise<{ session: Session; token?: string }> {
  return json(
    await fetch("/api/session", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body),
    }),
  );
}

export async function fetchChamber(
  id: string,
  seed?: string,
): Promise<Chamber> {
  const q = seed ? `?seed=${encodeURIComponent(seed)}` : "";
  return json(await fetch(`/api/chamber/${encodeURIComponent(id)}${q}`));
}

export async function fetchConstellation(
  seed: string,
  sessionId?: string,
): Promise<Constellation> {
  const params = new URLSearchParams({ seed });
  if (sessionId) params.set("sessionId", sessionId);
  return json(await fetch(`/api/constellation?${params}`));
}

export async function getCeoDayBrief(
  trigger?: "preview" | "manual" | "tesla_car_entry",
): Promise<CeoDayBrief> {
  const q = trigger ? `?trigger=${encodeURIComponent(trigger)}` : "";
  return json(await fetch(`/api/ceo-day-brief${q}`));
}

export async function getShowcaseHandoff(): Promise<HandoffPanel> {
  return json(await fetch("/api/showcase/handoff"));
}

export type DiveHandlers = {
  onEvent: (event: DiveEvent) => void;
  onSession?: (session: Session, token: string) => void;
  onDone?: () => void;
  onError?: (err: Error) => void;
};

export async function diveStream(
  body: DiveRequest,
  _seed: string | undefined,
  handlers: DiveHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`/api/dive`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    credentials: "include",
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`Dive failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

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
        const parsed = JSON.parse(raw) as
          | DiveEvent
          | { type: "done" }
          | { type: "session"; session: Session; token: string };
        if (parsed.type === "done") {
          handlers.onDone?.();
          continue;
        }
        if (parsed.type === "session") {
          handlers.onSession?.(parsed.session, parsed.token);
          continue;
        }
        handlers.onEvent(parsed as DiveEvent);
      } catch (e) {
        handlers.onError?.(e instanceof Error ? e : new Error(String(e)));
      }
    }
  }
  handlers.onDone?.();
}
