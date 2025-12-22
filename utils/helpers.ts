import type { Edge, Node } from "@/types/graph";

export function topologicalSort(nodes: Node[], edges: Edge[]): Node[] {
  const idToNode = new Map<string, Node>(nodes.map((n) => [n.id, n]));
  const incomingCount = new Map<string, number>();
  const outgoing = new Map<string, string[]>();

  for (const n of nodes) {
    incomingCount.set(n.id, 0);
    outgoing.set(n.id, []);
  }
  for (const e of edges) {
    incomingCount.set(e.to, (incomingCount.get(e.to) ?? 0) + 1);
    outgoing.get(e.from)?.push(e.to);
  }

  const queue: string[] = [];
  for (const [id, count] of incomingCount) {
    if (count === 0) queue.push(id);
  }
  const result: Node[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    const node = idToNode.get(id);
    if (node) result.push(node);
    for (const to of outgoing.get(id) ?? []) {
      const next = (incomingCount.get(to) ?? 0) - 1;
      incomingCount.set(to, next);
      if (next === 0) queue.push(to);
    }
  }
  // If cycle exists, return in original order to keep determinism
  if (result.length !== nodes.length) return nodes.slice();
  return result;
}
