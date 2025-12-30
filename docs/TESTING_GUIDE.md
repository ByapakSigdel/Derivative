# Arduino Upload System - Complete Testing Guide

## Overview

This guide provides comprehensive instructions for testing the Arduino upload system in your visual programming platform. The system uses the WebSerial API to upload code directly from the browser to Arduino boards.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Testing Without Arduino (Virtual Ports)](#testing-without-arduino-virtual-ports)
3. [Testing With Real Arduino](#testing-with-real-arduino)
4. [Test Pages Overview](#test-pages-overview)
5. [Troubleshooting](#troubleshooting)
6. [FAQ](#faq)

---

## Prerequisites

### Required Software

1. **Modern Browser**
   - Chrome 89+ (recommended)
   - Edge 89+
   - Opera 75+
   - Note: Firefox and Safari do NOT support WebSerial API

2. **Node.js and npm**
   - Node.js 18+ recommended
   - Install from: https://nodejs.org/

3. **Project Dependencies**
   ```bash
   cd Derivative
   npm install
   ```

### Optional (for virtual port testing)

4. **com0com** (Windows only)
   - Download from: https://sourceforge.net/projects/com0com/
   - Used to create virtual COM port pairs for testing without hardware

5. **PuTTY** (Windows/Linux/Mac)
   - Download from: https://www.putty.org/
   - Used to monitor serial port data

---

## Testing Without Arduino (Virtual Ports)

### Step 1: Install com0com

1. Download `setup_com0com_W7_x64_signed.exe`
2. Run as Administrator
3. Follow installation wizard
4. Restart Windows if prompted

### Step 2: Create Virtual Port Pair

Open Command Prompt as Administrator:

```cmd
cd "C:\Program Files\com0com"
setupc install PortName=COM10 PortName=COM11 EmuBR=yes
setupc list
```

Expected output:
```
CNCA0 PortName=COM10,EmuBR=yes
CNCB0 PortName=COM11,EmuBR=yes
```

### Step 3: Verify in Device Manager

1. Press `Win + X` → Device Manager
2. Expand "Ports (COM & LPT)"
3. You should see:
   - COM10 (com0com - serial port emulator)
   - COM11 (com0com - serial port emulator)

### Step 4: Setup PuTTY Monitor

1. Open PuTTY
2. Configure:
   - Connection type: **Serial**
   - Serial line: **COM11**
   - Speed: **115200**
3. Click "Open"
4. Leave PuTTY window open and visible

### Step 5: Start Development Server

```bash
cd Derivative
npm run dev
```

Wait for: `✓ Ready on http://localhost:3000`

### Step 6: Run Tests

#### Test 1: Serial Communication

1. Open: `http://localhost:3000/test-serial`
2. Click "Full Serial Test"
3. Browser dialog appears → Select **COM10**
4. Watch PuTTY window → You should see: `Hello from WebSerial!`
5. **Success!** Data sent from browser to COM10, received on COM11

#### Test 2: Code Generation

1. Open: `http://localhost:3000/test-codegen`
2. Click "Generate LED Blink Code"
3. Verify:
   - Green "Code Valid!" message
   - Arduino code appears below
   - Contains `setup()` and `loop()` functions
4. Try other buttons to test different patterns

#### Test 3: Complete Flow

1. Keep PuTTY open on COM11
2. Open: `http://localhost:3000/test-full`
3. Click "Run Complete Test"
4. Select **COM10** from browser dialog
5. Watch:
   - Progress bar: 0% → 100%
   - Logs showing each step
   - PuTTY window receiving data
6. **Success!** Complete pipeline verified

---

## Testing With Real Arduino

### Step 1: Connect Arduino

1. Plug Arduino Uno into USB port
2. Wait for Windows to install drivers
3. Hear USB connection sound (if sound enabled)

### Step 2: Find COM Port

**Device Manager Method:**
1. Press `Win + X` → Device Manager
2. Expand "Ports (COM & LPT)"
3. Look for: `Arduino Uno (COMx)` or `USB Serial Device (COMx)`
4. Note the COM number (e.g., COM3, COM4, COM5)

**Alternative Method:**
```bash
mode
```

### Step 3: Verify Arduino Works

Test with Arduino IDE first (recommended):

1. Open Arduino IDE
2. File → Examples → 01.Basics → Blink
3. Tools → Board → Arduino Uno
4. Tools → Port → [Your COM Port]
5. Click Upload (→ button)
6. LED should blink on Arduino

### Step 4: Close Conflicting Applications

**IMPORTANT:** Close these before testing:
- Arduino IDE
- Serial Monitor
- PuTTY
- Any other serial terminal programs

### Step 5: Start Development Server

```bash
cd Derivative
npm run dev
```

### Step 6: Run Upload Test

1. Open: `http://localhost:3000/test-upload`
2. Press F12 to open DevTools Console
3. Click "Upload to Arduino"
4. Select your Arduino's COM port
5. Wait 10-15 seconds (includes 8-second bootloader wait)
6. Watch console for detailed logs

### Expected Console Output

```
[RESET] Using 1200 baud touch method (Arduino IDE standard)
[RESET] Closing port
[RESET] Opening at 1200 baud to trigger reset
[RESET] Closing port to activate bootloader
[RESET] Waiting for bootloader mode (8 seconds)
[RESET] Bootloader should be active now
[PORT] Trying to open port at 115200 baud
[PORT] Port opened successfully at 115200 baud
[CONNECT] Connected and ready for bootloader sync
[UPLOAD] Syncing with bootloader
[UPLOAD] Sync attempt 1/10
[UPLOAD] Response: [0x14, 0x10]
[UPLOAD] Sync successful
[UPLOAD] Bootloader ready - uploading code
```

### Step 7: Verify Upload

**Look at your Arduino board:**
- Built-in LED (near pin 13) should blink
- ON for 1 second, OFF for 1 second, repeating
- This proves code uploaded and is running!

---

## Test Pages Overview

### /test-serial

**Purpose:** Test basic serial communication

**What it tests:**
- WebSerial API availability
- Port selection
- Opening serial connection
- Writing data to port
- Reading responses

**Use when:** Verifying basic browser-to-serial communication works

---

### /test-codegen

**Purpose:** Test code generation from visual nodes

**What it tests:**
- Node graph creation
- Graph to Arduino C++ conversion
- Code syntax validation
- setup() and loop() function generation

**Use when:** Verifying code generator produces valid Arduino code

---

### /test-full

**Purpose:** Test complete pipeline (for virtual ports)

**What it tests:**
- Graph creation
- Code generation
- Compilation (mock mode)
- Serial upload

**Use when:** Testing end-to-end flow with virtual COM ports

---

### /test-upload

**Purpose:** Test Arduino upload with real hardware

**What it tests:**
- 1200 baud touch reset
- Bootloader synchronization
- STK500 protocol communication
- Complete upload to real Arduino

**Use when:** Testing with physical Arduino board

---

### /editor

**Purpose:** Visual node editor (production interface)

**What it tests:**
- Drag-and-drop node interface
- Node connections
- Real-time code preview
- Upload to Arduino

**Use when:** Using the actual visual programming interface

---

## Troubleshooting

### Issue: "Web Serial API not supported"

**Solution:**
- Use Chrome, Edge, or Opera browser
- Firefox and Safari do NOT support WebSerial
- Update browser to latest version

---

### Issue: "Failed to open serial port"

**Possible causes:**
1. Port is already open by another application
2. Arduino IDE is open
3. Serial Monitor is running

**Solution:**
1. Close ALL serial applications:
   - Arduino IDE
   - PuTTY
   - Serial Monitor
   - Other browser tabs with serial tests
2. Unplug Arduino, wait 5 seconds, plug back in
3. Try again

---

### Issue: "No port selected"

**Solution:**
1. Make sure Arduino is connected via USB
2. Check Device Manager shows the port
3. Refresh browser page and try again
4. Grant serial port permission when browser asks

---

### Issue: "Failed to sync with bootloader"

**For genuine Arduino Uno:**
- Should work automatically with 1200 baud touch

**For Arduino clones:**
Manual reset method:
1. Keep finger on RESET button on Arduino
2. Click "Upload to Arduino"
3. When you see "Connecting to Arduino...", press and release RESET
4. Upload should proceed

**Permanent fix for clones:**
Add a 10µF capacitor between RESET and GND pins

---

### Issue: Empty responses `[]` during sync

**Cause:** Bootloader not responding

**Solutions:**
1. Wait longer (bootloader needs 8 seconds)
2. Try different USB cable
3. Try different USB port on computer
4. Check Arduino has bootloader installed
5. Try uploading from Arduino IDE first to verify board works

---

### Issue: LED doesn't blink after upload

**Solutions:**
1. Check upload completed (progress 100%)
2. Press reset button on Arduino
3. Try uploading again
4. Verify with Arduino IDE that board works
5. Check LED is connected to pin 13 (built-in LED)

---

## FAQ

### Q: Do I need Arduino CLI installed?

**A:** No, for testing purposes. The backend uses mock compilation. For production, you would install Arduino CLI.

### Q: Can I use Arduino Nano or Mega?

**A:** Yes, but you need to change the board type in the code. Currently defaults to Arduino Uno.

### Q: Why does it take 8 seconds to upload?

**A:** The 1200 baud touch method (same as Arduino IDE) requires waiting for the bootloader to initialize. This is normal.

### Q: Can I test on Mac or Linux?

**A:** Yes, but com0com is Windows-only. On Mac/Linux, use:
- **socat** for virtual ports
- **screen** or **minicom** instead of PuTTY

### Q: What if I don't have an Arduino?

**A:** Use the virtual COM port method with com0com. You can fully test serial communication without hardware.

### Q: Can I use this with Arduino Leonardo or Micro?

**A:** Yes, the 1200 baud touch method is specifically designed for those boards. Change board type in code.

### Q: Why do I need to grant serial port permission each time?

**A:** Browser security. Permission is session-based. You can use `getPreviouslyGrantedPorts()` API to remember ports.

---

## Next Steps

1. **After successful testing:**
   - Integrate upload into main editor UI
   - Add board type selection dropdown
   - Implement proper error handling
   - Add upload history/logging

2. **For production:**
   - Setup Arduino CLI backend
   - Implement real compilation
   - Add hex file parsing
   - Complete STK500 protocol implementation
   - Add support for more board types

3. **Documentation:**
   - User guide for visual editor
   - Node type documentation
   - API reference
   - Deployment guide

---

## Support

For issues or questions:
1. Check this guide first
2. Check browser console (F12) for detailed logs
3. Verify Arduino works with Arduino IDE
4. Review code comments in `lib/arduino/uploader.ts`

---

## Technical Details

### WebSerial API
- Browser-to-serial communication
- Chrome/Edge/Opera only
- Requires user permission
- Works on localhost and HTTPS

### STK500 Protocol
- Arduino bootloader communication protocol
- Sync command: `0x30 0x20`
- Expected response: `0x14 0x10`
- Used by Arduino IDE

### 1200 Baud Touch
- Standard Arduino reset method
- Opens port at 1200 baud
- Closes port to trigger bootloader
- Waits 8 seconds for initialization
- Same method Arduino IDE uses

### Port Configuration
- Baud rates tested: 115200, 57600, 9600
- Data bits: 8
- Stop bits: 1
- Parity: None
- Flow control: None

---

**Last Updated:** December 29, 2025
**Version:** 1.0
