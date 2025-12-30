// Dummy node configurations for demonstration
export const DUMMY_NODES = {
  // Input nodes (sensors)
  TEMPERATURE: {
    label: "Temperature",
    icon: "🌡️",
    color: "bg-red-500",
    description: "Read temperature sensor",
    inputs: 0,
    outputs: 1,
    config: { unit: "°C", pin: "A1" }
  },
  BUTTON: {
    label: "Button Press",
    icon: "🔘",
    color: "bg-green-500",
    description: "Detect button press",
    inputs: 0,
    outputs: 1,
    config: { pin: 2 }
  },
  LIGHT_SENSOR: {
    label: "Light Level",
    icon: "☀️",
    color: "bg-yellow-400",
    description: "Measure light intensity",
    inputs: 0,
    outputs: 1,
    config: { pin: "A2" }
  },
  
  // Output nodes
  SERVO: {
    label: "Servo Motor",
    icon: "🔧",
    color: "bg-pink-500",
    description: "Move servo to angle",
    inputs: 1,
    outputs: 0,
    config: { pin: 9, angle: 90 }
  },
  BUZZER: {
    label: "Play Sound",
    icon: "🔊",
    color: "bg-purple-600",
    description: "Make beeping sounds",
    inputs: 1,
    outputs: 0,
    config: { pin: 8, frequency: 1000 }
  },
  RGB_LED: {
    label: "Color Light",
    icon: "🌈",
    color: "bg-gradient-to-r from-red-500 via-green-500 to-blue-500",
    description: "Show RGB colors",
    inputs: 1,
    outputs: 0,
    config: { r: 255, g: 0, b: 0 }
  },
  
  // Logic nodes
  COMPARE: {
    label: "Compare",
    icon: "⚖️",
    color: "bg-teal-500",
    description: "Compare two values",
    inputs: 2,
    outputs: 2,
    config: { operator: ">" }
  },
  MATH: {
    label: "Math",
    icon: "➕",
    color: "bg-cyan-500",
    description: "Add, subtract, multiply, divide",
    inputs: 2,
    outputs: 1,
    config: { operation: "+" }
  },
  VARIABLE: {
    label: "Store Value",
    icon: "💾",
    color: "bg-gray-500",
    description: "Remember a number",
    inputs: 1,
    outputs: 1,
    config: { name: "count", value: 0 }
  },
  
  // Control flow
  TIMER: {
    label: "Every X Seconds",
    icon: "⏰",
    color: "bg-orange-600",
    description: "Run code periodically",
    inputs: 1,
    outputs: 1,
    config: { interval: 5000 }
  },
  RANDOM: {
    label: "Random Number",
    icon: "🎲",
    color: "bg-lime-500",
    description: "Generate random value",
    inputs: 0,
    outputs: 1,
    config: { min: 0, max: 100 }
  },
  
  // Communication
  SERIAL_PRINT: {
    label: "Show Message",
    icon: "💬",
    color: "bg-blue-600",
    description: "Display text in console",
    inputs: 1,
    outputs: 1,
    config: { message: "Hello!" }
  },
  
  // Error states examples
  ERROR_MISSING_INPUT: {
    label: "Needs Input!",
    icon: "⚠️",
    color: "bg-red-600",
    description: "This block needs a connection",
    inputs: 1,
    outputs: 1,
    error: true,
    config: {}
  },
  ERROR_INVALID_PIN: {
    label: "Wrong Pin",
    icon: "❌",
    color: "bg-red-700",
    description: "Invalid pin number",
    inputs: 1,
    outputs: 0,
    error: true,
    config: { pin: "INVALID" }
  }
};

export type DummyNodeType = keyof typeof DUMMY_NODES;
