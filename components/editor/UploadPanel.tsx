"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { 
  uploadArduinoSketch, 
  isWebSerialSupported,
  detectBoards,
  testSerialConnection 
} from "@/lib/arduino/uploader";

export default function UploadPanel() {
  const [board, setBoard] = useState<string>("arduino:avr:uno");
  const [code, setCode] = useState<string>("");
  const [status, setStatus] = useState<string>("Ready");
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [detectedBoards, setDetectedBoards] = useState<string[]>([]);
  const [isSerialSupported, setIsSerialSupported] = useState<boolean>(false);

  // Check browser support on mount
  useEffect(() => {
    const supported = isWebSerialSupported();
    setIsSerialSupported(supported);
    
    if (!supported) {
      setStatus("Web Serial API not supported. Use Chrome/Edge 89+ or Opera 75+");
    } else {
      setStatus("Ready - Connect your Arduino and click Upload");
      // Try to detect previously connected boards
      detectBoards().then(boards => {
        if (boards.length > 0) {
          setDetectedBoards(boards);
          setBoard(boards[0]);
        }
      });
    }
  }, []);

  const handleUpload = async () => {
    if (!isSerialSupported) {
      setStatus("Web Serial API not supported in this browser");
      return;
    }

    if (!code.trim()) {
      setStatus("No code to upload. Paste Arduino code or generate from nodes.");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setStatus("Starting upload...");

    try {
      const result = await uploadArduinoSketch(
        { code, board },
        (progressValue, message) => {
          setProgress(progressValue);
          setStatus(message);
        }
      );

      if (result.ok) {
        setStatus("Success: " + (result.message || "Upload successful!"));
        setProgress(100);
      } else {
        setStatus("Error: " + (result.message || "Upload failed"));
        setProgress(0);
      }
    } catch (err) {
      setStatus("Error: " + (err as Error).message);
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!isSerialSupported) {
      setStatus("Web Serial API not supported in this browser");
      return;
    }

    setStatus("Testing connection...");
    try {
      const result = await testSerialConnection(board);
      setStatus(result.ok ? "Success: " + result.message : "Error: " + result.message);
    } catch (err) {
      setStatus("Test failed: " + (err as Error).message);
    }
  };

  const handleDetectBoards = async () => {
    setStatus("Detecting boards...");
    const boards = await detectBoards();
    
    if (boards.length > 0) {
      setDetectedBoards(boards);
      setBoard(boards[0]);
      setStatus(`Found ${boards.length} board(s): ${boards.join(", ")}`);
    } else {
      setStatus("No previously connected boards found. Click Upload to select a port.");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 border border-gray-300 rounded-lg bg-white">
      <h2 className="text-lg font-semibold text-gray-800">Arduino Upload</h2>
      
      {/* Browser Support Warning */}
      {!isSerialSupported && (
        <div className="p-3 bg-yellow-50 border border-yellow-300 rounded text-sm text-yellow-800">
          <strong>Browser Not Supported</strong>
          <p>Web Serial API requires Chrome 89+, Edge 89+, or Opera 75+</p>
        </div>
      )}

      {/* Board Selection */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Board Type</label>
        <select 
          value={board} 
          onChange={(e) => setBoard(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isUploading}
        >
          <option value="arduino:avr:uno">Arduino Uno</option>
          <option value="arduino:avr:nano">Arduino Nano</option>
          <option value="arduino:avr:mega">Arduino Mega</option>
          <option value="arduino:avr:leonardo">Arduino Leonardo</option>
        </select>
        {detectedBoards.length > 0 && (
          <p className="text-xs text-green-600">
            Detected: {detectedBoards.join(", ")}
          </p>
        )}
      </div>

      {/* Code Input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Arduino Code
          <span className="text-gray-500 font-normal ml-2">(or generate from visual nodes)</span>
        </label>
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)}
          placeholder="void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}"
          className="rounded-md border border-gray-300 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={10}
          disabled={isUploading}
        />
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Status Message */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm">
        <p className="font-medium text-gray-700">Status:</p>
        <p className="text-gray-600 mt-1">{status}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          onClick={handleUpload}
          disabled={isUploading || !isSerialSupported}
          className="flex-1"
        >
          {isUploading ? "Uploading..." : "Upload to Arduino"}
        </Button>
        
        <Button 
          onClick={handleTestConnection}
          disabled={isUploading || !isSerialSupported}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Test
        </Button>
        
        <Button 
          onClick={handleDetectBoards}
          disabled={isUploading || !isSerialSupported}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Detect
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200">
        <p><strong>How to use:</strong></p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Connect your Arduino board via USB</li>
          <li>Paste your Arduino code or generate from visual nodes</li>
          <li>Select your board type</li>
          <li>Click "Upload to Arduino"</li>
          <li>Select the COM port when prompted by your browser</li>
          <li>Wait for compilation and upload to complete</li>
        </ol>
        <p className="mt-2"><strong>Note:</strong> First-time upload requires selecting the serial port.</p>
      </div>
    </div>
  );
}
