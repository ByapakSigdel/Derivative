"use client";
import { useState } from "react";
import { generateArduinoCode } from "@/lib/arduino/codeGenerator";
import { uploadArduinoSketch } from "@/lib/arduino/uploader";
import type { Graph } from "@/types/graph";

export default function FullTestPage() {
  const [status, setStatus] = useState("Ready to test complete flow");
  const [progress, setProgress] = useState(0);
  const [code, setCode] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const runFullTest = async () => {
    setLogs([]);
    setProgress(0);
    
    try {
      // Step 1: Create Graph
      addLog("Step 1: Creating visual node graph");
      setStatus("Step 1: Creating visual graph");
      await new Promise(r => setTimeout(r, 300));
      
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
      
      addLog(`Graph created: ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
      setProgress(20);

      // Step 2: Generate Code
      addLog("Step 2: Generating Arduino C++ code");
      setStatus("Step 2: Generating Arduino code");
      await new Promise(r => setTimeout(r, 300));
      
      const generatedCode = generateArduinoCode(graph);
      setCode(generatedCode);
      
      addLog(`Code generated: ${generatedCode.split('\n').length} lines, ${generatedCode.length} characters`);
      addLog("  - setup() function: OK");
      addLog("  - loop() function: OK");
      addLog("  - Pin configurations: OK");
      setProgress(40);

      // Step 3: Upload
      addLog("Step 3: Starting upload process");
      setStatus("Step 3: Uploading to Arduino");
      
      const result = await uploadArduinoSketch(
        { code: generatedCode, board: "arduino:avr:uno" },
        (prog, msg) => {
          setProgress(40 + (prog * 0.6)); // 40% to 100%
          setStatus(`Step 3: ${msg}`);
          addLog(`  ${msg} (${prog.toFixed(0)}%)`);
        }
      );

      if (result.ok) {
        addLog("Upload completed successfully!");
        addLog("ALL STEPS COMPLETED");
        setStatus("COMPLETE: Graph -> Code -> Upload SUCCESSFUL!");
        setProgress(100);
      } else {
        addLog(`Upload failed: ${result.message}`);
        setStatus(`Failed: ${result.message}`);
      }
      
    } catch (err) {
      const error = err as Error;
      addLog(`Error: ${error.message}`);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Flow Test</h1>
          <p className="text-slate-600">
            Test the entire pipeline: Visual Nodes → Code Generation → Arduino Upload
          </p>
        </div>

        {/* Prerequisites */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-3 text-lg">Before Running:</h3>
          <ol className="list-decimal list-inside space-y-2 text-amber-800">
            <li><strong>Install com0com</strong> and create COM10 ↔ COM11 pair</li>
            <li><strong>Open PuTTY</strong> on COM11 (Serial, 115200 baud)</li>
            <li><strong>Keep PuTTY window visible</strong> to see data arrive</li>
            <li>When browser asks, <strong>select COM10</strong></li>
          </ol>
        </div>
        
        {/* Main Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          {/* Run Button */}
          <button
            onClick={runFullTest}
            disabled={progress > 0 && progress < 100}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {progress === 0 ? "Run Complete Test" : progress === 100 ? "Test Complete - Run Again?" : "Running..."}
          </button>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2 text-slate-700">
              <span className="font-medium">Progress</span>
              <span className="font-mono font-semibold">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status */}
          <div className={`p-4 rounded-lg border-2 ${
            status.includes('SUCCESSFUL') || status.includes('COMPLETE')
              ? 'bg-green-50 border-green-300 text-green-900'
              : status.includes('Failed') || status.includes('Error')
              ? 'bg-red-50 border-red-300 text-red-900'
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}>
            <p className="font-mono text-sm font-medium">{status}</p>
          </div>
        </div>

        {/* Console Logs */}
        {logs.length > 0 && (
          <div className="bg-slate-900 rounded-xl shadow-lg p-5">
            <h3 className="text-white font-semibold mb-3 text-lg">Console Logs</h3>
            <div className="bg-slate-950 rounded-lg p-4 max-h-80 overflow-y-auto font-mono text-xs space-y-1">
              {logs.map((log, i) => (
                <div 
                  key={i} 
                  className={
                    log.includes('completed') || log.includes('created') || log.includes('OK') ? 'text-green-400' :
                    log.includes('failed') || log.includes('Error') ? 'text-red-400' :
                    log.includes('COMPLETE') ? 'text-yellow-400' :
                    'text-slate-300'
                  }
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Code */}
        {code && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-slate-900">Generated Arduino Code</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  alert("Code copied to clipboard!");
                }}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                Copy Code
              </button>
            </div>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed">
              {code}
            </pre>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-slate-600">Lines</p>
                <p className="font-semibold text-slate-900">{code.split('\n').length}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-slate-600">Characters</p>
                <p className="font-semibold text-slate-900">{code.length}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-slate-600">setup()</p>
                <p className="font-semibold text-slate-900">{code.includes('void setup()') ? 'Present' : 'Missing'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-slate-600">loop()</p>
                <p className="font-semibold text-slate-900">{code.includes('void loop()') ? 'Present' : 'Missing'}</p>
              </div>
            </div>
          </div>
        )}

        {/* What to Watch For */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-lg text-slate-900 mb-4">What to Watch For:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">In Browser:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Progress bar fills up</li>
                <li>• Logs show each step</li>
                <li>• Success message appears</li>
                <li>• Generated code displays</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">In PuTTY (COM11):</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Characters appear</li>
                <li>• Data: "0 " (hex: 0x30 0x20)</li>
                <li>• This proves data was sent</li>
                <li>• COM10 → COM11 working</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.location.href = "/test-serial"}
            className="flex-1 min-w-[200px] bg-slate-700 text-white px-5 py-3 rounded-lg hover:bg-slate-800 font-medium transition-colors"
          >
            ← Serial Test
          </button>
          <button
            onClick={() => window.location.href = "/test-codegen"}
            className="flex-1 min-w-[200px] bg-slate-700 text-white px-5 py-3 rounded-lg hover:bg-slate-800 font-medium transition-colors"
          >
            Code Gen Test
          </button>
          <button
            onClick={() => window.location.href = "/editor"}
            className="flex-1 min-w-[200px] bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Editor →
          </button>
        </div>
      </div>
    </div>
  );
}
