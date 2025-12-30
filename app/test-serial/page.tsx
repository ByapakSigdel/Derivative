"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { 
  testWebSerialAvailability, 
  testSerialPortSelection,
  testSerialCommunication,
  listPreviousPorts,
  type TestResult 
} from "@/lib/arduino/serialTester";

/**
 * Serial Port Testing Page
 * 
 * Use this page to test serial communication without having an Arduino.
 * This helps verify that Web Serial API is working on your Windows + Edge setup.
 * 
 * Access: http://localhost:3000/test-serial
 */
export default function TestSerialPage() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testFn: () => Promise<TestResult>, testName: string) => {
    setIsRunning(true);
    setResult(null);
    
    console.log(`\n🧪 Running: ${testName}`);
    console.log("=".repeat(50));
    
    try {
      const res = await testFn();
      setResult(res);
      
      if (res.success) {
        console.log("✅ Test passed!");
      } else {
        console.log("❌ Test failed:", res.message);
      }
      
      if (res.details) {
        console.log("Details:", res.details);
      }
    } catch (err) {
      const error = err as Error;
      setResult({
        success: false,
        message: `Unexpected error: ${error.message}`
      });
      console.error("❌ Error:", error);
    } finally {
      setIsRunning(false);
      console.log("=".repeat(50));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Serial Port Tester
          </h1>
          <p className="text-gray-600 mb-6">
            Test serial communication without Arduino hardware
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">
              📝 What This Tests:
            </h2>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>Web Serial API availability in your browser</li>
              <li>Serial port selection dialog</li>
              <li>Opening serial connection</li>
              <li>Writing test data to port</li>
              <li>Reading responses (if device connected)</li>
            </ul>
          </div>

          {/* Test Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={() => runTest(testWebSerialAvailability, "API Availability Check")}
              disabled={isRunning}
              className="w-full"
            >
              1️⃣ Check Web Serial API
            </Button>

            <Button
              onClick={() => runTest(listPreviousPorts, "List Previous Ports")}
              disabled={isRunning}
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              2️⃣ List Authorized Ports
            </Button>

            <Button
              onClick={() => runTest(testSerialPortSelection, "Port Selection Test")}
              disabled={isRunning}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              3️⃣ Test Port Selection
            </Button>

            <Button
              onClick={() => runTest(testSerialCommunication, "Full Communication Test")}
              disabled={isRunning}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              🚀 Full Serial Test (Recommended)
            </Button>
          </div>

          {/* Loading State */}
          {isRunning && (
            <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 mb-6">
              <p className="text-blue-900 font-semibold text-base">
                ⏳ Running test... Check browser console (F12) for details
              </p>
            </div>
          )}

          {/* Results */}
          {result && !isRunning && (
            <div
              className={`border-2 rounded-lg p-5 mb-6 ${
                result.success
                  ? "bg-green-100 border-green-500"
                  : "bg-red-100 border-red-500"
              }`}
            >
              <h3 className={`font-bold mb-3 text-xl ${
                result.success ? "text-green-900" : "text-red-900"
              }`}>
                {result.success ? "✅ Success" : "❌ Failed"}
              </h3>
              <pre className={`whitespace-pre-wrap text-sm font-mono ${
                result.success ? "text-green-900" : "text-red-900"
              }`}>
                {result.message}
              </pre>
              
              {result.details && (
                <details className="mt-3">
                  <summary className={`cursor-pointer font-semibold text-sm ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}>
                    📊 Technical Details
                  </summary>
                  <pre className="mt-2 p-3 bg-white border border-gray-300 rounded text-xs overflow-x-auto text-gray-900">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              💡 What to Expect (Windows + Edge):
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <strong>✅ With USB device connected:</strong>
                <p className="ml-4">
                  You'll see a dialog to select COM port (COM3, COM4, etc.).
                  Test will show port can open and send data.
                </p>
              </div>
              
              <div>
                <strong>⚠️ Without Arduino:</strong>
                <p className="ml-4">
                  Port opens and sends data successfully, but no response received.
                  This is NORMAL - it means your serial communication is working!
                </p>
              </div>
              
              <div>
                <strong>❌ If test fails:</strong>
                <p className="ml-4">
                  Check you're using Edge 89+ or Chrome 89+. Try enabling flags:
                  edge://flags/#enable-experimental-web-platform-features
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              🎯 Testing Tips:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>
                <strong>No Arduino needed!</strong> You can test with any USB serial device
                or even a USB-to-Serial adapter (FTDI, CH340, etc.)
              </li>
              <li>
                <strong>Loopback test:</strong> If you have a USB-Serial adapter,
                connect TX to RX (pins 2 and 3) to receive your own data
              </li>
              <li>
                <strong>Virtual COM port:</strong> Use tools like com0com (Windows)
                to create virtual serial ports for testing
              </li>
              <li>
                <strong>Check Device Manager:</strong> Windows Key + X → Device Manager
                → Ports (COM & LPT) to see available ports
              </li>
              <li>
                <strong>Browser Console:</strong> Press F12 to see detailed logs
                of each test step
              </li>
            </ol>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => window.location.href = "/"}
              className="bg-gray-600 hover:bg-gray-700"
            >
              ← Home
            </Button>
            <Button
              onClick={() => window.location.href = "/editor"}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Editor →
            </Button>
          </div>
        </div>

        {/* Windows COM Port Info */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            🪟 Windows COM Port Information
          </h2>
          
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <strong>How to check available COM ports:</strong>
              <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                <li>Press Windows Key + X</li>
                <li>Click "Device Manager"</li>
                <li>Expand "Ports (COM & LPT)"</li>
                <li>Look for "USB Serial Port (COMx)" or "Arduino Uno (COMx)"</li>
              </ol>
            </div>
            
            <div>
              <strong>Common COM port ranges:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>COM1-COM4: Usually hardware serial ports</li>
                <li>COM3-COM10: Common for USB devices</li>
                <li>COM10+: Automatically assigned by Windows</li>
              </ul>
            </div>
            
            <div>
              <strong>If no ports appear:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Connect a USB device (Arduino, FTDI adapter, etc.)</li>
                <li>Install device drivers if needed</li>
                <li>Restart browser after connecting device</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
