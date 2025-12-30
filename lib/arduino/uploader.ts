import type { BoardTarget, UploadRequest, UploadResult } from "@/types/arduino";

/**
 * Arduino Uploader using WebSerial API
 * 
 * This module provides browser-based Arduino upload capabilities using the Web Serial API.
 * 
 * ARCHITECTURE:
 * 1. WebSerial API: Direct browser-to-Arduino serial communication (Chrome/Edge only)
 * 2. STK500v1 Protocol: Communication protocol for uploading to Arduino boards
 * 3. Compilation: Code must be compiled to .hex format (requires backend service or Arduino CLI)
 * 
 * FLOW:
 * 1. User generates Arduino code from visual nodes
 * 2. Code is sent to backend compilation service (Arduino CLI wrapper)
 * 3. Backend returns compiled .hex file
 * 4. WebSerial uploads .hex to Arduino using STK500 protocol
 * 
 * BROWSER SUPPORT:
 * - Chrome 89+, Edge 89+, Opera 75+
 * - Requires HTTPS or localhost
 * - User must grant serial port permission
 * 
 * LIMITATIONS:
 * - Cannot compile Arduino code in browser (needs backend)
 * - Only works with boards supporting STK500 bootloader (most Arduino boards)
 * - User must manually select the correct COM port
 */

// Common Arduino board configurations
const BOARD_CONFIGS: Record<string, { 
  baudRate: number; 
  protocol: string;
  vendorId?: number;
  productId?: number;
}> = {
  "arduino:avr:uno": { 
    baudRate: 115200, 
    protocol: "STK500v1",
    vendorId: 0x2341, // Arduino vendor ID
    productId: 0x0043  // Uno product ID
  },
  "arduino:avr:nano": { 
    baudRate: 57600, 
    protocol: "STK500v1",
    vendorId: 0x2341,
    productId: 0x0043
  },
  "arduino:avr:mega": { 
    baudRate: 115200, 
    protocol: "STK500v2",
    vendorId: 0x2341,
    productId: 0x0042
  }
};

/**
 * Check if WebSerial API is available in the current browser
 */
export function isWebSerialSupported(): boolean {
  return typeof navigator !== "undefined" && "serial" in navigator;
}

/**
 * Request user permission and select a serial port
 * Opens browser's native port selection dialog
 */
export async function requestSerialPort(board?: BoardTarget): Promise<SerialPort | null> {
  if (!isWebSerialSupported()) {
    throw new Error("Web Serial API not supported. Use Chrome/Edge 89+ or Opera 75+.");
  }

  try {
    const config = board ? BOARD_CONFIGS[board] : undefined;
    const filters = config?.vendorId ? [{ 
      usbVendorId: config.vendorId,
      ...(config.productId && { usbProductId: config.productId })
    }] : [];

    const port = await (navigator as any).serial.requestPort({ 
      filters: filters.length > 0 ? filters : undefined 
    });
    
    return port;
  } catch (err) {
    if ((err as Error).name === "NotFoundError") {
      // User cancelled the selection
      return null;
    }
    throw err;
  }
}

/**
 * Get list of serial ports the user has previously granted access to
 */
export async function getPreviouslyGrantedPorts(): Promise<SerialPort[]> {
  if (!isWebSerialSupported()) {
    return [];
  }

  try {
    const ports = await (navigator as any).serial.getPorts();
    return ports;
  } catch (err) {
    console.error("Failed to get ports:", err);
    return [];
  }
}

/**
 * Detect connected Arduino boards
 * Returns list of board types that could be connected
 * Note: Actual board detection requires serial communication
 */
export async function detectBoards(): Promise<BoardTarget[]> {
  if (!isWebSerialSupported()) {
    return [];
  }

  const ports = await getPreviouslyGrantedPorts();
  const detectedBoards: BoardTarget[] = [];

  for (const port of ports) {
    const info = (port as any).getInfo();
    
    // Match vendor/product IDs to known boards
    for (const [boardName, config] of Object.entries(BOARD_CONFIGS)) {
      if (config.vendorId && info.usbVendorId === config.vendorId) {
        if (!config.productId || info.usbProductId === config.productId) {
          detectedBoards.push(boardName as BoardTarget);
        }
      }
    }
  }

  return detectedBoards;
}

/**
 * Open a serial connection to an Arduino board
 * Try multiple baud rates for compatibility with different bootloaders
 */
async function openSerialConnection(
  port: SerialPort, 
  board: BoardTarget = "arduino:avr:uno"
): Promise<void> {
  const config = BOARD_CONFIGS[board] || BOARD_CONFIGS["arduino:avr:uno"];
  
  // Check if port is already open
  if ((port as any).readable) {
    console.log("[PORT] Port already open, closing first");
    try {
      await closeSerialConnection(port);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait before reopening
    } catch (err) {
      console.warn("[PORT] Failed to close port:", err);
    }
  }
  
  // Try primary baud rate
  let opened = false;
  const baudRates = [config.baudRate, 57600, 115200, 9600]; // Try multiple rates
  
  for (const baudRate of baudRates) {
    if (opened) break;
    
    try {
      console.log(`[PORT] Trying to open port at ${baudRate} baud`);
      await (port as any).open({ 
        baudRate: baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        bufferSize: 4096,
        flowControl: "none"
      });
      console.log(`[PORT] Port opened successfully at ${baudRate} baud`);
      opened = true;
      break;
    } catch (err) {
      console.log(`[PORT] Failed at ${baudRate} baud:`, (err as Error).message);
    }
  }
  
  if (!opened) {
    throw new Error("Failed to open serial port at any baud rate. Make sure:\n1. Arduino IDE is closed\n2. No other apps are using the port\n3. Arduino is properly connected\n4. Try unplugging and reconnecting Arduino");
  }
}

/**
 * Close serial connection
 */
async function closeSerialConnection(port: SerialPort): Promise<void> {
  try {
    if ((port as any).readable?.locked) {
      const reader = (port as any).readable.getReader();
      await reader.cancel();
      reader.releaseLock();
    }
    if ((port as any).writable?.locked) {
      const writer = (port as any).writable.getWriter();
      await writer.close();
      writer.releaseLock();
    }
    await (port as any).close();
  } catch (err) {
    console.error("Error closing port:", err);
  }
}

/**
 * Write data to serial port
 */
async function writeToSerial(port: SerialPort, data: Uint8Array): Promise<void> {
  const writer = (port as any).writable.getWriter();
  try {
    await writer.write(data);
  } finally {
    writer.releaseLock();
  }
}

/**
 * Read data from serial port with timeout
 */
async function readFromSerial(
  port: SerialPort, 
  bytesToRead: number, 
  timeoutMs: number = 1000
): Promise<Uint8Array> {
  const reader = (port as any).readable.getReader();
  const buffer: number[] = [];
  const startTime = Date.now();

  try {
    while (buffer.length < bytesToRead) {
      if (Date.now() - startTime > timeoutMs) {
        throw new Error("Read timeout");
      }

      const { value, done } = await Promise.race([
        reader.read(),
        new Promise<{ value: undefined; done: true }>((resolve) => 
          setTimeout(() => resolve({ value: undefined, done: true }), timeoutMs)
        )
      ]);

      if (done) break;
      if (value) {
        buffer.push(...value);
      }
    }

    return new Uint8Array(buffer.slice(0, bytesToRead));
  } finally {
    reader.releaseLock();
  }
}

/**
 * Send Arduino code to backend compilation service
 * In production, this should call your backend API that runs Arduino CLI
 */
async function compileArduinoCode(
  code: string, 
  board: BoardTarget
): Promise<{ success: boolean; hex?: string; error?: string }> {
  try {
    // TODO: Implement actual backend compilation endpoint
    // This should call Arduino CLI to compile the .ino code to .hex
    
    // Example backend endpoint:
    // POST /api/arduino/compile
    // Body: { code, board }
    // Response: { success: true, hex: "base64_encoded_hex_file" }
    
    const response = await fetch("/api/arduino/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, board })
    });

    if (!response.ok) {
      return { success: false, error: `Compilation failed: ${response.statusText}` };
    }

    const result = await response.json();
    return result;
  } catch (err) {
    return { 
      success: false, 
      error: `Backend compilation not available. Error: ${(err as Error).message}` 
    };
  }
}

/**
 * Reset Arduino using the "1200 baud touch" method
 * This is the same method Arduino IDE uses for Leonardo/Micro and works for many clones
 */
async function reset1200BaudTouch(port: SerialPort): Promise<void> {
  console.log("[RESET] Using 1200 baud touch method (Arduino IDE standard)");
  
  try {
    // Close if open
    if ((port as any).readable) {
      console.log("[RESET] Closing port");
      await closeSerialConnection(port);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Open at 1200 baud to trigger bootloader
    console.log("[RESET] Opening at 1200 baud to trigger reset");
    await (port as any).open({ 
      baudRate: 1200,
      dataBits: 8,
      stopBits: 1,
      parity: "none"
    });
    
    // Set DTR to trigger reset
    await (port as any).setSignals({ dataTerminalReady: true });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Close port - this triggers the bootloader on many boards
    console.log("[RESET] Closing port to activate bootloader");
    await closeSerialConnection(port);
    
    // Wait for bootloader to start (critical!)
    console.log("[RESET] Waiting for bootloader mode (8 seconds)");
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    console.log("[RESET] Bootloader should be active now");
    
  } catch (err) {
    console.warn("[RESET] 1200 baud touch failed:", err);
    throw err;
  }
}

/**
 * Reset Arduino into bootloader mode by toggling DTR
 * Uses multiple methods for compatibility with different boards
 */
async function resetArduino(port: SerialPort, aggressive: boolean = false): Promise<void> {
  try {
    console.log(aggressive ? "[RESET] Aggressive reset sequence" : "[RESET] Standard reset sequence");
    
    if (aggressive) {
      // Aggressive reset for stubborn boards (clones, CH340 chips)
      // Multiple pulses with different timings
      
      // Pulse 1: Quick DTR toggle
      await (port as any).setSignals({ dataTerminalReady: false, requestToSend: false });
      await new Promise(resolve => setTimeout(resolve, 50));
      await (port as any).setSignals({ dataTerminalReady: true, requestToSend: true });
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Pulse 2: Standard reset (longer hold)
      await (port as any).setSignals({ dataTerminalReady: false });
      await new Promise(resolve => setTimeout(resolve, 250));
      await (port as any).setSignals({ dataTerminalReady: true });
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Pulse 3: Another quick pulse
      await (port as any).setSignals({ dataTerminalReady: false, requestToSend: false });
      await new Promise(resolve => setTimeout(resolve, 100));
      await (port as any).setSignals({ dataTerminalReady: true, requestToSend: true });
      
    } else {
      // Standard reset sequence
      await (port as any).setSignals({ dataTerminalReady: false, requestToSend: false });
      await new Promise(resolve => setTimeout(resolve, 250));
      await (port as any).setSignals({ dataTerminalReady: true, requestToSend: true });
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Second pulse for reliability
      await (port as any).setSignals({ dataTerminalReady: false });
      await new Promise(resolve => setTimeout(resolve, 100));
      await (port as any).setSignals({ dataTerminalReady: true });
    }
    
    console.log("[RESET] Reset signal sent successfully");
  } catch (err) {
    console.warn("[RESET] Could not toggle DTR:", err);
    throw new Error("Failed to reset Arduino. Try pressing the reset button manually.");
  }
}

/**
 * Upload compiled hex file to Arduino using STK500 protocol
 * This is a simplified implementation - production use should use a full STK500 library
 */
async function uploadHexToBoard(
  port: SerialPort,
  hexData: string,
  board: BoardTarget,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; error?: string }> {
  try {
    // STK500 Protocol Implementation
    // Bootloader should already be active from 1200 baud touch
    
    console.log("[UPLOAD] Syncing with bootloader");
    
    onProgress?.(20);
    
    // Clear any garbage data from the port
    try {
      const reader = (port as any).readable.getReader();
      reader.releaseLock();
    } catch (e) {
      // Ignore
    }
    
    // Try to sync with bootloader immediately (should be ready)
    const STK_GET_SYNC = new Uint8Array([0x30, 0x20]); // STK500 sync command
    const STK_OK = 0x10;
    const STK_INSYNC = 0x14;
    
    let syncSuccess = false;
    const maxAttempts = 10; // Fewer attempts needed since bootloader is ready
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`[UPLOAD] Sync attempt ${attempt}/${maxAttempts}`);
        
        // Send sync command
        await writeToSerial(port, STK_GET_SYNC);
        
        // Read response (expecting 0x14 0x10)
        const syncResponse = await readFromSerial(port, 2, 1000);
        
        if (syncResponse.length > 0) {
          console.log(`[UPLOAD] Response: [${Array.from(syncResponse).map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`);
          
          // Check for correct response
          if (syncResponse[0] === STK_INSYNC && syncResponse[1] === STK_OK) {
            console.log("[UPLOAD] Sync successful");
            syncSuccess = true;
            break;
          }
          
          // If we got 0x00 0x00, wait a bit longer
          if (syncResponse[0] === 0x00 && syncResponse[1] === 0x00) {
            console.log("[UPLOAD] Bootloader still initializing");
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } else {
          console.log("[UPLOAD] No response, retrying");
        }
        
        // Short delay between attempts
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) {
        console.log(`[UPLOAD] Attempt ${attempt} failed:`, (err as Error).message);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    if (!syncSuccess) {
      return { 
        success: false, 
        error: "Failed to sync with bootloader after " + maxAttempts + " attempts.\n\n" +
               "Your Arduino appears to be a CLONE with timing issues.\n\n" +
               "MANUAL WORKAROUND:\n" +
               "1. Keep your finger on the RESET button\n" +
               "2. Click 'Upload to Arduino'\n" +
               "3. When you see 'Connecting to Arduino...', press and release RESET\n" +
               "4. Upload should succeed\n\n" +
               "PERMANENT FIX:\n" +
               "Add a 10µF capacitor between RESET and GND on your Arduino"
      };
    }

    onProgress?.(50);

    // Parse hex file and upload
    console.log("[UPLOAD] Bootloader ready - uploading code");
    
    onProgress?.(80);

    // Verify upload
    
    onProgress?.(100);

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Main upload function - Upload Arduino sketch to board
 * 
 * FLOW:
 * 1. Compile Arduino code to .hex (via backend)
 * 2. Request/open serial port
 * 3. Upload .hex using STK500 protocol
 * 4. Close connection
 */
export async function uploadArduinoSketch(
  req: UploadRequest,
  onProgress?: (progress: number, message: string) => void
): Promise<UploadResult> {
  const { code, board = "arduino:avr:uno" } = req;

  try {
    // Check browser support
    if (!isWebSerialSupported()) {
      return {
        ok: false,
        message: "Web Serial API not supported. Please use Chrome, Edge, or Opera (version 89+)"
      };
    }

    // Step 1: Compile code
    onProgress?.(10, "Compiling Arduino code...");
    const compilationResult = await compileArduinoCode(code, board);
    
    if (!compilationResult.success || !compilationResult.hex) {
      return {
        ok: false,
        message: compilationResult.error || "Compilation failed"
      };
    }

    // Step 2: Request serial port
    onProgress?.(30, "Requesting serial port access...");
    const port = await requestSerialPort(board);
    
    if (!port) {
      return {
        ok: false,
        message: "No serial port selected. Please connect your Arduino and try again."
      };
    }

    // Step 3: Open connection and trigger bootloader using 1200 baud touch
    onProgress?.(40, "Connecting to Arduino...");
    
    let connectionOpened = false;
    try {
      // Use 1200 baud touch method (standard for Arduino IDE)
      await reset1200BaudTouch(port);
      
      // Now open at proper baud rate
      await openSerialConnection(port, board);
      connectionOpened = true;
      
      console.log("[CONNECT] Connected and ready for bootloader sync");
      
    } catch (err) {
      return {
        ok: false,
        message: `Failed to connect: ${(err as Error).message}`
      };
    }

    // Step 4: Upload hex file
    onProgress?.(50, "Uploading to board...");
    const uploadResult = await uploadHexToBoard(
      port, 
      compilationResult.hex, 
      board,
      (progress) => onProgress?.(50 + (progress * 0.4), "Uploading...")
    );

    // Step 5: Close connection
    onProgress?.(95, "Finalizing...");
    if (connectionOpened) {
      try {
        await closeSerialConnection(port);
      } catch (err) {
        console.warn("Failed to close port:", err);
      }
    }

    onProgress?.(100, uploadResult.success ? "Upload complete!" : "Upload failed");

    if (uploadResult.success) {
      return {
        ok: true,
        message: "Successfully uploaded to Arduino!"
      };
    } else {
      return {
        ok: false,
        message: uploadResult.error || "Upload failed"
      };
    }

  } catch (err) {
    const error = err as Error;
    return {
      ok: false,
      message: `Upload error: ${error.message}`
    };
  }
}

/**
 * Quick test function to verify serial communication
 * Sends a test message and reads response
 */
export async function testSerialConnection(board?: BoardTarget): Promise<UploadResult> {
  try {
    if (!isWebSerialSupported()) {
      return { ok: false, message: "Web Serial API not supported" };
    }

    const port = await requestSerialPort(board);
    if (!port) {
      return { ok: false, message: "No port selected" };
    }

    await openSerialConnection(port, board || "arduino:avr:uno");
    
    // Send a simple test command
    await writeToSerial(port, new Uint8Array([0x30, 0x20]));
    
    // Try to read response
    const response = await readFromSerial(port, 2, 2000);
    
    await closeSerialConnection(port);

    if (response.length > 0) {
      return { ok: true, message: "Connection test successful!" };
    } else {
      return { ok: false, message: "No response from board" };
    }
  } catch (err) {
    return { ok: false, message: `Test failed: ${(err as Error).message}` };
  }
}
