// Core block node type definitions and interfaces
import type { Node as RFNode, Edge as RFEdge } from "reactflow";

export type BlockNodeType =
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
  | "MathOperation"
  | "LogicOperation"
  | "SerialBegin"
  | "SerialPrint"
  | "Millis"
  | "Micros"
  | "DelayMicros"
  | "Map"
  | "Constrain"
  | "Random"
  | "While"
  | "For"
  | "ArrayDecl"
  | "ArrayGet"
  | "ArraySet"
  | "BitwiseOp"
  | "TypeCast"
  | "Interrupt"
  | "EEPROMRead"
  | "EEPROMWrite"
  | "Struct";

export type IOInfo = {
  inputs: number;
  outputs: number;
};

export type PinMode = "INPUT" | "OUTPUT" | "INPUT_PULLUP";
export type DataType = "int" | "float" | "bool" | "String" | "char" | "long" | "double" | "void";

export type BlockConfig =
  | { kind: "none" }
  | { kind: "pinConfig"; pin: number | `A${number}`; mode: PinMode }
  | { kind: "digitalWrite"; pin: number; value: boolean | string }
  | { kind: "digitalRead"; pin: number }
  | { kind: "analogWrite"; pin: number; value: number | string }
  | { kind: "analogRead"; pin: number }
  | { kind: "delay"; ms: number | string }
  | { kind: "if"; condition: string }
  | { kind: "loop"; iterations?: number | string; condition?: string }
  | { kind: "variable"; name: string; type: DataType; initial?: string }
  | { kind: "variableSet"; name: string; value: string }
  | { kind: "math"; left: string; op: string; right: string }
  | { kind: "logic"; left: string; op: string; right: string }
  | { kind: "not"; value: string }
  | { kind: "serialBegin"; baud: number }
  | { kind: "serialPrint"; value: string; newLine: boolean }
  | { kind: "time"; type: "millis" | "micros" }
  | { kind: "map"; value: string; fromLow: string; fromHigh: string; toLow: string; toHigh: string }
  | { kind: "constrain"; value: string; low: string; high: string }
  | { kind: "random"; min: string; max: string }
  | { kind: "while"; condition: string }
  | { kind: "for"; init: string; condition: string; increment: string }
  | { kind: "arrayDecl"; name: string; type: DataType; size: number }
  | { kind: "arrayGet"; name: string; index: string }
  | { kind: "arraySet"; name: string; index: string; value: string }
  | { kind: "bitwise"; left: string; op: string; right: string }
  | { kind: "cast"; type: DataType; value: string }
  | { kind: "interrupt"; pin: string; mode: string; function: string }
  | { kind: "eepromRead"; address: string }
  | { kind: "eepromWrite"; address: string; value: string };

export type BlockDefinition<T extends BlockNodeType = any> = {
  type: T;
  title: string;
  description?: string;
  category?: string;
  io: IOInfo;
  outputLabels?: string[];
  defaultConfig: BlockConfig;
  isValueNode?: boolean;
  codeGenerator: (ctx: CodeGenContext, node: BlockInstance) => CodeGenResult;
  // Function to generate an inline expression for this node (e.g. "analogRead(A0)" or "x + y")
  generateExpression?: (ctx: CodeGenContext, node: BlockInstance) => string;
};

export type BlockInstance = {
  id: string;
  type: BlockNodeType;
  inputs: number;
  outputs: number;
  config: BlockConfig;
};

export type CodeGenResult = {
  setup?: IRStatement[];
  loop?: IRStatement[];
  declarations?: string[];
};

// Lightweight IR types (shared with engine IR)
export type IRStatement =
  | { kind: "Raw"; code: string }
  | { kind: "PinMode"; pin: number; mode: PinMode }
  | { kind: "DigitalWrite"; pin: number; value: 0 | 1 | string }
  | { kind: "AnalogWrite"; pin: number; value: number | string }
  | { kind: "Delay"; ms: number | string }
  | { kind: "Assignment"; name: string; value: string }
  | { kind: "If"; condition: string; then: IRStatement[]; else?: IRStatement[] }
  | { kind: "While"; condition: string; body: IRStatement[] }
  | { kind: "For"; init: string; condition: string; increment: string; body: IRStatement[] }
  | { kind: "Repeat"; times: number | string; indexVar: string; body: IRStatement[] }
  | { kind: "SerialBegin"; baud: number }
  | { kind: "SerialPrint"; value: string; newLine: boolean }
  | { kind: "ExpressionStatement"; expression: string };

export type IRProgram = {
  declarations: string[];
  setup: IRStatement[];
  loop: IRStatement[];
};

export type CodeGenContext = {
  registerDeclaration: (decl: string) => void;
  emitSetup: (...stmts: IRStatement[]) => void;
  emitLoop: (...stmts: IRStatement[]) => void;
};

export type FlowGraph = {
  nodes: RFNode[];
  edges: RFEdge[];
};
