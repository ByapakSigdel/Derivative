import { useState, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";
import { validateFlow, toVisualStatuses, FlowValidation } from "@/lib/engine/validate";
import { generateArduinoCode } from "@/lib/arduino/codeGenerator";
import { analyzeWiring } from "@/lib/engine/debugger";

export function useCodeGenerator() {
  const { nodes, edges, graph, onNodesChange, onEdgesChange } = useEditorStore();
  const [code, setCode] = useState<string>("// Click Generate to build code");
  const [validation, setValidation] = useState<FlowValidation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(() => {
    setIsGenerating(true);
    
    // 1. Validate Flow
    const flowResult = validateFlow(nodes, edges);
    setValidation(flowResult);
    
    // Access store directly to avoid stale closure if needed, though hook should update
    const { setValidationStatus } = useEditorStore.getState();
    
    // Update visual status in store
    const visualStatus = toVisualStatuses(flowResult);
    setValidationStatus(visualStatus);
    
    if (!flowResult.ok) {
      setCode("// Fix validation errors to generate code\n" + flowResult.issues.map(i => `// - ${i.message}`).join("\n"));
      setIsGenerating(false);
      return;
    }

    // 2. Analyze Wiring (Hardware rules)
    // We need to convert to Graph for analyzeWiring, or update analyzeWiring to take RF nodes.
    // analyzeWiring currently takes Graph.
    // Let's skip strict wiring analysis for code generation blocker, but maybe warn.
    
    // 3. Generate Code
    try {
      const generated = generateArduinoCode(graph);
      setCode(generated);
    } catch (e: any) {
      console.error("Code Generation Error:", e);
      setCode(`// Error generating code: ${e.message}\n// Check console for details.`);
    } finally {
      setIsGenerating(false);
    }
  }, [nodes, edges]);

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sketch.ino";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code]);

  return {
    code,
    generate,
    downloadCode,
    validation,
    isGenerating
  };
}
