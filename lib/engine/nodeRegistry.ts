import type { BlockDefinition, BlockInstance, CodeGenContext, CodeGenResult, IRStatement, PinMode } from "@/types/blocks";

export class NodeRegistry {
  private defs = new Map<string, BlockDefinition>();

  register(def: BlockDefinition) {
    this.defs.set(def.type, def);
  }

  get(type: string): BlockDefinition | undefined {
    return this.defs.get(type);
  }

  list(): BlockDefinition[] {
    return Array.from(this.defs.values());
  }
}

export function createDefaultRegistry(): NodeRegistry {
  const reg = new NodeRegistry();

  const emitVarDecl = (ctx: CodeGenContext, name: string, initial?: string) => {
    ctx.registerDeclaration(`auto ${name}${initial !== undefined ? ` = ${initial}` : ""};`);
  };

  // Start
  reg.register({
    type: "Start",
    title: "Start",
    description: "Program entry point (Setup)",
    category: "Core",
    io: { inputs: 0, outputs: 1 },
    defaultConfig: { kind: "none" },
    codeGenerator: () => ({ setup: [], loop: [] }),
  });

  // End
  reg.register({
    type: "End",
    title: "End",
    description: "End of program flow",
    category: "Core",
    io: { inputs: 1, outputs: 0 },
    defaultConfig: { kind: "none" },
    codeGenerator: () => ({ setup: [], loop: [] }),
  });

  // PinConfig
  reg.register({
    type: "PinConfig",
    title: "Pin Mode",
    description: "Configure pin as INPUT/OUTPUT",
    category: "IO",
    io: { inputs: 1, outputs: 1 },
    defaultConfig: { kind: "pinConfig", pin: 13, mode: "OUTPUT" },
    codeGenerator: (_ctx, node) => {
      const cfg = node.config as Extract<typeof node.config, { kind: "pinConfig" }>;
      const pin = typeof cfg.pin === "string" ? parseInt(cfg.pin.slice(1), 10) : cfg.pin;
      const stmt: IRStatement = { kind: "PinMode", pin, mode: cfg.mode };
      return { setup: [stmt] };
    },
  });

  // DigitalWrite
  reg.register({
    type: "DigitalWrite",
    title: "Digital Write",
    description: "Set digital pin HIGH/LOW",
    category: "IO",
    io: { inputs: 1, outputs: 1 },
    defaultConfig: { kind: "digitalWrite", pin: 13, value: true },
    codeGenerator: (_ctx, node) => {
      const cfg = node.config as Extract<typeof node.config, { kind: "digitalWrite" }>;
      return { loop: [{ kind: "DigitalWrite", pin: cfg.pin, value: cfg.value ? 1 : 0 }] };
    },
  });

  // DigitalRead
  reg.register({
    type: "DigitalRead",
    title: "Digital Read",
    description: "Read digital pin state",
    category: "IO",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "digitalRead", pin: 2 },
    codeGenerator: () => ({}),
    generateExpression: (_ctx, node) => {
      const cfg = node.config as any;
      return `digitalRead(${cfg.pin})`;
    },
  });

  // AnalogWrite
  reg.register({
    type: "AnalogWrite",
    title: "Analog Write",
    description: "Write PWM value (0-255)",
    category: "IO",
    io: { inputs: 1, outputs: 1 },
    defaultConfig: { kind: "analogWrite", pin: 3, value: 128 },
    codeGenerator: (_ctx, node) => {
      const cfg = node.config as Extract<typeof node.config, { kind: "analogWrite" }>;
      return { loop: [{ kind: "AnalogWrite", pin: cfg.pin, value: cfg.value }] };
    },
  });

  // AnalogRead
  reg.register({
    type: "AnalogRead",
    title: "Analog Read",
    description: "Read analog pin (0-1023)",
    category: "IO",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "analogRead", pin: 0 },
    codeGenerator: () => ({}),
    generateExpression: (_ctx, node) => {
      const cfg = node.config as any;
      return `analogRead(${cfg.pin})`;
    },
  });

  // Delay
  reg.register({
    type: "Delay",
    title: "Delay",
    description: "Wait for milliseconds",
    category: "Timing",
    io: { inputs: 1, outputs: 1 },
    defaultConfig: { kind: "delay", ms: 1000 },
    codeGenerator: (_ctx, node) => ({ loop: [{ kind: "Delay", ms: (node.config as any).ms }] }),
  });

  // IfCondition
  reg.register({
    type: "IfCondition",
    title: "If",
    description: "Conditional branch",
    category: "Logic",
    io: { inputs: 1, outputs: 2 },
    outputLabels: ["Then", "Else"],
    defaultConfig: { kind: "if", condition: "true" },
    codeGenerator: (_ctx, node) => ({ loop: [{ kind: "If", condition: (node.config as any).condition, then: [], else: [] }] }),
  });

  // Loop
  reg.register({
    type: "Loop",
    title: "Loop",
    description: "Repeat block",
    category: "Logic",
    io: { inputs: 1, outputs: 2 },
    outputLabels: ["Body", "Next"],
    defaultConfig: { kind: "loop", iterations: 10 },
    codeGenerator: (_ctx, node) => {
      const cfg = node.config as any;
      if (cfg.condition) return { loop: [{ kind: "While", condition: cfg.condition, body: [] }] };
      const idx = `i_${node.id}`;
      return { loop: [{ kind: "Repeat", times: cfg.iterations ?? 1, indexVar: idx, body: [] }] };
    },
  });

  // VariableSet
  reg.register({
    type: "VariableSet",
    title: "Set Variable",
    description: "Assign value to variable",
    category: "Data",
    io: { inputs: 1, outputs: 1 },
    defaultConfig: { kind: "variableSet", name: "value", value: "0" },
    codeGenerator: (_ctx, node) => {
      const cfg = node.config as any;
      return { loop: [{ kind: "Assignment", name: cfg.name, value: String(cfg.value) }] };
    },
  });

  // Variable
  reg.register({
    type: "Variable",
    title: "Variable",
    description: "Declare a variable",
    category: "Data",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "variable", name: "myVar", type: "int", initial: "0" },
    codeGenerator: (ctx, node) => {
      const cfg = node.config as any;
      const typeMap: Record<string, string> = {
          int: "int", float: "float", bool: "bool", String: "String", char: "char", long: "long", double: "double"
      };
      const cType = typeMap[cfg.type] || "int";
      ctx.registerDeclaration(`${cType} ${cfg.name} = ${cfg.initial};`);
      return { loop: [] };
    },
    generateExpression: (_ctx, node) => {
        const cfg = node.config as any;
        return cfg.name;
    }
  });

  // MathOperation
  reg.register({
    type: "MathOperation",
    title: "Math Op",
    description: "Basic arithmetic",
    category: "Math",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "math", left: "0", op: "+", right: "0" },
    codeGenerator: () => ({}),
    generateExpression: (_ctx, node) => {
      const cfg = node.config as any;
      return `(${cfg.left} ${cfg.op} ${cfg.right})`;
    }
  });

  // LogicOperation
  reg.register({
    type: "LogicOperation",
    title: "Logic Op",
    description: "Boolean logic",
    category: "Logic",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "logic", left: "true", op: "&&", right: "true" },
    codeGenerator: () => ({}),
    generateExpression: (_ctx, node) => {
      const cfg = node.config as any;
      return `(${cfg.left} ${cfg.op} ${cfg.right})`;
    }
  });

  // SerialBegin
  reg.register({
    type: "SerialBegin",
    title: "Serial Begin",
    description: "Initialize Serial",
    category: "Communication",
    io: { inputs: 1, outputs: 1 },
    defaultConfig: { kind: "serialBegin", baud: 9600 },
    codeGenerator: (_ctx, node) => {
        const cfg = node.config as any;
        return { setup: [{ kind: "SerialBegin", baud: cfg.baud }] };
    }
  });

  // SerialPrint
  reg.register({
    type: "SerialPrint",
    title: "Serial Print",
    description: "Print to Serial",
    category: "Communication",
    io: { inputs: 1, outputs: 1 },
    defaultConfig: { kind: "serialPrint", value: "Hello", newLine: true },
    codeGenerator: (_ctx, node) => {
        const cfg = node.config as any;
        return { loop: [{ kind: "SerialPrint", value: cfg.value, newLine: cfg.newLine }] };
    }
  });

  // Millis
  reg.register({
    type: "Millis",
    title: "Millis",
    description: "Time since start (ms)",
    category: "Timing",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "time", type: "millis" },
    codeGenerator: () => ({}),
    generateExpression: () => "millis()"
  });

  // Map
  reg.register({
    type: "Map",
    title: "Map",
    description: "Map value range",
    category: "Math",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "map", value: "0", fromLow: "0", fromHigh: "1023", toLow: "0", toHigh: "255" },
    codeGenerator: () => ({}),
    generateExpression: (_ctx, node) => {
        const cfg = node.config as any;
        return `map(${cfg.value}, ${cfg.fromLow}, ${cfg.fromHigh}, ${cfg.toLow}, ${cfg.toHigh})`;
    }
  });

  // Constrain
  reg.register({
    type: "Constrain",
    title: "Constrain",
    description: "Constrain value",
    category: "Math",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "constrain", value: "0", low: "0", high: "255" },
    codeGenerator: () => ({}),
    generateExpression: (_ctx, node) => {
        const cfg = node.config as any;
        return `constrain(${cfg.value}, ${cfg.low}, ${cfg.high})`;
    }
  });

  // Random
  reg.register({
    type: "Random",
    title: "Random",
    description: "Random number",
    category: "Math",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "random", min: "0", max: "100" },
    codeGenerator: () => ({}),
    generateExpression: (_ctx, node) => {
        const cfg = node.config as any;
        return `random(${cfg.min}, ${cfg.max})`;
    }
  });

  // While
  reg.register({
    type: "While",
    title: "While Loop",
    description: "Repeat while true",
    category: "Logic",
    io: { inputs: 1, outputs: 2 },
    outputLabels: ["Body", "Next"],
    defaultConfig: { kind: "while", condition: "true" },
    codeGenerator: (_ctx, node) => {
        const cfg = node.config as any;
        return { loop: [{ kind: "While", condition: cfg.condition, body: [] }] };
    }
  });

  // For Loop
  reg.register({
    type: "For",
    title: "For Loop",
    description: "Iterate range",
    category: "Logic",
    io: { inputs: 1, outputs: 2 },
    outputLabels: ["Body", "Next"],
    defaultConfig: { kind: "for", init: "int i = 0", condition: "i < 10", increment: "i++" },
    codeGenerator: (_ctx, node) => {
        const cfg = node.config as any;
        return { loop: [{ kind: "For", init: cfg.init, condition: cfg.condition, increment: cfg.increment, body: [] }] };
    }
  });

  // Array Declaration
  reg.register({
    type: "ArrayDecl",
    title: "Array Decl",
    description: "Declare array",
    category: "Data",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "arrayDecl", name: "myArr", type: "int", size: 10 },
    codeGenerator: (ctx, node) => {
        const cfg = node.config as any;
        ctx.registerDeclaration(`${cfg.type} ${cfg.name}[${cfg.size}];`);
        return { loop: [] };
    },
    generateExpression: (_ctx, node) => {
        const cfg = node.config as any;
        return cfg.name;
    }
  });

  // Array Get
  reg.register({
    type: "ArrayGet",
    title: "Array Get",
    description: "Get array element",
    category: "Data",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "arrayGet", name: "myArr", index: "0" },
    codeGenerator: () => ({}),
    generateExpression: (_ctx, node) => {
        const cfg = node.config as any;
        return `${cfg.name}[${cfg.index}]`;
    }
  });

  // Array Set
  reg.register({
    type: "ArraySet",
    title: "Array Set",
    description: "Set array element",
    category: "Data",
    io: { inputs: 1, outputs: 1 },
    defaultConfig: { kind: "arraySet", name: "myArr", index: "0", value: "0" },
    codeGenerator: (_ctx, node) => {
        const cfg = node.config as any;
        return { loop: [{ kind: "Assignment", name: `${cfg.name}[${cfg.index}]`, value: String(cfg.value) }] };
    }
  });

  // Bitwise Op
  reg.register({
    type: "BitwiseOp",
    title: "Bitwise Op",
    description: "Bitwise operation",
    category: "Math",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "bitwise", left: "0", op: "&", right: "0" },
    codeGenerator: () => ({}),
    generateExpression: (_ctx, node) => {
        const cfg = node.config as any;
        return `(${cfg.left} ${cfg.op} ${cfg.right})`;
    }
  });

  // EEPROM Read
  reg.register({
    type: "EEPROMRead",
    title: "EEPROM Read",
    description: "Read from EEPROM",
    category: "Data",
    io: { inputs: 0, outputs: 0 },
    isValueNode: true,
    defaultConfig: { kind: "eepromRead", address: "0" },
    codeGenerator: (ctx) => {
        ctx.registerDeclaration("#include <EEPROM.h>");
        return {};
    },
    generateExpression: (_ctx, node) => {
        const cfg = node.config as any;
        return `EEPROM.read(${cfg.address})`;
    }
  });

  // EEPROM Write
  reg.register({
    type: "EEPROMWrite",
    title: "EEPROM Write",
    description: "Write to EEPROM",
    category: "Data",
    io: { inputs: 1, outputs: 1 },
    defaultConfig: { kind: "eepromWrite", address: "0", value: "0" },
    codeGenerator: (ctx, node) => {
        const cfg = node.config as any;
        ctx.registerDeclaration("#include <EEPROM.h>");
        return { loop: [{ kind: "ExpressionStatement", expression: `EEPROM.write(${cfg.address}, ${cfg.value})` }] };
    }
  });

  return reg;
}
