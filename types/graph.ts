export type NodeType = 
  | "Start"
  | "End"
  | "PinConfig"
  | "DigitalWrite"
  | "DigitalRead"
  | "AnalogWrite"
  | "AnalogRead"
  | "Delay"
  | "IfCondition"
  | "Loop"
  | "Variable"
  | "VariableSet"
  | "MathOperation";

export type Node = { id: string; type: NodeType; payload: any };

export type Edge = { from: string; to: string };

export type Graph = { nodes: Node[]; edges: Edge[] };

