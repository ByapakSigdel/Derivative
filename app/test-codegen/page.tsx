"use client";
import { useState } from "react";
import { generateArduinoCode, validateArduinoCode } from "@/lib/arduino/codeGenerator";
import type { Graph } from "@/types/graph";

export default function CodeGenTestPage() {
  const [code, setCode] = useState("");
  const [validation, setValidation] = useState({ valid: true, errors: [] as string[] });

  const generateBlink = () => {
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

    const generated = generateArduinoCode(graph);
    setCode(generated);
    
    const valid = validateArduinoCode(generated);
    setValidation(valid);
    
    console.log("✅ Generated code:", generated);
    console.log("✅ Validation:", valid);
  };

  const generateSensor = () => {
    const graph: Graph = {
      nodes: [
        { id: "n1", type: "AnalogRead", payload: { pin: 0 } },
        { id: "n2", type: "Delay", payload: { ms: 100 } }
      ],
      edges: [{ from: "n1", to: "n2" }]
    };

    const generated = generateArduinoCode(graph);
    setCode(generated);
    
    const valid = validateArduinoCode(generated);
    setValidation(valid);
    
    console.log("✅ Generated code:", generated);
    console.log("✅ Validation:", valid);
  };

  const generateComplex = () => {
    const graph: Graph = {
      nodes: [
        { id: "n1", type: "AnalogRead", payload: { pin: 0 } },
        { id: "n2", type: "DigitalWrite", payload: { pin: 13, value: true } },
        { id: "n3", type: "Delay", payload: { ms: 500 } },
        { id: "n4", type: "DigitalWrite", payload: { pin: 13, value: false } },
        { id: "n5", type: "Delay", payload: { ms: 500 } }
      ],
      edges: [
        { from: "n1", to: "n2" },
        { from: "n2", to: "n3" },
        { from: "n3", to: "n4" },
        { from: "n4", to: "n5" }
      ]
    };

    const generated = generateArduinoCode(graph);
    setCode(generated);
    
    const valid = validateArduinoCode(generated);
    setValidation(valid);
    
    console.log("✅ Generated code:", generated);
    console.log("✅ Validation:", valid);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2">🎨 Code Generator Test</h1>
          <p className="text-gray-600 mb-6">
            Test Arduino code generation from visual node graphs
          </p>
          
          {/* Info */}
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📝 What This Tests:</h3>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>Visual node graph creation</li>
              <li>Graph to Arduino C++ code conversion</li>
              <li>Code syntax validation</li>
              <li>setup() and loop() function generation</li>
            </ul>
          </div>

          {/* Test Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={generateBlink}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              1️⃣ Generate LED Blink Code
            </button>
            
            <button
              onClick={generateSensor}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              2️⃣ Generate Sensor Read Code
            </button>

            <button
              onClick={generateComplex}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              3️⃣ Generate Complex Code (Sensor + LED)
            </button>
          </div>

          {/* Validation Status */}
          {code && (
            <div className={`p-4 rounded-lg mb-4 border-2 ${
              validation.valid 
                ? "bg-green-100 border-green-500" 
                : "bg-red-100 border-red-500"
            }`}>
              <h3 className={`font-bold text-lg mb-2 ${
                validation.valid ? "text-green-900" : "text-red-900"
              }`}>
                {validation.valid ? "✅ Code Valid!" : "❌ Code Invalid"}
              </h3>
              {!validation.valid && (
                <ul className="list-disc list-inside text-red-900">
                  {validation.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
              {validation.valid && (
                <p className="text-green-900 text-sm">
                  All checks passed: setup() ✓, loop() ✓, braces balanced ✓
                </p>
              )}
            </div>
          )}

          {/* Generated Code */}
          {code && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">📄 Generated Arduino Code:</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    alert("Code copied to clipboard!");
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                >
                  📋 Copy Code
                </button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
                {code}
              </pre>
              
              <div className="mt-4 p-3 bg-gray-100 rounded text-sm space-y-1">
                <p><strong>Lines:</strong> {code.split('\n').length}</p>
                <p><strong>Characters:</strong> {code.length}</p>
                <p><strong>setup() function:</strong> {code.includes('void setup()') ? '✓ Present' : '✗ Missing'}</p>
                <p><strong>loop() function:</strong> {code.includes('void loop()') ? '✓ Present' : '✗ Missing'}</p>
              </div>
            </div>
          )}

          {!code && (
            <div className="text-center text-gray-500 py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-lg mb-2">👆 Click a button above to generate code</p>
              <p className="text-sm">Code will appear here with validation results</p>
            </div>
          )}

          {/* Help */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded-lg">
            <h3 className="font-semibold mb-2">💡 Tips:</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Open browser console (F12) to see detailed logs</li>
              <li>• Generated code is ready to compile with Arduino CLI</li>
              <li>• Copy code and paste into Arduino IDE to test</li>
              <li>• Validation checks basic syntax automatically</li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => window.location.href = "/test-serial"}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              ← Serial Test
            </button>
            <button
              onClick={() => window.location.href = "/test-full"}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Full Flow Test →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
