"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Constellation } from "@depth-showcase/api";

export function ConstellationMap({
  data,
  currentId,
  onClose,
}: {
  data: Constellation | null;
  currentId?: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    prevFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const panel = panelRef.current;
    if (!panel) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prevFocus.current?.focus?.();
    };
  }, [onClose]);

  const layout = useMemo(() => {
    if (!data) return null;
    const w = 720;
    const h = 460;
    const maxDepth = Math.max(1, ...data.nodes.map((n) => n.depth));
    const byDepth = new Map<number, typeof data.nodes>();
    for (const n of data.nodes) {
      const list = byDepth.get(n.depth) ?? [];
      list.push(n);
      byDepth.set(n.depth, list);
    }
    const pos = new Map<string, { x: number; y: number }>();
    for (const [depth, nodes] of byDepth) {
      nodes.forEach((n, i) => {
        const spread = nodes.length;
        const x = ((i + 1) / (spread + 1)) * (w - 48) + 24;
        const y = 48 + (depth / maxDepth) * (h - 88);
        pos.set(n.id, { x, y });
      });
    }
    return { w, h, pos, maxDepth };
  }, [data]);

  if (!data || !layout) {
    return (
      <div className="map-panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Constellation">
        <header className="map-head">
          <h2>Constellation</h2>
          <button ref={closeRef} type="button" className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </header>
        <p className="muted">Loading map from API…</p>
      </div>
    );
  }

  const { w, h, pos } = layout;

  return (
    <div
      className="map-panel map-panel--enter"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Constellation"
    >
      <header className="map-head">
        <div>
          <p className="map-kicker">BLUEPRINT</p>
          <h2>
            {data.nodes.length} chambers · <code>{data.seed}</code>
          </h2>
        </div>
        <button ref={closeRef} type="button" className="btn-ghost" onClick={onClose}>
          Close <kbd className="kbd-inline">Esc</kbd>
        </button>
      </header>
      <svg className="map-svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Chamber graph">
        {Array.from({ length: layout.maxDepth + 1 }).map((_, d) => {
          const y = 48 + (d / Math.max(1, layout.maxDepth)) * (h - 88);
          return (
            <line
              key={`guide-${d}`}
              x1={16}
              y1={y}
              x2={w - 16}
              y2={y}
              stroke="#F2F400"
              strokeOpacity={0.12}
              strokeDasharray="2 6"
            />
          );
        })}
        {data.edges.map((e, i) => {
          const a = pos.get(e.from);
          const b = pos.get(e.to);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#F2F400"
              strokeOpacity={0.35}
              strokeWidth={1.5}
            />
          );
        })}
        {data.nodes.map((n) => {
          const p = pos.get(n.id);
          if (!p) return null;
          const here = n.id === currentId;
          return (
            <g key={n.id} transform={`translate(${p.x}, ${p.y})`}>
              {here ? (
                <rect
                  x={-12}
                  y={-12}
                  width={24}
                  height={24}
                  fill="none"
                  stroke="#F2F400"
                  strokeWidth={2}
                />
              ) : null}
              <rect
                x={here ? -7 : -5}
                y={here ? -7 : -5}
                width={here ? 14 : 10}
                height={here ? 14 : 10}
                fill={here ? "#F2F400" : n.paradox ? "#F7F7F5" : "#0A0A0A"}
                stroke="#F2F400"
                strokeWidth={1.5}
              />
              <text
                y={here ? 22 : 18}
                textAnchor="middle"
                fill="#F2F400"
                fillOpacity={here ? 1 : 0.55}
                fontSize={here ? 10 : 8}
                fontFamily="ui-monospace, monospace"
              >
                {n.title.length > 18 ? `${n.title.slice(0, 16)}…` : n.title}
              </text>
              <title>
                {n.title} (d{n.depth}
                {n.paradox ? ", paradox" : ""})
              </title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
