import type { Node, Edge } from "reactflow";
import type { CustomNodeData } from "@/components/editor/nodes/CustomNode";

export type ValidationError = {
  nodeId: string;
  message: string;
  severity: "error" | "warning";
};

/**
 * Validates the node graph and returns any errors or warnings
 */
export function validateGraph(
  nodes: Node<CustomNodeData>[],
  edges: Edge[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  nodes.forEach(node => {
    // Check for disconnected input nodes (sensors that aren't connected to anything)
    const hasOutputs = node.data.outputs ?? 1;
    if (hasOutputs > 0) {
      const outgoingEdges = edges.filter(e => e.source === node.id);
      if (outgoingEdges.length === 0 && node.type !== "end") {
        errors.push({
          nodeId: node.id,
          message: `"${node.data.label}" is not connected to anything`,
          severity: "warning"
        });
      }
    }

    // Check for nodes that require inputs but don't have them
    const hasInputs = node.data.inputs ?? 1;
    if (hasInputs > 0) {
      const incomingEdges = edges.filter(e => e.target === node.id);
      if (incomingEdges.length === 0 && node.type !== "start") {
        errors.push({
          nodeId: node.id,
          message: `"${node.data.label}" needs an input connection`,
          severity: "error"
        });
      }
    }

    // Check for invalid configuration values
    if (node.data.params) {
      const params = node.data.params;
      
      // Check for invalid pin numbers
      const pinParam = params.find(p => p.name === "Pin");
      if (pinParam) {
        const pin = String(pinParam.value);
        const isValidDigital = /^[0-9]$|^1[0-3]$/.test(pin); // 0-13
        const isValidAnalog = /^A[0-5]$/.test(pin); // A0-A5
        
        if (!isValidDigital && !isValidAnalog) {
          errors.push({
            nodeId: node.id,
            message: `Invalid pin "${pin}". Use 0-13 or A0-A5`,
            severity: "error"
          });
        }
      }

      // Check for invalid delay values
      const msParam = params.find(p => p.name === "Milliseconds");
      if (msParam) {
        const ms = Number(msParam.value);
        if (isNaN(ms) || ms < 0) {
          errors.push({
            nodeId: node.id,
            message: "Delay must be a positive number",
            severity: "error"
          });
        }
      }
    }
  });

  // Check for circular dependencies
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = edges
        .filter(e => e.source === nodeId)
        .map(e => e.target);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && hasCycle(neighbor)) {
          return true;
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }
    }
    recursionStack.delete(nodeId);
    return false;
  }

  nodes.forEach(node => {
    if (hasCycle(node.id)) {
      errors.push({
        nodeId: node.id,
        message: "Circular connection detected! This creates an infinite loop",
        severity: "error"
      });
    }
  });

  return errors;
}

/**
 * Apply validation errors to nodes by marking them with error state
 */
export function applyValidationToNodes(
  nodes: Node<CustomNodeData>[],
  errors: ValidationError[]
): Node<CustomNodeData>[] {
  const errorNodeIds = new Set(errors.filter(e => e.severity === "error").map(e => e.nodeId));
  
  return nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      error: errorNodeIds.has(node.id)
    }
  }));
}
