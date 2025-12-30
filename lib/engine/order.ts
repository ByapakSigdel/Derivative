import type { Edge as RFEdge, Node as RFNode } from "reactflow";

export type ExecutionStep = { nodeId: string };
export type ExecutionPlan = { order: ExecutionStep[] };

export function resolveExecutionOrder(nodes: RFNode[], edges: RFEdge[]): ExecutionPlan {
  // Find the Start node (case-insensitive check for robustness)
  const startNode = nodes.find((n) => n.type?.toLowerCase() === "start");
  
  if (!startNode) return { order: [] };

  const plan: ExecutionStep[] = [];
  const visited = new Set<string>();
  let currentId: string | undefined = startNode.id;

  // Simple linear traversal from Start to End
  while (currentId) {
    if (visited.has(currentId)) break; // Loop detection
    visited.add(currentId);

    // Don't include Start node in the execution plan steps if it's just a marker
    if (currentId !== startNode.id) {
      plan.push({ nodeId: currentId });
    }
    
    // Find the outgoing edge
    // We assume the main flow is on the first output or default output
    const outEdge = edges.find(e => e.source === currentId);
    
    if (!outEdge) break;
    currentId = outEdge.target;
    
    // Stop if we hit an End node
    const currentNode = nodes.find(n => n.id === currentId);
    if (currentNode?.type?.toLowerCase() === "end") {
       // We stop at End node
       break;
    }
  }

  return { order: plan };
}
