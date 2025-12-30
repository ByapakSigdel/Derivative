"use client";
import { useState } from "react";
import { uploadArduinoSketch } from "@/lib/arduino/uploader";
import { generateArduinoCode } from "@/lib/arduino/codeGenerator";
import type { Graph } from "@/types/graph";

export default function TestUploadPage() {
  const [status, setStatus] = useState("Ready");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
    console.log(msg);
  };

  const testUpload = async () => {
    setLogs([]);
    setProgress(0);
    setShowInstructions(true);
    
    try {
      // Generate simple blink code
      const graph: Graph = {
        nodes: [
          { id: "n1", type: "DigitalWrite", payload: { pin: 13, value: true } },
          { id: "n2", type: "Delay", payload: { ms: 1000 } },
          { id: "n3", type: "DigitalWrite", payload: { pin: 13, value: false } },
          { id: "n4", type: "Delay", payload: { ms: 1000 } }
        ],
        edges: [
          { from: "n1", to: "n2" },
          { from: "n2", to: "n3" },
          { from: "n3", to: "n4" }
        ]
      };
      
      const code = generateArduinoCode(graph);
      addLog("✅ Generated LED blink code");
      
      setStatus("Select your Arduino's COM port...");
      addLog("📌 Select your Arduino's COM port from the browser dialog");
      
      const result = await uploadArduinoSketch(
        { code, board: "arduino:avr:uno" },
        (prog, msg) => {
          setProgress(prog);
          setStatus(msg);
          addLog(`${msg} (${prog.toFixed(0)}%)`);
        }
      );

      if (result.ok) {
        addLog("🎉 Upload successful! Check your Arduino's LED!");
        setStatus("✅ SUCCESS! LED should be blinking!");
      } else {
        addLog(`❌ Failed: ${result.message}`);
        setStatus(`❌ Failed`);
      }
      
    } catch (err) {
      addLog(`❌ Error: ${(err as Error).message}`);
      setStatus("❌ Error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2">🚀 Arduino Upload Test</h1>
          <p className="text-gray-600 mb-6">
            Upload LED blink code to your Arduino Uno
          </p>

          {/* Instructions */}
          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-blue-900 mb-3">📋 BEFORE YOU CLICK:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-900">
              <li className="font-semibold">Arduino IDE must be <span className="text-red-600">CLOSED</span></li>
              <li className="font-semibold">Arduino Uno must be <span className="text-green-600">CONNECTED</span> via USB</li>
              <li>When prompted, select your Arduino's COM port</li>
              <li className="font-semibold text-purple-600">⚠️ IMPORTANT: Be ready to press RESET button on Arduino!</li>
            </ol>
          </div>

          {/* Upload Button */}
          <button
            onClick={testUpload}
            disabled={progress > 0 && progress < 100}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-blue-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {progress === 0 ? "🚀 Upload to Arduino" : progress === 100 ? "✅ Complete - Try Again?" : "⏳ Uploading..."}
          </button>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">Progress</span>
              <span className="font-mono">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className={`h-6 rounded-full transition-all duration-300 flex items-center justify-center text-white text-xs font-bold ${
                  progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                }`}
                style={{ width: `${progress}%` }}
              >
                {progress > 5 && `${progress.toFixed(0)}%`}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className={`p-4 rounded-lg border-2 ${
            status.includes('SUCCESS') || status.includes('successful')
              ? 'bg-green-100 border-green-500 text-green-900'
              : status.includes('Failed') || status.includes('Error')
              ? 'bg-red-100 border-red-500 text-red-900'
              : 'bg-blue-100 border-blue-400 text-blue-900'
          }`}>
            <p className="font-mono text-sm font-semibold">{status}</p>
          </div>
        </div>

        {/* Manual Reset Instructions (shows when uploading) */}
        {showInstructions && progress > 0 && progress < 100 && (
          <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6 animate-pulse">
            <h3 className="font-bold text-yellow-900 text-xl mb-3">⚠️ IF SYNC FAILS:</h3>
            <div className="space-y-3 text-yellow-900">
              <p className="font-bold text-lg">Follow these steps:</p>
              <ol className="list-decimal list-inside space-y-2 text-base">
                <li className="font-semibold">Find the small RESET button on your Arduino board</li>
                <li className="font-semibold">Press and HOLD the reset button</li>
                <li>You'll see sync attempts in the console below</li>
                <li className="font-semibold text-red-600">When you see "Sync attempt 3/15", RELEASE the button</li>
                <li>Keep watching - it should sync within 1-2 seconds!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Console Logs */}
        {logs.length > 0 && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-4">
            <h3 className="text-white font-bold mb-3 flex items-center">
              <span className="text-green-400 mr-2">$</span> Console Output
            </h3>
            <div className="bg-black rounded p-3 max-h-96 overflow-y-auto font-mono text-xs space-y-1">
              {logs.map((log, i) => (
                <div 
                  key={i} 
                  className={
                    log.includes('✅') || log.includes('successful') ? 'text-green-400' :
                    log.includes('❌') || log.includes('Failed') ? 'text-red-400' :
                    log.includes('🎉') ? 'text-yellow-400' :
                    log.includes('⚠️') || log.includes('TIP') ? 'text-orange-400' :
                    log.includes('📌') ? 'text-blue-400' :
                    'text-gray-300'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Troubleshooting */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold text-lg mb-3">🔧 Troubleshooting</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold mb-1">Problem: "Failed to sync with bootloader"</p>
              <p className="text-gray-700">Solution: Use manual reset method above - press reset when told</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold mb-1">Problem: "Failed to open serial port"</p>
              <p className="text-gray-700">Solution: Close Arduino IDE, unplug Arduino, wait 5 sec, plug back in</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-semibold mb-1">Problem: "No port selected"</p>
              <p className="text-gray-700">Solution: Make sure Arduino is connected and appears in Device Manager</p>
            </div>
          </div>
        </div>

        {/* Success Indicator */}
        {status.includes('SUCCESS') && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
            <h3 className="font-bold text-green-900 text-xl mb-3">🎉 Upload Successful!</h3>
            <div className="space-y-2 text-green-900">
              <p className="font-semibold">Look at your Arduino Uno board:</p>
              <p>✅ The built-in LED (near pin 13) should be blinking</p>
              <p>✅ ON for 1 second, OFF for 1 second, repeating</p>
              <p>✅ If you see this, your Arduino upload system is working perfectly!</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => window.location.href = "/test-full"}
            className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 font-semibold"
          >
            ← Full Flow Test
          </button>
          <button
            onClick={() => window.location.href = "/editor"}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Visual Editor →
          </button>
        </div>
      </div>
    </div>
  );
}
