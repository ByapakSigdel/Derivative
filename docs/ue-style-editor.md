# Visual Node Editor - Unreal Engine Blueprint Style

## Overview
The editor has been redesigned to feel like Unreal Engine's Blueprint system - clean, professional, and focused on functionality.

## Key Design Principles

### 1. **Simplicity Over Features**
- Removed excessive visual effects (emojis, gradients, animations)
- Clean, dark theme similar to professional IDEs
- Focused on essential Arduino programming concepts

### 2. **UE Blueprint-Inspired Design**
- Dark slate background (#0f172a)
- Node style: Dark boxes with clear labels
- Square connection handles (not circles)
- Subtle shadows and borders
- Professional color scheme

### 3. **Node Structure**
Each node has:
- **Header**: Node type label (white text on dark background)
- **Parameters**: Key-value pairs displayed clearly
- **Handles**: Square white handles for connections
  - Left handle = input
  - Right handle = output

### 4. **Available Nodes**

#### Digital Write
- Sets a digital pin HIGH or LOW
- Parameters: Pin (default: 13), Value (default: HIGH)
- Use for: LEDs, motors, relays

#### Analog Read  
- Reads analog sensor value (0-1023)
- Parameters: Pin (default: A0)
- Use for: Sensors, potentiometers

#### Delay
- Pauses execution for specified milliseconds
- Parameters: Milliseconds (default: 1000)
- Use for: Timing, blinking LEDs

#### If Statement
- Conditional branching
- Parameters: Condition (default: digitalRead(2))
- Has 2 output paths (true/false branches)

#### For Loop
- Repeats code N times
- Parameters: Count (default: 10)
- Has 2 outputs (loop body and exit)

## Features

### ✅ Working Features
- **Drag nodes** around the canvas
- **Connect nodes** by dragging from output to input handles
- **Delete nodes** with Delete/Backspace key
- **Auto-generate code** from node graph (debounced to 500ms)
- **Minimap** for navigation
- **Zoom and pan** controls
- **Dark theme** throughout

### 🎯 Code Generation
The editor generates valid Arduino C++ code:
```cpp
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, 1);
  delay(1000);
}
```

### 🔧 Simplified
- Removed complex validation warnings
- No more error states on nodes
- Clean, distraction-free canvas
- Focus on building working programs

## Usage

1. **Add nodes**: Click buttons in the right panel
2. **Position nodes**: Drag them to desired location
3. **Connect**: Drag from white square on right → white square on left
4. **Generate code**: Happens automatically (view in "Generated Code" panel)
5. **Upload**: Configure port and board, then upload

## Technical Stack

- **React Flow**: Professional node graph library
- **Zustand**: State management with persistence
- **TypeScript**: Type safety
- **Tailwind CSS**: Dark theme styling

## Color Palette

- Background: `bg-slate-900` (#0f172a)
- Nodes: `bg-slate-700` (#334155)
- Headers: `bg-slate-600` (#475569)
- Text: `text-white` / `text-slate-300`
- Borders: `border-slate-700`
- Handles: White with dark border

## Comparison to Previous Design

| Aspect | Old Design | New Design |
|--------|-----------|------------|
| Theme | Light, colorful | Dark, professional |
| Nodes | Rounded, emoji icons | Square, text labels |
| Style | Kid-friendly | UE Blueprint-like |
| Complexity | Many features, validation | Essential features only |
| Focus | Visual appeal | Functionality |

## Future Enhancements

1. **Node editing**: Click node to edit parameters inline
2. **More node types**: Serial print, variables, math operations
3. **Subgraphs**: Reusable function blocks
4. **Debugging**: Step through execution visually
5. **Templates**: Load example projects
