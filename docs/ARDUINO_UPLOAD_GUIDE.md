# Arduino Upload System - Complete Guide

## 📋 Overview

This system enables direct Arduino code upload from the browser to Arduino hardware using the **Web Serial API**. It's a two-phase process:

1. **Compilation**: Arduino code (.ino) → Compiled hex file (backend)
2. **Upload**: Hex file → Arduino board (browser via WebSerial)

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Visual Nodes   │
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Code Generator  │  (lib/arduino/codeGenerator.ts)
│  Graph → .ino   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Compilation API │  (api/arduino/compile)
│   .ino → .hex   │  Uses Arduino CLI on server
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Upload Module  │  (lib/arduino/uploader.ts)
│  WebSerial API  │  Runs in browser
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Arduino Board   │  Connected via USB/Serial
│   (Hardware)    │
└─────────────────┘
```

---

## 🔌 Web Serial API

### What is WebSerial?

The Web Serial API allows websites to communicate with serial devices directly from the browser.

**Browser Support:**
- ✅ Chrome 89+ (Windows, macOS, Linux, ChromeOS)
- ✅ Edge 89+
- ✅ Opera 75+
- ❌ Firefox (not supported)
- ❌ Safari (not supported)

**Requirements:**
- HTTPS connection (or localhost for development)
- User must explicitly grant permission to access serial ports
- Physical Arduino board connected via USB

### Key Capabilities

```typescript
// Check if supported
if ("serial" in navigator) {
  // WebSerial is available
}

// Request port access
const port = await navigator.serial.requestPort();

// Open connection
await port.open({ baudRate: 115200 });

// Write data
const writer = port.writable.getWriter();
await writer.write(new Uint8Array([...]));
writer.releaseLock();

// Read data
const reader = port.readable.getReader();
const { value, done } = await reader.read();
reader.releaseLock();

// Close port
await port.close();
```

---

## 🚀 Upload Flow

### Step-by-Step Process

#### 1. **Generate Arduino Code**
User creates visual nodes → Code generator produces `.ino` code

```typescript
import { generateArduinoCode } from "@/lib/arduino/codeGenerator";

const graph = {
  nodes: [
    { id: "1", type: "DigitalWrite", payload: { pin: 13, value: true } },
    { id: "2", type: "Delay", payload: { ms: 1000 } }
  ],
  edges: [{ from: "1", to: "2" }]
};

const arduinoCode = generateArduinoCode(graph);
// Output: Arduino C++ code with setup() and loop()
```

#### 2. **Compile to Hex**
Backend compiles `.ino` to `.hex` using Arduino CLI

```typescript
// Frontend calls compilation endpoint
const response = await fetch("/api/arduino/compile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code: arduinoCode,
    board: "arduino:avr:uno"
  })
});

const { success, hex } = await response.json();
// hex is base64-encoded Intel HEX format
```

#### 3. **Request Serial Port**
Browser prompts user to select Arduino board

```typescript
import { requestSerialPort } from "@/lib/arduino/uploader";

const port = await requestSerialPort("arduino:avr:uno");
// User sees browser's native port selection dialog
```

#### 4. **Upload Hex File**
Upload compiled hex to Arduino using STK500 protocol

```typescript
import { uploadArduinoSketch } from "@/lib/arduino/uploader";

const result = await uploadArduinoSketch(
  {
    code: arduinoCode,
    board: "arduino:avr:uno"
  },
  (progress, message) => {
    console.log(`${progress}%: ${message}`);
  }
);

if (result.ok) {
  console.log("Upload successful!");
}
```

---

## 🛠️ Backend Setup

### Prerequisites

1. **Install Arduino CLI**

```bash
# Windows (using Chocolatey)
choco install arduino-cli

# macOS (using Homebrew)
brew install arduino-cli

# Linux
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
```

2. **Configure Arduino CLI**

```bash
# Initialize configuration
arduino-cli config init

# Update package index
arduino-cli core update-index

# Install AVR core (for Uno, Nano, Mega, etc.)
arduino-cli core install arduino:avr

# Verify installation
arduino-cli version
arduino-cli core list
```

3. **Test Compilation**

```bash
# Create test sketch
mkdir test-sketch
echo "void setup() { pinMode(13, OUTPUT); }
void loop() { digitalWrite(13, HIGH); delay(1000); digitalWrite(13, LOW); delay(1000); }" > test-sketch/test-sketch.ino

# Compile
arduino-cli compile --fqbn arduino:avr:uno test-sketch

# Should create test-sketch.ino.hex
```

### Environment Setup

The compilation API will automatically detect Arduino CLI. If not available, it falls back to mock compilation for testing.

---

## 💻 Frontend Integration

### Using UploadPanel Component

The `UploadPanel` component provides a complete UI for Arduino upload:

```tsx
import UploadPanel from "@/components/editor/UploadPanel";

export default function EditorPage() {
  return (
    <div>
      <UploadPanel />
    </div>
  );
}
```

### Programmatic Upload

For custom implementations:

```typescript
"use client";
import { useState } from "react";
import { uploadArduinoSketch, isWebSerialSupported } from "@/lib/arduino/uploader";

export default function CustomUploader() {
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    // Check browser support
    if (!isWebSerialSupported()) {
      setStatus("WebSerial not supported");
      return;
    }

    // Your Arduino code
    const code = `
      void setup() {
        pinMode(13, OUTPUT);
      }
      
      void loop() {
        digitalWrite(13, HIGH);
        delay(1000);
        digitalWrite(13, LOW);
        delay(1000);
      }
    `;

    // Upload with progress callback
    const result = await uploadArduinoSketch(
      {
        code,
        board: "arduino:avr:uno"
      },
      (progress, message) => {
        setStatus(`${progress}%: ${message}`);
      }
    );

    setStatus(result.ok ? "Success!" : result.message || "Failed");
  };

  return (
    <button onClick={handleUpload}>Upload to Arduino</button>
  );
}
```

---

## 🎯 Supported Boards

### Currently Implemented

| Board | FQBN | Baud Rate | Protocol |
|-------|------|-----------|----------|
| Arduino Uno | `arduino:avr:uno` | 115200 | STK500v1 |
| Arduino Nano | `arduino:avr:nano:cpu=atmega328` | 57600 | STK500v1 |
| Arduino Mega | `arduino:avr:mega:cpu=atmega2560` | 115200 | STK500v2 |
| Arduino Leonardo | `arduino:avr:leonardo` | 57600 | AVR109 |

### Adding More Boards

Edit `BOARD_CONFIGS` in [uploader.ts](../lib/arduino/uploader.ts):

```typescript
const BOARD_CONFIGS: Record<string, { 
  baudRate: number; 
  protocol: string;
  vendorId?: number;
  productId?: number;
}> = {
  "arduino:avr:uno": { 
    baudRate: 115200, 
    protocol: "STK500v1",
    vendorId: 0x2341,
    productId: 0x0043
  },
  // Add your board here
  "arduino:avr:mycustomboard": {
    baudRate: 115200,
    protocol: "STK500v1",
    vendorId: 0xXXXX,
    productId: 0xXXXX
  }
};
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "Web Serial API not supported"

**Cause:** Using unsupported browser (Firefox, Safari, or old Chrome/Edge)

**Solution:**
- Use Chrome 89+, Edge 89+, or Opera 75+
- Ensure HTTPS (or localhost)

#### 2. "No serial port selected"

**Cause:** User cancelled port selection dialog

**Solution:**
- Click upload again
- Select the correct COM port (usually COM3-COM10 on Windows)
- Ensure Arduino is connected

#### 3. "Compilation failed"

**Cause:** Arduino CLI not installed or code has syntax errors

**Solution:**
- Install Arduino CLI (see Backend Setup)
- Check Arduino code syntax
- Review compilation logs in browser console

#### 4. "Failed to sync with bootloader"

**Cause:** Wrong baud rate, wrong board selected, or board not in bootloader mode

**Solution:**
- Select correct board type in dropdown
- Try pressing reset button on Arduino just before uploading
- Check USB cable (use data cable, not charge-only)

#### 5. "Upload timeout"

**Cause:** Board not responding, wrong port, or interference

**Solution:**
- Disconnect and reconnect Arduino
- Close Arduino IDE or other serial monitors
- Check USB cable quality

### Debug Mode

Enable debug logging:

```typescript
// In uploader.ts, add console.log statements
console.log("Port opened:", port);
console.log("Sending data:", data);
console.log("Received response:", response);
```

---

## 🔐 Security Considerations

### User Permission Model

WebSerial requires explicit user permission for each serial port:

1. User must click "Upload" button (user gesture)
2. Browser shows native port selection dialog
3. User explicitly selects the Arduino port
4. Permission is remembered for future sessions

### Data Safety

- Only hex files are uploaded (not arbitrary data)
- Upload is done via standard Arduino bootloader protocol
- No system-level access required
- Sandboxed within browser security model

---

## 🧪 Testing

### Test Serial Connection

```typescript
import { testSerialConnection } from "@/lib/arduino/uploader";

const result = await testSerialConnection("arduino:avr:uno");
console.log(result.ok ? "Connected!" : "Failed");
```

### Mock Compilation (Development)

When Arduino CLI is not available, the system uses mock compilation:

```typescript
// Returns a mock hex file for testing upload flow
// Won't actually work on Arduino, but tests the pipeline
```

### Manual Testing Checklist

- [ ] Browser support detection works
- [ ] Port selection dialog appears
- [ ] Compilation succeeds with valid code
- [ ] Upload progress updates correctly
- [ ] Success/failure messages display
- [ ] Multiple uploads work (connection cleanup)
- [ ] Different boards can be selected

---

## 📚 API Reference

### `uploadArduinoSketch(request, onProgress)`

Main upload function.

**Parameters:**
- `request: UploadRequest` - Upload configuration
  - `code: string` - Arduino code to upload
  - `board?: BoardTarget` - Board type (default: "arduino:avr:uno")
- `onProgress?: (progress: number, message: string) => void` - Progress callback

**Returns:** `Promise<UploadResult>`
- `ok: boolean` - Success status
- `message?: string` - Status/error message

**Example:**
```typescript
const result = await uploadArduinoSketch(
  { code: myCode, board: "arduino:avr:uno" },
  (p, m) => console.log(`${p}%: ${m}`)
);
```

### `isWebSerialSupported()`

Check if WebSerial API is available.

**Returns:** `boolean`

### `requestSerialPort(board?)`

Request user to select a serial port.

**Parameters:**
- `board?: BoardTarget` - Filter ports by board type

**Returns:** `Promise<SerialPort | null>`

### `detectBoards()`

Detect previously connected boards.

**Returns:** `Promise<BoardTarget[]>`

### `testSerialConnection(board?)`

Test serial communication.

**Parameters:**
- `board?: BoardTarget` - Board type to test

**Returns:** `Promise<UploadResult>`

---

## 🚧 Future Enhancements

### Short Term
- [ ] Full STK500 protocol implementation
- [ ] Support for more Arduino boards
- [ ] Real-time upload progress from bootloader
- [ ] Better error messages with solutions

### Long Term
- [ ] Direct .ino compilation in WebAssembly (no backend needed)
- [ ] Serial monitor integration
- [ ] Firmware debugging capabilities
- [ ] OTA (Over-The-Air) updates for WiFi-enabled boards

---

## 🔗 Additional Resources

- [Web Serial API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)
- [Arduino CLI Documentation](https://arduino.github.io/arduino-cli/)
- [STK500 Protocol Specification](http://ww1.microchip.com/downloads/en/AppNotes/doc2525.pdf)
- [Intel HEX Format](https://en.wikipedia.org/wiki/Intel_HEX)

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Review troubleshooting section
3. Verify Arduino CLI installation: `arduino-cli version`
4. Test with simple blink sketch first
5. Check USB cable and Arduino board LEDs

---

**Last Updated:** December 23, 2025
