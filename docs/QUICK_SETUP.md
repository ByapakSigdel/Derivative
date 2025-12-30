# Arduino Upload - Quick Setup Guide

## 🎯 Goal
Enable direct Arduino code upload from browser to Arduino hardware.

## ⚡ Quick Setup (5 minutes)

### 1. Backend Setup (Arduino CLI)

**Windows:**
```powershell
# Using Chocolatey
choco install arduino-cli

# Or download from: https://arduino.github.io/arduino-cli/
```

**macOS:**
```bash
brew install arduino-cli
```

**Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
export PATH=$PATH:$HOME/bin
```

### 2. Configure Arduino CLI

```bash
# Initialize config
arduino-cli config init

# Update package index
arduino-cli core update-index

# Install Arduino AVR core (for Uno, Nano, Mega)
arduino-cli core install arduino:avr

# Verify installation
arduino-cli version
```

Expected output:
```
arduino-cli  Version: 0.x.x ...
```

### 3. Test Compilation

```bash
# Create test sketch
mkdir test && echo "void setup() { pinMode(13, OUTPUT); }
void loop() { digitalWrite(13, HIGH); delay(1000); digitalWrite(13, LOW); delay(1000); }" > test/test.ino

# Compile
arduino-cli compile --fqbn arduino:avr:uno test

# Should see: "Sketch uses X bytes..."
```

### 4. Start Your Next.js App

```bash
npm run dev
```

### 5. Test Upload

1. Open `http://localhost:3000/editor` in **Chrome** (or Edge/Opera)
2. Connect Arduino via USB
3. Paste or generate Arduino code
4. Click "Upload to Arduino"
5. Select COM port when prompted
6. Wait for upload to complete ✅

## 🔧 Troubleshooting

### Arduino CLI Not Found

**Problem:** Compilation fails with "arduino-cli not found"

**Solution:**
```bash
# Verify PATH
echo $PATH  # Unix/Mac
echo %PATH%  # Windows

# Add to PATH if needed
export PATH=$PATH:/path/to/arduino-cli  # Unix/Mac
set PATH=%PATH%;C:\path\to\arduino-cli  # Windows
```

### No Serial Port Available

**Problem:** "No serial port selected"

**Solution:**
- Ensure Arduino is connected via USB
- Use Chrome/Edge/Opera (not Firefox/Safari)
- Check USB cable (must support data, not just charging)
- Restart browser after connecting Arduino

### Compilation Errors

**Problem:** Syntax errors in generated code

**Solution:**
- Check visual node connections
- Ensure all required nodes are present
- Test with simple blink example first:
```cpp
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
```

### Permission Denied (Linux)

**Problem:** Cannot access /dev/ttyUSB0

**Solution:**
```bash
# Add user to dialout group
sudo usermod -a -G dialout $USER

# Log out and back in
# Or reboot
```

## 📋 System Check

Run this checklist:

- [ ] Arduino CLI installed: `arduino-cli version`
- [ ] AVR core installed: `arduino-cli core list`
- [ ] Using Chrome/Edge/Opera browser
- [ ] Arduino connected via USB
- [ ] Arduino appears in device manager
- [ ] Can compile test sketch
- [ ] Website running on localhost or HTTPS

## 🎓 Usage Examples

### Simple LED Blink

```typescript
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

// Upload
const result = await uploadArduinoSketch({ code, board: "arduino:avr:uno" });
```

### Button Input

```typescript
const code = `
void setup() {
  pinMode(13, OUTPUT);  // LED
  pinMode(2, INPUT);    // Button
}

void loop() {
  int buttonState = digitalRead(2);
  digitalWrite(13, buttonState);
}
`;
```

### Analog Sensor

```typescript
const code = `
void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(A0);
  Serial.println(sensorValue);
  delay(100);
}
`;
```

## 🚀 Next Steps

1. ✅ **Basic Setup** - You've completed this!
2. 📖 **Read Full Guide** - See [ARDUINO_UPLOAD_GUIDE.md](./ARDUINO_UPLOAD_GUIDE.md)
3. 🎨 **Create Visual Nodes** - Build circuits visually
4. 🔧 **Customize Boards** - Add your custom Arduino boards
5. 📊 **Add Monitoring** - Implement serial monitor

## 💡 Pro Tips

- **First Upload**: Takes longer (downloads libraries)
- **Port Selection**: Browser remembers your choice
- **Multiple Boards**: Detect boards automatically
- **Test Connection**: Use "Test" button before uploading
- **Code Backup**: Always save your code/graph
- **Serial Monitor**: Use Arduino IDE or separate tool

## 📞 Need Help?

1. Check [Troubleshooting Section](#-troubleshooting)
2. Review [Full Documentation](./ARDUINO_UPLOAD_GUIDE.md)
3. Test with simple blink sketch
4. Check browser console for errors
5. Verify Arduino CLI: `arduino-cli version`

## ✅ Success Indicators

You'll know it's working when:
- ✅ Browser shows port selection dialog
- ✅ Compilation completes (check logs)
- ✅ Progress bar reaches 100%
- ✅ Success message appears
- ✅ Arduino LED blinks (for blink sketch)

---

**Estimated Setup Time:** 5-10 minutes  
**Difficulty:** Beginner  
**Last Updated:** December 23, 2025
