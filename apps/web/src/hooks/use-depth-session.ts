"use client";

import { useCallback, useRef, useState } from "react";
import type {
  Chamber,
  Constellation,
  DiveEvent,
  SeedManifest,
} from "@depth-showcase/api";
import {
  diveStream,
  fetchChamber,
  fetchConstellation,
  postSeed,
} from "@/lib/client-api";

export type SessionState = {
  status: "idle" | "seeding" | "ready" | "diving" | "error";
  manifest: SeedManifest | null;
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
  const seedRef = useRef<string | null>(null);
  // Keep latest chamber/manifest for dive without stale closures
  const chamberRef = useRef<Chamber | null>(null);
  const manifestRef = useRef<SeedManifest | null>(null);
  chamberRef.current = state.chamber;
  manifestRef.current = state.manifest;

  const refreshConstellation = useCallback(async (seed: string) => {
    try {
      const constellation = await fetchConstellation(seed);
      setState((s) => ({ ...s, constellation }));
    } catch {
      /* non-fatal */
    }
  }, []);

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
        const manifest = await postSeed(seed?.trim() || undefined);
        seedRef.current = manifest.seed;
        const chamber = await fetchChamber(
          manifest.rootChamberId,
          manifest.seed,
        );
        setState({
          status: "ready",
          manifest,
          chamber,
          constellation: null,
          whispers: chamber.whisper ? [chamber.whisper] : [],
          lastEvents: [],
          error: null,
          mapOpen: false,
        });
        void refreshConstellation(manifest.seed);
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
      const chamber = chamberRef.current;
      const manifest = manifestRef.current;
      if (!chamber || !manifest) return;
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
      const seed = manifest.seed;
      try {
        await diveStream(
          {
            fromChamberId: chamber.id,
            choiceIndex,
            intensity,
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
            onDone: () => {
              setState((s) => ({ ...s, status: "ready" }));
              void refreshConstellation(seed);
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
    [refreshConstellation],
  );

  const toggleMap = useCallback(() => {
    setState((s) => {
      if (!s.manifest) return s;
      if (!s.mapOpen) void refreshConstellation(s.manifest.seed);
      return { ...s, mapOpen: !s.mapOpen };
    });
  }, [refreshConstellation]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    seedRef.current = null;
    setState(initial);
  }, []);

  return { ...state, seedWorld, dive, reset, toggleMap };
}
