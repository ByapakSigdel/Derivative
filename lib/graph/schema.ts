import type { NodeType } from "@/types/graph";

export type NodePayloads = {
  DigitalWrite: { pin: number; value: boolean };
  AnalogRead: { pin: number };
  Delay: { ms: number };
  If: { condition: string };
  Loop: { iterations?: number };
};

export type GraphNode<T extends NodeType = NodeType> = {
  id: string;
  type: T;
  payload: NodePayloads[T];
};

export type GraphEdge = { from: string; to: string };

export type GraphSchema = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};
