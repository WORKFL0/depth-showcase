import type { Constellation } from "@depth-showcase/api";
import { generateChamber } from "./chamber";

const MAX_DEPTH = 6;
const MAX_NODES = 40;

export function buildConstellation(seed: string): Constellation {
  const root = generateChamber(seed, []);
  const nodes: Constellation["nodes"] = [];
  const edges: Constellation["edges"] = [];
  const seen = new Set<string>();

  type Q = { id: string; path: number[]; depth: number };
  const queue: Q[] = [{ id: root.id, path: [], depth: 0 }];

  while (queue.length && nodes.length < MAX_NODES) {
    const cur = queue.shift()!;
    if (seen.has(cur.id)) continue;
    seen.add(cur.id);

    const chamber = generateChamber(seed, cur.path);
    nodes.push({
      id: chamber.id,
      depth: chamber.depth,
      title: chamber.title,
      ...(chamber.paradox ? { paradox: true } : {}),
    });

    if (cur.depth >= MAX_DEPTH) continue;

    // Fan-out capped so BFS can reach ~depth 6 under MAX_NODES.
    const fanout = Math.min(chamber.exits.length, cur.depth < 2 ? 3 : 2);
    for (let i = 0; i < fanout; i++) {
      if (nodes.length + queue.length >= MAX_NODES) break;
      const exit = chamber.exits[i]!;
      const childPath = [...cur.path, i];
      const child = generateChamber(seed, childPath);
      edges.push({
        from: chamber.id,
        to: child.id,
        label: exit.label,
      });
      if (!seen.has(child.id)) {
        queue.push({ id: child.id, path: childPath, depth: cur.depth + 1 });
      }
    }
  }

  return { seed, nodes, edges };
}
