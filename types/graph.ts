export type NodeType = "DigitalWrite" | "AnalogRead" | "Delay" | "If" | "Loop";

export type Node =
  | { id: string; type: "DigitalWrite"; payload: { pin: number; value: boolean } }
  | { id: string; type: "AnalogRead"; payload: { pin: number } }
  | { id: string; type: "Delay"; payload: { ms: number } }
  | { id: string; type: "If"; payload: { condition: string } }
  | { id: string; type: "Loop"; payload: { iterations?: number } };

export type Edge = { from: string; to: string };

export type Graph = { nodes: Node[]; edges: Edge[] };
