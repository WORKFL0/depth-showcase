"use client";

import { useCallback, useRef, useState } from "react";
import type {
  Chamber,
  Constellation,
  DiveEvent,
  SeedManifest,
  Session,
} from "@depth-showcase/api";
import {
  createSession,
  diveStream,
  fetchChamber,
  fetchConstellation,
} from "@/lib/client-api";

export type SessionState = {
  status: "idle" | "seeding" | "ready" | "diving" | "error";
  manifest: SeedManifest | null;
  session: Session | null;
  sessionToken: string | null;
  chamber: Chamber | null;
  constellation: Constellation | null;
  whispers: string[];
  lastEvents: DiveEvent[];
  error: string | null;
  mapOpen: boolean;
};

const initial: SessionState = {
  status: "idle",
  manifest: null,
  session: null,
  sessionToken: null,
  chamber: null,
  constellation: null,
  whispers: [],
  lastEvents: [],
  error: null,
  mapOpen: false,
};

export function useDepthSession() {
  const [state, setState] = useState<SessionState>(initial);
  const abortRef = useRef<AbortController | null>(null);
  const sessionRef = useRef<string | null>(null);

  const refreshConstellation = useCallback(
    async (seed: string, sessionId?: string | null) => {
      try {
        const constellation = await fetchConstellation(
          seed,
          sessionId || undefined,
        );
        setState((s) => ({ ...s, constellation }));
      } catch {
        /* non-fatal */
      }
    },
    [],
  );

  const seedWorld = useCallback(
    async (seed?: string) => {
      abortRef.current?.abort();
      setState((s) => ({
        ...s,
        status: "seeding",
        error: null,
        whispers: [],
        mapOpen: false,
      }));
      try {
        const res = await createSession(seed?.trim() || undefined);
        const manifest = res.manifest!;
        const chamber =
          res.chamber ||
          (await fetchChamber(manifest.rootChamberId, manifest.seed));
        sessionRef.current = res.token || res.session.id;
        setState({
          status: "ready",
          manifest,
          session: res.session,
          sessionToken: res.token || res.session.id,
          chamber,
          constellation: null,
          whispers: chamber.whisper ? [chamber.whisper] : [],
          lastEvents: [],
          error: null,
          mapOpen: false,
        });
        void refreshConstellation(manifest.seed, sessionRef.current);
      } catch (e) {
        setState((s) => ({
          ...s,
          status: "error",
          error: e instanceof Error ? e.message : "Seed failed",
        }));
      }
    },
    [refreshConstellation],
  );

  const dive = useCallback(
    async (choiceIndex: number, intensity = 0.55) => {
      if (!state.chamber || !state.manifest) return;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setState((s) => ({
        ...s,
        status: "diving",
        lastEvents: [],
        error: null,
        mapOpen: false,
      }));

      const collected: DiveEvent[] = [];
      const seed = state.manifest.seed;
      const sessionId = sessionRef.current || state.sessionToken || undefined;
      try {
        await diveStream(
          {
            fromChamberId: state.chamber.id,
            choiceIndex,
            intensity,
            ...(sessionId ? { sessionId } : {}),
          },
          seed,
          {
            onEvent: (event) => {
              collected.push(event);
              setState((s) => {
                const next = { ...s, lastEvents: [...collected] };
                if (event.type === "enter") {
                  next.chamber = event.chamber;
                  if (event.chamber.whisper) {
                    next.whispers = [
                      ...s.whispers.slice(-4),
                      event.chamber.whisper,
                    ];
                  }
                }
                if (event.type === "whisper") {
                  next.whispers = [...s.whispers.slice(-4), event.text];
                }
                return next;
              });
            },
            onSession: (session, token) => {
              sessionRef.current = token;
              setState((s) => ({
                ...s,
                session,
                sessionToken: token,
              }));
            },
            onDone: () => {
              setState((s) => ({ ...s, status: "ready" }));
              void refreshConstellation(
                seed,
                sessionRef.current || sessionId,
              );
            },
            onError: (err) => {
              setState((s) => ({
                ...s,
                status: "error",
                error: err.message,
              }));
            },
          },
          ac.signal,
        );
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setState((s) => ({
          ...s,
          status: "error",
          error: e instanceof Error ? e.message : "Dive failed",
        }));
      }
    },
    [state.chamber, state.manifest, state.sessionToken, refreshConstellation],
  );

  const toggleMap = useCallback(() => {
    setState((s) => {
      if (!s.manifest) return s;
      if (!s.mapOpen) {
        void refreshConstellation(
          s.manifest.seed,
          sessionRef.current || s.sessionToken,
        );
      }
      return { ...s, mapOpen: !s.mapOpen };
    });
  }, [refreshConstellation]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    sessionRef.current = null;
    setState(initial);
  }, []);

  return { ...state, seedWorld, dive, reset, toggleMap };
}
