# Quick Test Reference

## Test URLs

| Page | URL | Purpose |
|------|-----|---------|
| Serial Test | `/test-serial` | Basic serial communication |
| Code Gen | `/test-codegen` | Code generation from nodes |
| Complete Flow | `/test-full` | Full pipeline (virtual ports) |
| Arduino Upload | `/test-upload` | Real Arduino upload |
| Editor | `/editor` | Visual programming interface |

## Common Commands

### Start Development Server
```bash
cd Derivative
npm run dev
```

### Create Virtual COM Ports (Windows)
```cmd
cd "C:\Program Files\com0com"
setupc install PortName=COM10 PortName=COM11 EmuBR=yes
setupc list
```

### Monitor Virtual Port (PuTTY)
- Connection type: Serial
- Serial line: COM11
- Speed: 115200
- Click: Open

### Check Arduino COM Port
```bash
# Windows
mode

# Or check Device Manager:
# Win + X → Device Manager → Ports (COM & LPT)
```

## Test Workflow

### Without Arduino (Virtual Ports)
1. Install com0com → Create COM10 ↔ COM11
2. Open PuTTY on COM11 (115200 baud)
3. Start dev server: `npm run dev`
4. Open `/test-full` in browser
5. Select COM10 when prompted
6. Watch data in PuTTY

### With Real Arduino
1. Connect Arduino via USB
2. Note COM port (Device Manager)
3. Close Arduino IDE
4. Start dev server: `npm run dev`
5. Open `/test-upload` in browser
6. Select Arduino COM port
7. Wait 10-15 seconds
8. LED blinks!

## Browser Console Tags

All logs use prefixed tags for easy filtering:

| Tag | Purpose |
|-----|---------|
| `[RESET]` | Arduino reset operations |
| `[PORT]` | Serial port operations |
| `[CONNECT]` | Connection status |
| `[UPLOAD]` | Upload progress |

**Filter in DevTools:** Type tag name in console filter box (e.g., `[UPLOAD]`)

## Success Indicators

### Virtual Port Test
- ✓ PuTTY shows: `Hello from WebSerial!`
- ✓ Browser shows: Upload complete
- ✓ Progress: 100%

### Real Arduino Test
- ✓ Console shows: `[UPLOAD] Sync successful`
- ✓ LED on Arduino blinks
- ✓ ON/OFF every 1 second

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port won't open | Close Arduino IDE, PuTTY, other apps |
| No sync | Wait full 8 seconds, or press reset manually |
| Wrong browser | Use Chrome/Edge/Opera (not Firefox) |
| No port shown | Check Device Manager, reconnect Arduino |

## File Locations

```
Derivative/
├── lib/arduino/
│   ├── uploader.ts          # WebSerial upload logic
│   ├── codeGenerator.ts     # Node to Arduino code
│   └── serialTester.ts      # Testing utilities
├── app/
│   ├── test-serial/         # Serial test page
│   ├── test-codegen/        # Code gen test page
│   ├── test-full/           # Complete flow test
│   ├── test-upload/         # Arduino upload test
│   └── editor/              # Visual editor
└── docs/
    ├── TESTING_GUIDE.md     # Complete guide
    ├── QUICK_SETUP.md       # Setup instructions
    └── ARDUINO_UPLOAD_GUIDE.md
```

## Need Help?

1. Read [TESTING_GUIDE.md](TESTING_GUIDE.md) - Comprehensive instructions
2. Check browser console (F12) - Detailed logs
3. Verify Arduino with Arduino IDE first
4. Review code comments in `lib/arduino/uploader.ts`

---

**Pro Tip:** Keep browser console (F12) open while testing to see detailed logs with `[TAGS]` for easy debugging.
