/**
 * Serial Port Tester - Test serial communication without Arduino
 * 
 * This utility helps you verify that serial communication is working
 * even without a physical Arduino board connected.
 * 
 * For Windows + Edge testing.
 */

export type TestResult = {
  success: boolean;
  message: string;
  details?: {
    portInfo?: any;
    canOpen?: boolean;
    canWrite?: boolean;
    canRead?: boolean;
    dataSent?: number;
  };
};

/**
 * Test if Web Serial API is available
 */
export async function testWebSerialAvailability(): Promise<TestResult> {
  if (typeof navigator === "undefined") {
    return {
      success: false,
      message: "Not in browser environment"
    };
  }

  if (!("serial" in navigator)) {
    return {
      success: false,
      message: "Web Serial API not supported. Use Edge 89+, Chrome 89+, or Opera 75+"
    };
  }

  return {
    success: true,
    message: "✅ Web Serial API is available!"
  };
}

/**
 * Request and test serial port without uploading anything
 * Just verifies that you can select and open a port
 */
export async function testSerialPortSelection(): Promise<TestResult> {
  try {
    // Check API availability first
    const apiTest = await testWebSerialAvailability();
    if (!apiTest.success) {
      return apiTest;
    }

    console.log("📝 Requesting serial port...");
    
    // Request port (will show browser dialog)
    const port = await (navigator as any).serial.requestPort();
    
    if (!port) {
      return {
        success: false,
        message: "No port selected"
      };
    }

    // Get port info
    const info = port.getInfo();
    console.log("✅ Port selected:", info);

    return {
      success: true,
      message: "✅ Port selected successfully!",
      details: {
        portInfo: info,
        canOpen: false // Not opened yet
      }
    };

  } catch (err) {
    const error = err as Error;
    if (error.name === "NotFoundError") {
      return {
        success: false,
        message: "❌ No port selected (user cancelled)"
      };
    }
    return {
      success: false,
      message: `❌ Error: ${error.message}`
    };
  }
}

/**
 * Full serial port test - Select, Open, Write test data
 * This is the most comprehensive test without Arduino
 */
export async function testSerialCommunication(): Promise<TestResult> {
  try {
    console.log("🚀 Starting serial communication test...");
    
    // Step 1: Check API
    const apiTest = await testWebSerialAvailability();
    if (!apiTest.success) {
      return apiTest;
    }
    console.log("✅ Step 1: API available");

    // Step 2: Request port
    console.log("📝 Step 2: Requesting port...");
    const port = await (navigator as any).serial.requestPort();
    
    if (!port) {
      return {
        success: false,
        message: "❌ No port selected"
      };
    }

    const info = port.getInfo();
    console.log("✅ Step 2: Port selected", info);

    // Step 3: Try to open port
    console.log("📝 Step 3: Opening port...");
    try {
      await port.open({
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: "none"
      });
      console.log("✅ Step 3: Port opened successfully");
    } catch (openErr) {
      return {
        success: false,
        message: `❌ Failed to open port: ${(openErr as Error).message}`,
        details: { portInfo: info, canOpen: false }
      };
    }

    // Step 4: Try to write test data
    console.log("📝 Step 4: Writing test data...");
    let bytesWritten = 0;
    try {
      const writer = port.writable.getWriter();
      
      // Send test bytes (STK500 sync command)
      const testData = new Uint8Array([0x30, 0x20]);
      await writer.write(testData);
      bytesWritten = testData.length;
      
      writer.releaseLock();
      console.log("✅ Step 4: Data written successfully", testData);
    } catch (writeErr) {
      await port.close();
      return {
        success: false,
        message: `❌ Failed to write data: ${(writeErr as Error).message}`,
        details: { portInfo: info, canOpen: true, canWrite: false }
      };
    }

    // Step 5: Try to read (will timeout if no device responds)
    console.log("📝 Step 5: Attempting to read response...");
    let canRead = false;
    try {
      const reader = port.readable.getReader();
      
      // Try to read with short timeout
      const readPromise = reader.read();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("timeout")), 2000)
      );

      const result = await Promise.race([readPromise, timeoutPromise]);
      
      if (result && typeof result === 'object' && 'value' in result) {
        console.log("✅ Step 5: Received response:", result.value);
        canRead = true;
      }
      
      reader.releaseLock();
    } catch (readErr) {
      console.log("⚠️  Step 5: No response (expected without Arduino)");
      canRead = false; // This is OK - no Arduino to respond
    }

    // Step 6: Close port
    console.log("📝 Step 6: Closing port...");
    await port.close();
    console.log("✅ Step 6: Port closed");

    return {
      success: true,
      message: `✅ Serial communication test passed!
      
Port Info: Vendor ${info.usbVendorId || "N/A"}, Product ${info.usbProductId || "N/A"}
✓ Port can be opened
✓ Data can be written (${bytesWritten} bytes sent)
${canRead ? "✓ Device responded" : "⚠ No response (normal without Arduino)"}

Your serial communication is working! 🎉`,
      details: {
        portInfo: info,
        canOpen: true,
        canWrite: true,
        canRead: canRead,
        dataSent: bytesWritten
      }
    };

  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: `❌ Test failed: ${error.message}`,
      details: {}
    };
  }
}

/**
 * Check what serial ports the user has previously granted access to
 */
export async function listPreviousPorts(): Promise<TestResult> {
  try {
    const apiTest = await testWebSerialAvailability();
    if (!apiTest.success) {
      return apiTest;
    }

    const ports = await (navigator as any).serial.getPorts();
    
    if (ports.length === 0) {
      return {
        success: true,
        message: "No previously authorized ports. Click 'Test' to select one.",
        details: { portInfo: [] }
      };
    }

    const portInfos = ports.map((p: any) => p.getInfo());
    console.log("Previously authorized ports:", portInfos);

    return {
      success: true,
      message: `✅ Found ${ports.length} previously authorized port(s)`,
      details: { portInfo: portInfos }
    };

  } catch (err) {
    return {
      success: false,
      message: `❌ Error: ${(err as Error).message}`
    };
  }
}

/**
 * Monitor serial port events (connect/disconnect)
 */
export function setupSerialMonitoring(
  onConnect: (port: any) => void,
  onDisconnect: (port: any) => void
): () => void {
  if (typeof navigator === "undefined" || !("serial" in navigator)) {
    console.warn("Web Serial API not available");
    return () => {};
  }

  const connectHandler = (event: any) => {
    console.log("🔌 Serial device connected:", event.target);
    onConnect(event.target);
  };

  const disconnectHandler = (event: any) => {
    console.log("🔌 Serial device disconnected:", event.target);
    onDisconnect(event.target);
  };

  (navigator as any).serial.addEventListener("connect", connectHandler);
  (navigator as any).serial.addEventListener("disconnect", disconnectHandler);

  // Return cleanup function
  return () => {
    (navigator as any).serial.removeEventListener("connect", connectHandler);
    (navigator as any).serial.removeEventListener("disconnect", disconnectHandler);
  };
}
