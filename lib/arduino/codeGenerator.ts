import type { Edge, Node } from "reactflow";
import { createProgram, formatIR } from "@/lib/engine/ir";
import { createDefaultRegistry } from "@/lib/engine/nodeRegistry";
import type { BlockInstance, IRStatement } from "@/types/blocks";

export function generateArduinoCode(graph: any): string {
    return "// Use generateCodeFromFlow instead";
}

export function generateCodeFromFlow(nodes: Node[], edges: Edge[]): string {
  const program = createProgram();
  const registry = createDefaultRegistry();
  
  // Helper to find connected node
  const getConnectedNode = (nodeId: string, handleType: "source" | "target", handleIndex?: number): string | undefined => {
      const edge = edges.find(e => {
          if (e.source !== nodeId) return false;
          if (handleIndex !== undefined) {
              return e.sourceHandle === `source-${handleIndex}`;
          }
          // For single output, handle might be null, "source", or "source-0"
          return !e.sourceHandle || e.sourceHandle === "source" || e.sourceHandle === "source-0";
      });
      return edge?.target;
  };

  // Helper to resolve value from input connection
  const resolveValue = (nodeId: string, paramName: string, defaultValue: any): string => {
      // Find edge connected to targetHandle `param-${paramName}`
      const edge = edges.find(e => e.target === nodeId && e.targetHandle === `param-${paramName}`);
      if (edge) {
          const sourceNode = nodes.find(n => n.id === edge.source);
          if (sourceNode) {
              return generateExpressionForNode(sourceNode);
          }
      }
      return String(defaultValue);
  };

  const createBlockInstance = (n: Node): BlockInstance => {
      const config: any = { kind: "none" };
      const params = n.data.params || [];
      const getParam = (name: string) => params.find((p: any) => p.name === name)?.value;
      const type = n.data.type;
      
      // Generic mapping for new blocks
      // We assume the registry's defaultConfig keys match the param names (lowercase)
      // But we need to handle the specific cases for existing blocks first
      
      if (type === "DigitalWrite") {
        Object.assign(config, { 
            kind: "digitalWrite", 
            pin: Number(resolveValue(n.id, "Pin", getParam("Pin"))), 
            value: resolveValue(n.id, "State", getParam("State")) 
        });
      } else if (type === "DigitalRead") {
        Object.assign(config, { 
            kind: "digitalRead", 
            pin: Number(resolveValue(n.id, "Pin", getParam("Pin"))) 
        });
      } else if (type === "AnalogRead") {
        Object.assign(config, { 
            kind: "analogRead", 
            pin: Number(resolveValue(n.id, "Pin", String(getParam("Pin")).replace("A", ""))) 
        });
      } else if (type === "AnalogWrite") {
        Object.assign(config, { 
            kind: "analogWrite", 
            pin: Number(resolveValue(n.id, "Pin", getParam("Pin"))),
            value: resolveValue(n.id, "Value", getParam("Value"))
        });
      } else if (type === "Delay") {
        Object.assign(config, { 
            kind: "delay", 
            ms: resolveValue(n.id, "Time (ms)", getParam("Time (ms)")) 
        });
      } else if (type === "If" || type === "IfCondition") {
        Object.assign(config, { 
            kind: "if", 
            condition: resolveValue(n.id, "Condition", getParam("Condition")) 
        });
      } else if (type === "Loop") {
        Object.assign(config, { 
            kind: "loop", 
            iterations: resolveValue(n.id, "Times", getParam("Times")) 
        });
      } else if (type === "MathOperation") {
        Object.assign(config, {
            kind: "math",
            left: resolveValue(n.id, "Left", getParam("Left")),
            op: getParam("Op"), // Op is usually a dropdown, not connectable
            right: resolveValue(n.id, "Right", getParam("Right"))
        });
      } else if (type === "LogicOperation") {
        Object.assign(config, {
            kind: "logic",
            left: resolveValue(n.id, "Left", getParam("Left")),
            op: getParam("Op"),
            right: resolveValue(n.id, "Right", getParam("Right"))
        });
      } else if (type === "Variable") {
         Object.assign(config, {
             kind: "variable",
             name: getParam("Name"),
             type: getParam("Type"),
             initial: getParam("Initial")
         });
      } else if (type === "VariableSet") {
          Object.assign(config, {
              kind: "variableSet",
              name: getParam("Name"),
              value: resolveValue(n.id, "Value", getParam("Value"))
          });
      } else if (type === "SerialBegin") {
          Object.assign(config, {
              kind: "serialBegin",
              baud: Number(getParam("Baud"))
          });
      } else if (type === "SerialPrint") {
          Object.assign(config, {
              kind: "serialPrint",
              value: resolveValue(n.id, "Value", getParam("Value")),
              newLine: getParam("NewLine") === "true" || getParam("NewLine") === true
          });
      } else if (type === "Millis") {
          Object.assign(config, { kind: "time", type: "millis" });
      } else if (type === "Map") {
          Object.assign(config, {
              kind: "map",
              value: resolveValue(n.id, "Value", getParam("Value")),
              fromLow: resolveValue(n.id, "FromLow", getParam("FromLow")),
              fromHigh: resolveValue(n.id, "FromHigh", getParam("FromHigh")),
              toLow: resolveValue(n.id, "ToLow", getParam("ToLow")),
              toHigh: resolveValue(n.id, "ToHigh", getParam("ToHigh"))
          });
      } else if (type === "Constrain") {
          Object.assign(config, {
              kind: "constrain",
              value: resolveValue(n.id, "Value", getParam("Value")),
              low: resolveValue(n.id, "Low", getParam("Low")),
              high: resolveValue(n.id, "High", getParam("High"))
          });
      } else if (type === "Random") {
          Object.assign(config, {
              kind: "random",
              min: resolveValue(n.id, "Min", getParam("Min")),
              max: resolveValue(n.id, "Max", getParam("Max"))
          });
      } else if (type === "While") {
          Object.assign(config, {
              kind: "while",
              condition: resolveValue(n.id, "Condition", getParam("Condition"))
          });
      } else if (type === "For") {
          Object.assign(config, {
              kind: "for",
              init: resolveValue(n.id, "Init", getParam("Init")),
              condition: resolveValue(n.id, "Condition", getParam("Condition")),
              increment: resolveValue(n.id, "Increment", getParam("Increment"))
          });
      } else if (type === "ArrayDecl") {
          Object.assign(config, {
              kind: "arrayDecl",
              name: getParam("Name"),
              type: getParam("Type"),
              size: Number(getParam("Size"))
          });
      } else if (type === "ArrayGet") {
          Object.assign(config, {
              kind: "arrayGet",
              name: getParam("Name"),
              index: resolveValue(n.id, "Index", getParam("Index"))
          });
      } else if (type === "ArraySet") {
          Object.assign(config, {
              kind: "arraySet",
              name: getParam("Name"),
              index: resolveValue(n.id, "Index", getParam("Index")),
              value: resolveValue(n.id, "Value", getParam("Value"))
          });
      } else if (type === "BitwiseOp") {
          Object.assign(config, {
              kind: "bitwise",
              left: resolveValue(n.id, "Left", getParam("Left")),
              op: getParam("Op"),
              right: resolveValue(n.id, "Right", getParam("Right"))
          });
      } else if (type === "EEPROMRead") {
          Object.assign(config, {
              kind: "eepromRead",
              address: resolveValue(n.id, "Address", getParam("Address"))
          });
      } else if (type === "EEPROMWrite") {
          Object.assign(config, {
              kind: "eepromWrite",
              address: resolveValue(n.id, "Address", getParam("Address")),
              value: resolveValue(n.id, "Value", getParam("Value"))
          });
      }

      return {
        id: n.id,
        type: n.type as any, 
        inputs: 0, 
        outputs: 0,
        config
      };
  };

  const generateExpressionForNode = (node: Node): string => {
      const def = registry.get(node.type || "");
      
      // Special case for Variable (Get)
      if (node.type === "Variable") {
          return node.data.params?.find((p: any) => p.name === "Name")?.value || "var";
      }

      if (!def) return "0";
      
      const instance = createBlockInstance(node);
      
      if (def.generateExpression) {
          return def.generateExpression({
              registerDeclaration: (code) => program.declarations.push(code),
              emitSetup: () => {},
              emitLoop: () => {}
          }, instance);
      }
      
      return "0";
  };

  const traverse = (nodeId: string, visited: Set<string>): IRStatement[] => {
      if (visited.has(nodeId)) return [];
      visited.add(nodeId);

      const node = nodes.find(n => n.id === nodeId);
      if (!node) return [];
      if (node.type === "End") return [];

      const def = registry.get(node.type || "");
      if (!def) return [];

      const instance = createBlockInstance(node);
      const ctx = {
          registerDeclaration: (code: string) => program.declarations.push(code),
          emitSetup: (...stmts: IRStatement[]) => { /* no-op */ },
          emitLoop: (...stmts: IRStatement[]) => { /* no-op */ },
      };
      
      const result = def.codeGenerator(ctx, instance);
      const myStmts = [...(result.setup || []), ...(result.loop || [])];

      // Handle Branching
      if (node.type === "IfCondition" || node.type === "If") {
          const thenId = getConnectedNode(nodeId, "source", 0);
          const elseId = getConnectedNode(nodeId, "source", 1);
          
          if (myStmts.length > 0 && myStmts[0].kind === "If") {
              if (thenId) myStmts[0].then = traverse(thenId, new Set(visited));
              if (elseId) myStmts[0].else = traverse(elseId, new Set(visited));
          }
          return myStmts;
      }

      if (node.type === "Loop") {
          const bodyId = getConnectedNode(nodeId, "source", 0);
          const nextId = getConnectedNode(nodeId, "source", 1);

          if (myStmts.length > 0 && (myStmts[0].kind === "Repeat" || myStmts[0].kind === "While")) {
              if (bodyId) myStmts[0].body = traverse(bodyId, new Set(visited));
          }
          
          const nextStmts = nextId ? traverse(nextId, visited) : [];
          return [...myStmts, ...nextStmts];
      }
      
      if (node.type === "While") {
          const bodyId = getConnectedNode(nodeId, "source", 0);
          const nextId = getConnectedNode(nodeId, "source", 1);

          if (myStmts.length > 0 && myStmts[0].kind === "While") {
              if (bodyId) myStmts[0].body = traverse(bodyId, new Set(visited));
          }
          
          const nextStmts = nextId ? traverse(nextId, visited) : [];
          return [...myStmts, ...nextStmts];
      }

      // Linear Flow
      const nextId = getConnectedNode(nodeId, "source");
      const nextStmts = nextId ? traverse(nextId, visited) : [];
      
      return [...myStmts, ...nextStmts];
  };

  // 1. Collect Declarations
  nodes.forEach(node => {
    if (node.type === "Variable") {
       const def = registry.get(node.type);
       if (def) {
         const ctx = {
            registerDeclaration: (code: string) => program.declarations.push(code),
            emitSetup: (...stmts: IRStatement[]) => { /* no-op */ },
            emitLoop: (...stmts: IRStatement[]) => { /* no-op */ },
         };
         const instance = createBlockInstance(node);
         def.codeGenerator(ctx, instance);
       }
    }
  });

  // 2. Traverse from Start
  const startNode = nodes.find(n => n.type === "Start" || n.type === "start");
  if (startNode) {
      const mainStmts = traverse(startNode.id, new Set());
      program.setup.push(...mainStmts);
  }

  return formatIR(program);
}

