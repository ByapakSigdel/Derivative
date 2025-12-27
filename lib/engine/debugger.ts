import type { Graph, Node } from "@/types/graph";

export type WireStatus = "green" | "yellow" | "red";
export type DebugIssue = { nodeId?: string; message: string; severity: WireStatus };
export type DebugResult = { ok: boolean; issues: DebugIssue[] };

export function analyzeWiring(graph: Graph): DebugResult {
  const issues: DebugIssue[] = [];
  const pinModes = new Map<number, "INPUT" | "OUTPUT">();
  const configuredPins = new Set<number>();

  for (const n of graph.nodes) {
    if (n.type === "DigitalWrite") {
      const pin = n.payload.pin;
      if (pinModes.get(pin) === "INPUT") {
        issues.push({ nodeId: n.id, message: `Pin ${pin} used as OUTPUT and INPUT`, severity: "red" });
      }
      pinModes.set(pin, "OUTPUT");
      configuredPins.add(pin);
    }
    if (n.type === "AnalogRead") {
      const pin = n.payload.pin;
      if (pinModes.get(pin) === "OUTPUT") {
        issues.push({ nodeId: n.id, message: `Pin ${pin} used as INPUT and OUTPUT`, severity: "red" });
      }
      pinModes.set(pin, "INPUT");
      configuredPins.add(pin);
    }
  }

  for (const n of graph.nodes) {
    if (n.type === "DigitalWrite" || n.type === "AnalogRead") {
      const pin = (n as any).payload.pin as number;
      if (!configuredPins.has(pin)) {
        // Missing explicit PinConfig is a warning (Arduino defaults allowed), but surface it.
        issues.push({ nodeId: n.id, message: `Pin ${pin} not explicitly configured`, severity: "yellow" });
      }
    }
  }

  return { ok: issues.length === 0, issues };
}
