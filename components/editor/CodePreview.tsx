"use client";
import { useCodeGenerator } from "@/lib/hooks/useCodeGenerator";

export default function CodePreview() {
  const { code, generate, downloadCode, validation, isGenerating } = useCodeGenerator();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Generated Code</h2>
        <div className="flex gap-2">
          <button
            onClick={generate}
            disabled={isGenerating}
            className="px-3 py-1 text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors disabled:opacity-50 font-medium shadow-sm"
          >
            {isGenerating ? "Building..." : "Generate Code"}
          </button>
          <button
            onClick={downloadCode}
            disabled={!code || code.startsWith("//")}
            className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors disabled:opacity-50 border border-border shadow-sm"
          >
            Download .ino
          </button>
        </div>
      </div>
      
      {validation && !validation.ok && (
        <div className="mb-2 p-2 bg-destructive/10 border border-destructive/20 rounded">
          <p className="text-xs font-bold text-destructive mb-1">Validation Errors:</p>
          <ul className="list-disc list-inside text-[10px] text-destructive/80 space-y-0.5">
            {validation.issues.map((issue, i) => (
              <li key={i}>{issue.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex-1 min-h-0 relative">
        <pre className="absolute inset-0 overflow-auto rounded-md bg-muted/50 p-3 text-xs text-muted-foreground font-mono border border-border shadow-inner">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

