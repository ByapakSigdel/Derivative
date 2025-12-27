import type { Edge as RFEdge, Node as RFNode } from "reactflow";

export type FlowSeverity = "error" | "warning" | "info";
export type FlowIssue = { nodeId?: string; edgeId?: string; message: string; severity: FlowSeverity };
export type FlowValidation = { ok: boolean; issues: FlowIssue[] };

export function validateFlow(nodes: RFNode[], edges: RFEdge[]): FlowValidation {
  const issues: FlowIssue[] = [];

  const byType = (t: string) => nodes.filter((n) => n.type?.toLowerCase() === t.toLowerCase());
  const starts = byType("start");
  const ends = byType("end");

  if (starts.length !== 1) {
    issues.push({ message: `Program must contain exactly one Start node`, severity: "error" });
  }
  if (ends.length !== 1) {
    issues.push({ message: `Program must contain exactly one End node`, severity: "error" });
  }

  const nodeIds = new Set(nodes.map((n) => n.id));
  const adj = new Map<string, string[]>();
  const incoming = new Map<string, number>();
  for (const n of nodes) {
    adj.set(n.id, []);
    incoming.set(n.id, 0);
  }
  for (const e of edges) {
    if (!nodeIds.has(e.source)) issues.push({ edgeId: e.id, message: `Edge source missing`, severity: "error" });
    if (!nodeIds.has(e.target)) issues.push({ edgeId: e.id, message: `Edge target missing`, severity: "error" });
    if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) continue;
    adj.get(e.source)!.push(e.target);
    incoming.set(e.target, (incoming.get(e.target) ?? 0) + 1);
  }

  // Disconnected nodes: no in and no out except Start/End
  for (const n of nodes) {
    const outs = adj.get(n.id) ?? [];
    const ins = incoming.get(n.id) ?? 0;
    if (outs.length === 0 && ins === 0 && n.type?.toLowerCase() !== "start" && n.type?.toLowerCase() !== "end" && n.type !== "Variable") {
      issues.push({ nodeId: n.id, message: `Node is disconnected`, severity: "error" });
    }
  }

  // Cycle detection (exclude back edges involving Loop nodes)
  const visited = new Set<string>();
  const stack = new Set<string>();
  const loopIds = new Set(byType("loop").map((n) => n.id));

  const hasCycleFrom = (u: string): boolean => {
    if (stack.has(u)) return true;
    if (visited.has(u)) return false;
    visited.add(u);
    stack.add(u);
    for (const v of adj.get(u) ?? []) {
      // Exempt back-edge if current node is a Loop node
      // Actually, Loop node logic is handled by code generator structure (Repeat/While)
      // But for graph validation, a cycle is generally bad unless it's a specific loop construct.
      // Our Loop block is a container-like logic, not a graph cycle.
      // So any graph cycle is technically invalid for this simple flow.
      if (hasCycleFrom(v)) return true;
    }
    stack.delete(u);
    return false;
  };

  for (const n of nodes) {
    if (hasCycleFrom(n.id)) {
      issues.push({ nodeId: n.id, message: `Cycle detected in graph`, severity: "error" });
      break;
    }
  }

  // Invalid connections: multiple outputs to End, Start with incoming
  for (const n of ends) {
    const incomingCount = Array.from(edges).filter((e) => e.target === n.id).length;
    if (incomingCount === 0) issues.push({ nodeId: n.id, message: `End node must have an incoming connection`, severity: "error" });
    const outgoingCount = Array.from(edges).filter((e) => e.source === n.id).length;
    if (outgoingCount > 0) issues.push({ nodeId: n.id, message: `End node cannot have outgoing connections`, severity: "error" });
  }
  for (const n of starts) {
    const incomingCount = Array.from(edges).filter((e) => e.target === n.id).length;
    if (incomingCount > 0) issues.push({ nodeId: n.id, message: `Start node cannot have incoming connections`, severity: "error" });
    const outgoingCount = Array.from(edges).filter((e) => e.source === n.id).length;
    if (outgoingCount === 0) issues.push({ nodeId: n.id, message: `Start node must have an outgoing connection`, severity: "error" });
  }

  return { ok: issues.length === 0, issues };
}

export type VisualStatus = "valid" | "warning" | "invalid";
export type EdgeStatus = { id: string; status: VisualStatus; message?: string };
export type NodeStatus = { id: string; status: VisualStatus; message?: string };

export function toVisualStatuses(validation: FlowValidation): { nodes: NodeStatus[]; edges: EdgeStatus[] } {
  const nodeIssues = new Map<string, FlowIssue[]>();
  const edgeIssues = new Map<string, FlowIssue[]>();
  for (const i of validation.issues) {
    if (i.nodeId) {
      const arr = nodeIssues.get(i.nodeId) ?? [];
      arr.push(i);
      nodeIssues.set(i.nodeId, arr);
    }
    if (i.edgeId) {
      const arr = edgeIssues.get(i.edgeId) ?? [];
      arr.push(i);
      edgeIssues.set(i.edgeId, arr);
    }
  }

  const nodes: NodeStatus[] = [];
  for (const [id, arr] of nodeIssues) {
    const sev = highestSeverity(arr.map((a) => a.severity));
    nodes.push({ id, status: sevToVisual(sev), message: arr.map((a) => a.message).join("; ") });
  }
  const edges: EdgeStatus[] = [];
  for (const [id, arr] of edgeIssues) {
    const sev = highestSeverity(arr.map((a) => a.severity));
    edges.push({ id, status: sevToVisual(sev), message: arr.map((a) => a.message).join("; ") });
  }

  return { nodes, edges };
}

function highestSeverity(list: FlowSeverity[]): FlowSeverity {
  if (list.includes("error")) return "error";
  if (list.includes("warning")) return "warning";
  return "info";
}
function sevToVisual(sev: FlowSeverity): VisualStatus {
  switch (sev) {
    case "error":
      return "invalid";
    case "warning":
      return "warning";
    default:
      return "valid";
  }
}
