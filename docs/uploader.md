# Arduino Uploader

> **⚠️ Updated Documentation Available**  
> For comprehensive guide, see [ARDUINO_UPLOAD_GUIDE.md](./ARDUINO_UPLOAD_GUIDE.md)

## Quick Start

The Arduino uploader uses **Web Serial API** to upload code directly from the browser to Arduino hardware.

### Prerequisites

1. **Browser**: Chrome 89+, Edge 89+, or Opera 75+ (WebSerial support required)
2. **Backend**: Arduino CLI installed on server for code compilation
3. **Hardware**: Arduino board connected via USB

### Basic Usage

```typescript
import { uploadArduinoSketch } from "@/lib/arduino/uploader";

const result = await uploadArduinoSketch(
  {
    code: yourArduinoCode,
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

### Upload Flow

1. **Generate Code**: Visual nodes → Arduino C++ code
2. **Compile**: Backend compiles .ino → .hex using Arduino CLI
3. **Request Port**: Browser prompts user to select serial port
4. **Upload**: WebSerial uploads .hex to Arduino
5. **Done**: Arduino runs the uploaded code

### Installation (Backend)

```bash
# Install Arduino CLI
# Windows
choco install arduino-cli

# macOS
brew install arduino-cli

# Configure
arduino-cli config init
arduino-cli core install arduino:avr
```

### Supported Boards

- Arduino Uno (`arduino:avr:uno`)
- Arduino Nano (`arduino:avr:nano`)
- Arduino Mega (`arduino:avr:mega`)
- Arduino Leonardo (`arduino:avr:leonardo`)

### Troubleshooting

**"Web Serial API not supported"**
- Use Chrome 89+, Edge 89+, or Opera 75+

**"No serial port selected"**
- Ensure Arduino is connected via USB

**"Compilation failed"**
- Install Arduino CLI on server

For complete documentation, see: **[ARDUINO_UPLOAD_GUIDE.md](./ARDUINO_UPLOAD_GUIDE.md)**

---

**Status:** ✅ **Fully Implemented** with WebSerial API  
**File:** `lib/arduino/uploader.ts`  
**Last Updated:** December 23, 2025
- Console logs + error handling.

Decoupling:
- Keep all upload logic in `lib/arduino/*` for UI independence and mockability.
