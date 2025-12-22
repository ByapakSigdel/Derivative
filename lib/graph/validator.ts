import type { Graph } from "@/types/graph";

export type ValidationIssue = { path: string; message: string };
export type ValidationResult = { ok: boolean; issues: ValidationIssue[] };

export function validateGraph(graph: Graph): ValidationResult {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  for (const n of graph.nodes) {
    if (ids.has(n.id)) issues.push({ path: `nodes.${n.id}`, message: "Duplicate node id" });
    ids.add(n.id);
    switch (n.type) {
      case "DigitalWrite":
        if (typeof n.payload.pin !== "number") issues.push({ path: `nodes.${n.id}.payload.pin`, message: "pin must be number" });
        if (typeof n.payload.value !== "boolean") issues.push({ path: `nodes.${n.id}.payload.value`, message: "value must be boolean" });
        break;
      case "AnalogRead":
        if (typeof n.payload.pin !== "number") issues.push({ path: `nodes.${n.id}.payload.pin`, message: "pin must be number" });
        break;
      case "Delay":
        if (typeof n.payload.ms !== "number") issues.push({ path: `nodes.${n.id}.payload.ms`, message: "ms must be number" });
        break;
      case "If":
        if (typeof n.payload.condition !== "string") issues.push({ path: `nodes.${n.id}.payload.condition`, message: "condition must be string" });
        break;
      case "Loop":
        if (n.payload.iterations !== undefined && typeof n.payload.iterations !== "number") issues.push({ path: `nodes.${n.id}.payload.iterations`, message: "iterations must be number" });
        break;
    }
  }
  for (const e of graph.edges) {
    if (!ids.has(e.from)) issues.push({ path: `edges.${e.from}`, message: "edge from missing node" });
    if (!ids.has(e.to)) issues.push({ path: `edges.${e.to}`, message: "edge to missing node" });
  }
  return { ok: issues.length === 0, issues };
}
