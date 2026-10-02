"use client";

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
  if (!data) {
    return (
      <div className="map-panel" role="dialog" aria-label="Constellation">
        <header className="map-head">
          <h2>Constellation</h2>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </header>
        <p className="muted">Charting the graph…</p>
      </div>
    );
  }

  const w = 640;
  const h = 420;
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
      const x = ((i + 1) / (nodes.length + 1)) * (w - 40) + 20;
      const y = 36 + (depth / maxDepth) * (h - 72);
      pos.set(n.id, { x, y });
    });
  }

  return (
    <div className="map-panel" role="dialog" aria-modal="true" aria-label="Constellation">
      <header className="map-head">
        <div>
          <p className="eyebrow">CONSTELLATION</p>
          <h2>
            {data.nodes.length} chambers · seed <code>{data.seed}</code>
          </h2>
        </div>
        <button type="button" className="btn-ghost" onClick={onClose}>
          Close
        </button>
      </header>
      <svg
        className="map-svg"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Chamber graph"
      >
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
              strokeOpacity={0.25}
              strokeWidth={1.5}
            />
          );
        })}
        {data.nodes.map((n) => {
          const p = pos.get(n.id);
          if (!p) return null;
          const here = n.id === currentId;
          return (
            <g key={n.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={here ? 9 : n.paradox ? 7 : 5}
                fill={here ? "#F2F400" : n.paradox ? "#fff" : "#0A0A0A"}
                stroke="#F2F400"
                strokeWidth={2}
              />
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
