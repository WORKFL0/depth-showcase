"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Constellation } from "@depth-showcase/api";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ConstellationMap({
  data,
  currentId,
  onClose,
}: {
  data: Constellation | null;
  currentId?: string;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();

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
        // slight spiral offset for spatial feel
        const wobble = Math.sin(i * 1.7 + depth) * 10;
        pos.set(n.id, { x: x + wobble, y });
      });
    }
    return { w, h, pos, maxDepth };
  }, [data]);

  if (!data || !layout) {
    return (
      <motion.div
        className="map-panel"
        role="dialog"
        aria-label="Constellation"
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
      >
        <header className="map-head">
          <h2>Constellation</h2>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </header>
        <p className="muted">Charting the graph…</p>
      </motion.div>
    );
  }

  const { w, h, pos } = layout;

  return (
    <motion.div
      className="map-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Constellation"
      initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="map-head">
        <div>
          <p className="eyebrow">CONSTELLATION</p>
          <h2>
            {data.nodes.length} chambers · seed <code>{data.seed}</code>
          </h2>
        </div>
        <button type="button" className="btn-ghost" onClick={onClose}>
          Close <kbd className="kbd-inline">Esc</kbd>
        </button>
      </header>
      <svg
        className="map-svg"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Chamber graph"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F2F400" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F2F400" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* depth guide lines */}
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
              strokeOpacity={0.06}
              strokeDasharray="4 8"
            />
          );
        })}

        {data.edges.map((e, i) => {
          const a = pos.get(e.from);
          const b = pos.get(e.to);
          if (!a || !b) return null;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2 - 18;
          return (
            <g key={i}>
              <path
                d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                fill="none"
                stroke="#F2F400"
                strokeOpacity={0.28}
                strokeWidth={1.6}
              />
            </g>
          );
        })}

        {data.nodes.map((n) => {
          const p = pos.get(n.id);
          if (!p) return null;
          const here = n.id === currentId;
          return (
            <g key={n.id} transform={`translate(${p.x}, ${p.y})`}>
              {here ? (
                <>
                  <circle r={22} fill="url(#nodeGlow)" className="map-pulse-ring" />
                  {!reduced ? (
                    <circle
                      r={14}
                      fill="none"
                      stroke="#F2F400"
                      strokeOpacity={0.45}
                      className="map-pulse-ring"
                    />
                  ) : null}
                </>
              ) : null}
              <circle
                r={here ? 9 : n.paradox ? 7 : 5.5}
                fill={here ? "#F2F400" : n.paradox ? "#ffffff" : "#0A0A0A"}
                stroke={n.paradox && !here ? "#ffffff" : "#F2F400"}
                strokeWidth={here ? 2.5 : 1.8}
                filter={here ? "url(#softGlow)" : undefined}
              />
              <text
                y={here ? 24 : 18}
                textAnchor="middle"
                fill="#F2F400"
                fillOpacity={here ? 0.95 : 0.55}
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
    </motion.div>
  );
}
