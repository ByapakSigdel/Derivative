# Node-Based Visual Editor

## Overview

The visual editor is now powered by React Flow, providing a kid-friendly, interactive node-based programming interface for creating Arduino programs visually.

## Features

### 🎨 Visual Node System
- **Colorful Nodes**: Each block type has its own color and emoji icon for easy identification
- **Drag & Drop**: Move blocks around the canvas by dragging
- **Connect Blocks**: Draw connections from blue output dots to green input dots
- **Animated Connections**: Connections animate to show flow direction

### 🧩 Available Blocks (Current Dummy Nodes)

1. **💡 Light Control (DigitalWrite)** - Yellow
   - Turn LEDs on/off
   - Configure pin and HIGH/LOW value

2. **📊 Sensor Read (AnalogRead)** - Purple  
   - Read sensor values
   - Configure analog pin (A0-A5)

3. **⏱️ Wait (Delay)** - Orange
   - Pause execution
   - Configure milliseconds

4. **🔀 Decision (If)** - Blue
   - Conditional logic
   - Two output paths

5. **🔄 Repeat (Loop)** - Indigo
   - Execute code multiple times
   - Configure iteration count

### ✅ Validation System

The editor automatically validates your blocks and shows:

- ❌ **Errors**: Critical issues that prevent code generation
  - Disconnected required inputs
  - Invalid pin numbers (must be 0-13 or A0-A5)
  - Invalid configuration values
  - Circular connections

- ⚠️ **Warnings**: Non-critical issues
  - Blocks not connected to outputs
  - Unused blocks

Errors are shown:
- Red border around problem blocks
- Error panel in bottom-left corner
- Specific error messages

### 🎯 User Experience Features

#### For Kids:
- **Large, colorful blocks** with emojis instead of technical terms
- **Clear visual feedback** when dragging and connecting
- **Helpful welcome message** explaining how to use the editor
- **Real-time validation** to catch mistakes immediately
- **Smooth animations** to make interactions feel responsive

#### Controls:
- **Zoom**: Mouse wheel or controls (bottom-left)
- **Pan**: Click and drag on empty canvas space
- **Select**: Click on blocks
- **Connect**: Drag from blue dot → green dot
- **Delete**: Select and press Delete/Backspace
- **Clear All**: Button in top-right corner

### 🗺️ Minimap
- Shows overview of entire canvas in bottom-right
- Color-coded blocks for easy navigation
- Click to jump to canvas area

### 📐 Grid Background
- Dotted grid helps align blocks neatly
- Gradient background (blue to purple) for visual appeal

## Technical Details

### Components

#### Custom Nodes
- `CustomNode.tsx` - General purpose configurable node
- `StartNode.tsx` - Special start node (green, circular)
- `EndNode.tsx` - Special end node (red, circular)

#### Canvas
- `NodeCanvas.tsx` - Main React Flow canvas with validation
- Handles node/edge changes
- Validates graph in real-time

#### Validation
- `lib/editor/validation.ts` - Graph validation logic
- Checks for connection errors, invalid configs, circular dependencies

### API Call Fix

**Problem**: `/api/arduino/generate` was called multiple times on startup

**Solution**: Added debouncing to `CodePreview.tsx`
- Waits 500ms after last change before generating code
- Prevents rapid-fire API calls during initialization
- Uses `useRef` to manage timeout cleanup

### Data Flow

```
User clicks block in NodePanel
  ↓
editorStore.addNode() creates React Flow node
  ↓
NodeCanvas displays node
  ↓
User connects nodes by dragging
  ↓
editorStore.onConnect() creates edge
  ↓
Validation runs automatically
  ↓
Graph converted to Arduino code format
  ↓
CodePreview sends to /api/arduino/generate (debounced)
```

## Future Enhancements

The current implementation uses dummy nodes as a foundation. Future additions will include:

1. **More Block Types**
   - Servo motors, buzzers, RGB LEDs
   - Math operations, comparisons
   - Variables and data storage
   - Serial communication

2. **Node Configuration Panel**
   - Click on a node to edit its properties
   - Visual property editors (sliders, dropdowns, color pickers)

3. **Drag from Panel**
   - Drag blocks directly from the side panel to canvas
   - Preview where block will be placed

4. **Educational Features**
   - Tutorials and guided lessons
   - Achievement system
   - Example projects to load

5. **Enhanced Validation**
   - Auto-fix suggestions
   - "Did you mean?" for common mistakes
   - Visual flow indicators

6. **Collaboration**
   - Share projects with others
   - Import/export functionality
   - Template library

## Implementation Notes

- React Flow library handles all graph visualization and interaction
- Zustand store manages application state with persistence
- TypeScript ensures type safety throughout
- Tailwind CSS provides responsive, beautiful styling
- Validation runs client-side for instant feedback
