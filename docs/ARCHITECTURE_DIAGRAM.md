# Arduino Upload System - Flow Diagram

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                 │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  UploadPanel Component (UploadPanel.tsx)                       │    │
│  │  • Board Selection Dropdown                                     │    │
│  │  • Code Input Textarea                                          │    │
│  │  • Upload Button                                                │    │
│  │  • Progress Bar                                                 │    │
│  │  • Status Messages                                              │    │
│  └────────────────────────┬───────────────────────────────────────┘    │
└───────────────────────────┼────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      UPLOAD ORCHESTRATOR                                 │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  uploadArduinoSketch() - Main Upload Function                  │    │
│  │  (lib/arduino/uploader.ts)                                     │    │
│  │                                                                  │    │
│  │  Flow:                                                          │    │
│  │  1. Check WebSerial Support ────────────────────────┐          │    │
│  │  2. Compile Code (Backend API)                      │          │    │
│  │  3. Request Serial Port ─────────────────┐          │          │    │
│  │  4. Open Connection                      │          │          │    │
│  │  5. Upload Hex File                      │          │          │    │
│  │  6. Close Connection                     │          │          │    │
│  └──────────────────────┬───────────────────┼──────────┼─────────┘    │
└─────────────────────────┼───────────────────┼──────────┼──────────────┘
                          │                   │          │
         ┌────────────────┼───────────────────┘          │
         │                │                               │
         ▼                ▼                               ▼
┌────────────────┐ ┌─────────────────┐    ┌──────────────────────────┐
│  COMPILATION   │ │   WEBSERIAL     │    │    SERIAL PROTOCOL       │
│    SERVICE     │ │      API        │    │                          │
└────────────────┘ └─────────────────┘    └──────────────────────────┘
         │                │                               │
         ▼                ▼                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND COMPILATION API                               │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  POST /api/arduino/compile                                     │    │
│  │  (app/api/arduino/compile/route.ts)                            │    │
│  │                                                                  │    │
│  │  Input: { code: string, board: string }                        │    │
│  │                                                                  │    │
│  │  Process:                                                       │    │
│  │  1. Create temp directory                                       │    │
│  │  2. Write .ino file                                             │    │
│  │  3. Run: arduino-cli compile --fqbn <board> <sketch>           │    │
│  │  4. Read compiled .hex file                                     │    │
│  │  5. Encode to base64                                            │    │
│  │  6. Clean up temp files                                         │    │
│  │                                                                  │    │
│  │  Output: { success: bool, hex: string, logs: string }          │    │
│  └────────────────────────┬───────────────────────────────────────┘    │
└───────────────────────────┼────────────────────────────────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │  Arduino CLI   │
                   │  (External)    │
                   └────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │  .hex file     │
                   │  (Intel HEX)   │
                   └────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                    BROWSER SERIAL COMMUNICATION                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Web Serial API (Browser Built-in)                             │    │
│  │                                                                  │    │
│  │  navigator.serial.requestPort()                                │    │
│  │       │                                                          │    │
│  │       ▼                                                          │    │
│  │  ┌──────────────────────────┐                                  │    │
│  │  │ Browser Port Picker      │ ◄─── User Selects COM Port       │    │
│  │  │ [COM3] [COM4] [COM5]    │                                  │    │
│  │  └──────────┬───────────────┘                                  │    │
│  │             │                                                    │    │
│  │             ▼                                                    │    │
│  │  port.open({ baudRate: 115200 })                               │    │
│  │             │                                                    │    │
│  │             ▼                                                    │    │
│  │  port.setSignals({ dataTerminalReady: false/true })            │    │
│  │       (Resets Arduino - triggers bootloader)                   │    │
│  │             │                                                    │    │
│  │             ▼                                                    │    │
│  │  port.writable.getWriter().write(data)                         │    │
│  │       (Send hex file data via STK500 protocol)                 │    │
│  │             │                                                    │    │
│  │             ▼                                                    │    │
│  │  port.readable.getReader().read()                              │    │
│  │       (Receive bootloader responses)                            │    │
│  │             │                                                    │    │
│  │             ▼                                                    │    │
│  │  port.close()                                                   │    │
│  └─────────────┬──────────────────────────────────────────────────┘    │
└────────────────┼───────────────────────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │  USB Serial Port       │
    │  (COM3, /dev/ttyUSB0)  │
    └────────────┬───────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │  Arduino Board         │
    │  • Bootloader (STK500) │
    │  • Receives hex data   │
    │  • Flashes to memory   │
    │  • Starts execution    │
    └────────────────────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │  Arduino Running       │
    │  • LED blinks          │
    │  • Sensors read        │
    │  • Your code runs!     │
    └────────────────────────┘
```

## Detailed Upload Sequence

```
TIME    USER                FRONTEND                BACKEND              ARDUINO
│
├─ 1s   Click "Upload"
│       │
│       ├──────────────► Check WebSerial support
│       │                       │
│       │                       ├─ Supported? ──► Continue
│       │                       └─ Not? ─────────► Show error
│
├─ 2s   │              Generate Arduino code
│       │              from visual nodes
│       │                       │
├─ 3s   │                       │
│       │              POST /api/arduino/compile
│       │              { code, board }
│       │                       │
│       │                       │────────────────► Create temp dir
│       │                       │                  Write .ino file
│       │                       │                  Run arduino-cli
├─ 6s   │                       │                  Compile...
│       │                       │                  Read .hex
│       │                       │◄─────────────── Return { hex }
│       │                       │
├─ 7s   │              navigator.serial.requestPort()
│       │                       │
│       ◄──────────────── Browser shows port picker
│       │
│       Select "COM3"
│       │
│       ├──────────────► port.open({ baudRate: 115200 })
│       │                       │
├─ 8s   │                       │                                    USB connected
│       │              port.setSignals({ DTR: false })
│       │                       │────────────────────────────────► Reset
├─ 8.5s │              port.setSignals({ DTR: true })
│       │                       │────────────────────────────────► Bootloader active
│       │                       │
├─ 9s   │              Send STK500 sync (0x30 0x20)
│       │                       │────────────────────────────────► 
│       │                       │◄───────────────────────────────  Response (0x14 0x10)
│       │                       │
├─ 10s  │              Parse hex file
│       │              Upload page 1/10 ──────────────────────────►
│       │                       │◄───────────────────────────────  ACK
│       │              Upload page 2/10 ──────────────────────────►
│       │                       │◄───────────────────────────────  ACK
│       │              ...
├─ 15s  │              Upload page 10/10 ─────────────────────────►
│       │                       │◄───────────────────────────────  ACK
│       │                       │
│       │              port.close()
│       │                       │
├─ 16s  │                       │                                    Code starts!
│       │                       │                                    LED blinks
│       │                       │
│       Show "Upload Success!"
│
└─ Done ✓
```

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      VISUAL NODE EDITOR                           │
│                                                                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │
│  │ Digital    │  │  Delay     │  │  Analog    │                 │
│  │ Write      ├──┤  1000ms    ├──┤  Read      │                 │
│  │ Pin 13     │  │            │  │  A0        │                 │
│  └────────────┘  └────────────┘  └────────────┘                 │
│                                                                    │
│  Graph Representation:                                            │
│  { nodes: [...], edges: [...] }                                  │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                    CODE GENERATOR                                 │
│  (lib/arduino/codeGenerator.ts)                                  │
│                                                                    │
│  generateArduinoCode(graph) ─────────► Arduino C++ Code          │
│                                                                    │
│  Output:                                                          │
│  void setup() {                                                   │
│    pinMode(13, OUTPUT);                                           │
│  }                                                                 │
│  void loop() {                                                    │
│    digitalWrite(13, HIGH);                                        │
│    delay(1000);                                                   │
│    int val = analogRead(A0);                                      │
│  }                                                                 │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                    UPLOAD PANEL UI                                │
│  (components/editor/UploadPanel.tsx)                             │
│                                                                    │
│  [Board: Arduino Uno ▼]                                          │
│  [Code: <textarea>]                                               │
│  [Upload to Arduino]  [Test]  [Detect]                           │
│  Progress: ████████░░ 80%                                         │
│  Status: Uploading to board...                                    │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                    UPLOAD MODULE                                  │
│  (lib/arduino/uploader.ts)                                       │
│                                                                    │
│  uploadArduinoSketch()                                            │
│    ├─ isWebSerialSupported()                                     │
│    ├─ compileArduinoCode() ───────► Backend API                  │
│    ├─ requestSerialPort()                                        │
│    ├─ openSerialConnection()                                     │
│    ├─ uploadHexToBoard()                                         │
│    └─ closeSerialConnection()                                    │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. Visual Nodes (JSON)
   ↓
2. Graph { nodes: [...], edges: [...] }
   ↓
3. Arduino Code (.ino)
   ↓
4. HTTP Request (JSON)
   ↓
5. Compiled Hex (base64)
   ↓
6. Binary Data (Uint8Array)
   ↓
7. Serial Packets (STK500)
   ↓
8. Arduino Flash Memory
   ↓
9. Running Program
```

---

**This diagram shows the complete flow from user interaction to Arduino execution.**
